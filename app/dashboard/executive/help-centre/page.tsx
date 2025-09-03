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
import { LifeBuoy, Send, BarChart2, DollarSign, Users, ChevronRight } from "lucide-react"

interface Message {
  sender: "user" | "ai"
  text: string
}

interface FAQ {
  question: string
  answer: string
}

const faqs: FAQ[] = [
  {
    question: "How to approve/reject leads?",
    answer: "To manage leads, navigate to the 'Leads Management' page. Click on any lead in the table to open a detailed side drawer. Inside the drawer, you will find 'Approve', 'Reject', and 'Reassign' buttons to perform the desired action.",
  },
  {
    question: "Where can I see revenue trends?",
    answer: "Revenue trends are available on both the main 'Dashboard' and the dedicated 'Revenue' page. Both pages feature charts for 'Revenue by Client', 'Revenue Growth Trend', and 'Expenses vs. Profit' for a comprehensive financial overview.",
  },
  {
    question: "How to reassign tasks?",
    answer: "Task reassignment for leads can be done from the 'Leads Management' page. For team-wide task distribution, visit the 'Team Performance' page to get an overview and then coordinate with the respective project managers.",
  },
]

const quickLinks = [
    { title: "Revenue Report", description: "View detailed financial reports.", icon: DollarSign, link: "/dashboard/executive/revenue" },
    { title: "Team Performance Metrics", description: "Analyze team productivity.", icon: Users, link: "/dashboard/executive/team-performance" },
    { title: "Lead Conversion Rates", description: "Track sales pipeline effectiveness.", icon: BarChart2, link: "/dashboard/executive/leads-management" },
]

export default function ExecutiveHelpCentrePage() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState("")

  const handleSend = () => {
    if (!input.trim()) return
    const userMessage: Message = { sender: "user", text: input }

    const faq = faqs.find(f => f.question.toLowerCase().includes(input.toLowerCase()))
    const aiResponse: Message = { sender: "ai", text: faq ? faq.answer : "I'm sorry, I don't have a specific answer for that. Please check the linked reports or contact your account manager for detailed queries." }

    setMessages([...messages, userMessage, aiResponse])
    setInput("")
  }

  const handleQuestionClick = (question: string) => {
    const userMessage: Message = { sender: "user", text: question }
    const faq = faqs.find(f => f.question === question)
    const aiResponse: Message = { sender: "ai", text: faq!.answer }
    setMessages([...messages, userMessage, aiResponse])
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center"><LifeBuoy className="mr-3 h-8 w-8" /> Help Centre</h1>
        <p className="text-muted-foreground">Get strategic insights and answers to your questions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Ask SNR AI</CardTitle>
              <CardDescription>Get instant answers for executive-level queries.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] overflow-y-auto p-4 border rounded-md bg-secondary/50 space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                    {msg.sender === 'ai' && <Avatar><AvatarFallback>AI</AvatarFallback></Avatar>}
                    <div className={`rounded-lg px-4 py-2 max-w-[80%] ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                     {msg.sender === 'user' && <Avatar><AvatarFallback>You</AvatarFallback></Avatar>}
                  </div>
                ))}
                 {messages.length === 0 && (
                    <div className="text-center text-muted-foreground pt-20">
                        <p>Ask a question or select a common query below.</p>
                    </div>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question here..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button onClick={handleSend}><Send className="h-4 w-4" /></Button>
              </div>
              <div className="mt-4 space-x-2">
                {faqs.map(faq => (
                    <Button key={faq.question} variant="outline" size="sm" onClick={() => handleQuestionClick(faq.question)}>{faq.question}</Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
              <CardDescription>Jump directly to key reports.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {quickLinks.map(link => {
                    const Icon = link.icon
                    return (
                        <a href={link.link} key={link.title} className="flex items-center justify-between p-3 rounded-md hover:bg-secondary">
                            <div className="flex items-center gap-4">
                                <Icon className="h-6 w-6 text-muted-foreground" />
                                <div>
                                    <p className="font-semibold">{link.title}</p>
                                    <p className="text-sm text-muted-foreground">{link.description}</p>
                                </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </a>
                    )
                })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
