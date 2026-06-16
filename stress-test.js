const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8000');

  let errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', error => errors.push(error.message));

  console.log('Starting 100 Room-Entry / Room-Exit stress test...');

  for (let i = 0; i < 100; i++) {
    // Wait for the corridor state to settle and the canvas to be ready
    await new Promise(r => setTimeout(r, 1000));

    // Simulate clicking the center of the screen (assuming door is in focus)
    await page.mouse.click(page.viewport().width / 2, page.viewport().height / 2);

    // Wait for transition to room
    await new Promise(r => setTimeout(r, 2500));

    // Click exit door
    await page.mouse.click(page.viewport().width / 2, page.viewport().height / 2);

    // Wait for transition back to corridor
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('Stress test completed.');
  console.log('Errors caught:', errors);
  await browser.close();
})();
