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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Film, MessageSquare, Send, CheckCircle, Lock, User, Eye } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type EditingStatus = "Editing" | "Draft Ready" | "In Review" | "Approved"

interface MediaTask {
  id: string
  media: string
  editor: string
  editorAvatar: string
  status: EditingStatus
  progress: number
}

interface Comment {
    timestamp: string
    user: string
    avatar: string
    text: string
}

const allMediaTasks: MediaTask[] = [
  { id: "MEDIA-01", media: "Client X - Testimonial", editor: "Alex", editorAvatar: "/avatars/alex.jpg", status: "In Review", progress: 90 },
  { id: "MEDIA-02", media: "Q3 Campaign Ad", editor: "Alex", editorAvatar: "/avatars/alex.jpg", status: "Editing", progress: 40 },
  { id: "MEDIA-03", media: "New Product Launch Teaser", editor: "Casey", editorAvatar: "/avatars/casey.jpg", status: "Draft Ready", progress: 100 },
  { id: "MEDIA-04", media: "Brand Story - Part 1", editor: "Alex", editorAvatar: "/avatars/alex.jpg", status: "Approved", progress: 100 },
  { id: "MEDIA-05", media: "Internal Training Video", editor: "Taylor", editorAvatar: "/avatars/taylor.jpg", status: "Editing", progress: 15 },
  { id: "MEDIA-06", media: "Client Y - Social Snippet", editor: "Casey", editorAvatar: "/avatars/casey.jpg", status: "In Review", progress: 100 },
]

const mockComments: Comment[] = [
    { timestamp: "0:15", user: "Morgan Lee", avatar: "/avatars/morgan.jpg", text: "Can we make the logo bigger here?" },
    { timestamp: "0:42", user: "Morgan Lee", avatar: "/avatars/morgan.jpg", text: "The music feels a bit off. Let's try something more upbeat." },
    { timestamp: "1:10", user: "Alex", avatar: "/avatars/alex.jpg", text: "Good point, I'll update the music track." },
]

export default function ExecutiveEditingOversightPage() {
  const [tasks, setTasks] = React.useState<MediaTask[]>(allMediaTasks)
  const [selectedTask, setSelectedTask] = React.useState<MediaTask | null>(null)

  const getStatusBadge = (status: EditingStatus) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="mr-1 h-3 w-3" />Approved</Badge>
      case "In Review":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">In Review</Badge>
      case "Draft Ready":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Draft Ready</Badge>
      case "Editing":
        return <Badge variant="secondary">Editing</Badge>
    }
  }

  const handleApprove = () => {
      if(!selectedTask) return;
      setTasks(tasks.map(t => t.id === selectedTask.id ? {...t, status: "Approved", progress: 100} : t));
      setSelectedTask(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editing Oversight</h1>
        <p className="text-muted-foreground">Review and approve all media in the post-production pipeline.</p>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Media</TableHead>
                <TableHead>Editor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[20%]">Progress</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.media}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6"><AvatarImage src={task.editorAvatar} /><AvatarFallback>{task.editor.charAt(0)}</AvatarFallback></Avatar>
                        <span>{task.editor}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                  <TableCell><Progress value={task.progress} className="w-full" /></TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => setSelectedTask(task)}>
                        <Eye className="mr-2 h-4 w-4"/> Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedTask} onOpenChange={(isOpen) => !isOpen && setSelectedTask(null)}>
        <DialogContent className="max-w-4xl">
            {selectedTask && (
                <>
                    <DialogHeader>
                        <DialogTitle>Review: {selectedTask.media}</DialogTitle>
                        <DialogDescription>Editor: {selectedTask.editor} • Status: {selectedTask.status}</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                        <Card>
                            <CardHeader><CardTitle className="flex items-center"><Film className="mr-2"/> Media Preview</CardTitle></CardHeader>
                            <CardContent>
                                <div className="aspect-video bg-slate-900 rounded-md flex items-center justify-center text-slate-400">
                                    <p>Video Player Mock</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle className="flex items-center"><MessageSquare className="mr-2"/> Timestamped Comments</CardTitle></CardHeader>
                            <CardContent>
                                <div className="space-y-4 h-64 overflow-y-auto pr-4">
                                    {mockComments.map((comment, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <Avatar className="h-8 w-8"><AvatarImage src={comment.avatar}/><AvatarFallback>{comment.user.charAt(0)}</AvatarFallback></Avatar>
                                            <div>
                                                <p className="font-semibold text-sm">{comment.user} <span className="text-xs text-muted-foreground ml-2 font-mono bg-secondary px-1 rounded">{comment.timestamp}</span></p>
                                                <p className="text-sm text-muted-foreground">{comment.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <form className="mt-4 flex gap-2">
                                    <Input placeholder="Add a comment... (e.g., 0:32 - Check this transition)" />
                                    <Button type="submit" size="icon"><Send className="h-4 w-4"/></Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedTask(null)}>Close</Button>
                        {selectedTask.status !== "Approved" ? (
                            <Button className="bg-green-600 hover:bg-green-700" onClick={handleApprove}>
                                <Lock className="mr-2 h-4 w-4"/> Approve & Lock
                            </Button>
                        ) : (
                             <Button disabled><CheckCircle className="mr-2 h-4 w-4"/> Approved</Button>
                        )}
                    </DialogFooter>
                </>
            )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
