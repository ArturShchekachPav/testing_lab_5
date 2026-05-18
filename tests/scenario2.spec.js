const { test, expect, chromium } = require('@playwright/test');
const fs = require('fs');

test('Scenario 2 - find video and reload', async () => {

  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage();

  await page.goto('https://rutube.ru/');

  const searchInput = page.locator('input[placeholder="Поиск"]');

  await expect(searchInput).toBeVisible();

  const videoName = 'Новая Битва экстрасенсов, 25 сезон, 12 выпуск';

  await searchInput.fill(videoName);
  await searchInput.press('Enter');

  const grid = page.getByTestId('grid');
  const firstVideoLink = grid.locator(':scope > :first-child a[href*="/video/"]').first();
  await firstVideoLink.click();

  await page.screenshot({
    path: 'artifacts/final-page.png',
    fullPage: true
  });

  const html = await page.content();

  fs.writeFileSync(
    'artifacts/page.html',
    html
  );

  await browser.close();
});