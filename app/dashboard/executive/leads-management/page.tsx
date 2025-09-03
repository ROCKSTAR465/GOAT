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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, CheckCircle, XCircle, UserPlus, MessageSquare } from "lucide-react"

type LeadStatus = "New" | "Contacted" | "Qualified" | "Rejected" | "Converted"

interface Lead {
  id: string
  name: string
  company: string
  status: LeadStatus
  assignedTo: string
  assignedToAvatar: string
  date: string
  value: number
}

interface Interaction {
  id: string
  employee: string
  employeeAvatar: string
  timestamp: string
  comment: string
}

const initialLeads: Lead[] = [
  { id: "LEAD-01", name: "Rahul Sharma", company: "TechStart Solutions", status: "Qualified", assignedTo: "Alex", assignedToAvatar: "/avatars/alex.jpg", date: "2024-09-01", value: 150000 },
  { id: "LEAD-02", name: "Priya Patel", company: "Digital Innovations", status: "Contacted", assignedTo: "Casey", assignedToAvatar: "/avatars/casey.jpg", date: "2024-09-02", value: 120000 },
  { id: "LEAD-03", name: "Sunita Verma", company: "GrowthCorp", status: "New", assignedTo: "N/A", assignedToAvatar: "", date: "2024-09-03", value: 210000 },
  { id: "LEAD-04", name: "Kavya Reddy", company: "SuccessStory Ltd", status: "Converted", assignedTo: "Alex", assignedToAvatar: "/avatars/alex.jpg", date: "2024-08-15", value: 180000 },
  { id: "LEAD-05", name: "Ankit Gupta", company: "Future Enterprises", status: "Rejected", assignedTo: "Casey", assignedToAvatar: "/avatars/casey.jpg", date: "2024-08-20", value: 90000 },
]

const mockInteractions: Interaction[] = [
    { id: "INT-1", employee: "Casey", employeeAvatar: "/avatars/casey.jpg", timestamp: "2024-09-02 11:00 AM", comment: "Initial contact made. Client is interested in a full-service package. Follow-up call scheduled for tomorrow." },
    { id: "INT-2", employee: "Casey", employeeAvatar: "/avatars/casey.jpg", timestamp: "2024-09-03 10:30 AM", comment: "Follow-up call complete. Sent over the proposal document. They will review and get back by EOW." },
]

export default function LeadsManagementPage() {
  const [leads, setLeads] = React.useState<Lead[]>(initialLeads)
  const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null)
  const [filter, setFilter] = React.useState<LeadStatus | "All">("All")

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case "Converted": return <Badge className="bg-green-500">Converted</Badge>
      case "Qualified": return <Badge className="bg-blue-500">Qualified</Badge>
      case "Contacted": return <Badge className="bg-yellow-500">Contacted</Badge>
      case "New": return <Badge variant="secondary">New</Badge>
      case "Rejected": return <Badge variant="destructive">Rejected</Badge>
    }
  }

  const filteredLeads = leads.filter(lead => filter === "All" || lead.status === filter)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Leads Management</h1>
        <p className="text-muted-foreground">Approve, reject, and reassign incoming leads.</p>
      </div>

      <div className="flex items-center space-x-2">
        <Tabs defaultValue="All" onValueChange={(value) => setFilter(value as LeadStatus | "All")}>
            <TabsList>
                <TabsTrigger value="All">All</TabsTrigger>
                <TabsTrigger value="New">New</TabsTrigger>
                <TabsTrigger value="Qualified">Qualified</TabsTrigger>
                <TabsTrigger value="Contacted">Contacted</TabsTrigger>
                <TabsTrigger value="Converted">Converted</TabsTrigger>
                <TabsTrigger value="Rejected">Rejected</TabsTrigger>
            </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id} onClick={() => setSelectedLead(lead)} className="cursor-pointer">
                  <TableCell className="font-medium">
                    <div>{lead.name}</div>
                    <div className="text-sm text-muted-foreground">{lead.company}</div>
                  </TableCell>
                  <TableCell>{getStatusBadge(lead.status)}</TableCell>
                  <TableCell>
                    {lead.assignedTo !== "N/A" ? (
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6"><AvatarImage src={lead.assignedToAvatar} /><AvatarFallback>{lead.assignedTo.charAt(0)}</AvatarFallback></Avatar>
                            <span>{lead.assignedTo}</span>
                        </div>
                    ) : "N/A"}
                  </TableCell>
                  <TableCell>{new Date(lead.date).toLocaleDateString()}</TableCell>
                  <TableCell>${lead.value.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={!!selectedLead} onOpenChange={(isOpen) => !isOpen && setSelectedLead(null)}>
        <SheetContent className="w-[500px] sm:max-w-lg">
          {selectedLead && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedLead.name} - {selectedLead.company}</SheetTitle>
                <SheetDescription>Lead Value: ${selectedLead.value.toLocaleString()}</SheetDescription>
              </SheetHeader>
              <div className="py-6 space-y-6">
                <div>
                    <h4 className="font-semibold mb-2">Lead Demands</h4>
                    <p className="text-sm text-muted-foreground">Client is looking for a full-service social media management and content creation package, with a focus on short-form video for Instagram and TikTok. They require monthly performance reports.</p>
                </div>
                 <div>
                    <h4 className="font-semibold mb-2">Interaction Log</h4>
                    <div className="space-y-4">
                        {mockInteractions.map(interaction => (
                            <div key={interaction.id} className="flex gap-3">
                                <Avatar className="h-8 w-8"><AvatarImage src={interaction.employeeAvatar} /><AvatarFallback>{interaction.employee.charAt(0)}</AvatarFallback></Avatar>
                                <div>
                                    <div className="text-sm">
                                        <span className="font-semibold">{interaction.employee}</span>
                                        <span className="text-muted-foreground ml-2">{interaction.timestamp}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{interaction.comment}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
                 <div>
                     <h4 className="font-semibold mb-2">Reason for Acceptance/Rejection</h4>
                     <Textarea placeholder="Provide a reason for your decision..."/>
                 </div>
              </div>
              <SheetFooter className="grid grid-cols-3 gap-2">
                <Button variant="destructive"><XCircle className="mr-2 h-4 w-4"/> Reject</Button>
                <Button variant="secondary"><UserPlus className="mr-2 h-4 w-4"/> Reassign</Button>
                <Button><CheckCircle className="mr-2 h-4 w-4"/> Approve</Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
