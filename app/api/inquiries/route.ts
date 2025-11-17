import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import { handleError, successResponse, BadRequestError } from '@/lib/errors';
import { inquirySchema } from '@/lib/validators';
import { sendEmail, sendBulkEmails } from '@/lib/email';
import {
  inquiryBusinessNotification,
  inquiryCustomerConfirmation,
} from '@/lib/email-templates';

// POST /api/inquiries - 問い合わせ作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // バリデーション
    const validatedData = inquirySchema.parse(body);

    // 選択された業者が存在し、アクティブか確認
    const companies = await prisma.company.findMany({
      where: {
        id: { in: validatedData.selectedItems },
        isActive: true,
      },
      select: { id: true, name: true, email: true },
    });

    if (companies.length === 0) {
      throw new BadRequestError('選択された業者が見つかりません');
    }

    if (companies.length !== validatedData.selectedItems.length) {
      throw new BadRequestError('一部の業者が見つからないか、利用できません');
    }

    // トランザクションで問い合わせと中間テーブルを作成
    const inquiry = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 問い合わせを作成
      const newInquiry = await tx.inquiry.create({
        data: {
          customerName: validatedData.customerName,
          customerEmail: validatedData.customerEmail,
          customerPhone: validatedData.customerPhone,
          message: validatedData.message,
          selectedItems: validatedData.selectedItems,
          status: 'sent',
        },
      });

      // 中間テーブルに関連付けを作成
      await tx.inquiryCompany.createMany({
        data: validatedData.selectedItems.map((companyId) => ({
          inquiryId: newInquiry.id,
          companyId,
        })),
      });

      // 作成した問い合わせを関連データとともに取得
      return await tx.inquiry.findUnique({
        where: { id: newInquiry.id },
        include: {
          companies: {
            include: {
              company: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
    });

    // メール送信処理
    try {
      if (inquiry) {
        // 準備: 問い合わせデータの整形
        const inquiryData = {
          customerName: inquiry.customerName,
          customerEmail: inquiry.customerEmail,
          customerPhone: inquiry.customerPhone,
          message: inquiry.message,
          companies: companies.map((c) => ({
            name: c.name,
            email: c.email,
          })),
          selectedItems: validatedData.selectedItems,
        };

        // 業者へのメール通知を並列送信
        const businessEmails = companies.map((company) => {
          const emailTemplate = inquiryBusinessNotification(inquiryData, company.name);
          return {
            to: company.email,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
          };
        });

        await sendBulkEmails(businessEmails);

        // 顧客への確認メール送信
        const customerEmailTemplate = inquiryCustomerConfirmation(inquiryData);
        await sendEmail({
          to: inquiry.customerEmail,
          subject: customerEmailTemplate.subject,
          html: customerEmailTemplate.html,
        });

        console.log(
          `Inquiry emails sent successfully to ${companies.length} companies and customer`
        );
      }
    } catch (emailError) {
      // メール送信エラーはログに記録するが、問い合わせ自体は成功とする
      console.error('Failed to send inquiry emails:', emailError);
    }

    return successResponse(inquiry, 201);
  } catch (error) {
    return handleError(error);
  }
}

// GET /api/inquiries - 問い合わせ一覧取得（管理者用）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const where: any = {};

    if (status) {
      where.status = status;
    }

    const skip = (page - 1) * limit;

    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          companies: {
            include: {
              company: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                },
              },
            },
          },
        },
      }),
      prisma.inquiry.count({ where }),
    ]);

    return successResponse({
      data: inquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
