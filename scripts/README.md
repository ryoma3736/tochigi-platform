# Instagram Sync Scripts

This directory contains scripts for managing Instagram integration and data synchronization.

## Available Scripts

### 1. Instagram Sync Script

Synchronizes real Instagram posts from Instagram Graph API to the database.

#### Usage

```bash
# Sync all companies with Instagram connected
npm run instagram:sync

# Sync specific company by ID
npx tsx scripts/sync-instagram.ts --company-id=clx123456

# Sync specific company by email
npx tsx scripts/sync-instagram.ts --email=company@example.com
```

#### Features

- Fetches latest posts from Instagram Graph API
- Upserts posts to database (creates new or updates existing)
- Handles errors gracefully with detailed logging
- Provides sync summary with statistics
- Rate limiting protection (1 second delay between companies)

#### Output

```
🚀 Instagram Sync Script Started

📸 Syncing Instagram for: Sample Restaurant (@sample_restaurant)
   🔄 Fetching posts from Instagram API...
   📥 Found 25 posts
   ✅ Success: 5 new, 20 updated

============================================================
📊 Sync Summary
============================================================

✅ Successful: 1
   - Sample Restaurant: 25 posts synced

============================================================
✨ Sync completed!
```

---

### 2. Mock Data Generator

Generates realistic mock Instagram posts for testing purposes when Instagram API is not available.

#### Usage

```bash
# Generate mock posts for all companies (10 posts each)
npm run instagram:mock

# Generate for specific company
npx tsx scripts/generate-mock-instagram.ts --company-id=clx123456

# Generate custom number of posts per company
npx tsx scripts/generate-mock-instagram.ts --count=20
```

#### Features

- Generates realistic captions based on business category
- Uses high-quality Unsplash images
- Random engagement metrics (likes, comments)
- Posts distributed over last 90 days
- Category-aware content generation
- Safe mode: limits to 10 companies by default

#### Output

```
🎨 Mock Instagram Data Generator Started

📸 Generating 10 mock posts for: Sample Restaurant
   ✅ Generated 10 posts

============================================================
📊 Generation Summary
============================================================

✅ Total posts generated: 10
📁 Companies processed: 1

============================================================
✨ Mock data generation completed!
```

---

## Prerequisites

### For Instagram Sync (Real API)

1. Instagram Business/Creator account
2. Facebook Developer App configured
3. Valid Instagram API credentials in `.env`
4. Companies must have `instagramToken` stored

Required environment variables:

```bash
INSTAGRAM_CLIENT_ID=your_instagram_app_id
INSTAGRAM_CLIENT_SECRET=your_instagram_app_secret
INSTAGRAM_REDIRECT_URI=https://yourdomain.com/api/auth/instagram/callback
```

### For Mock Data Generator

No external dependencies required. Works with:

- Active companies in database
- Valid Prisma connection
- Internet access (for Unsplash image URLs)

---

## Integration with Cron Jobs

These scripts can be integrated into automated workflows:

### Vercel Cron

```json
{
  "crons": [
    {
      "path": "/api/cron/instagram-sync",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

### GitHub Actions

```yaml
name: Instagram Sync
on:
  schedule:
    - cron: '0 */6 * * *'
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run instagram:sync
```

### Manual Trigger

Both scripts can be run manually anytime for:

- Initial data population
- Testing integrations
- Troubleshooting sync issues
- Refreshing data on demand

---

## Error Handling

### Common Issues

#### "No Instagram token found"

**Cause**: Company hasn't connected Instagram account

**Solution**:
1. Navigate to company dashboard
2. Click "Connect Instagram"
3. Complete OAuth flow
4. Retry sync

#### "Instagram authentication failed"

**Cause**: Token has expired or is invalid

**Solution**:
1. Refresh the token (auto-refresh cron should handle this)
2. Re-connect Instagram account if refresh fails

#### "Rate limit exceeded"

**Cause**: Too many API requests

**Solution**:
1. Wait before retrying
2. Scripts include built-in delays
3. Reduce sync frequency if persistent

---

## Best Practices

### Development

1. Use **mock generator** for local development
2. Test with **one company** before syncing all
3. Monitor console output for errors
4. Check database after successful sync

### Production

1. Schedule **sync-instagram** every 6 hours
2. Set up **token refresh** weekly
3. Monitor email notifications for failures
4. Keep backup of last successful sync

### Testing

```bash
# 1. Generate mock data for testing
npm run instagram:mock -- --company-id=test123 --count=5

# 2. Verify data in database
npm run db:studio

# 3. Test real sync with one company
npx tsx scripts/sync-instagram.ts --email=test@example.com
```

---

## Monitoring & Logs

### Script Output

Both scripts provide:
- Real-time progress updates
- Detailed error messages
- Summary statistics
- Exit codes (0 = success, 1 = failure)

### Database Verification

After running scripts, verify in Prisma Studio:

```bash
npm run db:studio
```

Navigate to `InstagramPost` table to see synced data.

---

## Related Documentation

- [INSTAGRAM_SETUP.md](../INSTAGRAM_SETUP.md) - Complete Instagram API setup guide
- [API Documentation](../app/api/cron/instagram-sync/route.ts) - Cron job implementation
- [Instagram API Client](../lib/instagram.ts) - API wrapper documentation

---

## Support

For issues or questions:

1. Check error messages in console output
2. Review Instagram API status
3. Verify environment variables
4. Test with mock data generator first
5. Check database connection

---

**Last Updated**: 2025-01-17
