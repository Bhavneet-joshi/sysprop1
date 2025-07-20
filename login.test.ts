import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/login');

  // Fill in the login form
  await page.fill('input[name="email"]', 'admin@test.com');
  await page.fill('input[name="password"]', 'Qwerty@1234');

  // Handle CAPTCHA
  const captchaText = await page.textContent('label[for="captcha"]');
  if (captchaText) {
    const question = captchaText.split('CAPTCHA: ')[1].split(' = ?')[0];
    const [a, b] = question.split(' + ').map(Number);
    const answer = (a + b).toString();
    await page.fill('input[name="captcha"]', answer);
  }

  // Click the sign-in button
  await page.click('button[type="submit"]');

  // Wait for navigation to the dashboard
  await page.waitForURL('**/dashboard');

  console.log('Admin login successful!');
  await browser.close();
})();