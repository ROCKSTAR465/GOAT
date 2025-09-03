"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BorderBeam } from "@/components/ui/border-beam"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Calendar,
  Play,
  Pause,
  Stop,
  Zap
} from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "in-progress" | "completed" | "overdue"
  deadline: string
  estimatedTime: string
  actualTime?: string
  project: string
  client: string
  category: string
}

interface MyTasksHubProps {
  tasks: Task[]
  onStartTask: (taskId: string) => void
  onPauseTask: (taskId: string) => void
  onCompleteTask: (taskId: string) => void
  onViewTask: (taskId: string) => void
}

const priorityColors = {
  low: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  urgent: "bg-red-100 text-red-800 border-red-200",
}

const statusColors = {
  pending: "bg-blue-100 text-blue-800 border-blue-200",
  "in-progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  overdue: "bg-red-100 text-red-800 border-red-200",
}

const priorityIcons = {
  low: "🟢",
  medium: "🟡",
  high: "🟠",
  urgent: "🔴",
}

export function MyTasksHub({ 
  tasks, 
  onStartTask, 
  onPauseTask, 
  onCompleteTask, 
  onViewTask 
}: MyTasksHubProps) {
  const [activeTask, setActiveTask] = React.useState<string | null>(null)
  const [timer, setTimer] = React.useState<{ [key: string]: number }>({})

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => {
        const newTimer = { ...prev }
        Object.keys(newTimer).forEach(taskId => {
          if (newTimer[taskId] > 0) {
            newTimer[taskId] += 1
          }
        })
        return newTimer
      })
    }, 1000)

    return () => clearInterval(clearInterval)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartTask = (taskId: string) => {
    setActiveTask(taskId)
    setTimer(prev => ({ ...prev, [taskId]: 0 }))
    onStartTask(taskId)
  }

  const handlePauseTask = (taskId: string) => {
    setActiveTask(null)
    onPauseTask(taskId)
  }

  const handleCompleteTask = (taskId: string) => {
    setActiveTask(null)
    setTimer(prev => {
      const newTimer = { ...prev }
      delete newTimer[taskId]
      return newTimer
    })
    onCompleteTask(taskId)
  }

  const todayTasks = tasks.filter(task => 
    new Date(task.deadline).toDateString() === new Date().toDateString()
  )
  
  const upcomingTasks = tasks.filter(task => 
    new Date(task.deadline) > new Date() && 
    new Date(task.deadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  ).slice(0, 5)

  const completedTasks = tasks.filter(task => task.status === "completed").slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Today's Priority Tasks */}
      <Card className="relative">
        <BorderBeam />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Today&apos;s Priority Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayTasks.length > 0 ? (
              todayTasks.map((task) => (
                <div key={task.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{task.title}</h4>
                        <span className="text-sm">{priorityIcons[task.priority]}</span>
                        <Badge className={priorityColors[task.priority]}>
                          {task.priority}
                        </Badge>
                        <Badge className={statusColors[task.status]}>
                          {task.status.replace("-", " ")}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Project: {task.project}</p>
                          <p className="text-gray-600">Client: {task.client}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Deadline: {task.deadline}</p>
                          <p className="text-gray-600">Est. Time: {task.estimatedTime}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {activeTask === task.id ? (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handlePauseTask(task.id)}>
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </Button>
                        <Button size="sm" onClick={() => handleCompleteTask(task.id)}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Complete
                        </Button>
                        <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-md">
                          <Clock className="w-4 h-4" />
                          <span className="font-mono">{formatTime(timer[task.id] || 0)}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <Button size="sm" onClick={() => handleStartTask(task.id)}>
                          <Play className="w-4 h-4 mr-2" />
                          Start
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onViewTask(task.id)}>
                          View Details
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                <p>No tasks scheduled for today!</p>
                <p className="text-sm">Great job staying on top of your workload.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <Card className="relative">
          <BorderBeam />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Deadlines (Next 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      <p className="text-xs text-gray-600">{task.project} - {task.client}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={priorityColors[task.priority]}>
                        {task.priority}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{task.deadline}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recently Completed */}
        <Card className="relative">
          <BorderBeam />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Recently Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <div key={task.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      <p className="text-xs text-gray-600">{task.project} - {task.client}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Completed
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {task.actualTime || task.estimatedTime}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Progress Tracker */}
      <Card className="relative">
        <BorderBeam />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Progress className="w-5 h-5" />
            Task Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {tasks.filter(t => t.status === "pending").length}
              </div>
              <p className="text-sm text-gray-600">Pending Tasks</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {tasks.filter(t => t.status === "in-progress").length}
              </div>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {tasks.filter(t => t.status === "completed").length}
              </div>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Progress</span>
              <span>
                {Math.round((tasks.filter(t => t.status === "completed").length / tasks.length) * 100)}%
              </span>
            </div>
            <Progress 
              value={(tasks.filter(t => t.status === "completed").length / tasks.length) * 100} 
              className="h-3" 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
