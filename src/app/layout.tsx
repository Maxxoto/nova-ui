import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { SidebarLayout } from "@/components/sidebar-layout";
import { LoginDialog } from "@/components/login-dialog";
import { AuthProvider } from "@/components/auth-provider";

const nunitoSans = Nunito_Sans({
    variable: "--font-nunito-sans",
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
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
            <body
                className={`${nunitoSans.variable} antialiased`}
            >
                <AuthProvider>
                    <SidebarLayout>
                        {children}
                    </SidebarLayout>
                </AuthProvider>
            </body>
        </html>
    );
}
