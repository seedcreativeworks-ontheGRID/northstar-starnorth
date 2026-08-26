import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import {
  mockDashboardState,
  openDashboard,
} from "./fixtures";

test.beforeEach(async ({ page }) => {
  await mockDashboardState(page);
});

test("validates transfers and shows a completed transfer immediately", async ({
  page,
}) => {
  await openDashboard(page);
  await page
    .getByRole("button", { name: "Transfer now", exact: true })
    .click();

  const dialog = page.getByRole("dialog", { name: "Transfer Funds" });
  const amount = dialog.getByLabel("Amount");
  const submit = dialog.getByRole("button", { name: "Transfer now" });

  await expect(dialog).toContainText("Top up your operating balance");
  await expect(dialog).toContainText("Investments Overview");
  await expect(dialog).toContainText("Deposit Accounts Overview");
  await expect(dialog).toContainText("CAD - Canadian Dollar");
  await expect(amount).toHaveValue("129493");

  await amount.fill("");
  await submit.click();
  await expect(dialog.getByRole("alert")).toHaveText("Amount is required");

  await amount.fill("0");
  await submit.click();
  await expect(dialog.getByRole("alert")).toHaveText(
    "Must be a positive number",
  );

  await amount.fill("190939.91");
  await submit.click();
  await expect(dialog.getByRole("alert")).toHaveText(
    "Cannot exceed available balance (190,939.90 CAD)",
  );

  await amount.fill("129493");
  await submit.click();

  await expect(dialog).toBeHidden();
  await expect(
    page.getByText("Transfer successful", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Successfully transferred $129,493.00 CAD.", {
      exact: true,
    }),
  ).toBeVisible();
  const newTransaction = page.getByRole("button", {
    name: "View details for Internal account transfer transaction on Northstar Chequing Business **5274",
  });
  await expect(newTransaction).toBeVisible();
  await expect(newTransaction).toContainText("$129,493.00");
  await expect(newTransaction).toContainText("Just now");

  await page.reload();
  await page.getByRole("heading", { name: "Welcome Ben!" }).waitFor();
  await expect(newTransaction).toBeVisible();
  await expect(page.locator(".payroll-alert")).toBeHidden();
});

test("updates approval decisions and opens the matching details", async ({
  page,
}) => {
  await openDashboard(page);

  const achApproval = page
    .locator(".approval-row")
    .filter({ hasText: "Approve ACH Template" });
  await achApproval.getByRole("button", { name: "Approve" }).click();
  await expect(achApproval.getByText("approved", { exact: true })).toBeVisible();
  await expect(
    achApproval.getByRole("button", { name: "Approve" }),
  ).toHaveCount(0);
  await expect(page.getByText("Approval granted", { exact: true })).toBeVisible();

  await achApproval.getByRole("button", { name: "View" }).click();
  const details = page.getByRole("dialog", { name: "Approve ACH Template" });
  await expect(details).toContainText("Approval ID: app-1");
  await expect(details).toContainText("Credit reconciliation payment");
  await expect(details).toContainText("approved");
  await page.keyboard.press("Escape");

  const wireApproval = page
    .locator(".approval-row")
    .filter({ hasText: "Wire payment approval" });
  await wireApproval.getByRole("button", { name: "Reject" }).click();
  await expect(wireApproval.getByText("rejected", { exact: true })).toBeVisible();
  await expect(page.getByText("Approval rejected", { exact: true })).toBeVisible();

  await page.reload();
  await page.getByRole("heading", { name: "Welcome Ben!" }).waitFor();
  await expect(
    page
      .locator(".approval-row")
      .filter({ hasText: "Approve ACH Template" })
      .getByText("approved", { exact: true }),
  ).toBeVisible();
  await expect(
    page
      .locator(".approval-row")
      .filter({ hasText: "Wire payment approval" })
      .getByText("rejected", { exact: true }),
  ).toBeVisible();
});

test("previews reports and downloads valid TXT and PDF files", async ({
  page,
}) => {
  await openDashboard(page);

  const previewRow = page
    .locator(".report-row")
    .filter({ hasText: "Transfer Activity Report" });
  await previewRow.getByRole("button", { name: "View Report" }).click();

  const preview = page.getByRole("dialog", {
    name: "Transfer Activity Report",
  });
  await expect(preview).toContainText("Bank - PDF");
  await expect(preview.locator(".bg-white.border.shadow-sm")).toBeVisible();
  await page.keyboard.press("Escape");

  const txtRow = page
    .locator(".report-row")
    .filter({ hasText: "Q3 2026 Transfer Template Report" });
  const txtDownloadPromise = page.waitForEvent("download");
  await txtRow.getByRole("button", { name: "Download Report" }).click();
  const txtDownload = await txtDownloadPromise;
  expect(txtDownload.suggestedFilename()).toBe("Report_r3.txt");
  const txtPath = await txtDownload.path();
  expect(txtPath).not.toBeNull();
  await expect(
    readFile(txtPath!, "utf8"),
  ).resolves.toBe(
    "Mock report data for Q3 2026 Transfer Template Report",
  );

  const pdfRow = page
    .locator(".report-row")
    .filter({ hasText: "Jul 2026 Transfer Activity Report" });
  const pdfDownloadPromise = page.waitForEvent("download");
  await pdfRow.getByRole("button", { name: "Download Report" }).click();
  const pdfDownload = await pdfDownloadPromise;
  expect(pdfDownload.suggestedFilename()).toBe("Report_r4.pdf");
  const pdfPath = await pdfDownload.path();
  expect(pdfPath).not.toBeNull();

  const pdf = await readFile(pdfPath!);
  const pdfText = pdf.toString("latin1");
  expect(pdf.byteLength).toBeGreaterThan(500);
  expect(pdfText.startsWith("%PDF-1.4\n")).toBe(true);
  expect(pdfText).toContain("Jul 2026 Transfer Activity Report");
  expect(pdfText).toContain("\nxref\n");
  expect(pdfText.endsWith("%%EOF\n")).toBe(true);
  await expect(page.getByText("Download complete").last()).toBeVisible();
});

test("moves through homepage insights and supports detailed action states", async ({
  page,
}) => {
  await openDashboard(page);

  const alert = page.locator(".payroll-alert");
  await expect(alert).toContainText(
    "Payroll of $129,493 CAD is due in 1 day",
  );

  await page
    .getByRole("button", {
      name: "Hide Payroll of $129,493 CAD is due in 1 day",
    })
    .click();
  await expect(alert).toContainText("has been hidden");
  await page.getByRole("button", { name: "Undo" }).click();
  await expect(alert).toContainText(
    "Your balance may be insufficient to cover it.",
  );

  await page
    .getByRole("button", {
      name: "Hide Payroll of $129,493 CAD is due in 1 day",
    })
    .click();
  await page
    .getByRole("button", {
      name: /Dismiss Payroll of \$129,493 CAD is due in 1 day/,
    })
    .click();
  await expect(alert).toContainText(
    "A $42,500 wire payment is awaiting approval",
  );

  await page.getByRole("button", { name: "Review approval" }).click();
  await expect(
    page.getByRole("dialog", { name: "Wire payment approval" }),
  ).toContainText("Approval ID: app-2");
  await page.keyboard.press("Escape");

  await page
    .getByRole("button", {
      name: "Hide A $42,500 wire payment is awaiting approval",
    })
    .click();
  await page
    .getByRole("button", {
      name: /Dismiss A \$42,500 wire payment is awaiting approval/,
    })
    .click();
  await expect(alert).toContainText(
    "Your cash position report is ready to review",
  );

  await page.getByRole("button", { name: "Open report" }).click();
  await expect(
    page.getByRole("dialog", {
      name: "Cash Position Report: Virtual Account",
    }),
  ).toContainText("Bank - HTML");
  await page.keyboard.press("Escape");

  await page
    .getByRole("button", {
      name: "Hide Your cash position report is ready to review",
    })
    .click();
  await page
    .getByRole("button", {
      name: /Dismiss Your cash position report is ready to review/,
    })
    .click();
  await expect(alert).toBeHidden();

  await page
    .getByRole("button", { name: /Northstar Business Insights/ })
    .click();
  const insights = page.locator(
    'aside[aria-label="Northstar Business Insights"]',
  );
  await expect(insights).toBeVisible();
  await expect(insights).toContainText("16 July");
  await expect(insights).toContainText("15 July");
  await expect(insights).toContainText("12 July");

  const shortfall = insights.getByRole("button", {
    name: "Transfer funds to cover payroll shortfall",
  });
  await shortfall.click();
  await expect(shortfall).toHaveAttribute("aria-expanded", "true");
  await expect(insights).toContainText(
    "Add funds before the processing deadline",
  );

  await insights.getByRole("button", { name: "Chat with us" }).click();
  await expect(insights).toContainText(
    "Choose one or more actions",
  );
  await insights
    .getByRole("button", { name: "Continue with selected actions" })
    .click();
  await expect(
    page.getByText("Choose an action", { exact: true }),
  ).toBeVisible();

  const action = insights.getByRole("button", {
    name: "Set a payroll reminder",
  });
  await action.click();
  await expect(action).toHaveAttribute("aria-pressed", "true");
  await insights
    .getByRole("button", { name: "Continue with selected actions" })
    .click();
  await expect(
    page.getByText("Action saved", { exact: true }),
  ).toBeVisible();
  await expect(action).toBeDisabled();
  await expect(action).toContainText("Done");
});