import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarLayout } from "@/components/sidebar-layout";
import { AuthProvider } from "@/components/auth-provider";
import { SessionProvider } from "@/components/session-provider";
import { ReactQueryProvider } from "@/components/react-query-provider";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Nova AI Assistant",
  description: "Your personalized AI companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        <ReactQueryProvider>
          <SessionProvider>
            <AuthProvider>
              <ThemeProvider>
                <SidebarLayout>{children}</SidebarLayout>
              </ThemeProvider>
            </AuthProvider>
          </SessionProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
