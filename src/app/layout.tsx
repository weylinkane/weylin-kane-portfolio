import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "@/components/layout/Sidebar";
import "./globals.css";

// Load Inter from Google Fonts using next/font (self-hosted at build time)
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Weylin Kane Portfolio",
  description: "Personal investment portfolio and trade journal.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          {/* Main content area: leaves room for sidebar on lg+ */}
          <main className="flex-1 lg:ml-60">
            <div className="mx-auto max-w-6xl px-6 py-10 lg:px-12 lg:py-14">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
