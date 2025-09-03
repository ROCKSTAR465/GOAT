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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Line, LineChart, Sparkline } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Users, BarChart3, TrendingUp, Check, Clock, Award } from "lucide-react"

interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
  status: "active" | "busy"
  tasksCompleted: number
  avgCompletionTime: number // in hours
  achievements: string[]
  performanceData: { month: string; tasks: number }[]
}

const teamPerformanceData = [
  { name: 'Content', tasks: 45 },
  { name: 'Editing', tasks: 30 },
  { name: 'Management', tasks: 15 },
  { name: 'Design', tasks: 25 },
]

const productivityData = [
    { name: 'Week 1', completed: 80, assigned: 100 },
    { name: 'Week 2', completed: 90, assigned: 100 },
    { name: 'Week 3', completed: 75, assigned: 90 },
    { name: 'Week 4', completed: 95, assigned: 100 },
]

const initialTeams: { name: string, members: TeamMember[] }[] = [
  {
    name: "Content & Strategy",
    members: [
      { id: "EMP-01", name: "Alex", role: "Content Strategist", avatar: "/avatars/alex.jpg", status: "active", tasksCompleted: 45, avgCompletionTime: 4, achievements: ["Top Performer Q2"], performanceData: [{month: 'Jan', tasks: 10}, {month: 'Feb', tasks: 12}] },
      { id: "EMP-02", name: "Casey", role: "Scriptwriter", avatar: "/avatars/casey.jpg", status: "busy", tasksCompleted: 38, avgCompletionTime: 5, achievements: [], performanceData: [{month: 'Jan', tasks: 8}, {month: 'Feb', tasks: 10}] },
    ]
  },
  {
      name: "Editing & Post-Production",
      members: [
        { id: "EMP-03", name: "Taylor", role: "Video Editor", avatar: "/avatars/taylor.jpg", status: "active", tasksCompleted: 52, avgCompletionTime: 6, achievements: ["Fastest Turnaround Award"], performanceData: [{month: 'Jan', tasks: 14}, {month: 'Feb', tasks: 11}] },
      ]
  }
]

export default function TeamPerformancePage() {
  const [teams, setTeams] = React.useState(initialTeams)
  const [selectedMember, setSelectedMember] = React.useState<TeamMember | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Team Performance</h1>
        <p className="text-muted-foreground">Monitor workload, productivity, and individual performance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Workload Distribution</CardTitle>
            <CardDescription>How tasks are split across departments.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-64">
                <BarChart data={teamPerformanceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={80}/>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="tasks" fill="var(--color-primary)" radius={4}/>
                </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Productivity Chart</CardTitle>
            <CardDescription>Tasks completed vs. assigned per week.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-64">
                <LineChart data={productivityData}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="completed" stroke="var(--color-primary)" strokeWidth={2} name="Completed"/>
                    <Line type="monotone" dataKey="assigned" stroke="var(--color-secondary)" strokeDasharray="5 5" name="Assigned"/>
                </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {teams.map(team => (
        <Card key={team.name}>
            <CardHeader><CardTitle>{team.name}</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {team.members.map(member => (
                    <div key={member.id} className="p-4 bg-secondary rounded-lg cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedMember(member)}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <Avatar><AvatarImage src={member.avatar}/><AvatarFallback>{member.name.charAt(0)}</AvatarFallback></Avatar>
                                <div>
                                    <h4 className="font-semibold">{member.name}</h4>
                                    <p className="text-sm text-muted-foreground">{member.role}</p>
                                </div>
                            </div>
                            <Badge variant={member.status === "active" ? "default" : "outline"} className={member.status === "active" ? "bg-green-500" : ""}>{member.status}</Badge>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
      ))}

      <Dialog open={!!selectedMember} onOpenChange={(isOpen) => !isOpen && setSelectedMember(null)}>
        <DialogContent className="sm:max-w-md">
            {selectedMember && (
                <>
                    <DialogHeader className="flex-row items-center gap-4">
                        <Avatar className="h-16 w-16"><AvatarImage src={selectedMember.avatar}/><AvatarFallback>{selectedMember.name.charAt(0)}</AvatarFallback></Avatar>
                        <div>
                            <DialogTitle className="text-2xl">{selectedMember.name}</DialogTitle>
                            <p className="text-muted-foreground">{selectedMember.role}</p>
                            <p className="text-xs text-muted-foreground">Joined: 2023-01-15</p>
                        </div>
                    </DialogHeader>
                    <div className="py-6 grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 p-3 bg-secondary rounded-md">
                            <Check className="h-6 w-6 text-green-500"/>
                            <div>
                                <p className="text-sm text-muted-foreground">Tasks Completed</p>
                                <p className="font-bold text-lg">{selectedMember.tasksCompleted}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-secondary rounded-md">
                            <Clock className="h-6 w-6 text-blue-500"/>
                            <div>
                                <p className="text-sm text-muted-foreground">Avg. Completion</p>
                                <p className="font-bold text-lg">{selectedMember.avgCompletionTime} hrs</p>
                            </div>
                        </div>
                        <div className="col-span-2">
                            <h4 className="font-semibold mb-2">Achievements</h4>
                            <div className="flex gap-2">
                                {selectedMember.achievements.map(ach => <Badge key={ach}><Award className="mr-1 h-3 w-3"/>{ach}</Badge>)}
                                {selectedMember.achievements.length === 0 && <p className="text-sm text-muted-foreground">No achievements yet.</p>}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
