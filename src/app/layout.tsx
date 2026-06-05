import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "جيب - محفظتك الرقمية",
  description: "محفظة جيب الرقمية - الدفع والتحويل وإدارة الأموال",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="antialiased bg-[#F5F5F5] text-foreground font-sans" style={{ fontFamily: "'Segoe UI', Tahoma, 'Noto Sans Arabic', 'Arial', sans-serif" }}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
