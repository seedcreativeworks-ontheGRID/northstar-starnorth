import { expect, test } from "@playwright/test";
import { openDashboard } from "./fixtures";

test("unsupported controls explain their limits instead of ending silently", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await openDashboard(page);

  await page.getByRole("button", { name: /English/ }).click();
  let disclosure = page.getByRole("dialog", { name: "Language Settings" });
  await expect(disclosure).toContainText("only available in English");
  await expect(disclosure).toContainText("No banking instruction was submitted");
  await disclosure.getByRole("button", { name: "Return to dashboard" }).click();

  await page.getByRole("button", { name: "Administration" }).click();
  disclosure = page.getByRole("dialog", {
    name: "Administration — Not Available in Demo",
  });
  await expect(disclosure).toContainText("not available in this prototype");
  await disclosure.getByRole("button", { name: "Return to dashboard" }).click();

  await page
    .getByRole("button", { name: "Payments and Receivables" })
    .click();
  await page.getByRole("button", { name: "Wire Payment", exact: true }).click();
  disclosure = page.getByRole("dialog", {
    name: "Wire Payment — Not Available in Demo",
  });
  await expect(disclosure).toBeVisible();
  await disclosure.getByRole("button", { name: "Return to dashboard" }).click();

  await page.getByRole("button", { name: "View All Chequing Accounts" }).click();
  await expect(
    page.getByRole("dialog", {
      name: "Deposit Account — account detail",
    }),
  ).toContainText("displays summary data only");
});

test("notifications acknowledge completion and open the relevant journey", async ({
  page,
}) => {
  await openDashboard(page);

  const notifications = page.getByRole("button", {
    name: "Notifications, 2 unread",
  });
  await notifications.click();
  await page.getByTestId("notification-report").click();

  const report = page.getByRole("dialog", {
    name: "Jul 2026 Transfer Activity Report",
  });
  await expect(report).toContainText("Sample report preview");
  await page.keyboard.press("Escape");

  await expect(
    page.getByRole("button", { name: "Notifications, 1 unread" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Notifications, 1 unread" }).click();
  await page.getByTestId("notification-payroll").click();

  await expect(page.getByRole("dialog", { name: "Transfer Funds" })).toBeVisible();
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(
    page.getByRole("button", { name: "Notifications, 0 unread" }),
  ).toBeVisible();

  await page.reload();
  await page.getByRole("heading", { name: "Welcome Ben!" }).waitFor();
  await expect(
    page.getByRole("button", { name: "Notifications, 0 unread" }),
  ).toBeVisible();
});

test("Ben and James keep isolated session journeys across a refresh", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await openDashboard(page);

  const benApproval = page
    .locator(".approval-row")
    .filter({ hasText: "Approve ACH Template" });
  await benApproval.getByRole("button", { name: "Approve" }).click();
  await expect(benApproval.getByText("approved", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "James", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Welcome James!" }),
  ).toBeVisible();
  const jamesApproval = page
    .locator(".approval-row")
    .filter({ hasText: "Approve ACH Template" });
  await expect(
    jamesApproval.getByRole("button", { name: "Approve" }),
  ).toBeVisible();

  await page
    .getByRole("button", { name: "Payments and Receivables" })
    .click();
  await page.getByRole("button", { name: "Account Transfer", exact: true }).click();
  const transfer = page.getByRole("dialog", { name: "Transfer Funds" });
  await transfer.getByLabel("Amount").fill("1000");
  await transfer.getByRole("button", { name: "Transfer now" }).click();
  await expect(
    page.getByRole("button", { name: /Internal account transfer/ }),
  ).toContainText("+ $1,000.00");

  await page.reload();
  await page.getByRole("heading", { name: "Welcome James!" }).waitFor();
  await expect(
    page.getByRole("button", { name: /Internal account transfer/ }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Ben", exact: true }).click();
  await expect(benApproval.getByText("approved", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /Internal account transfer/ })).toHaveCount(0);
});

test("James report entry points all reach an explicit sample preview", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await openDashboard(page);
  await page.getByRole("button", { name: "James", exact: true }).click();

  const insight = page.locator(".payroll-alert");
  await insight
    .getByRole("button", { name: /Hide This month you have an \$80,000 surplus/ })
    .click();
  await insight
    .getByRole("button", { name: /Dismiss .* and show the next insight/ })
    .click();
  await insight
    .getByRole("button", { name: /Hide A \$42,500 wire payment/ })
    .click();
  await insight
    .getByRole("button", { name: /Dismiss .* and show the next insight/ })
    .click();
  await page.getByRole("button", { name: "Open report" }).click();
  let report = page.getByRole("dialog", {
    name: "Cash Position Report: Virtual Account",
  });
  await expect(report).toContainText("Sample report preview");
  await page.keyboard.press("Escape");

  await page
    .getByRole("button", { name: "Payments and Receivables" })
    .click();
  await page
    .getByRole("button", { name: "Account transfer reports", exact: true })
    .click();
  await expect(page.locator("#reports")).toBeInViewport();

  await page.getByRole("button", { name: "Notifications, 2 unread" }).click();
  await page.getByTestId("notification-report").click();
  report = page.getByRole("dialog", {
    name: "Jul 2026 Transfer Activity Report",
  });
  await expect(report).toContainText("Sample report preview");
});

test("incomplete session records are normalized before the dashboard renders", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.sessionStorage.setItem(
      "northstar-dashboard-session-v1",
      JSON.stringify({
        version: 1,
        activeUser: "james",
        isSignedOut: false,
        users: {
          ben: {},
          james: {
            readNotificationIds: ["report"],
          },
        },
      }),
    );
  });

  await openDashboard(page);
  await expect(
    page.getByRole("heading", { name: "Welcome James!" }),
  ).toBeVisible();
  await expect(
    page
      .locator(".approval-row")
      .filter({ hasText: "Approve ACH Template" })
      .getByRole("button", { name: "Approve" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Notifications, 1 unread" }),
  ).toBeVisible();
  await expect(page.locator("#reports")).toBeVisible();
});

test("support chat and article feedback end with honest acknowledgements", async ({
  page,
}) => {
  await openDashboard(page);

  await page.getByRole("button", { name: /Support Centre/ }).click();
  await page.getByTestId("support-chat-with-us").click();
  const support = page.locator("#support-panel");
  await expect(support).toContainText("Demo chat");
  await expect(support).toContainText("no real support agent connected");

  await support.getByPlaceholder("Type your message...").fill("I need help with a transfer.");
  await support.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText("Demo response sent", { exact: true })).toBeVisible();
  await expect(support).toContainText("No real ticket was created");

  await support.getByRole("button", { name: "Back to Help Center" }).click();
  await support
    .getByPlaceholder("Search help articles...")
    .fill("payment processing");
  await support
    .getByRole("button", { name: /Understanding payment processing times/ })
    .click();
  await support.getByRole("button", { name: "Yes" }).click();
  await expect(
    page.getByText("Thanks for your feedback!", { exact: true }),
  ).toBeVisible();
  await expect(support).toContainText("Thank you for your feedback.");
});

test("sign out clears the tab session and returns to protected access", async ({
  page,
}) => {
  await openDashboard(page);

  const approval = page
    .locator(".approval-row")
    .filter({ hasText: "Approve ACH Template" });
  await approval.getByRole("button", { name: "Approve" }).click();
  await expect(approval.getByText("approved", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Sign Out" }).click();
  const confirmation = page.getByRole("alertdialog", {
    name: "Sign out of Northstar?",
  });
  await expect(confirmation).toContainText("returned to the demo start screen");
  await confirmation.getByRole("button", { name: "Sign Out" }).click();

  await expect(
    page.getByRole("heading", {
      name: "A clearer view of what moves your business.",
    }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", {
      name: "A clearer view of what moves your business.",
    }),
  ).toBeVisible();

  await page.getByLabel("Username").fill(crypto.randomUUID());
  await page
    .getByTestId("input-login-password")
    .fill(crypto.randomUUID());
  await page.getByRole("button", { name: "Sign in to preview" }).click();
  await expect(page.getByRole("heading", { name: "Welcome Ben!" })).toBeVisible();
  await expect(
    page
      .locator(".approval-row")
      .filter({ hasText: "Approve ACH Template" })
      .getByRole("button", { name: "Approve" }),
  ).toBeVisible();
});