import { test, expect } from "@playwright/test";

test.describe("Dayflow HRMS — Golden Path End-to-End Suite", () => {
  const testRunId = Date.now().toString().slice(-4);
  const newEmpEmail = `jordan.qa.${testRunId}@dayflow.io`;
  let tempGeneratedPassword = "";

  test("1. Admin Login and Dashboard Analytics from PostgreSQL", async ({ page }) => {
    await page.goto("/login");

    // Fill in Admin credentials
    await page.locator('input[type="email"]').fill("admin@dayflow.io");
    await page.locator('input[type="password"]').fill("password123");
    await page.locator('button[type="submit"]').click();

    // Verify redirect to Admin Dashboard
    await expect(page).toHaveURL(/.*\/dashboard\/admin/, { timeout: 10000 });

    // Verify admin page elements loaded
    await expect(page.locator("body")).toContainText("Admin");
  });

  test("2. Admin Onboards New Employee Transactionally", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"]').fill("admin@dayflow.io");
    await page.locator('input[type="password"]').fill("password123");
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/.*\/dashboard\/admin/, { timeout: 10000 });

    // Navigate to Employees directory
    await page.goto("/dashboard/admin/employees");
    await expect(page.locator("body")).toContainText("Employee Directory");

    // Open Onboard Modal
    await page.locator('button:has-text("Onboard Employee")').click();

    // Fill Onboarding Form using exact placeholders
    await page.locator('input[placeholder="e.g. Jordan"]').fill("Jordan");
    await page.locator('input[placeholder="e.g. Blake"]').fill(`Hayes${testRunId}`);
    await page.locator('input[placeholder="jordan.blake@acmecorp.io"]').fill(newEmpEmail);
    await page.locator('input[placeholder="Senior QA Engineer"]').fill("Senior QA Automation Engineer");

    // Submit Onboard
    await page.locator('button[type="submit"]:has-text("Complete Onboarding")').click();

    // Verify credentials modal appeared
    await expect(page.locator("text=Staff Onboarding Complete")).toBeVisible({ timeout: 10000 });

    // Grab temporary password
    const passElement = page.locator("strong.text-rose-600");
    tempGeneratedPassword = (await passElement.textContent())?.trim() || "";
    expect(tempGeneratedPassword.length).toBeGreaterThan(5);

    // Close credentials dialog
    await page.locator('button:has-text("Done")').click();
    await expect(page.locator("text=Staff Onboarding Complete")).not.toBeVisible();
  });

  test("3. New Employee Forced Password Reset Lifecycle", async ({ page }) => {
    // Clear storage and navigate to login
    await page.goto("/login");
    await page.evaluate(() => localStorage.clear());
    await page.goto("/login");

    // Sign in with temporary credentials
    await page.locator('input[type="email"]').fill(newEmpEmail);
    await page.locator('input[type="password"]').fill(tempGeneratedPassword);
    await page.locator('button[type="submit"]').click();

    // Verify redirection to /force-password-reset
    await expect(page).toHaveURL(/.*\/force-password-reset/, { timeout: 10000 });

    // Fill temporary password and new permanent password
    await page.locator('input[placeholder="Enter temporary password from email"]').fill(tempGeneratedPassword);
    await page.locator('input[placeholder="••••••••••••"]').nth(0).fill("DayflowSecure2026!");
    await page.locator('input[placeholder="••••••••••••"]').nth(1).fill("DayflowSecure2026!");

    // Submit permanent password
    await page.locator('button[type="submit"]').click();

    // Verify redirection to Employee Workspace
    await expect(page).toHaveURL(/.*\/dashboard\/employee/, { timeout: 10000 });
  });

  test("4. Employee Attendance Page & Leave Balances", async ({ page }) => {
    await page.goto("/login");
    await page.evaluate(() => localStorage.clear());
    await page.goto("/login");

    await page.locator('input[type="email"]').fill("alex.rivera@dayflow.io");
    await page.locator('input[type="password"]').fill("password123");
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/.*\/dashboard\/employee/, { timeout: 10000 });

    // Navigate to Attendance
    await page.goto("/dashboard/employee/attendance");
    await expect(page.locator("body")).toContainText("Attendance");

    // Navigate to Leaves
    await page.goto("/dashboard/employee/leaves");
    await expect(page.locator("body")).toContainText("Leave");
    await expect(page.locator("body")).toContainText("Paid Leave");
  });

  test("5. HR Review & Leave Workflow", async ({ page }) => {
    // Log in as HR Lead
    await page.goto("/login");
    await page.evaluate(() => localStorage.clear());
    await page.goto("/login");

    await page.locator('input[type="email"]').fill("sarah.hr@dayflow.io");
    await page.locator('input[type="password"]').fill("password123");
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/.*\/dashboard\/admin/, { timeout: 10000 });

    // Navigate to Leaves Review
    await page.goto("/dashboard/admin/leaves");
    await expect(page.locator("body")).toContainText("Leave");
  });

  test("6. Admin Payroll Breakdown & Wage Structure", async ({ page }) => {
    await page.goto("/login");
    await page.evaluate(() => localStorage.clear());
    await page.goto("/login");

    await page.locator('input[type="email"]').fill("admin@dayflow.io");
    await page.locator('input[type="password"]').fill("password123");
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/.*\/dashboard\/admin/, { timeout: 10000 });

    // Navigate to Payroll
    await page.goto("/dashboard/admin/payroll");
    await expect(page.locator("body")).toContainText("Payroll");
    await expect(page.locator("body")).toContainText("Basic");
  });
});
