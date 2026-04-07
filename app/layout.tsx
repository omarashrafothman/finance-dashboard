import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Sidebar from "@/components/layout/Sidebar";
import MobileSidebar from "@/components/layout/MobileSidebar";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { Toaster } from "sonner";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-sans",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://finance-dashboard.local"),
  title: {
    default: "Finance Dashboard",
    template: "%s | Finance Dashboard",
  },
  description:
    "Track income and expenses, analyze monthly trends, and manage your transactions in one place.",
  applicationName: "Finance Dashboard",
  keywords: ["finance", "dashboard", "transactions", "income", "expenses", "budget"],
  openGraph: {
    title: "Finance Dashboard",
    description:
      "Track income and expenses, analyze monthly trends, and manage your transactions in one place.",
    type: "website",
    siteName: "Finance Dashboard",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finance Dashboard",
    description:
      "Track income and expenses, analyze monthly trends, and manage your transactions in one place.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground">
        <ThemeProvider>
          <div className="flex bg-gradient-to-br from-background via-background to-primary/5">
            <Sidebar className="hidden md:flex" />
            <MobileSidebar />
            <main className="min-h-screen flex-1 bg-background/80 p-2 pt-14 md:p-4">{children}</main>
          </div>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
