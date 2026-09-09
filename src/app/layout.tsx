import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import ReactQueryProvider from "@/providers/src/providers/ReactQueryProvider";


const tajawal = localFont({
  src: [
    {
      path: "../fonts/tajawal/tajawal-v12-arabic-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/tajawal/tajawal-v12-arabic-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/tajawal/tajawal-v12-arabic-700.woff2",
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