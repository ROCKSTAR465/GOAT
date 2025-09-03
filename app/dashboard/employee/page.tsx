"use client"

import * as React from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from "recharts"
import { Bell, CheckCircle, Clock, Video, FileText, User } from "lucide-react"

// Mock Data
const employee = {
  name: "Alex",
  role: "Content Strategist",
  joinedDate: "2023-01-15",
  avatar: "/avatars/alex.jpg", // Placeholder avatar
}

const quickStats = {
  tasksDue: 5,
  pendingApprovals: 2,
  shootsThisWeek: 3,
}

const taskCompletionData = [
  { week: "W1", completed: 8, total: 10 },
  { week: "W2", completed: 7, total: 10 },
  { week: "W3", completed: 9, total: 10 },
  { week: "W4", completed: 6, total: 8 },
]

const workloadData = [
  { day: "Mon", deadlines: 2 },
  { day: "Tue", deadlines: 3 },
  { day: "Wed", deadlines: 1 },
  { day: "Thu", deadlines: 4 },
  { day: "Fri", deadlines: 2 },
  { day: "Sat", deadlines: 0 },
  { day: "Sun", deadlines: 1 },
]

const notifications = [
  { id: 1, text: "Shoot rescheduled to tomorrow.", time: "1h ago" },
  { id: 2, text: "New script 'Project Alpha' assigned.", time: "3h ago" },
  { id: 3, text: "Your latest edit was approved.", time: "5h ago" },
]

const scriptsInReview = [
  { id: 1, title: "IG Reel - Q3 Campaign", version: "V2" },
  { id: 2, title: "YouTube Ad - New Product", version: "V1" },
]

const shootsToday = [
  { id: 1, title: "Client X - Product Shoot", time: "10:00 AM" },
]

export default function EmployeeDashboardPage() {
    const [user, setUser] = React.useState(employee);

    React.useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if(storedUser.name) {
            setUser({
                name: storedUser.name,
                role: storedUser.designation,
                joinedDate: "2023-02-20", // mock
                avatar: `/avatars/${storedUser.name.toLowerCase()}.jpg`
            })
        }
    }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
          <p className="text-muted-foreground">Here&apos;s your dashboard for today.</p>
        </div>
        <p className="text-sm text-muted-foreground italic">&quot;Creativity fuels growth.&quot;</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Employee Info Card */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.role}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Joined on {new Date(user.joinedDate).toLocaleDateString()}</p>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tasks due today</span>
                <span className="font-bold text-lg">{quickStats.tasksDue}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Approvals pending</span>
                <span className="font-bold text-lg">{quickStats.pendingApprovals}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Shoots this week</span>
                <span className="font-bold text-lg">{quickStats.shootsThisWeek}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Completion Rate</CardTitle>
              <CardDescription>Your weekly task completion progress.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-48 w-full" config={{}}>
                <BarChart data={taskCompletionData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="completed" fill="var(--color-primary)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Workload</CardTitle>
              <CardDescription>Your deadlines over the next 7 days.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-48 w-full" config={{}}>
                <LineChart data={workloadData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="deadlines" stroke="var(--color-primary)" strokeWidth={2} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Row - Preview Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5" /> Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {notifications.map(n => (
                <li key={n.id} className="text-sm flex justify-between">
                  <span>{n.text}</span>
                  <span className="text-muted-foreground">{n.time}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Scripts in Review</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {scriptsInReview.map(s => (
                <li key={s.id} className="text-sm flex justify-between">
                  <span>{s.title}</span>
                  <Badge variant="outline">{s.version}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Video className="w-5 h-5" /> Shoots Today</CardTitle>
          </CardHeader>
          <CardContent>
            {shootsToday.length > 0 ? (
                <ul className="space-y-3">
                {shootsToday.map(s => (
                    <li key={s.id} className="text-sm flex justify-between">
                    <span>{s.title}</span>
                    <span className="font-semibold">{s.time}</span>
                    </li>
                ))}
                </ul>
            ) : (
                <p className="text-sm text-muted-foreground">No shoots scheduled for today.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
