import type { Page } from "@playwright/test";

type ApprovalStatus = "pending" | "approved" | "rejected";

export type ApprovalFixture = {
  id: string;
  title: string;
  detail: string;
  status: ApprovalStatus;
};

export const seededApprovals: ApprovalFixture[] = [
  {
    id: "app-1",
    title: "Approve ACH Template",
    detail: "Credit reconciliation payment",
    status: "pending",
  },
  {
    id: "app-2",
    title: "Wire payment approval",
    detail: "Contract Supplier Corporation payment",
    status: "pending",
  },
  {
    id: "app-3",
    title: "EFT Payment Approval",
    detail: "ACME business vendor Payment",
    status: "pending",
  },
];

export async function mockDashboardState(
  page: Page,
  approvals: ApprovalFixture[] = seededApprovals,
) {
  await page.route(/\/api\/dashboard-state(?:\?.*)?$/, async (route) => {
    if (route.request().method() !== "GET") {
      await route.fallback();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        transfers: [],
        approvals,
      }),
    });
  });
}

export async function openDashboard(page: Page) {
  await page.goto("/");
  await page.getByRole("heading", { name: "Welcome Ben!" }).waitFor();
  await page
    .getByText("Loading saved transaction activity…")
    .waitFor({ state: "hidden" });
}