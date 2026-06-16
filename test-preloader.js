const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('CONSOLE:', msg.text()));
  await page.goto('http://localhost:8000');
  try {
    await page.waitForFunction(() => {
      const p = document.querySelector('.preloader');
      return !p || p.classList.contains('hidden');
    }, {timeout: 5000});
    console.log('Preloader dismissed successfully.');
  } catch(e) {
    console.log('Preloader stuck!');
  }
  await browser.close();
})();
