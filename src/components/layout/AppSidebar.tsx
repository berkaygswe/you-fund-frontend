"use client"

import { Bitcoin, Briefcase, DollarSign, Home, List, Star, Wallet } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { LanguageSwitcher } from "./LanguageSwitcher"
import { ThemeSwitcher } from "./ThemeSwitcher"

export function AppSidebar() {
  const t = useTranslations("Nav")

  const items = [
    { titleKey: "home",        url: "/market-overview", icon: Home },
    { titleKey: "fundListing", url: "/fund",            icon: List },
    { titleKey: "etfListing",  url: "/etf",             icon: Briefcase },
    { titleKey: "usStocks",    url: "/stock",           icon: DollarSign },
    { titleKey: "crypto",      url: "/crypto",          icon: Bitcoin },
    { titleKey: "watchlist",   url: "/watchlist",       icon: Star },
    { titleKey: "portfolios",  url: "/portfolios",      icon: Wallet },
  ] as const

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("appName")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{t(item.titleKey)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Mobile only: the header hides language/theme below md (see Header).
            Placed right after navigation, not pinned to the bottom, so phone
            browser toolbars can't cover it. */}
        <SidebarGroup className="md:hidden">
          <SidebarGroupLabel>{t("settings")}</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-1 px-2 text-sm">
            <div className="flex items-center justify-between">
              <span>{t("language")}</span>
              <LanguageSwitcher />
            </div>
            <div className="flex items-center justify-between">
              <span>{t("theme")}</span>
              <ThemeSwitcher />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
