"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  ClipboardList,
  Bot,
  Calendar,
  Wand2,
  Bell,
  LifeBuoy,
  Briefcase,
  Users,
  Video,
  ClipboardCheck,
  TrendingUp,
  Mountain,
  Settings,
  LogOut,
} from "lucide-react"

import { NavMain } from "@/components/dashboard/nav-main"
import { NavSecondary } from "@/components/dashboard/nav-secondary"
import { NavUser } from "@/components/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const getRoleData = (role: string) => {
  const baseData = {
    user: {
      name: "User",
      email: "user@thegoatmedia.com",
      avatar: "/avatars/user.jpg", // A generic avatar
    },
    navSecondary: [
      {
        title: "Help Centre",
        url: `/dashboard/${role}/help-centre`,
        icon: LifeBuoy,
      },
      {
        title: "Settings",
        url: `/dashboard/${role}/settings`,
        icon: Settings,
      },
    ],
  }

  switch (role) {
    case "employee":
      return {
        ...baseData,
        user: {
          ...baseData.user,
          name: "Alex (Employee)",
          email: "employee@thegoatmedia.com",
        },
        navMain: [
          { title: "Home", url: "/dashboard/employee", icon: LayoutDashboard },
          { title: "Tasks & Scheduling", url: "/dashboard/employee/tasks", icon: ClipboardList },
          { title: "Content Studio", url: "/dashboard/employee/content-studio", icon: Bot },
          { title: "Shoot Planner", url: "/dashboard/employee/shoot-planner", icon: Calendar },
          { title: "Editing Workflow", url: "/dashboard/employee/editing-workflow", icon: Wand2 },
          { title: "Notifications", url: "/dashboard/employee/notifications", icon: Bell },
        ],
      }
    case "executive":
      return {
        ...baseData,
        user: {
          ...baseData.user,
          name: "Morgan (Executive)",
          email: "executive@thegoatmedia.com",
        },
        navMain: [
          { title: "Home", url: "/dashboard/executive", icon: LayoutDashboard },
          { title: "Leads Management", url: "/dashboard/executive/leads-management", icon: Briefcase },
          { title: "Team Performance", url: "/dashboard/executive/team-performance", icon: Users },
          { title: "Shoot Oversight", url: "/dashboard/executive/shoot-oversight", icon: Video },
          { title: "Editing Oversight", url: "/dashboard/executive/editing-oversight", icon: ClipboardCheck },
          { title: "Revenue", url: "/dashboard/executive/revenue", icon: TrendingUp },
          { title: "Notifications", url: "/dashboard/executive/notifications", icon: Bell },
        ],
      }
    default:
      return {
        ...baseData,
        navMain: [
          {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
          },
        ],
      }
  }
}

export function AppSidebar({ onLogout, userRole, ...props }: React.ComponentProps<typeof Sidebar> & { 
  onLogout?: () => void
  userRole?: string 
}) {
  const data = getRoleData(userRole || "")

  // A simple component to fetch user info from localStorage
  const [userName, setUserName] = React.useState(data.user.name)
  React.useEffect(() => {
    try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
        setUserName(storedUser.name || data.user.name)
    } catch (e) {
        //ignore
    }
  }, [userRole, data.user.name])


  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href={`/dashboard/${userRole}`}>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Mountain className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">GOAT Media</span>
                    <span className="truncate text-xs">
                      {userRole ? `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard` : "Dashboard"}
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
          <NavUser
            user={{...data.user, name: userName}}
            onLogout={onLogout}
          />
        </SidebarFooter>
    </Sidebar>
    </motion.div>
  )
}
