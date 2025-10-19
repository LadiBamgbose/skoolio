import * as React from "react"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileText,
  Settings,
} from "lucide-react"

import { NavMain } from "@/components/shadcn/nav-main"
import { NavUser } from "@/components/shadcn/nav-user"
import { TeamSwitcher } from "@/components/shadcn/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/shadcn/sidebar"

// Teacher Dashboard data
const data = {
  user: {
    name: "Teacher Name",
    email: "teacher@skoolio.com",
    avatar: "",
  },
  teams: [
    {
      name: "Skoolio",
      logo: GraduationCap,
      plan: "Teacher",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/teacher/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Students",
      url: "/teacher/students",
      icon: Users,
    },
    {
      title: "Quiz",
      url: "/teacher/quiz",
      icon: FileText,
    },
    {
      title: "Settings",
      url: "/teacher/settings",
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
