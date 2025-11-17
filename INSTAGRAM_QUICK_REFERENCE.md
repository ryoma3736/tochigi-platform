# Instagram Integration - Quick Reference

Quick command reference for Instagram integration features.

## NPM Scripts

```bash
# Manual sync (all companies)
npm run instagram:sync

# Generate mock data (all companies)
npm run instagram:mock
```

## Manual Sync Options

```bash
# Sync all companies with Instagram connected
npm run instagram:sync

# Sync specific company by ID
npx tsx scripts/sync-instagram.ts --company-id=clx123456

# Sync specific company by email
npx tsx scripts/sync-instagram.ts --email=company@example.com
```

## Mock Data Generation

```bash
# Generate 10 posts for all companies
npm run instagram:mock

# Generate for specific company
npx tsx scripts/generate-mock-instagram.ts --company-id=clx123456

# Generate 20 posts per company
npx tsx scripts/generate-mock-instagram.ts --count=20
```

## Environment Variables

```bash
# Required for production
INSTAGRAM_CLIENT_ID=your_instagram_app_id
INSTAGRAM_CLIENT_SECRET=your_instagram_app_secret
INSTAGRAM_REDIRECT_URI=https://yourdomain.com/api/auth/instagram/callback

# For cron job protection
CRON_SECRET=your_random_secret_key

# App URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## API Endpoints

```
GET  /api/auth/instagram/authorize        # Start OAuth flow
GET  /api/auth/instagram/callback         # OAuth callback
GET  /api/cron/instagram-sync             # Sync all companies
GET  /api/cron/refresh-instagram-tokens   # Refresh tokens
```

## Vercel Cron Setup

**File**: `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/instagram-sync",
      "schedule": "0 */6 * * *"
    },
    {
      "path": "/api/cron/refresh-instagram-tokens",
      "schedule": "0 0 * * 0"
    }
  ]
}
```

## Database Access

```bash
# Open Prisma Studio
npm run db:studio

# Navigate to InstagramPost table
```

## Testing Flow

```bash
# 1. Generate mock data
npm run instagram:mock

# 2. View in database
npm run db:studio

# 3. Test real sync (if API configured)
npm run instagram:sync

# 4. Check for errors in console
```

## Common Tasks

### First Time Setup

```bash
# 1. Add environment variables to .env
# 2. Generate Prisma client
npm run db:generate

# 3. Push schema to database
npm run db:push

# 4. Generate test data
npm run instagram:mock
```

### Production Deployment

```bash
# 1. Set environment variables in Vercel
# 2. Deploy application
# 3. Add vercel.json with cron config
# 4. Test cron endpoint manually
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
     https://yourdomain.com/api/cron/instagram-sync
```

## Troubleshooting

### Check logs

```bash
# View app logs
vercel logs

# Check specific function
vercel logs --function=/api/cron/instagram-sync
```

### Manual token refresh

```typescript
import { instagramAPI } from '@/lib/instagram';

const refreshed = await instagramAPI.refreshAccessToken(currentToken);
console.log('New token:', refreshed.access_token);
```

### Database queries

```typescript
import { prisma } from '@/lib/prisma';

// Count Instagram posts
const count = await prisma.instagramPost.count();

// Get latest posts
const posts = await prisma.instagramPost.findMany({
  take: 10,
  orderBy: { timestamp: 'desc' }
});
```

## File Locations

```
lib/instagram.ts                          # API client
scripts/sync-instagram.ts                 # Manual sync
scripts/generate-mock-instagram.ts        # Mock generator
app/api/cron/instagram-sync/route.ts      # Auto sync
INSTAGRAM_SETUP.md                        # Full setup guide
```

## Quick Links

- [Full Setup Guide](./INSTAGRAM_SETUP.md)
- [Scripts Documentation](./scripts/README.md)
- [Implementation Complete](./INSTAGRAM_IMPLEMENTATION_COMPLETE.md)
- [Instagram Graph API Docs](https://developers.facebook.com/docs/instagram-api)

## Support

For detailed information, see:
- INSTAGRAM_SETUP.md - Complete setup instructions
- scripts/README.md - Script usage details
- INSTAGRAM_IMPLEMENTATION_COMPLETE.md - Full implementation summary
