import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Bell, Palette, Users, Calendar, DollarSign, Briefcase } from "lucide-react"

const getRoleIcon = (role: string) => {
  switch (role) {
    case "creative":
      return Palette
    case "manager":
      return Users
    case "social":
      return Calendar
    case "finance":
      return DollarSign
    case "executive":
      return Briefcase
    default:
      return Users
  }
}

const getRoleTitle = (role: string) => {
  switch (role) {
    case "creative":
      return "Creative Team Dashboard"
    case "manager":
      return "Project Manager Dashboard"
    case "social":
      return "Social Media Dashboard"
    case "finance":
      return "Finance Dashboard"
    case "executive":
      return "Executive Dashboard"
    default:
      return "Employee Dashboard"
  }
}

export function SiteHeader({ onLogout, userRole }: { onLogout: () => void; userRole?: string }) {
  const RoleIcon = getRoleIcon(userRole || "")
  const roleTitle = getRoleTitle(userRole || "")

  return (
    <header className="flex h-[60px] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4"
        />
        <div className="flex items-center gap-2">
          <RoleIcon className="h-5 w-5 text-primary" />
          <h1 className="text-base font-medium">{roleTitle}</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" className="hover:bg-transparent hover:text-foreground relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
            </Button>
            <Button onClick={onLogout} variant="outline" size="sm" className="hover:bg-transparent hover:text-foreground">
                Logout
            </Button>
        </div>
      </div>
    </header>
  )
}
