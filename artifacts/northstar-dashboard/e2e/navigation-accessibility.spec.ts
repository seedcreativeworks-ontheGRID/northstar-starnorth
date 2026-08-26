import { expect, test } from "@playwright/test";
import { mockDashboardState, openDashboard } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await mockDashboardState(page);
});

test("desktop navigation exposes the complete payments menu", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await openDashboard(page);

  await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Accounts Information" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Administration" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Marketplace" })).toBeVisible();

  await page
    .getByRole("button", { name: "Payments and Receivables" })
    .click();
  const paymentsSection = page
    .getByRole("heading", { name: "Payments and Transfers" })
    .locator("..");
  for (const paymentOption of [
    "Account Transfer",
    "ACH Payments",
    "Electronic Funds Transfer (EFT)",
    "EFT Client Returns",
    "File Transfer Facility (FTF)",
    "Interac e-Transfer CA",
    "Wire Payment",
    "Zelle US",
  ]) {
    await expect(
      paymentsSection.getByRole("button", {
        name: paymentOption,
        exact: true,
      }),
    ).toBeVisible();
  }
});

test("mobile navigation, support menus, and responsive layout remain usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openDashboard(page);

  const navigationButton = page.getByRole("button", {
    name: "Open primary navigation",
  });
  await navigationButton.click();
  const navigation = page.getByRole("navigation", {
    name: "Primary navigation",
  });
  await expect(navigation).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(
    navigation.getByRole("tab", { name: /Quick Access/ }),
  ).toBeFocused();

  const railGroups: Array<{ group: RegExp; items: string[] }> = [
    {
      group: /Quick Access/,
      items: ["Home", "Accounts Information", "Administration", "Marketplace"],
    },
    {
      group: /Payments & Transfers/,
      items: [
        "Account Transfer",
        "ACH Payments",
        "Electronic Funds Transfer (EFT)",
        "EFT Client Returns",
        "File Transfer Facility (FTF)",
        "Interac e-Transfer",
        "Wire Payment",
        "Zelle",
      ],
    },
    {
      group: /Cheques/,
      items: [
        "Northstar DepositEdge",
        "Digital Cheque Service (DCS)",
        "Recon Management",
        "Stop Payments",
        "Cheque Imaging",
      ],
    },
    {
      group: /Reports/,
      items: [
        "Account transfer reports",
        "Wire Payment reports",
        "Electronic Report Delivery (ERD)",
        "File Transfer Facility (FTF) reports",
        "Recon Management reports",
        "ACH reports",
        "Stop payments reports",
        "Digital Cheque Services reports",
      ],
    },
  ];
  for (const { group, items } of railGroups) {
    await navigation.getByRole("tab", { name: group }).first().click();
    for (const item of items) {
      const navItem = navigation.getByText(item, { exact: true }).first();
      await navItem.scrollIntoViewIfNeeded();
      await expect(navItem).toBeVisible();
    }
  }
  const openNavigationWidths = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
  }));
  expect(openNavigationWidths.documentWidth).toBeLessThanOrEqual(
    openNavigationWidths.viewportWidth,
  );
  expect(openNavigationWidths.bodyWidth).toBeLessThanOrEqual(
    openNavigationWidths.viewportWidth,
  );
  await page.keyboard.press("Escape");
  await expect(navigation).toBeHidden();

  await page
    .getByRole("button", { name: "Notifications, 2 unread" })
    .click();
  await expect(page.getByText("Action Required: Payroll Funding")).toBeVisible();

  await page.getByRole("button", { name: /Support Centre/ }).click();
  await expect(page.getByText("Action Required: Payroll Funding")).toBeHidden();
  const supportMenu = page.getByLabel("Support Centre links");
  await expect(supportMenu).toBeVisible();
  await expect(supportMenu.getByText("Submit a Support Ticket")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(supportMenu).toBeHidden();

  const helpButton = page.getByRole("button", {
    name: "Open Help and Support",
  });
  await helpButton.click();
  await expect(
    page.getByRole("button", { name: "Close Help and Support" }),
  ).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#support-panel")).toBeVisible();

  await expect(page.locator(".activity-card-view")).toBeVisible();
  await expect(page.locator(".activity-table-view")).toBeHidden();

  const reportRow = page
    .locator(".report-row")
    .filter({ hasText: "Q3 2026 Transfer Template Report" });
  const rowWidth = await reportRow.evaluate((element) =>
    element.getBoundingClientRect().width,
  );
  const actionWidth = await reportRow
    .getByRole("button", { name: "Download Report" })
    .evaluate((element) => element.getBoundingClientRect().width);
  expect(actionWidth).toBeGreaterThan(rowWidth * 0.9);

  const overflowingElements = await page.evaluate(
    () =>
      Array.from(document.querySelectorAll<HTMLElement>("body *"))
        .map((element) => {
          const bounds = element.getBoundingClientRect();
          return {
            tag: element.tagName.toLowerCase(),
            id: element.id,
            className:
              typeof element.className === "string" ? element.className : "",
            left: Math.round(bounds.left),
            right: Math.round(bounds.right),
            text: element.textContent?.trim().slice(0, 80) ?? "",
          };
        })
        .filter(
          ({ left, right }) =>
            left < -1 || right > document.documentElement.clientWidth + 1,
        ),
  );
  const pageWidth = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }));
  expect(
    pageWidth.scrollWidth,
    `Elements outside the viewport: ${JSON.stringify(overflowingElements)}`,
  ).toBeLessThanOrEqual(pageWidth.viewportWidth);
});

test("intermediate navigation presents all destinations in four clear groups", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await openDashboard(page);

  await page.getByRole("button", { name: "Open primary navigation" }).click();
  const navigation = page.getByRole("navigation", {
    name: "Primary navigation",
  });
  await expect(navigation).toBeVisible();

  // The rail lists all four destination groups
  for (const group of [
    "quick-access",
    "payments",
    "cheques",
    "reports",
  ]) {
    await expect(
      navigation.getByTestId(`nav-compact-group-${group}`),
    ).toBeVisible();
  }

  // Selecting each group reveals its heading in the detail panel
  for (const [group, heading] of [
    ["quick-access", "Quick Access"],
    ["payments", "Payments & Transfers"],
    ["cheques", "Cheques"],
    ["reports", "Reports"],
  ] as const) {
    await navigation.getByTestId(`nav-compact-group-${group}`).click();
    await expect(
      navigation.getByTestId(`nav-compact-group-${group}`),
    ).toHaveAttribute("aria-selected", "true");
    await expect(
      navigation.getByRole("heading", { name: heading }),
    ).toBeVisible();
  }

  // Arrow keys move the selection between rail groups
  await navigation.getByTestId("nav-compact-group-quick-access").click();
  await navigation.getByTestId("nav-compact-group-quick-access").focus();
  await page.keyboard.press("ArrowDown");
  await expect(
    navigation.getByTestId("nav-compact-group-payments"),
  ).toHaveAttribute("aria-selected", "true");
  await expect(
    navigation.getByRole("heading", { name: "Payments & Transfers" }),
  ).toBeVisible();

  // Closing and reopening resets the menu to Quick Access
  await page
    .getByRole("button", { name: "Close primary navigation" })
    .click();
  await expect(navigation).toBeHidden();
  await page.getByRole("button", { name: "Open primary navigation" }).click();
  await expect(
    page
      .getByRole("navigation", { name: "Primary navigation" })
      .getByTestId("nav-compact-group-quick-access"),
  ).toHaveAttribute("aria-selected", "true");
  await expect(
    page.getByRole("button", { name: "Close primary navigation" }),
  ).toHaveAttribute("aria-expanded", "true");
});

test("transactions open from both Enter and Space keyboard input", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await openDashboard(page);

  const transaction = page.getByRole("button", {
    name: /View details for AMC Invoice Payment transaction/,
  });
  await transaction.focus();
  await page.keyboard.press("Enter");

  const details = page.getByRole("dialog", { name: "Transaction Details" });
  await expect(details).toContainText("ID: tx-1");
  await expect(details).toContainText("AMC Invoice Payment");
  await expect(details).toContainText("Posted");
  await page.keyboard.press("Escape");

  await transaction.focus();
  await page.keyboard.press("Space");
  await expect(details).toBeVisible();
  await expect(details).toContainText("Jul 22, 2026");
});