import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import ReactQueryProvider from "@/providers/src/providers/ReactQueryProvider";

const tajawal = Tajawal({
  weight: ["400", "500", "700"],
  subsets: ["arabic"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Furniture Management System",
  description: "Furniture Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${tajawal.variable} ${tajawal.className} antialiased`}>
        <Script id="theme-script" strategy="beforeInteractive">
          {`
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
          `}
        </Script>

        <ReactQueryProvider>
          <TooltipProvider>
            <AuthProvider>{children}</AuthProvider>
          </TooltipProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}