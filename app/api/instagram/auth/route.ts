/**
 * Instagram OAuth Authentication API
 * Handles Instagram authorization and token exchange
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { instagramAPI } from '@/lib/instagram';

/**
 * GET /api/instagram/auth
 * Redirect to Instagram authorization page
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    // Verify company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Get Instagram authorization URL
    const authUrl = instagramAPI.getAuthorizationUrl();

    // Store companyId in state parameter for callback
    const stateParam = Buffer.from(JSON.stringify({ companyId })).toString('base64');
    const fullAuthUrl = `${authUrl}&state=${stateParam}`;

    return NextResponse.json({ authUrl: fullAuthUrl });
  } catch (error) {
    console.error('Instagram auth error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Instagram authentication' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/instagram/auth
 * Handle OAuth callback and exchange code for token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, state } = body;

    if (!code) {
      return NextResponse.json({ error: 'Authorization code is required' }, { status: 400 });
    }

    // Decode state to get companyId
    let companyId: string;
    try {
      const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
      companyId = stateData.companyId;
    } catch {
      return NextResponse.json({ error: 'Invalid state parameter' }, { status: 400 });
    }

    // Exchange code for short-lived token
    const tokenData = await instagramAPI.exchangeCodeForToken(code);

    // Exchange short-lived token for long-lived token
    const longLivedToken = await instagramAPI.getLongLivedToken(tokenData.access_token);

    // Get user profile
    const profile = await instagramAPI.getUserProfile(longLivedToken.access_token);

    // Update company with Instagram credentials
    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: {
        instagramHandle: profile.username,
        instagramToken: longLivedToken.access_token,
      },
    });

    return NextResponse.json({
      success: true,
      username: profile.username,
      expiresIn: longLivedToken.expires_in,
    });
  } catch (error) {
    console.error('Instagram token exchange error:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate with Instagram' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/instagram/auth
 * Disconnect Instagram account
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    // Remove Instagram credentials
    await prisma.company.update({
      where: { id: companyId },
      data: {
        instagramHandle: null,
        instagramToken: null,
      },
    });

    // Delete all Instagram posts for this company
    await prisma.instagramPost.deleteMany({
      where: { companyId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Instagram disconnect error:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect Instagram account' },
      { status: 500 }
    );
  }
}
