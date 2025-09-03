"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Bot,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { BorderBeam } from "@/components/ui/border-beam"

interface AIActionDialogProps {
  isOpen: boolean
  onClose: () => void
  actionType: "call" | "email" | "message"
  leadName?: string
  leadCompany?: string
  leadInfo?: string
}

export function AIActionDialog({ 
  isOpen, 
  onClose, 
  actionType, 
  leadName = "Contact",
  leadCompany = "Company",
  leadInfo = ""
}: AIActionDialogProps) {
  const [objective, setObjective] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [result, setResult] = useState("")

  const getActionConfig = () => {
    switch (actionType) {
      case "call":
        return {
          icon: Phone,
          title: "AI Phone Call",
          description: `Our AI agent will call ${leadName} at ${leadCompany}`,
          placeholder: "e.g., Schedule a demo meeting for next week, discuss their marketing automation needs, and qualify their budget ($50K+)",
          actionText: "Start AI Call"
        }
      case "email":
        return {
          icon: Mail,
          title: "AI Email Campaign",
          description: `Our AI agent will send a personalized email to ${leadName} at ${leadCompany}`,
          placeholder: "e.g., Follow up on their demo request, provide pricing information, and schedule a strategy consultation",
          actionText: "Send AI Email"
        }
      case "message":
        return {
          icon: MessageSquare,
          title: "AI Message Sequence",
          description: `Our AI agent will send targeted messages to ${leadName} at ${leadCompany}`,
          placeholder: "e.g., Send LinkedIn connection request, share case study, and invite to upcoming webinar",
          actionText: "Start AI Messaging"
        }
      default:
        return {
          icon: Bot,
          title: "AI Action",
          description: `AI agent action for ${leadName} at ${leadCompany}`,
          placeholder: "Please specify your objective...",
          actionText: "Start AI Action"
        }
    }
  }

  const config = getActionConfig()
  const IconComponent = config?.icon || Bot

  // Don't render if actionType is not set
  if (!actionType) {
    return null
  }

  const handleAction = async () => {
    if (!objective.trim()) return

    setIsProcessing(true)
    
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsComplete(true)
      
      // Generate realistic result based on action type
      const results = {
        call: `✅ Call completed successfully!\n\n📞 AI Agent Report:\n• Connected with ${leadName} (Director of Marketing)\n• Discussed their automation needs (current manual processes)\n• Qualified budget: $75K allocated for Q2 2025\n• Scheduled demo for February 5th at 2:00 PM\n• Sent calendar invite and preparation materials\n• Lead score increased to 95% (Hot Lead)\n\n🎯 Next Actions: Demo preparation assigned to Sarah Johnson`,
        email: `✅ Email sent and engagement tracked!\n\n📧 AI Agent Report:\n• Personalized email delivered to ${leadName}\n• Subject: "Transform ${leadCompany}'s Marketing ROI by 300%"\n• Opened within 15 minutes (high engagement)\n• Clicked 3 links (pricing, case studies, calendar)\n• Reply received: "Very interested, let's schedule a call"\n• Follow-up sequence automatically triggered\n\n🎯 Next Actions: Calendar link sent, demo scheduled`,
        message: `✅ Message sequence initiated!\n\n💬 AI Agent Report:\n• LinkedIn connection request sent and accepted\n• Shared relevant case study (Manufacturing ROI 400%)\n• Webinar invitation sent: "AI Automation Masterclass"\n• Direct message engagement: 85% positive sentiment\n• Connection scheduled for coffee meeting next Tuesday\n• Added to nurture sequence for enterprise prospects\n\n🎯 Next Actions: Prepare personalized demo materials`
      }
      
      setResult(results[actionType])
    }, 3000)
  }

  const handleReset = () => {
    setObjective("")
    setIsProcessing(false)
    setIsComplete(false)
    setResult("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleReset}>
      <DialogContent className="max-w-2xl">
        <div className="relative overflow-hidden">
          {isProcessing && <BorderBeam duration={2} size={120} colorFrom="#ebde10" colorTo="#f5ed6b" />}
          
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 bg-accent text-accent-foreground rounded-lg">
                <IconComponent className="h-5 w-5" />
              </div>
              {config.title}
            </DialogTitle>
            <DialogDescription className="text-base">
              {config.description}
              {leadInfo && (
                <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm">
                  <strong>Lead Context:</strong> {leadInfo}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          {!isComplete ? (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="objective" className="text-base font-semibold">
                  AI Agent Objective
                </Label>
                <Textarea
                  id="objective"
                  placeholder={config.placeholder}
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="min-h-24 resize-none"
                  disabled={isProcessing}
                />
                <p className="text-sm text-muted-foreground">
                  Be specific about goals, timeline, and desired outcomes. Our AI agent will handle the entire conversation autonomously.
                </p>
              </div>

              {isProcessing && (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center">
                      <div className="p-4 bg-accent text-accent-foreground rounded-full">
                        <Bot className="h-8 w-8 animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">AI Agent Working...</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {actionType === "call" && "Dialing and conducting conversation..."}
                        {actionType === "email" && "Crafting personalized email and sending..."}
                        {actionType === "message" && "Sending targeted message sequence..."}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-4">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-6 w-6 text-accent" />
                <h3 className="text-lg font-semibold text-accent">Mission Accomplished!</h3>
              </div>
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                <pre className="whitespace-pre-wrap text-sm font-mono">{result}</pre>
              </div>
            </div>
          )}

          <DialogFooter className="gap-3">
            {!isComplete ? (
              <>
                <Button variant="outline" onClick={handleReset} disabled={isProcessing}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAction} 
                  disabled={!objective.trim() || isProcessing}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Bot className="h-4 w-4 mr-2" />
                      {config.actionText}
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={handleReset} className="w-full">
                Close & Return to Dashboard
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
