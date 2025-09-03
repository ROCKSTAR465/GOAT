"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SiteHeader } from "@/components/dashboard/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Meteors } from "@/components/ui/meteors"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState("")
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated')
    const userData = localStorage.getItem('user')
    
    if (authStatus !== 'true' || !userData) {
      router.push('/login')
      return
    }

    try {
      const user = JSON.parse(userData)
      if (!['employee', 'executive'].includes(user.role)) {
        // If role is invalid, log out and redirect to login
        localStorage.removeItem('isAuthenticated')
        localStorage.removeItem('user')
        router.push('/login')
        return
      }

      setUserRole(user.role)
      setIsAuthenticated(true)

      // Redirect to role-specific dashboard if on a generic dashboard path
      if (pathname === '/dashboard' || pathname === '/dashboard/') {
        const roleRoutes = {
          employee: '/dashboard/employee',
          executive: '/dashboard/executive',
        }
        router.push(roleRoutes[user.role as keyof typeof roleRoutes])
      }
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push('/login')
    }
  }, [router, pathname])

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (!isAuthenticated) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground">Loading Dashboard...</p>
            </div>
        </div>
    )
  }

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "280px",
        "--header-height": "60px",
      } as React.CSSProperties}
    >
      <AppSidebar onLogout={handleLogout} userRole={userRole} />
      <SidebarInset>
        <SiteHeader onLogout={handleLogout} userRole={userRole} />
        <main className="relative flex-1 space-y-4 p-4 md:p-8 pt-6 overflow-y-auto">
            <Meteors number={15} className="opacity-30" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {children}
            </motion.div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
