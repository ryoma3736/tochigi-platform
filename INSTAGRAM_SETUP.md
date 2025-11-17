# Instagram Graph API Setup Guide

Complete guide for integrating Instagram Graph API with the Tochigi Platform.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Instagram Developer Setup](#instagram-developer-setup)
3. [OAuth Authentication Flow](#oauth-authentication-flow)
4. [API Configuration](#api-configuration)
5. [Token Management](#token-management)
6. [Testing & Verification](#testing--verification)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:

- A Facebook Developer account
- An Instagram Business or Creator account
- A Facebook Page connected to your Instagram account
- Admin access to both Facebook Page and Instagram account

---

## Instagram Developer Setup

### Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **"My Apps"** → **"Create App"**
3. Select **"Business"** as the app type
4. Fill in app details:
   - **App Name**: `Tochigi Platform`
   - **App Contact Email**: Your email
   - **Business Account**: Select or create one

### Step 2: Add Instagram Graph API Product

1. In your app dashboard, click **"Add Product"**
2. Find **"Instagram Graph API"** and click **"Set Up"**
3. The product will be added to your app

### Step 3: Configure Basic Settings

1. Go to **Settings** → **Basic**
2. Add **App Domains**: `yourdomain.com`
3. Add **Privacy Policy URL**: `https://yourdomain.com/privacy`
4. Add **Terms of Service URL**: `https://yourdomain.com/terms`
5. Save changes

### Step 4: Configure Instagram Basic Display

1. Go to **Products** → **Instagram Basic Display** → **Basic Display**
2. Click **"Create New App"**
3. Add OAuth Redirect URLs:
   ```
   https://yourdomain.com/api/auth/instagram/callback
   http://localhost:3000/api/auth/instagram/callback (for development)
   ```
4. Add Deauthorize Callback URL:
   ```
   https://yourdomain.com/api/auth/instagram/deauthorize
   ```
5. Add Data Deletion Request URL:
   ```
   https://yourdomain.com/api/auth/instagram/delete
   ```

### Step 5: Get API Credentials

1. In **Basic Display** settings, you'll find:
   - **Instagram App ID** (Client ID)
   - **Instagram App Secret** (Client Secret)
2. Copy these values - you'll need them later

---

## OAuth Authentication Flow

### Overview

The Instagram OAuth flow consists of:

1. User clicks "Connect Instagram"
2. Redirect to Instagram authorization
3. User approves permissions
4. Instagram redirects back with authorization code
5. Exchange code for short-lived access token
6. Exchange for long-lived access token (60 days)
7. Store token in database

### Implementation

#### 1. Authorization URL

```typescript
import { instagramAPI } from '@/lib/instagram';

// Generate authorization URL
const authUrl = instagramAPI.getAuthorizationUrl();
// Redirect user to authUrl
```

#### 2. Handle Callback

```typescript
// In your callback route: /api/auth/instagram/callback

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    // Handle error
    return NextResponse.redirect('/dashboard?error=instagram_auth_failed');
  }

  if (!code) {
    return NextResponse.redirect('/dashboard?error=no_code');
  }

  try {
    // Exchange code for short-lived token
    const { access_token, user_id } = await instagramAPI.exchangeCodeForToken(code);

    // Exchange for long-lived token
    const longLivedToken = await instagramAPI.getLongLivedToken(access_token);

    // Get user profile
    const profile = await instagramAPI.getUserProfile(longLivedToken.access_token);

    // Save to database
    await prisma.company.update({
      where: { id: companyId },
      data: {
        instagramToken: longLivedToken.access_token,
        instagramHandle: profile.username,
      },
    });

    return NextResponse.redirect('/dashboard?success=instagram_connected');
  } catch (error) {
    console.error('Instagram auth error:', error);
    return NextResponse.redirect('/dashboard?error=instagram_auth_failed');
  }
}
```

---

## API Configuration

### Environment Variables

Add these to your `.env` file:

```bash
# Instagram API Credentials
INSTAGRAM_CLIENT_ID=your_instagram_app_id
INSTAGRAM_CLIENT_SECRET=your_instagram_app_secret
INSTAGRAM_REDIRECT_URI=https://yourdomain.com/api/auth/instagram/callback

# Cron Job Secret (for scheduled sync)
CRON_SECRET=your_random_secret_key

# App URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Vercel Environment Variables

If deploying to Vercel:

1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add all variables from `.env`
4. Set appropriate environments (Production, Preview, Development)

---

## Token Management

### Long-Lived Access Tokens

Instagram access tokens expire after 60 days. You need to refresh them before expiration.

#### Token Lifespan

- **Short-lived token**: 1 hour
- **Long-lived token**: 60 days
- **Refreshed token**: 60 days (from refresh date)

#### Automatic Token Refresh

Implement a cron job to refresh tokens before they expire:

```typescript
// /app/api/cron/refresh-instagram-tokens/route.ts

export async function GET(request: NextRequest) {
  const companies = await prisma.company.findMany({
    where: {
      instagramToken: { not: null },
      isActive: true,
    },
  });

  for (const company of companies) {
    try {
      const refreshed = await instagramAPI.refreshAccessToken(company.instagramToken!);

      await prisma.company.update({
        where: { id: company.id },
        data: {
          instagramToken: refreshed.access_token,
        },
      });
    } catch (error) {
      console.error(`Failed to refresh token for ${company.name}:`, error);
    }
  }

  return NextResponse.json({ success: true });
}
```

#### Recommended Cron Schedule

```yaml
# vercel.json
{
  "crons": [
    {
      "path": "/api/cron/refresh-instagram-tokens",
      "schedule": "0 0 * * 0"  // Weekly on Sunday at midnight
    },
    {
      "path": "/api/cron/instagram-sync",
      "schedule": "0 */6 * * *"  // Every 6 hours
    }
  ]
}
```

---

## Testing & Verification

### Manual Sync Script

Test Instagram integration manually:

```bash
# Sync all companies
npx tsx scripts/sync-instagram.ts

# Sync specific company
npx tsx scripts/sync-instagram.ts --company-id=clx123456

# Sync by email
npx tsx scripts/sync-instagram.ts --email=company@example.com
```

### Generate Mock Data

For testing without Instagram API:

```bash
# Generate mock posts for all companies
npx tsx scripts/generate-mock-instagram.ts

# Generate for specific company
npx tsx scripts/generate-mock-instagram.ts --company-id=clx123456

# Generate custom number of posts
npx tsx scripts/generate-mock-instagram.ts --count=20
```

### Verify API Access

Test Instagram API connection:

```typescript
import { instagramAPI } from '@/lib/instagram';

// Test with a valid access token
const profile = await instagramAPI.getUserProfile(accessToken);
console.log('Connected as:', profile.username);

const media = await instagramAPI.getUserMedia(accessToken, 10);
console.log('Posts fetched:', media.data.length);
```

---

## Troubleshooting

### Common Issues

#### 1. "Invalid OAuth access token"

**Cause**: Token has expired or is invalid

**Solution**:
- Refresh the access token
- Re-authenticate the user
- Check token expiration date

```typescript
try {
  const media = await instagramAPI.getUserMedia(token);
} catch (error) {
  if (error.message.includes('authentication failed')) {
    // Prompt user to reconnect Instagram
    // Or attempt token refresh
  }
}
```

#### 2. "Permissions error"

**Cause**: Missing required permissions

**Solution**:
- Ensure app has `user_profile` and `user_media` permissions
- Re-authenticate with correct scopes
- Check Facebook App Review status

#### 3. "Rate limit exceeded"

**Cause**: Too many API requests

**Solution**:
- Implement rate limiting in your code
- Add delays between requests (1 second minimum)
- Use pagination efficiently
- Cache data when possible

```typescript
// Add delay between requests
await new Promise(resolve => setTimeout(resolve, 1000));
```

#### 4. "Instagram account not connected to Facebook Page"

**Cause**: Instagram account is personal, not business

**Solution**:
1. Convert Instagram to Business account
2. Connect to a Facebook Page
3. Grant Page access to your app

#### 5. "App not approved"

**Cause**: App is in Development Mode

**Solution**:
- For testing: Add Instagram accounts as test users
- For production: Submit app for review
- Follow Facebook's [App Review](https://developers.facebook.com/docs/app-review) process

### Debug Mode

Enable detailed logging:

```typescript
// Add to your Instagram API calls
console.log('Fetching media with token:', token.substring(0, 10) + '...');

try {
  const media = await instagramAPI.getUserMedia(token);
  console.log('Success:', media.data.length, 'posts fetched');
} catch (error) {
  console.error('Instagram API Error:', {
    message: error.message,
    status: error.status,
    code: error.code,
  });
}
```

### Testing with Test Users

1. Go to **Roles** → **Instagram Testers** in your Facebook App
2. Add Instagram accounts as testers
3. Accept the invitation on Instagram
4. Test full authentication flow

---

## API Endpoints Reference

### Authentication

- **Authorization**: `https://api.instagram.com/oauth/authorize`
- **Token Exchange**: `https://api.instagram.com/oauth/access_token`
- **Long-lived Token**: `https://graph.instagram.com/access_token`
- **Refresh Token**: `https://graph.instagram.com/refresh_access_token`

### Data Endpoints

- **User Profile**: `https://graph.instagram.com/me`
- **User Media**: `https://graph.instagram.com/me/media`
- **Media Details**: `https://graph.instagram.com/{media-id}`

### Available Fields

```typescript
// User fields
'id,username,account_type,media_count'

// Media fields
'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count,children'
```

---

## Best Practices

### Security

1. **Never expose API credentials** in client-side code
2. **Use environment variables** for all secrets
3. **Implement CRON_SECRET** for webhook/cron protection
4. **Validate all tokens** before use
5. **Handle token expiration** gracefully

### Performance

1. **Cache Instagram data** in your database
2. **Sync periodically** (every 6 hours recommended)
3. **Use pagination** for large media sets
4. **Implement rate limiting** to avoid API blocks
5. **Add delays** between consecutive requests

### User Experience

1. **Show sync status** to users in dashboard
2. **Send email notifications** for sync errors
3. **Provide manual refresh** option
4. **Display last sync time**
5. **Handle disconnection** gracefully

---

## Additional Resources

- [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api)
- [Instagram Basic Display API](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Facebook App Review](https://developers.facebook.com/docs/app-review)
- [Instagram Platform Policy](https://www.facebook.com/policies/instagram_platform_policy)

---

## Support

For issues or questions:

1. Check this documentation
2. Review error logs in your application
3. Test with the manual sync script
4. Check Facebook Developer Console for app status
5. Contact support team

---

**Last Updated**: 2025-01-17
**Version**: 1.0.0
