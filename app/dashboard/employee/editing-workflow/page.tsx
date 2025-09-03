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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Film, MessageSquare, Send, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

type EditingStatus = "Editing" | "Draft Ready" | "In Review" | "Approved"

interface MediaTask {
  id: string
  media: string
  editor: string
  status: EditingStatus
  progress: number
}

interface Comment {
    timestamp: string
    user: string
    text: string
}

const initialMediaTasks: MediaTask[] = [
  { id: "MEDIA-01", media: "Client X - Testimonial", editor: "Alex", status: "In Review", progress: 90 },
  { id: "MEDIA-02", media: "Q3 Campaign Ad", editor: "Alex", status: "Editing", progress: 40 },
  { id: "MEDIA-03", media: "New Product Launch Teaser", editor: "Casey", status: "Draft Ready", progress: 100 },
  { id: "MEDIA-04", media: "Brand Story - Part 1", editor: "Alex", status: "Approved", progress: 100 },
  { id: "MEDIA-05", media: "Internal Training Video", editor: "Taylor", status: "Editing", progress: 15 },
]

const mockComments: Comment[] = [
    { timestamp: "0:15", user: "Morgan Lee", text: "Can we make the logo bigger here?" },
    { timestamp: "0:42", user: "Morgan Lee", text: "The music feels a bit off. Let's try something more upbeat." },
    { timestamp: "1:10", user: "Alex", text: "Good point, I'll update the music track." },
]

export default function EmployeeEditingWorkflowPage() {
  const [tasks, setTasks] = React.useState<MediaTask[]>(initialMediaTasks)
  const [selectedTask, setSelectedTask] = React.useState<MediaTask | null>(null)
  const [isUploadModalOpen, setUploadModalOpen] = React.useState(false)
  const [comments, setComments] = React.useState<Comment[]>(mockComments)
  const [newComment, setNewComment] = React.useState("")

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

  const handleCommentSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(!newComment.trim()) return;
      const newCommentObj: Comment = {
          timestamp: "1:25", // Mock timestamp
          user: "Alex",
          text: newComment
      }
      setComments([...comments, newCommentObj]);
      setNewComment("");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Editing Workflow</h1>
          <p className="text-muted-foreground">Your queue of media tasks for post-production.</p>
        </div>
        <Dialog open={isUploadModalOpen} onOpenChange={setUploadModalOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Upload className="mr-2 h-4 w-4" /> Upload Draft
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Upload Draft: {selectedTask?.media || "New Media"}</DialogTitle>
                    <DialogDescription>Preview the media and leave timestamped comments for review.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center"><Film className="mr-2"/> Media Preview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="aspect-video bg-slate-900 rounded-md flex items-center justify-center text-slate-400">
                                    <p>Video Player Mock</p>
                                </div>
                                <div className="mt-4">
                                    <Label htmlFor="version-notes">Version Notes</Label>
                                    <Textarea id="version-notes" placeholder="e.g., Added color correction and initial audio mix." />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center"><MessageSquare className="mr-2"/> Timestamped Comments</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 h-64 overflow-y-auto pr-4">
                                    {comments.map((comment, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <Badge variant="secondary" className="font-mono">{comment.timestamp}</Badge>
                                            <div>
                                                <p className="font-semibold text-sm">{comment.user}</p>
                                                <p className="text-sm text-muted-foreground">{comment.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <form onSubmit={handleCommentSubmit} className="mt-4 flex gap-2">
                                    <Input value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment... (e.g., 0:32 - Check this transition)" />
                                    <Button type="submit" size="icon"><Send className="h-4 w-4"/></Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setUploadModalOpen(false)}>Cancel</Button>
                    <Button>Submit for Review</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id} onClick={() => {setSelectedTask(task); setUploadModalOpen(true)}} className="cursor-pointer">
                  <TableCell className="font-medium">{task.media}</TableCell>
                  <TableCell>{task.editor}</TableCell>
                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                  <TableCell>
                    <Progress value={task.progress} className="w-full" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
