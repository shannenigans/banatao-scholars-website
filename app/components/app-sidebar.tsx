'use client';

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
import { ChevronUp, Home, Settings, User2, BookOpenText, GalleryHorizontal, LayoutDashboard, FolderOpen, Calendar, Handshake, Briefcase, Newspaper } from "lucide-react"
import { SignOut } from "./buttons/sign-out";
import Link from 'next/link';
import { useUser } from '../hooks/use-user';

const tabs = [
  {
    title: "Portal",
    url: "/portal",
    icon: LayoutDashboard,
  },
  {
    title: "Resources",
    url: "/resources",
    icon: FolderOpen,
  },
  {
    title: "Scholars",
    url: "/scholars",
    icon: BookOpenText,
  },
  {
    title: "Mentorship",
    url: "/mentorship",
    icon: Handshake,
  },
  {
    title: "Jobs",
    url: "/jobs",
    icon: Briefcase,
  },
  {
    title: "News",
    url: "/news",
    icon: Newspaper,
  },
  {
    title: "Events",
    url: "/events",
    icon: Calendar,
  },
  {
    title: "Gallery",
    url: "/gallery",
    icon: GalleryHorizontal
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Home",
    url: "/",
    icon: Home,
  }
];

export function AppSidebar() {
  const { viewer } = useUser();

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
                  <User2 /> {viewer?.user.email ?? ''}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem asChild>
                  <SignOut />
                </DropdownMenuItem>
                {viewer?.isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href={'/admin'}>Admin</Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
