import { SidebarTrigger } from "@/components/ui/sidebar";
import { CurrencySwitcher } from "./currency-switcher";
import LoginButton from "./header/LoginButton";

export function Header(){
    return (
        <header className="flex justify-between py-4 mx-4">
            <SidebarTrigger />
            <div className="flex items-center gap-4">
            <LoginButton />
            <CurrencySwitcher />
            </div>
        </header>
    )
}