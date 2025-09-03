"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AIActionDialog } from "./ai-action-dialog"
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Eye,
  Settings,
  MoreHorizontal,
  TrendingUp,
  Calendar,
  FileText,
  Users
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ActionButtonsProps {
  variant?: "default" | "compact" | "detailed"
  leadName?: string
  leadCompany?: string
  leadInfo?: string
  showViewDetails?: boolean
  showConfigure?: boolean
  priority?: "high" | "medium" | "low"
  leadValue?: string
  className?: string
}

export function ActionButtons({ 
  variant = "default",
  leadName = "Contact",
  leadCompany = "Company",
  leadInfo = "",
  showViewDetails = true,
  showConfigure = true,
  priority = "medium",
  leadValue,
  className = ""
}: ActionButtonsProps) {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean
    actionType: "call" | "email" | "message" | null
  }>({
    isOpen: false,
    actionType: null
  })

  const openDialog = (actionType: "call" | "email" | "message") => {
    setDialogState({ isOpen: true, actionType })
  }

  const closeDialog = () => {
    setDialogState({ isOpen: false, actionType: null })
  }

  const getPriorityColor = () => {
    switch (priority) {
      case "high": return "bg-destructive hover:bg-destructive/90"
      case "medium": return "bg-accent hover:bg-accent/90"
      case "low": return "bg-muted hover:bg-muted/90"
    }
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          size="sm"
          variant="outline"
          onClick={() => openDialog("call")}
          className="h-8 px-3"
        >
          <Phone className="h-3 w-3 mr-1" />
          Call
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => openDialog("email")}
          className="h-8 px-3"
        >
          <Mail className="h-3 w-3 mr-1" />
          Email
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline" className="h-8 px-2">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openDialog("message")}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </DropdownMenuItem>
            {showViewDetails && (
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
            )}
            {showConfigure && (
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <AIActionDialog
          isOpen={dialogState.isOpen && dialogState.actionType !== null}
          onClose={closeDialog}
          actionType={dialogState.actionType!}
          leadName={leadName}
          leadCompany={leadCompany}
          leadInfo={leadInfo}
        />
      </div>
    )
  }

  if (variant === "detailed") {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-primary text-primary-foreground border-0">
              {priority.toUpperCase()} PRIORITY
            </Badge>
            {leadValue && (
              <Badge variant="secondary">
                <TrendingUp className="h-3 w-3 mr-1" />
                {leadValue}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => openDialog("call")}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Phone className="h-4 w-4 mr-2" />
            AI Call
          </Button>
          <Button
            onClick={() => openDialog("email")}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Mail className="h-4 w-4 mr-2" />
            AI Email
          </Button>
          <Button
            onClick={() => openDialog("message")}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            AI Message
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full">
                <MoreHorizontal className="h-4 w-4 mr-2" />
                More Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              {showViewDetails && (
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Profile
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="h-4 w-4 mr-2" />
                Generate Proposal
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="h-4 w-4 mr-2" />
                Assign Team Member
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {showConfigure && (
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Automation
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <AIActionDialog
          isOpen={dialogState.isOpen && dialogState.actionType !== null}
          onClose={closeDialog}
          actionType={dialogState.actionType!}
          leadName={leadName}
          leadCompany={leadCompany}
          leadInfo={leadInfo}
        />
      </div>
    )
  }

  // Default variant
  return (
    <div className={`flex items-center gap-3 flex-wrap ${className}`}>
      <Button
        size="sm"
        onClick={() => openDialog("call")}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Phone className="h-4 w-4 mr-2" />
        Call
      </Button>
      <Button
        size="sm"
        onClick={() => openDialog("email")}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Mail className="h-4 w-4 mr-2" />
        Email
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => openDialog("message")}
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        Message
      </Button>
      {showViewDetails && (
        <Button size="sm" variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      )}
      {showConfigure && (
        <Button size="sm" variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Configure
        </Button>
      )}

      <AIActionDialog
        isOpen={dialogState.isOpen && dialogState.actionType !== null}
        onClose={closeDialog}
        actionType={dialogState.actionType!}
        leadName={leadName}
        leadCompany={leadCompany}
        leadInfo={leadInfo}
      />
    </div>
  )
}
