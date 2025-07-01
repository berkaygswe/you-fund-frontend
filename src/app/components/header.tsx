import { SidebarTrigger } from "@/components/ui/sidebar";
import { CurrencySwitcher } from "./currency-switcher";

export function Header(){
    return (
        <header className="flex justify-between py-4 mx-4">
            <SidebarTrigger />
            <CurrencySwitcher />
        </header>
    )
}