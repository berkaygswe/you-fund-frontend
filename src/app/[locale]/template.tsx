// src/app/[locale]/template.tsx
// This file is used to define the layout for the application, including the sidebar and header.

"use client"
import { usePathname } from "@/i18n/routing";
import { AppSidebar } from "@/components/AppSideBar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/header";
import { WebSocketProvider } from "@/providers/WebSocketProvider";

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
                <SidebarInset className="bg-gray-50 min-w-0 overflow-x-hidden">
                    <Header />
                    <main className="w-full">
                        <div className="m-3 md:m-6">{children}</div>
                        <div className="mt-10"></div>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </WebSocketProvider>
    );
}
