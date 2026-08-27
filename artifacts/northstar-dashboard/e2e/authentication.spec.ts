import { expect, test } from "@playwright/test";
import { mockDashboardState } from "./fixtures";

type AuthMocks = {
  authenticated: boolean;
  loginStatus?: number;
  flow?: "direct" | "guided";
  profile?: "ben" | "james" | null;
  guidedProfile?: "ben" | "james";
};

async function mockAuthentication(
  page: import("@playwright/test").Page,
  state: AuthMocks,
) {
  await page.route(/\/api\/auth\/session$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(state.authenticated
        ? {
            authenticated: true,
            flow: state.flow ?? "direct",
            profile: state.profile === undefined
              ? (state.flow === "guided" ? null : "ben")
              : state.profile,
            questionnaireRequired: state.flow === "guided" && !state.profile,
            profileLocked: state.flow === "guided" && Boolean(state.profile),
          }
        : { authenticated: false }),
    });
  });

  await page.route(/\/api\/auth\/login$/, async (route) => {
    if (route.request().method() !== "POST") {
      await route.fallback();
      return;
    }

    if (state.loginStatus && state.loginStatus !== 200) {
      await route.fulfill({
        status: state.loginStatus,
        contentType: "application/json",
        body: JSON.stringify({
          error:
            state.loginStatus === 429
              ? "Unable to sign in. Please try again later."
              : "Unable to sign in with those details.",
        }),
      });
      return;
    }

    state.authenticated = true;
    state.profile = state.flow === "guided" ? null : "ben";
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        authenticated: true,
        flow: state.flow ?? "direct",
        profile: state.profile,
        questionnaireRequired: state.flow === "guided",
      }),
    });
  });

  await page.route(/\/api\/auth\/profile$/, async (route) => {
    state.profile = state.guidedProfile ?? "ben";
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        authenticated: true,
        profile: state.profile,
        questionnaireRequired: false,
      }),
    });
  });

  await page.route(/\/api\/auth\/logout$/, async (route) => {
    state.authenticated = false;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ authenticated: false }),
    });
  });
}

test("shows the immersive portal before dashboard content", async ({ page }) => {
  await mockAuthentication(page, { authenticated: false });
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "A clearer view of what moves your business.",
    }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Welcome Ben!" })).toHaveCount(
    0,
  );
  await expect(page.getByLabel("Username")).toBeFocused();
});

test("supports password visibility and generic invalid-credential feedback", async ({
  page,
}) => {
  await mockAuthentication(page, {
    authenticated: false,
    loginStatus: 401,
  });
  await page.goto("/");

  await page.getByLabel("Username").fill("incorrect-user");
  await page.getByTestId("input-login-password").fill("incorrect-password");
  await expect(page.getByTestId("input-login-password")).toHaveAttribute(
    "type",
    "password",
  );

  await page.getByRole("button", { name: "Show password" }).click();
  await expect(page.getByTestId("input-login-password")).toHaveAttribute(
    "type",
    "text",
  );

  await page.getByRole("button", { name: "Sign in to preview" }).click();
  await expect(page.getByTestId("text-login-error")).toHaveText(
    "Unable to sign in with those details.",
  );
  await expect(page.getByRole("heading", { name: "Welcome Ben!" })).toHaveCount(
    0,
  );
});

test("direct login switches between Ben and James, restores the view, and signs out", async ({
  page,
}) => {
  const auth = { authenticated: false };
  await mockAuthentication(page, auth);
  await mockDashboardState(page);
  await page.goto("/");

  await page.getByLabel("Username").fill(crypto.randomUUID());
  await page.getByTestId("input-login-password").fill(crypto.randomUUID());
  await page.getByRole("button", { name: "Sign in to preview" }).click();
  await expect(page.getByRole("heading", { name: "Welcome Ben!" })).toBeVisible();
  await expect(page.getByTestId("button-user-james")).toBeVisible();

  await page.getByTestId("button-user-james").click();
  await expect(page.getByRole("heading", { name: "Welcome James!" })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: "Welcome James!" })).toBeVisible();

  await page.getByTestId("button-user-ben").click();
  await expect(page.getByRole("heading", { name: "Welcome Ben!" })).toBeVisible();

  await page.getByTestId("button-sign-out").click();
  await page.getByTestId("button-sign-out-confirm").click();
  await expect(
    page.getByRole("heading", {
      name: "A clearer view of what moves your business.",
    }),
  ).toBeVisible();
});

test("guided login selects James, restores him on refresh, and resets on logout", async ({
  page,
}) => {
  const auth: AuthMocks = {
    authenticated: false,
    flow: "guided",
    profile: null,
    guidedProfile: "james",
  };
  await mockAuthentication(page, auth);
  await mockDashboardState(page);
  await page.goto("/");

  await page.getByLabel("Username").fill(crypto.randomUUID());
  await page.getByTestId("input-login-password").fill(crypto.randomUUID());
  await page.getByRole("button", { name: "Sign in to preview" }).click();
  await expect(page.getByRole("heading", { name: "What is your primary role?" })).toBeVisible();

  for (const answer of [
    "CFO or executive approver",
    "Risk and oversight",
    "I provide final approval",
    "Monitor the strategic outlook",
  ]) {
    await page.getByRole("radio", { name: new RegExp(`^${answer}`) }).click();
    await page.getByRole("button", { name: /Continue|Enter workspace/ }).click();
  }

  await expect(page.getByRole("heading", { name: "Welcome James!" })).toBeVisible();
  await expect(page.getByTestId("button-user-ben")).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Welcome James!" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "What is your primary role?" })).toHaveCount(0);

  await page.getByTestId("button-sign-out").click();
  await page.getByTestId("button-sign-out-confirm").click();
  await expect(page.getByLabel("Username")).toBeVisible();

  await page.getByLabel("Username").fill(crypto.randomUUID());
  await page.getByTestId("input-login-password").fill(crypto.randomUUID());
  await page.getByRole("button", { name: "Sign in to preview" }).click();
  await expect(page.getByRole("heading", { name: "What is your primary role?" })).toBeVisible();
});

test("signing out immediately protects every open tab", async ({
  page,
  context,
}) => {
  const auth = { authenticated: true };
  const secondPage = await context.newPage();
  await mockAuthentication(page, auth);
  await mockAuthentication(secondPage, auth);
  await mockDashboardState(page);
  await mockDashboardState(secondPage);
  await Promise.all([page.goto("/"), secondPage.goto("/")]);

  await expect(page.getByRole("heading", { name: "Welcome Ben!" })).toBeVisible();
  await expect(
    secondPage.getByRole("heading", { name: "Welcome Ben!" }),
  ).toBeVisible();

  await page.getByTestId("button-sign-out").click();
  await page.getByTestId("button-sign-out-confirm").click();

  await expect(
    secondPage.getByRole("heading", {
      name: "A clearer view of what moves your business.",
    }),
  ).toBeVisible();
});