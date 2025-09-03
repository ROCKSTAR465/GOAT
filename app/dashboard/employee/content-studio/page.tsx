"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User, Sparkles, Save, Edit, Send, FileText, Lightbulb } from "lucide-react"

interface Message {
  sender: "user" | "ai"
  text: string | React.ReactNode
}

interface Draft {
  version: string
  content: string
}

const initialDrafts: Draft[] = [
  {
    version: "V1",
    content: "Initial script focusing on pain points. Casual tone.",
  },
  {
    version: "V2",
    content: "Revised with a stronger call-to-action. More formal.",
  },
]

const brandHooks = [
    "The one thing everyone gets wrong about...",
    "3 myths about [topic] busted.",
    "The secret to [achieving result] is not what you think."
]

const brandCTAs = [
    "Swipe up to learn more!",
    "Comment 'YES' to get the guide.",
    "Link in bio for the full story."
]

export default function ContentStudioPage() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState("")
  const [drafts] = React.useState<Draft[]>(initialDrafts)
  const [activeDraft, setActiveDraft] = React.useState<Draft | null>(null)
  const [isGenerating, setIsGenerating] = React.useState(false)

  const handleSend = (prompt?: string) => {
    const textToSend = prompt || input
    if (!textToSend.trim()) return

    const userMessage: Message = { sender: "user", text: textToSend }
    setMessages(prev => [...prev, userMessage])

    setIsGenerating(true)
    setTimeout(() => {
        const aiResponse: Message = {
            sender: "ai",
            text: (
                <div className="space-y-4">
                    <p>Here are a few options based on your prompt:</p>
                    <Card className="bg-background">
                        <CardHeader>
                            <CardTitle className="text-base">Option 1: Casual & Witty</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">&quot;Tired of your content flopping? 😴 Let&apos;s turn those crickets into conversions. Here&apos;s the secret sauce... 🌶️&quot;</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-background">
                        <CardHeader>
                            <CardTitle className="text-base">Option 2: Formal & Authoritative</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">&quot;Maximizing content ROI requires a strategic approach. We will explore three foundational pillars to elevate your brand&apos;s digital presence.&quot;</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-background">
                        <CardHeader>
                            <CardTitle className="text-base">Option 3: Trendy & Punchy</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">&quot;POV: You just found the ultimate content hack. ✨ It&apos;s giving... main character energy. Bet. 👇&quot;</p>
                        </CardContent>
                    </Card>
                </div>
            )
        }
        setMessages(prev => [...prev, aiResponse])
        setIsGenerating(false)
    }, 1500)

    setInput("")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
      {/* Left Sidebar: Draft History */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center"><FileText className="mr-2"/> Draft History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {drafts.map((draft) => (
              <Button key={draft.version} variant={activeDraft?.version === draft.version ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveDraft(draft)}>
                <Badge className="mr-2">{draft.version}</Badge> {draft.content.substring(0,25)}...
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Main Panel: Chat Interface */}
      <div className="lg:col-span-2 flex flex-col h-full">
        <Card className="flex-grow flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center"><Bot className="mr-2"/> Content Studio Chatbot</CardTitle>
            <CardDescription>Draft scripts by chatting with the AI.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ScrollArea className="h-[calc(100vh-22rem)] pr-4">
                <div className="space-y-6">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                    {msg.sender === 'ai' && <Avatar><AvatarFallback><Bot/></AvatarFallback></Avatar>}
                    <div className={`rounded-lg px-4 py-2 max-w-[90%] ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background border'}`}>
                      {typeof msg.text === 'string' ? <p className="text-sm">{msg.text}</p> : msg.text}
                    </div>
                    {msg.sender === 'user' && <Avatar><AvatarFallback><User/></AvatarFallback></Avatar>}
                  </div>
                ))}
                {isGenerating && (
                    <div className="flex items-start gap-3">
                        <Avatar><AvatarFallback><Bot/></AvatarFallback></Avatar>
                        <div className="rounded-lg px-4 py-2 bg-background border"><Sparkles className="h-5 w-5 animate-spin"/></div>
                    </div>
                )}
                </div>
            </ScrollArea>
          </CardContent>
          <div className="p-4 border-t">
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleSend("Make it more casual")}>Casual</Button>
                <Button variant="outline" size="sm" onClick={() => handleSend("Make it more formal")}>Formal</Button>
                <Button variant="outline" size="sm" onClick={() => handleSend("Make it more trendy")}>Trendy</Button>
            </div>
            <div className="mt-2 flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., Draft a 20-sec IG Reel script about our new feature"
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button onClick={() => handleSend()}><Send className="h-4 w-4" /></Button>
            </div>
            <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline"><Save className="mr-2 h-4 w-4"/> Save Draft</Button>
                <Button variant="outline"><Edit className="mr-2 h-4 w-4"/> Edit</Button>
                <Button><Send className="mr-2 h-4 w-4"/> Submit for Approval</Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Right Sidebar: Brand Guide */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center"><Lightbulb className="mr-2"/> Brand Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              <div>
                  <h4 className="font-semibold text-sm mb-2">Hooks</h4>
                  <ul className="space-y-2">
                      {brandHooks.map((hook, i) => <li key={i} className="text-xs text-muted-foreground p-2 bg-secondary rounded-md">{hook}</li>)}
                  </ul>
              </div>
               <div>
                  <h4 className="font-semibold text-sm mb-2">Calls to Action (CTAs)</h4>
                  <ul className="space-y-2">
                      {brandCTAs.map((cta, i) => <li key={i} className="text-xs text-muted-foreground p-2 bg-secondary rounded-md">{cta}</li>)}
                  </ul>
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
