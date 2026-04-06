import { SidebarTrigger } from "@/components/ui/sidebar";
import { CurrencySwitcher } from "./currency-switcher";
import LoginButton from "./header/LoginButton";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
    return (
        <header className="flex items-center justify-between py-4 px-6 border-b border-sidebar-border bg-sidebar sticky top-0 z-50 transition-colors duration-300">
            <div className="flex items-center gap-3">
                <SidebarTrigger className="h-8 w-8 hover:bg-primary/10 transition-colors" />
                {/* Optional brand indicator for consistency */}
                <div className="h-4 w-px bg-border/60 mx-2 hidden sm:block"></div>
            </div>
            <div className="flex items-center gap-4">
                <LoginButton />
                <CurrencySwitcher />
                <LanguageSwitcher />
            </div>
        </header>
    )
}
