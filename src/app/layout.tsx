import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import ReactQueryProvider from "@/providers/src/providers/ReactQueryProvider";

// تأكد إن ملفات الخط موجودة فعلاً في المسار ده: src/fonts/tajawal/
const tajawal = localFont({
  src: [
    {
      path: "../fonts/tajawal/Tajawal-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/tajawal/Tajawal-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/tajawal/Tajawal-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Furniture Management System",
  description: "Furniture Management System",
};

const THEME_INIT_SCRIPT = `
  (function () {
    try {
      var theme = localStorage.getItem("theme");
      var root = document.documentElement;

      if (theme === "dark") {
        root.classList.add("dark");
      } else if (theme === "light") {
        root.classList.remove("dark");
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${tajawal.variable} ${tajawal.className} antialiased`}>
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
        />

        <ReactQueryProvider>
          <TooltipProvider>
            <AuthProvider>{children}</AuthProvider>
          </TooltipProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}