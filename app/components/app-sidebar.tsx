import * as React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/app/components/ui/dropdown-menu"
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
} from "@/app/components/ui/sidebar"
import { ChevronUp, Home, Settings, User2, BookOpenText, Shield } from "lucide-react"
import { SignOut } from "./buttons/sign-out";
import Link from 'next/link';
import { useUser } from '../hooks/use-user';
import { isEmailWhitelisted } from '../lib/actions';

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
    }
];

export function AppSidebar() {
    const userContext = useUser();
    const {supabaseResponseUser} = userContext;
    const user = supabaseResponseUser?.user;
    const [isUserAdmin, setIsUserAdmin] = React.useState(false);

    React.useEffect(() => {
      const checkIsAdmin = async () => {
        if (user?.email) {
          const whitelistQuery = await isEmailWhitelisted(user?.email);
          console.log('whitelist', whitelistQuery)
          setIsUserAdmin(whitelistQuery ? whitelistQuery[0].isAdmin : false);
        }
      }

      checkIsAdmin();
    }, [user]);

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
                  {isUserAdmin &&<DropdownMenuItem>
                    <Link href={'/admin'}>Admin</Link>
                  </DropdownMenuItem>}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        </Sidebar>
    )
}
