import * as React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
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
import { ChevronUp, Home, Settings, User2, BookOpenText } from "lucide-react"
import { SignOut } from "./buttons/sign-out";
import { createBrowserClient } from "@/client";
import { User } from '@supabase/supabase-js';

const tabs = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    },
    {
      title: "Scholars",
      url: "/scholars",
      icon: BookOpenText,
  },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
];

export function AppSidebar() {
    const supabase = createBrowserClient();
    const [user, setUser] = React.useState<User | undefined>(undefined);
    
    React.useEffect(() => {
      const checkUser = async () => {
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user);
      }

      checkUser();
    }, [])

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
            <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> {user?.email ? user?.email : ''}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <SignOut />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        </Sidebar>
    )
}
