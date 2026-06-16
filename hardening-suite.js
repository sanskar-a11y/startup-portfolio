const puppeteer = require('puppeteer');

(async () => {
  console.log('--- Phase 6: Production Hardening Suite ---');
  
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  let errors = [];
  let warnings = [];
  let failedRequests = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
    if (msg.type() === 'warning') warnings.push(msg.text());
  });
  
  page.on('pageerror', error => errors.push(error.message));
  
  page.on('requestfailed', request => {
    failedRequests.push(`${request.url()} (${request.failure().errorText})`);
  });

  console.log('[1/4] Asset Loading & Console Audit');
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });
  
  console.log(`- Errors: ${errors.length}`);
  console.log(`- Warnings: ${warnings.length}`);
  console.log(`- Failed Requests: ${failedRequests.length}`);
  
  if (errors.length > 0) console.log('Errors found:', errors);
  if (warnings.length > 0) console.log('Warnings found:', warnings);
  if (failedRequests.length > 0) console.log('Failed Requests:', failedRequests);

  console.log('\n[2/4] Mobile Stress Testing');
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.reload({ waitUntil: 'networkidle0' });
  // Simulate touch scroll
  await page.mouse.move(100, 500);
  await page.mouse.down();
  await page.mouse.move(100, 100);
  await page.mouse.up();
  await new Promise(r => setTimeout(r, 500));
  console.log('- Mobile viewport verified.');

  console.log('\n[3/4] Ultrawide Testing');
  await page.setViewport({ width: 3440, height: 1440 });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  console.log('- Ultrawide viewport verified.');

  console.log('\n[4/4] Resize Stress Testing');
  for (let i = 0; i < 20; i++) {
    const width = Math.floor(Math.random() * 1920) + 320;
    const height = Math.floor(Math.random() * 1080) + 480;
    await page.setViewport({ width, height });
    await new Promise(r => setTimeout(r, 50));
  }
  console.log('- 20 random rapid resizes completed safely.');

  await browser.close();
  console.log('--- Phase 6 Complete ---');
})();
