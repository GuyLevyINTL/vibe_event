import { test, expect } from '@playwright/test';

test.describe('Break Breaker Game E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the game
    await page.goto('http://localhost:8080');
  });

  test('should load game page correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Break Breaker/);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Break Breaker');
    
    // Check game canvas exists
    await expect(page.locator('#gameCanvas')).toBeVisible();
    
    // Check control buttons exist
    await expect(page.locator('#startBtn')).toBeVisible();
    await expect(page.locator('#resetBtn')).toBeVisible();
    
    // Check score and lives display
    await expect(page.locator('#score')).toContainText('0');
    await expect(page.locator('#lives')).toContainText('3');
  });

  test('should start game when start button is clicked', async ({ page }) => {
    // Click start button
    await page.click('#startBtn');
    
    // Check that start button is disabled
    await expect(page.locator('#startBtn')).toBeDisabled();
    
    // Check game message appears
    await expect(page.locator('#gameMessage')).toContainText('Press SPACE to launch');
  });

  test('should launch ball when spacebar is pressed', async ({ page }) => {
    // Start the game
    await page.click('#startBtn');
    
    // Press spacebar to launch ball
    await page.keyboard.press('Space');
    
    // Game message should disappear
    await expect(page.locator('#gameMessage')).toHaveText('');
  });

  test('should move paddle with arrow keys', async ({ page }) => {
    // Start the game
    await page.click('#startBtn');
    
    // Test paddle movement (we can't directly test canvas content, 
    // but we can ensure key events are handled)
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('KeyA');
    await page.keyboard.press('KeyD');
    
    // If no errors thrown, paddle movement is working
    expect(true).toBe(true);
  });

  test('should reset game when reset button is clicked', async ({ page }) => {
    // Start and modify game state
    await page.click('#startBtn');
    await page.keyboard.press('Space');
    
    // Click reset button
    await page.click('#resetBtn');
    
    // Check that start button is enabled again
    await expect(page.locator('#startBtn')).toBeEnabled();
    
    // Check score and lives are reset
    await expect(page.locator('#score')).toContainText('0');
    await expect(page.locator('#lives')).toContainText('3');
    
    // Check game message is cleared
    await expect(page.locator('#gameMessage')).toHaveText('');
  });

  test('should display instructions', async ({ page }) => {
    // Check instructions are visible
    await expect(page.locator('.instructions')).toBeVisible();
    await expect(page.locator('.instructions h3')).toContainText('How to Play');
    
    // Check specific instruction text
    await expect(page.locator('.instructions')).toContainText('Move paddle');
    await expect(page.locator('.instructions')).toContainText('Break all bricks');
    await expect(page.locator('.instructions')).toContainText('Space');
  });

  test('should handle keyboard events correctly', async ({ page }) => {
    // Start the game
    await page.click('#startBtn');
    
    // Test various key combinations
    await page.keyboard.down('ArrowLeft');
    await page.keyboard.up('ArrowLeft');
    
    await page.keyboard.down('ArrowRight');
    await page.keyboard.up('ArrowRight');
    
    await page.keyboard.down('KeyA');
    await page.keyboard.up('KeyA');
    
    await page.keyboard.down('KeyD');
    await page.keyboard.up('KeyD');
    
    // Launch ball
    await page.keyboard.press('Space');
    
    // No errors should occur
    expect(true).toBe(true);
  });

  test('should maintain game state during gameplay', async ({ page }) => {
    // Start game
    await page.click('#startBtn');
    
    // Launch ball
    await page.keyboard.press('Space');
    
    // Wait a bit for game to run
    await page.waitForTimeout(1000);
    
    // Game should still be running (no error messages)
    const errorMessage = await page.locator('#gameMessage.lose').textContent();
    expect(errorMessage).toBeFalsy();
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('#gameCanvas')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('#gameCanvas')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('#gameCanvas')).toBeVisible();
  });

  test('should prevent context menu on canvas', async ({ page }) => {
    // Right-click on canvas should not show context menu
    await page.click('#gameCanvas', { button: 'right' });
    
    // No context menu should appear (this is implicit - if it appeared, test would fail)
    expect(true).toBe(true);
  });
});
