// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/next';
import QueryProvider from "@/components/providers/QueryProvider";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { ThemeInitializer } from "@/components/providers/ThemeInitializer";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Metadata.Default" });
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fnancal.com';

    return {
        title: {
            default: t("title"),
            template: `%s | ${t("brandName")}`,
        },
        description: t("description"),
        metadataBase: new URL(baseUrl),
        alternates: {
            canonical: `${baseUrl}/${locale}`,
            languages: {
                en: `${baseUrl}/en`,
                tr: `${baseUrl}/tr`,
            },
        },
        icons: {
            icon: '/site_logo.webp',
        },
        openGraph: {
            title: t("title"),
            description: t("description"),
            url: `${baseUrl}/${locale}`,
            siteName: t("brandName"),
            locale: locale === 'tr' ? 'tr_TR' : 'en_US',
            type: 'website',
        },
    };
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as typeof routing.locales[number])) {
      notFound();
    }

    // Enable static rendering
    setRequestLocale(locale);

    const cookieStore = await cookies();
    const hasSessionHint = cookieStore.has("logged_in");
    
    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                try {
                                    var storage = localStorage.getItem('theme-storage');
                                    var theme = 'light';
                                    if (storage) {
                                        var parsed = JSON.parse(storage);
                                        if (parsed && parsed.state && parsed.state.theme) {
                                            theme = parsed.state.theme;
                                        }
                                    }
                                    if (theme === 'dark') {
                                        document.documentElement.classList.add('dark');
                                    } else {
                                        document.documentElement.classList.remove('dark');
                                    }
                                } catch (e) {}
                            })();
                        `
                    }}
                />
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <NextIntlClientProvider messages={messages}>
                    <QueryProvider>
                        <AuthProvider initialSessionHint={hasSessionHint}>
                            <ThemeInitializer />
                            {children}
                            <SpeedInsights />
                            <Analytics />
                        </AuthProvider>
                    </QueryProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

