import { expect, test } from "@playwright/test";
import { mockDashboardState, openDashboard } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await mockDashboardState(page);
});

const insightsTrigger = (page: import("@playwright/test").Page) =>
  page.locator(".insights-trigger-button").first();

test("James's view keeps a single right panel for Insights and Help", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await openDashboard(page);

  await page.getByTestId("button-user-james").click();
  await expect(
    page.getByRole("heading", { name: "Welcome James!" }),
  ).toBeVisible();

  // Open Help & Support first.
  await page.getByTestId("button-help-support").click();
  await expect(page.locator("#support-panel")).toBeVisible();

  // Opening Insights closes Help & Support.
  await insightsTrigger(page).click();
  await expect(page.locator("#business-insights-panel")).toBeVisible();
  await expect(page.locator("#support-panel")).toBeHidden();

  // Opening Help & Support again closes Insights.
  await page.getByTestId("button-help-support").click();
  await expect(page.locator("#support-panel")).toBeVisible();
  await expect(page.locator("#business-insights-panel")).toBeHidden();
});

test("Ben's view still shows Insights and Help side by side", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await openDashboard(page);

  await page.getByTestId("button-help-support").click();
  await expect(page.locator("#support-panel")).toBeVisible();

  await insightsTrigger(page).click();
  await expect(page.locator("#business-insights-panel")).toBeVisible();
  await expect(page.locator("#support-panel")).toBeVisible();
});

test("switching to James collapses side-by-side panels to one", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await openDashboard(page);

  await page.getByTestId("button-help-support").click();
  await insightsTrigger(page).click();
  await expect(page.locator("#support-panel")).toBeVisible();
  await expect(page.locator("#business-insights-panel")).toBeVisible();

  await page.getByTestId("button-user-james").click();
  await expect(page.locator("#business-insights-panel")).toBeVisible();
  await expect(page.locator("#support-panel")).toBeHidden();
});
