import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WebSiteSchema from "@/components/structured-data/WebSiteSchema";
import SoftwareApplicationSchema from "@/components/structured-data/SoftwareApplicationSchema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nono.sh"),
  title: "nono - Next-Generation Agent Security",
  description:
    "Kernel-enforced isolation, immutable auditing, and atomic rollbacks for AI agents - built into the nono CLI and native SDKs.",
  keywords: [
    "AI agent sandbox",
    "AI agent security",
    "OS-level isolation",
    "nono sandbox",
    "Claude Code sandbox",
    "AI coding agent security",
    "kernel sandboxing",
    "Seatbelt sandbox",
    "Landlock sandbox",
    "secure AI agents",
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "nono - Next-Generation Agent Security",
    description:
      "Kernel-enforced isolation, immutable auditing, and atomic rollbacks for AI agents - built into the nono CLI and native SDKs.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "nono - OS-Level Isolation for AI Agents",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "nono - Next-Generation Agent Security",
    description:
      "Kernel-enforced isolation, immutable auditing, and atomic rollbacks for AI agents - built into the nono CLI and native SDKs.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <WebSiteSchema />
        <SoftwareApplicationSchema />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-T3KTDBM474"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-T3KTDBM474');
          `}
        </Script>
        <Script id="posthog" strategy="afterInteractive">
          {`
            !function(t,e){var o,n,p,r;e.__SV||(window.posthog && window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init ts ns yi rs os Qr es capture Hi calculateEventProperties hs register register_once register_for_session unregister unregister_for_session fs getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey displaySurvey cancelPendingSurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException startExceptionAutocapture stopExceptionAutocapture loadToolbar get_property getSessionProperty vs us createPersonProfile cs Yr ps opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing ls debug O ds getPageViewId captureTraceFeedback captureTraceMetric Vr".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
            posthog.init('phc_JZWiTzIDNnBp6Jj6uUb0JQKuIp3dv0gkay9aU50n38h', {
                api_host: 'https://eu.i.posthog.com',
                defaults: '2025-11-30',
                person_profiles: 'identified_only',
            });

            // Clean up tracking parameters from URL after analytics capture
            (function() {
              var url = new URL(window.location.href);
              var trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id', '_gl'];
              var hasTracking = trackingParams.some(function(p) { return url.searchParams.has(p); });
              if (hasTracking) {
                trackingParams.forEach(function(p) { url.searchParams.delete(p); });
                window.history.replaceState({}, '', url.pathname + url.search + url.hash);
              }
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
