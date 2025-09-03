"use client"

import { Button } from "@/components/ui/button"
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Eye, 
  Settings,
  MoreHorizontal
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface DemoButtonsProps {
  variant?: "default" | "compact" | "detailed"
  memberName?: string
  showViewDetails?: boolean
  showConfigure?: boolean
  className?: string
}

export function DemoButtons({ 
  variant = "default", 
  memberName = "Team Member",
  showViewDetails = true,
  showConfigure = false,
  className 
}: DemoButtonsProps) {
  
  const handleDemoAction = (action: string) => {
    // Just show a simple alert for demo purposes
    alert(`Demo: ${action} action for ${memberName}`)
  }

  if (variant === "compact") {
    return (
      <div className={cn("flex gap-2", className)}>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => handleDemoAction("Call")}
        >
          <Phone className="h-4 w-4 mr-2" />
          Call
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => handleDemoAction("Email")}
        >
          <Mail className="h-4 w-4 mr-2" />
          Email
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => handleDemoAction("Message")}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Message
        </Button>
        {showViewDetails && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleDemoAction("View Details")}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        )}
        {showConfigure && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleDemoAction("Configure")}
          >
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        )}
      </div>
    )
  }

  if (variant === "detailed") {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => handleDemoAction("Call")}
          >
            <Phone className="h-4 w-4 mr-2" />
            Call
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={() => handleDemoAction("Email")}
          >
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
        </div>
        
        <Button 
          size="sm" 
          variant="outline" 
          className="w-full"
          onClick={() => handleDemoAction("Message")}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Send Message
        </Button>
        
        {showViewDetails && (
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full"
            onClick={() => handleDemoAction("View Details")}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        )}
        {showConfigure && (
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full"
            onClick={() => handleDemoAction("Configure")}
          >
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        )}
      </div>
    )
  }

  // Default variant
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button 
        size="sm"
        onClick={() => handleDemoAction("Call")}
      >
        <Phone className="h-4 w-4 mr-2" />
        Call
      </Button>
      <Button 
        size="sm" 
        variant="outline"
        onClick={() => handleDemoAction("Email")}
      >
        <Mail className="h-4 w-4 mr-2" />
        Email
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleDemoAction("Message")}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Send Message
          </DropdownMenuItem>
          {showViewDetails && (
            <DropdownMenuItem onClick={() => handleDemoAction("View Details")}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
          )}
          {showConfigure && (
            <DropdownMenuItem onClick={() => handleDemoAction("Configure")}>
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
