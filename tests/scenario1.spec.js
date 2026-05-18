const { test, expect, chromium } = require('@playwright/test');

test('Scenario 1 - like video', async () => {

  const context = await chromium.launchPersistentContext(
    './user-data',
    {
      headless: false,
    }
  );

  const page = await context.newPage();

  await page.goto('https://rutube.ru/');

  const searchInput = page.locator('input[placeholder="Поиск"]');

  await expect(searchInput).toBeVisible();

  const videoName = 'Новая Битва экстрасенсов, 25 сезон, 12 выпуск';

  await searchInput.fill(videoName);
  await searchInput.press('Enter');

  const grid = page.getByTestId('grid');
  const firstVideoLink = grid.locator(':scope > :first-child a[href*="/video/"]').first();
  await firstVideoLink.click();

  await page.locator('button[title="Нравится"]').waitFor({ state: 'visible' });

  const likeButton = page.locator('button[title="Нравится"]');
  
  let isLiked = await likeButton.getAttribute('aria-pressed');
  
  if (isLiked === 'false') {
    await likeButton.click();
    await expect(likeButton).toHaveAttribute('aria-pressed', 'true');
    isLiked = 'true';
  } else {
    await likeButton.click();
    await expect(likeButton).toHaveAttribute('aria-pressed', 'false');
    isLiked = 'false';
  }
  
  await page.waitForTimeout(1000);

  await page.reload();

  await page.locator('button[title="Нравится"]').waitFor({ state: 'visible' });

  const likeButtonAfterReload = page.locator('button[title="Нравится"]');
  
  await expect(likeButtonAfterReload).toHaveAttribute('aria-pressed', isLiked);
  
  await likeButtonAfterReload.click();
  
  await expect(likeButtonAfterReload).toHaveAttribute('aria-pressed', isLiked === 'false' ? 'true' : 'false');

  await context.close();
});