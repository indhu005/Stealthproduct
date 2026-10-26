import type { Metadata } from "next";
import { Suspense } from "react";
import { Poppins, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { FlowSwitcher } from "@/components/layout/FlowSwitcher";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bolto Concept — Dashboard Redesign and Flows",
  description:
    "An unofficial concept redesign of Bolto's admin dashboard, with four interactive flows: payroll blocker resolution, time off approval, employee onboarding, and enterprise integration.",
  robots: {
    index: false,
    follow: false,
  },
};

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') {
      document.documentElement.setAttribute('data-theme', stored);
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-text">
        <Suspense fallback={null}>
          <FlowSwitcher />
        </Suspense>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
