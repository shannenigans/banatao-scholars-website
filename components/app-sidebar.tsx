import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Home, Settings } from "lucide-react"

const tabs = [
    {
        title: "Home",
        url: "#",
        icon: Home,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
];

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader />
            <SidebarContent>
                <SidebarGroup />
                <SidebarGroupLabel>Banatao Scholars</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {tabs.map((tab) => (
                            <SidebarMenuItem key={tab.title}>
                                <SidebarMenuButton asChild>
                                    <a href={tab.url}>
                                        <tab.icon />
                                        <span>{tab.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}
