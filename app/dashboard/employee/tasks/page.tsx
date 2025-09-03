"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, ListFilter, Upload, Paperclip } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

type TaskStatus = "Pending" | "Completed" | "Overdue"

interface Task {
  id: string
  name: string
  status: TaskStatus
  deadline: string
  assignedBy: string
  description: string
  attachments: { name: string; url: string }[]
}

const initialTasks: Task[] = [
  {
    id: "TASK-001",
    name: "Draft Q3 Social Media Calendar",
    status: "Pending",
    deadline: "2024-09-15",
    assignedBy: "Morgan Lee",
    description: "Create a comprehensive social media calendar for the third quarter, focusing on Instagram and LinkedIn. Include post types, captions, and suggested visuals.",
    attachments: [{ name: "Q3_Strategy_Brief.pdf", url: "#" }],
  },
  {
    id: "TASK-002",
    name: "Edit 'Client X' Testimonial Video",
    status: "Completed",
    deadline: "2024-09-10",
    assignedBy: "Casey",
    description: "Finalize the edit for the Client X testimonial video. Apply color correction, add lower thirds, and mix audio.",
    attachments: [],
  },
  {
    id: "TASK-003",
    name: "Design Graphics for 'New Product' Launch",
    status: "Pending",
    deadline: "2024-09-20",
    assignedBy: "Morgan Lee",
    description: "Develop a set of 5-7 graphics for the upcoming new product launch. Graphics should be optimized for Instagram Stories, Facebook posts, and Twitter.",
    attachments: [{ name: "Brand_Guidelines_v3.pdf", url: "#" }],
  },
  {
    id: "TASK-004",
    name: "Submit Script for 'Project Alpha'",
    status: "Overdue",
    deadline: "2024-09-05",
    assignedBy: "Casey",
    description: "The script for 'Project Alpha' is overdue. Please finalize and submit for executive review immediately.",
    attachments: [],
  },
]

export default function EmployeeTasksPage() {
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks)
  const [filter, setFilter] = React.useState<TaskStatus | "All">("All")
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null)
  const [isAddTaskOpen, setAddTaskOpen] = React.useState(false)

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case "Completed":
        return <Badge variant="default" className="bg-green-500">Completed</Badge>
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>
      case "Overdue":
        return <Badge variant="destructive">Overdue</Badge>
    }
  }

  const filteredTasks = tasks.filter(task => filter === "All" || task.status === filter)

  const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newTask: Task = {
      id: `TASK-${String(tasks.length + 1).padStart(3, '0')}`,
      name: formData.get("title") as string,
      status: "Pending",
      deadline: formData.get("deadline") as string,
      assignedBy: "Alex (Me)", // Mocked as self-assigned
      description: formData.get("description") as string,
      attachments: [],
    }
    setTasks([...tasks, newTask])
    setAddTaskOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold">Tasks & Scheduling</h1>
            <p className="text-muted-foreground">Manage your assigned tasks and deadlines.</p>
        </div>
        <Dialog open={isAddTaskOpen} onOpenChange={setAddTaskOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Task</DialogTitle>
              <DialogDescription>Fill out the details below to add a new task to your list.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddTask}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" placeholder="e.g., Edit promotional video" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" placeholder="Provide a brief description of the task." required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input id="deadline" name="deadline" type="date" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="attachments">Attachments</Label>
                    <Button variant="outline" className="w-full">
                        <Upload className="mr-2 h-4 w-4" /> Upload File
                    </Button>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Task</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <ListFilter className="h-5 w-5 text-muted-foreground" />
        <Button variant={filter === "All" ? "secondary" : "ghost"} onClick={() => setFilter("All")}>All</Button>
        <Button variant={filter === "Pending" ? "secondary" : "ghost"} onClick={() => setFilter("Pending")}>Pending</Button>
        <Button variant={filter === "Completed" ? "secondary" : "ghost"} onClick={() => setFilter("Completed")}>Completed</Button>
        <Button variant={filter === "Overdue" ? "secondary" : "ghost"} onClick={() => setFilter("Overdue")}>Overdue</Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Assigned By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id} onClick={() => setSelectedTask(task)} className="cursor-pointer">
                    <TableCell className="font-medium">{task.name}</TableCell>
                    <TableCell>{getStatusBadge(task.status)}</TableCell>
                    <TableCell>{new Date(task.deadline).toLocaleDateString()}</TableCell>
                    <TableCell>{task.assignedBy}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      <Sheet open={!!selectedTask} onOpenChange={(isOpen) => !isOpen && setSelectedTask(null)}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          {selectedTask && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedTask.name}</SheetTitle>
                <SheetDescription>
                  Assigned by {selectedTask.assignedBy} • Due on {new Date(selectedTask.deadline).toLocaleDateString()}
                </SheetDescription>
              </SheetHeader>
              <div className="py-6 space-y-4">
                <h3 className="font-semibold">Description</h3>
                <p className="text-muted-foreground">{selectedTask.description}</p>

                {selectedTask.attachments.length > 0 && (
                  <div>
                    <h3 className="font-semibold">Attachments</h3>
                    <ul className="mt-2 space-y-2">
                      {selectedTask.attachments.map((file, index) => (
                        <li key={index}>
                          <a href={file.url} className="flex items-center text-sm text-primary hover:underline">
                            <Paperclip className="mr-2 h-4 w-4" /> {file.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <h3 className="font-semibold">Activity Log</h3>
                <div className="text-sm text-muted-foreground">
                    <p>Task created on {new Date(new Date(selectedTask.deadline).getTime() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                    {selectedTask.status === 'Completed' && <p>Completed on {new Date(selectedTask.deadline).toLocaleDateString()}</p>}
                </div>
              </div>
              <SheetFooter>
                <Button onClick={() => setSelectedTask(null)} variant="outline">Close</Button>
                <Button>Submit for Review</Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
