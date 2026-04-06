// src/app/[locale]/template.tsx
// This file is used to define the layout for the application, including the sidebar and header.

"use client"
import { usePathname } from "@/i18n/routing";
import { AppSidebar } from "@/components/AppSideBar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/header";
import { WebSocketProvider } from "@/providers/WebSocketProvider";
import { QuantBackground } from "@/components/ui/quant-background";

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
                    <main className="w-full relative min-h-screen">
                        <QuantBackground />
                        <div className="m-3 md:m-6 relative z-10">{children}</div>
                        <div className="mt-10"></div>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </WebSocketProvider>
    );
}
