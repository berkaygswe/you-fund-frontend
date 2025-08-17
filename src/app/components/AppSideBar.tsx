import { Briefcase, Home, List, TrendingUp } from "lucide-react"
 
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
import Link from "next/link"
 
// Menu items.
const items = [
  {
    title: "Home",
    url: "/market-overview",
    icon: Home,
  },
  {
    title: "Fund Listing",
    url: "/fund",
    icon: List,
  },
  {
    title: "Etf Listing",
    url: "/etf",
    icon: Briefcase,
  },
  {
    title: "US Stocks",
    url: "/stocks",
    icon: TrendingUp,
  },
]
 
export function AppSidebar() {
  
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>You Fund</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
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