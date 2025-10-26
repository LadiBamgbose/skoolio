import * as React from "react"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileText,
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
import { useAuth } from "@/contexts/AuthContext"

// Navigation items (static)
const navMain = [
  {
    title: "Dashboard",
    url: "/teacher/dashboard",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "Quiz",
    url: "/teacher/quiz",
    icon: FileText,
  },
  {
    title: "Students",
    url: "#",
    icon: Users,
    disabled: true,
    tooltip: "Coming soon",
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  // Build dynamic data from authenticated user
  const data = {
    user: {
      name: user ? `${user.firstName} ${user.lastName}` : "Guest User",
      email: user?.email || "guest@skoolio.com",
      avatar: "",
    },
    teams: [
      {
        name: "Skoolio",
        logo: GraduationCap,
        plan: user?.plan || "BASIC",
      },
    ],
    navMain,
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-white">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="bg-white">
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
