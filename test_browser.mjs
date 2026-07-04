import { chromium } from 'playwright';

async function run() {
  console.log("Launching headless browser...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.error(`[BROWSER CRASH] ${err.stack || err.message}`);
  });

  console.log("Navigating to dev server at http://127.0.0.1:5174/ ...");
  try {
    await page.goto('http://127.0.0.1:5174/', { waitUntil: 'load', timeout: 15000 });
    
    console.log("Filling master login form...");
    await page.fill('input[type="text"]', 'master');
    await page.fill('input[type="password"]', 'master123');
    
    console.log("Submitting form...");
    await page.click('button[type="submit"]');
    
    console.log("Waiting for Master Dashboard to render...");
    await page.waitForTimeout(3000);

    console.log("Taking screenshot...");
    await page.screenshot({ path: 'C:/Users/migue/.gemini/antigravity/brain/31f316d8-d7a0-4774-b98b-e11df3ad957c/scratch/test_screenshot.png' });
  } catch (e) {
    console.error("Navigation error:", e.message);
  }

  console.log("Closing browser...");
  await browser.close();
}

run().catch(console.error);
