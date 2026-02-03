import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "nono - Secure Shell for AI Agents",
  description:
    "OS-enforced capability sandbox for running untrusted AI agents. No escape hatch. Works with any AI agent.",
  openGraph: {
    title: "nono - Secure Shell for AI Agents",
    description:
      "OS-enforced capability sandbox for running untrusted AI agents. No escape hatch. Works with any AI agent.",
    type: "website",
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
    title: "nono - Secure Shell for AI Agents",
    description:
      "OS-enforced capability sandbox for running untrusted AI agents. No escape hatch. Works with any AI agent.",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
