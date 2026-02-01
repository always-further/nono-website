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
  title: "NONO - Secure Shell for AI Agents",
  description:
    "OS-enforced capability sandbox for running untrusted AI agents. No escape hatch. Works with Claude, GPT, and any AI agent.",
  openGraph: {
    title: "NONO - Secure Shell for AI Agents",
    description:
      "OS-enforced capability sandbox for running untrusted AI agents. No escape hatch. Works with Claude, GPT, and any AI agent.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NONO - Secure Shell for AI Agents",
    description:
      "OS-enforced capability sandbox for running untrusted AI agents. No escape hatch. Works with Claude, GPT, and any AI agent.",
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
