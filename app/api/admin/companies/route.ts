/**
 * Admin Companies API
 * Manage companies from admin panel
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/companies
 * Get all companies with details
 */
export async function GET(request: NextRequest) {
  try {
    const companies = await prisma.company.findMany({
      include: {
        category: {
          select: {
            name: true,
          },
        },
        subscription: {
          select: {
            status: true,
            currentPeriodEnd: true,
          },
        },
        _count: {
          select: {
            services: true,
            inquiries: true,
            instagramPosts: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ companies });
  } catch (error) {
    console.error('Admin companies error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/companies
 * Update company status
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId, isActive } = body;

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: { isActive },
    });

    return NextResponse.json({ success: true, company: updatedCompany });
  } catch (error) {
    console.error('Admin company update error:', error);
    return NextResponse.json(
      { error: 'Failed to update company' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/companies?id=xxx
 * Delete a company
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get('id');

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    // Delete company (cascade will handle related records)
    await prisma.company.delete({
      where: { id: companyId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin company delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete company' },
      { status: 500 }
    );
  }
}
