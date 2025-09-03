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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LifeBuoy, Send, BookOpen, Workflow, Wrench, UploadCloud, ChevronRight } from "lucide-react"

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
    question: "How to add a new shoot?",
    answer: "To add a new shoot, go to the 'Shoot Planner' page. First, click on your desired date in the calendar. Then, a form will appear where you can fill in the client details, shoot type, location, and assigned team members. Click 'Schedule Shoot' to finalize.",
  },
  {
    question: "How to submit scripts?",
    answer: "You can draft and submit scripts in the 'Content Studio'. After generating or writing your script, click the 'Submit for Approval' button. This will send it to the executive team for review, and you'll be notified of any feedback or approval.",
  },
  {
    question: "Where do I see task approvals?",
    answer: "You can track task approvals in the 'Notifications' page under the 'Approvals' tab. You will receive a notification whenever a task, script, or shoot you're involved in is approved or requires changes.",
  },
]

const helpCategories = [
    { title: "Onboarding Guide", description: "New to the team? Start here.", icon: BookOpen, link: "#" },
    { title: "Workflow Tutorials", description: "Learn how to use our tools.", icon: Workflow, link: "#" },
    { title: "Technical Support", description: "Having trouble? Find solutions.", icon: Wrench, link: "#" },
    { title: "Publishing Checklist", description: "Ready to go live? Follow these steps.", icon: UploadCloud, link: "#" },
]

export default function EmployeeHelpCentrePage() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState("")

  const handleSend = () => {
    if (!input.trim()) return
    const userMessage: Message = { sender: "user", text: input }

    // Mock AI response
    const faq = faqs.find(f => f.question.toLowerCase().includes(input.toLowerCase()))
    const aiResponse: Message = { sender: "ai", text: faq ? faq.answer : "I'm sorry, I don't have an answer for that. Please check the documentation or contact support." }

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
        <p className="text-muted-foreground">Find answers, tutorials, and support.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Ask SNR AI</CardTitle>
              <CardDescription>Get instant answers to your questions.</CardDescription>
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
                        <p>Ask a question to get started, or select a common query.</p>
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
              <CardTitle>Documentation</CardTitle>
              <CardDescription>Browse our guides and tutorials.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {helpCategories.map(cat => {
                    const Icon = cat.icon
                    return (
                        <a href={cat.link} key={cat.title} className="flex items-center justify-between p-3 rounded-md hover:bg-secondary">
                            <div className="flex items-center gap-4">
                                <Icon className="h-6 w-6 text-muted-foreground" />
                                <div>
                                    <p className="font-semibold">{cat.title}</p>
                                    <p className="text-sm text-muted-foreground">{cat.description}</p>
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
