/**
 * Email Test API
 * POST /api/email/test - テストメール送信
 */

import { NextRequest } from 'next/server';
import { sendEmail, sendBulkEmails } from '@/lib/email';
import {
  inquiryBusinessNotification,
  inquiryCustomerConfirmation,
  subscriptionWelcome,
  subscriptionCancellation,
  subscriptionPaymentFailed,
  instagramSyncSuccess,
  instagramSyncError,
} from '@/lib/email-templates';
import { handleError, successResponse, BadRequestError } from '@/lib/errors';

// テストメールの送信を許可する環境のみ（本番環境では無効化）
const ALLOW_TEST_EMAILS = process.env.NODE_ENV !== 'production';

export async function POST(request: NextRequest) {
  try {
    if (!ALLOW_TEST_EMAILS) {
      throw new BadRequestError('Test emails are not allowed in production');
    }

    const body = await request.json();
    const { type, to, testData } = body;

    if (!type || !to) {
      throw new BadRequestError('type and to fields are required');
    }

    // SendGrid API キーの確認
    if (!process.env.SENDGRID_API_KEY) {
      throw new BadRequestError('SENDGRID_API_KEY is not configured');
    }

    let result;

    switch (type) {
      case 'inquiry-business': {
        // 業者向け問い合わせ通知のテスト
        const inquiryData = testData || {
          customerName: 'テスト太郎',
          customerEmail: 'test-customer@example.com',
          customerPhone: '090-1234-5678',
          message:
            'こんにちは。サービスについてお問い合わせがあります。\n詳細を教えていただけますでしょうか。',
          companies: [
            { name: 'テスト業者A', email: 'company-a@example.com' },
            { name: 'テスト業者B', email: 'company-b@example.com' },
          ],
          selectedItems: ['company-id-1', 'company-id-2'],
        };

        const template = inquiryBusinessNotification(inquiryData, 'テスト業者A');
        await sendEmail({
          to,
          subject: template.subject,
          html: template.html,
        });

        result = {
          message: 'Inquiry business notification test email sent',
          template: type,
          sentTo: to,
        };
        break;
      }

      case 'inquiry-customer': {
        // 顧客向け確認メールのテスト
        const inquiryData = testData || {
          customerName: 'テスト太郎',
          customerEmail: 'test-customer@example.com',
          customerPhone: '090-1234-5678',
          message:
            'こんにちは。サービスについてお問い合わせがあります。\n詳細を教えていただけますでしょうか。',
          companies: [
            { name: 'テスト業者A', email: 'company-a@example.com' },
            { name: 'テスト業者B', email: 'company-b@example.com' },
          ],
          selectedItems: ['company-id-1', 'company-id-2'],
        };

        const template = inquiryCustomerConfirmation(inquiryData);
        await sendEmail({
          to,
          subject: template.subject,
          html: template.html,
        });

        result = {
          message: 'Inquiry customer confirmation test email sent',
          template: type,
          sentTo: to,
        };
        break;
      }

      case 'subscription-welcome': {
        // サブスクリプション開始メールのテスト
        const subscriptionData = testData || {
          companyName: 'テスト株式会社',
          planName: 'プラットフォームフルプラン',
          price: '¥10,000/月',
          startDate: '2025年1月1日',
          endDate: '2025年2月1日',
        };

        const template = subscriptionWelcome(subscriptionData);
        await sendEmail({
          to,
          subject: template.subject,
          html: template.html,
        });

        result = {
          message: 'Subscription welcome test email sent',
          template: type,
          sentTo: to,
        };
        break;
      }

      case 'subscription-cancel': {
        // サブスクリプション解約メールのテスト
        const subscriptionData = testData || {
          companyName: 'テスト株式会社',
          planName: 'プラットフォームフルプラン',
          price: '¥10,000/月',
          startDate: '2025年1月1日',
          endDate: '2025年2月1日',
        };

        const template = subscriptionCancellation(subscriptionData);
        await sendEmail({
          to,
          subject: template.subject,
          html: template.html,
        });

        result = {
          message: 'Subscription cancellation test email sent',
          template: type,
          sentTo: to,
        };
        break;
      }

      case 'subscription-payment-failed': {
        // サブスクリプション支払い失敗メールのテスト
        const subscriptionData = testData || {
          companyName: 'テスト株式会社',
          planName: 'プラットフォームフルプラン',
          price: '¥10,000/月',
          startDate: '2025年1月1日',
          endDate: '2025年2月1日',
        };

        const template = subscriptionPaymentFailed(subscriptionData);
        await sendEmail({
          to,
          subject: template.subject,
          html: template.html,
        });

        result = {
          message: 'Subscription payment failed test email sent',
          template: type,
          sentTo: to,
        };
        break;
      }

      case 'instagram-sync-success': {
        // Instagram同期成功メールのテスト
        const companyName = testData?.companyName || 'テスト株式会社';
        const postCount = testData?.postCount || 15;

        const template = instagramSyncSuccess(companyName, postCount);
        await sendEmail({
          to,
          subject: template.subject,
          html: template.html,
        });

        result = {
          message: 'Instagram sync success test email sent',
          template: type,
          sentTo: to,
        };
        break;
      }

      case 'instagram-sync-error': {
        // Instagram同期エラーメールのテスト
        const companyName = testData?.companyName || 'テスト株式会社';
        const error =
          testData?.error || 'Instagram APIへのアクセスが拒否されました。再認証が必要です。';

        const template = instagramSyncError(companyName, error);
        await sendEmail({
          to,
          subject: template.subject,
          html: template.html,
        });

        result = {
          message: 'Instagram sync error test email sent',
          template: type,
          sentTo: to,
        };
        break;
      }

      case 'bulk-test': {
        // 一括送信テスト
        const recipients = Array.isArray(to) ? to : [to];

        const emails = recipients.map((recipient) => {
          const template = inquiryCustomerConfirmation({
            customerName: 'テスト太郎',
            customerEmail: recipient,
            customerPhone: '090-1234-5678',
            message: 'これは一括送信のテストメールです。',
            companies: [{ name: 'テスト業者A', email: 'company-a@example.com' }],
            selectedItems: ['company-id-1'],
          });

          return {
            to: recipient,
            subject: template.subject,
            html: template.html,
          };
        });

        await sendBulkEmails(emails);

        result = {
          message: 'Bulk test emails sent',
          template: type,
          sentTo: recipients,
          count: recipients.length,
        };
        break;
      }

      case 'all-templates': {
        // 全テンプレートをプレビュー（送信はしない）
        const inquiryData = {
          customerName: 'テスト太郎',
          customerEmail: 'test@example.com',
          customerPhone: '090-1234-5678',
          message: 'テストメッセージ',
          companies: [{ name: 'テスト業者', email: 'company@example.com' }],
          selectedItems: ['company-id-1'],
        };

        const subscriptionData = {
          companyName: 'テスト株式会社',
          planName: 'プラットフォームフルプラン',
          price: '¥10,000/月',
          startDate: '2025年1月1日',
          endDate: '2025年2月1日',
        };

        result = {
          message: 'All template previews generated',
          templates: {
            inquiryBusiness: inquiryBusinessNotification(inquiryData, 'テスト業者'),
            inquiryCustomer: inquiryCustomerConfirmation(inquiryData),
            subscriptionWelcome: subscriptionWelcome(subscriptionData),
            subscriptionCancel: subscriptionCancellation(subscriptionData),
            subscriptionPaymentFailed: subscriptionPaymentFailed(subscriptionData),
            instagramSyncSuccess: instagramSyncSuccess('テスト株式会社', 15),
            instagramSyncError: instagramSyncError(
              'テスト株式会社',
              'テストエラーメッセージ'
            ),
          },
        };
        break;
      }

      default:
        throw new BadRequestError(
          `Unknown email type: ${type}. Valid types: inquiry-business, inquiry-customer, subscription-welcome, subscription-cancel, subscription-payment-failed, instagram-sync-success, instagram-sync-error, bulk-test, all-templates`
        );
    }

    return successResponse(result);
  } catch (error) {
    return handleError(error);
  }
}

// GET /api/email/test - テストメールの種類一覧を取得
export async function GET() {
  try {
    if (!ALLOW_TEST_EMAILS) {
      throw new BadRequestError('Test emails are not allowed in production');
    }

    return successResponse({
      message: 'Email test API is available',
      allowedInEnvironment: ALLOW_TEST_EMAILS,
      sendGridConfigured: !!process.env.SENDGRID_API_KEY,
      fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@tochigi-platform.com',
      availableTypes: [
        {
          type: 'inquiry-business',
          description: '業者向け問い合わせ通知メール',
          requiredFields: ['to'],
          optionalFields: ['testData'],
        },
        {
          type: 'inquiry-customer',
          description: '顧客向け確認メール',
          requiredFields: ['to'],
          optionalFields: ['testData'],
        },
        {
          type: 'subscription-welcome',
          description: 'サブスクリプション開始メール',
          requiredFields: ['to'],
          optionalFields: ['testData'],
        },
        {
          type: 'subscription-cancel',
          description: 'サブスクリプション解約メール',
          requiredFields: ['to'],
          optionalFields: ['testData'],
        },
        {
          type: 'subscription-payment-failed',
          description: 'サブスクリプション支払い失敗メール',
          requiredFields: ['to'],
          optionalFields: ['testData'],
        },
        {
          type: 'instagram-sync-success',
          description: 'Instagram同期成功メール',
          requiredFields: ['to'],
          optionalFields: ['testData'],
        },
        {
          type: 'instagram-sync-error',
          description: 'Instagram同期エラーメール',
          requiredFields: ['to'],
          optionalFields: ['testData'],
        },
        {
          type: 'bulk-test',
          description: '一括送信テスト',
          requiredFields: ['to (array or string)'],
          optionalFields: [],
        },
        {
          type: 'all-templates',
          description: '全テンプレートのプレビュー（送信なし）',
          requiredFields: [],
          optionalFields: [],
        },
      ],
      usage: {
        endpoint: '/api/email/test',
        method: 'POST',
        exampleRequest: {
          type: 'inquiry-customer',
          to: 'your-email@example.com',
          testData: {
            customerName: 'カスタム名前',
            customerEmail: 'custom@example.com',
            customerPhone: '090-0000-0000',
            message: 'カスタムメッセージ',
            companies: [{ name: 'カスタム業者', email: 'custom-company@example.com' }],
            selectedItems: ['id-1'],
          },
        },
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
