// src/app/layout.tsx
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/next';
import QueryProvider from "@/app/components/QueryProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "You Fund",
    description: "You fund",
    icons: {
        icon: '/you-fund-icon.svg',
    }
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const hasSessionHint = cookieStore.has("logged_in");

    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <QueryProvider>
                    <AuthProvider initialSessionHint={hasSessionHint}>
                        {children}
                        <SpeedInsights />
                        <Analytics />
                    </AuthProvider>
                </QueryProvider>
            </body>
        </html>
    );
}