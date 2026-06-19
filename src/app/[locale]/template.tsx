// src/app/[locale]/template.tsx
// This file is used to define the layout for the application, including the sidebar and header.

"use client"
import { usePathname } from "@/i18n/routing";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/layout/Header";
import { WebSocketProvider } from "@/providers/WebSocketProvider";
import { QuantBackground } from "@/components/ui/quant-background";
import { LandingFooter } from "@/components/landing-page/LandingFooter";

export default function Template({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/";

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <WebSocketProvider>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="bg-background min-w-0 overflow-x-hidden relative">
                    <Header />
                    <main className="w-full relative min-h-screen flex flex-col justify-between">
                        <QuantBackground />
                        <div className="flex-grow relative z-10 m-3 md:m-6">{children}</div>
                        <div className="relative z-10">
                            <LandingFooter />
                        </div>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </WebSocketProvider>
    );
}
