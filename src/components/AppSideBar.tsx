"use client"

import { Bitcoin, Briefcase, DollarSign, Home, List, Star } from "lucide-react"
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

export function AppSidebar() {
  const t = useTranslations("Nav")

  const items = [
    { titleKey: "home",        url: "/market-overview", icon: Home },
    { titleKey: "fundListing", url: "/fund",            icon: List },
    { titleKey: "etfListing",  url: "/etf",             icon: Briefcase },
    { titleKey: "usStocks",    url: "/stocks",          icon: DollarSign },
    { titleKey: "crypto",      url: "/crypto",          icon: Bitcoin },
    { titleKey: "watchlist",   url: "/watchlist",       icon: Star },
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
      </SidebarContent>
    </Sidebar>
  )
}
