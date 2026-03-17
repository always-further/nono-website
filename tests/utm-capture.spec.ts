import { expect, test } from "@playwright/test";

test("captures campaign context, strips the URL, and dispatches analytics from saved context", async ({
  page,
}) => {
  await page.goto("/?ref=partner&utm_source=test&utm_medium=cpc&utm_campaign=debug", {
    waitUntil: "domcontentloaded",
  });

  await expect
    .poll(async () => page.url())
    .not.toContain("utm_source=test");

  await expect
    .poll(async () => page.url())
    .toContain("ref=partner");

  await expect
    .poll(async () =>
      page.evaluate(() => {
        const log = (
          window as typeof window & {
            __nonoAnalyticsDispatchLog?: { posthog?: unknown[] };
          }
        ).__nonoAnalyticsDispatchLog;
        return log?.posthog?.length ?? 0;
      }),
    )
    .toBeGreaterThan(0);

  const analyticsState = await page.evaluate(() => {
    const dataLayer = (window as typeof window & { dataLayer?: unknown[] }).dataLayer || [];
    const normalizeEntry = (item: unknown): unknown[] | null => {
      if (Array.isArray(item)) return item;
      if (item && typeof item === "object" && "length" in item) {
        return Array.from(item as ArrayLike<unknown>);
      }
      return null;
    };

    const normalizedDataLayer = dataLayer
      .map(normalizeEntry)
      .filter((item): item is unknown[] => !!item);
    const context = (
      window as typeof window & {
        __nonoAnalyticsContext?: {
          originalUrl?: string;
          cleanUrl?: string;
          campaign?: Record<string, string>;
        };
        __nonoAnalyticsConsent?: boolean;
        __nonoAnalyticsDispatchLog?: {
          ga?: Record<string, string>[];
          posthog?: Record<string, string>[];
        };
      }
    ).__nonoAnalyticsContext;
    const consentGranted = (
      window as typeof window & { __nonoAnalyticsConsent?: boolean }
    ).__nonoAnalyticsConsent;
    const dispatchLog = (
      window as typeof window & {
        __nonoAnalyticsDispatchLog?: {
          ga?: Record<string, string>[];
          posthog?: Record<string, string>[];
        };
      }
    ).__nonoAnalyticsDispatchLog;

    const gaConsentDefault = normalizedDataLayer.find(
      (item) =>
        item[0] === "consent" &&
        item[1] === "default",
    ) as [string, string, Record<string, string>] | undefined;

    const gaPageView = normalizedDataLayer.find(
      (item) =>
        item[0] === "event" &&
        item[1] === "page_view",
    ) as [string, string, Record<string, string>] | undefined;

    return {
      context,
      consentGranted,
      dispatchLog,
      gaConsentDefault,
      gaPageView,
    };
  });

  expect(analyticsState.context?.originalUrl).toContain("utm_source=test");
  expect(analyticsState.context?.cleanUrl).toBe("http://127.0.0.1:3000/?ref=partner");
  expect(analyticsState.context?.campaign).toMatchObject({
    utm_source: "test",
    utm_medium: "cpc",
    utm_campaign: "debug",
  });

  expect(analyticsState.consentGranted).toBe(true);
  expect(analyticsState.gaConsentDefault?.[2]).toMatchObject({
    analytics_storage: "granted",
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
  });

  expect(analyticsState.gaPageView?.[2]).toMatchObject({
    page_location: analyticsState.context?.originalUrl,
    utm_source: "test",
    utm_medium: "cpc",
    utm_campaign: "debug",
  });

  expect(analyticsState.dispatchLog?.ga?.[0]).toMatchObject({
    page_location: analyticsState.context?.originalUrl,
    utm_source: "test",
    utm_medium: "cpc",
    utm_campaign: "debug",
  });

  expect(analyticsState.dispatchLog?.posthog?.[0]).toMatchObject({
    $current_url: analyticsState.context?.originalUrl,
    $utm_source: "test",
    $utm_medium: "cpc",
    $utm_campaign: "debug",
    utm_source: "test",
    utm_medium: "cpc",
    utm_campaign: "debug",
  });
});
