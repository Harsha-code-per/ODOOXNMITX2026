import { test, expect } from '@playwright/test';

test.describe('Platform Super Admin & Multi-Tenant Provisioning E2E', () => {

  test('1. Super Admin login with credentials and dashboard load', async ({ page }) => {
    await page.goto('/platform-admin/login');
    await expect(page.getByRole('heading', { name: 'Platform Super Admin' })).toBeVisible();

    // Fill credentials
    const emailInput = page.locator('input[type="email"]');
    const passInput = page.locator('input[type="password"]');

    await emailInput.fill('owner@dayflow.io');
    await passInput.fill('DayflowPlatform#2026');
    await page.getByRole('button', { name: /Unlock Platform Console/i }).click();

    // Verify redirected to /platform-admin
    await expect(page).toHaveURL(/.*\/platform-admin/);
    await expect(page.getByRole('heading', { name: 'SaaS Multi-Tenant Management' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Active Client Tenants')).toBeVisible();
  });

  test('2. Super Admin provisions new tenant company', async ({ page }) => {
    // Login as super admin
    await page.goto('/platform-admin/login');
    await page.locator('input[type="email"]').fill('owner@dayflow.io');
    await page.locator('input[type="password"]').fill('DayflowPlatform#2026');
    await page.getByRole('button', { name: /Unlock Platform Console/i }).click();
    await expect(page).toHaveURL(/.*\/platform-admin/);

    // Click "Provision New Company" button
    await page.getByRole('button', { name: /Provision New Company/i }).click();
    await expect(page.getByRole('heading', { name: 'Provision Client Company & Admin' })).toBeVisible();

    const uniqueId = Date.now().toString().slice(-4);
    const companyName = `Aether Bio ${uniqueId}`;
    const domain = `aether${uniqueId}.com`;
    const adminEmail = `admin@aether${uniqueId}.com`;

    await page.locator('input[placeholder="e.g. Zenith Tech"]').fill(companyName);
    await page.locator('input[placeholder="zenith.com"]').fill(domain);
    await page.locator('input[placeholder="Claire Dupont"]').fill('Dr. Eleanor Vance');
    await page.locator('input[placeholder="admin@zenith.com"]').fill(adminEmail);

    // Submit provisioning
    await page.getByRole('button', { name: /Provision & Dispatch Email/i }).click();

    // Check activation modal
    await expect(page.getByRole('heading', { name: 'Welcome Invitation Email Dispatched' })).toBeVisible({ timeout: 10000 });

    // Close modal
    await page.getByRole('button', { name: 'Close', exact: true }).click();

    // Verify newly provisioned company appears in directory
    await expect(page.getByRole('table').getByText(companyName)).toBeVisible();
  });

  test('3. Public contact inquiry submission and Super Admin queue review', async ({ page }) => {
    const uniqueId = Date.now().toString().slice(-4);
    const inqCompany = `OmniCorp ${uniqueId}`;
    const inqEmail = `director@omnicorp${uniqueId}.com`;

    // 1. Submit inquiry from /contact
    await page.goto('/contact');
    await page.locator('input[placeholder="e.g. Acme Corporation"]').fill(inqCompany);
    await page.locator('input[placeholder="e.g. Arthur Morgan"]').fill('Alexander Vance');
    await page.locator('input[placeholder="admin@acmecorp.io"]').fill(inqEmail);
    await page.locator('textarea').fill('Requesting an enterprise custom deployment for 250 employees.');

    await page.getByRole('button', { name: /Submit Workspace Request/i }).click();
    await expect(page.getByText('Inquiry Received!')).toBeVisible({ timeout: 10000 });

    // 2. Super Admin logs in to verify inquiry
    await page.goto('/platform-admin/login');
    await page.locator('input[type="email"]').fill('owner@dayflow.io');
    await page.locator('input[type="password"]').fill('DayflowPlatform#2026');
    await page.getByRole('button', { name: /Unlock Platform Console/i }).click();
    await expect(page).toHaveURL(/.*\/platform-admin/);

    // Switch to Inbound Inquiries tab
    await page.getByRole('button', { name: /Inbound Inquiries/i }).click();
    await expect(page.getByText(inqCompany)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(inqEmail)).toBeVisible();
  });

  test('4. Newly provisioned admin forced password reset lifecycle', async ({ page }) => {
    // 1. Provision a tenant via backend API
    const uniqueId = Date.now().toString().slice(-4);
    const adminEmail = `director@solaris${uniqueId}.io`;

    // Login as super admin to provision
    await page.goto('/platform-admin/login');
    await page.locator('input[type="email"]').fill('owner@dayflow.io');
    await page.locator('input[type="password"]').fill('DayflowPlatform#2026');
    await page.getByRole('button', { name: /Unlock Platform Console/i }).click();
    await expect(page).toHaveURL(/.*\/platform-admin/);

    await page.getByRole('button', { name: /Provision New Company/i }).click();
    await page.locator('input[placeholder="e.g. Zenith Tech"]').fill(`Solaris ${uniqueId}`);
    await page.locator('input[placeholder="zenith.com"]').fill(`solaris${uniqueId}.io`);
    await page.locator('input[placeholder="Claire Dupont"]').fill('Harrison Vance');
    await page.locator('input[placeholder="admin@zenith.com"]').fill(adminEmail);
    await page.getByRole('button', { name: /Provision & Dispatch Email/i }).click();

    await expect(page.getByRole('heading', { name: 'Welcome Invitation Email Dispatched' })).toBeVisible({ timeout: 10000 });

    // Extract temporary password from modal
    const tempPassText = await page.locator('.text-rose-600').textContent();
    const tempPass = tempPassText?.trim() || 'Dayflow@1234';

    // Clear storage and navigate to login
    await page.goto('/login');
    await page.evaluate(() => localStorage.clear());
    await page.goto('/login');

    // 2. Login as newly provisioned Tenant Admin
    await page.locator('input[type="email"]').fill(adminEmail);
    await page.locator('input[type="password"]').fill(tempPass);
    await page.locator('button[type="submit"]').click();

    // Verify redirected to /force-password-reset
    await expect(page).toHaveURL(/.*\/force-password-reset/, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Set Permanent Password' })).toBeVisible({ timeout: 10000 });

    // Complete forced password reset
    await page.locator('input[placeholder="Enter temporary password from email"]').fill(tempPass);
    await page.locator('input[placeholder="••••••••••••"]').nth(0).fill('PermanentPass#2026');
    await page.locator('input[placeholder="••••••••••••"]').nth(1).fill('PermanentPass#2026');
    await page.locator('button[type="submit"]').click();

    // Verify redirected to tenant admin dashboard
    await expect(page).toHaveURL(/.*\/dashboard\/admin/, { timeout: 10000 });
    await expect(page.getByText('Executive Overview')).toBeVisible({ timeout: 10000 });
  });

});
