const { chromium } = require('playwright');

async function scrapeInstagramPost(url) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    const data = await page.evaluate(() => {
      // Try to extract data from meta tags and page content
      const getMetaContent = (property) => {
        const meta = document.querySelector(`meta[property="${property}"]`);
        return meta ? meta.getAttribute('content') : null;
      };

      return {
        username: getMetaContent('instapp:owner_user_username'),
        caption: getMetaContent('og:description'),
        imageUrl: getMetaContent('og:image'),
        title: getMetaContent('og:title'),
        url: getMetaContent('og:url')
      };
    });

    console.log(JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

const url = process.argv[2] || 'https://www.instagram.com/p/DOyPwfOE5L2/';
scrapeInstagramPost(url);
