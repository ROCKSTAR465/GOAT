"use client"

import * as React from "react"
import { Calendar as BigCalendar, dateFnsLocalizer, EventProps, ToolbarProps } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Video, Clock, MapPin, Users } from "lucide-react"

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

interface ShootEvent {
  id: string
  title: string
  start: Date
  end: Date
  client: string
  shootType: string
  location: string
  assignedTeam: string[]
  resourceId?: string
}

const initialShoots: ShootEvent[] = [
  {
    id: "1",
    title: "Brand Storytelling - TechStart",
    start: new Date(2024, 8, 2, 10, 0),
    end: new Date(2024, 8, 2, 13, 0),
    client: "TechStart Solutions",
    shootType: "Brand Storytelling",
    location: "Studio A",
    assignedTeam: ["Alex", "Casey"],
    resourceId: 'techstart'
  },
  {
    id: "2",
    title: "Product Demo - Digital Innovations",
    start: new Date(2024, 8, 4, 14, 0),
    end: new Date(2024, 8, 4, 17, 0),
    client: "Digital Innovations",
    shootType: "Product Demo",
    location: "Studio B",
    assignedTeam: ["Alex", "Taylor"],
    resourceId: 'digital'
  },
  {
    id: "3",
    title: "Interview - BrandBoost",
    start: new Date(2024, 8, 6, 9, 0),
    end: new Date(2024, 8, 6, 11, 0),
    client: "BrandBoost",
    shootType: "Interview Setup",
    location: "Client Office",
    assignedTeam: ["Casey", "Morgan"],
    resourceId: 'brandboost'
  },
]

const clientColors: { [key: string]: string } = {
    techstart: 'bg-blue-500',
    digital: 'bg-green-500',
    brandboost: 'bg-purple-500',
    default: 'bg-gray-500'
}

const CustomEvent = ({ event }: EventProps<ShootEvent>) => (
  <div className={`h-full p-1 text-white rounded-md ${clientColors[event.resourceId || 'default']}`}>
    <p className="text-xs font-semibold truncate">{event.title}</p>
  </div>
)

const CustomToolbar = ({ label, onNavigate, onView }: ToolbarProps) => (
  <div className="flex items-center justify-between p-4 bg-background rounded-t-lg">
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={() => onNavigate('PREV')}><ChevronLeft className="h-4 w-4" /></Button>
      <h2 className="text-xl font-bold">{label}</h2>
      <Button variant="outline" size="icon" onClick={() => onNavigate('NEXT')}><ChevronRight className="h-4 w-4" /></Button>
    </div>
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={() => onView('month')}>Month</Button>
      <Button variant="outline" onClick={() => onView('week')}>Week</Button>
    </div>
  </div>
)

export default function ShootPlannerPage() {
  const [shoots, setShoots] = React.useState<ShootEvent[]>(initialShoots)
  const [selectedShoot, setSelectedShoot] = React.useState<ShootEvent | null>(null)
  const [isAddModalOpen, setAddModalOpen] = React.useState(false)
  const [newEvent, setNewEvent] = React.useState<{start: Date, end: Date} | null>(null)

  const handleSelectSlot = ({ start, end }: { start: Date, end: Date }) => {
    setNewEvent({start, end})
    setAddModalOpen(true)
  }

  const handleAddShoot = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newShoot: ShootEvent = {
        id: String(shoots.length + 1),
        title: `${formData.get("type")} - ${formData.get("client")}`,
        start: newEvent!.start,
        end: newEvent!.end,
        client: formData.get("client") as string,
        shootType: formData.get("type") as string,
        location: formData.get("location") as string,
        assignedTeam: ["Alex", "New Member"], // Mock
        resourceId: (formData.get("client") as string).split(' ')[0].toLowerCase()
    }
    setShoots([...shoots, newShoot]);
    setAddModalOpen(false);
    setNewEvent(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Shoot Planner</h1>
        <p className="text-muted-foreground">Manage and schedule all your shoots in one place.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <BigCalendar
            localizer={localizer}
            events={shoots}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 'calc(100vh - 18rem)' }}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={event => setSelectedShoot(event)}
            components={{
                event: CustomEvent,
                toolbar: CustomToolbar
            }}
            eventPropGetter={(event) => ({
                className: `${clientColors[event.resourceId || 'default']} border-none`,
            })}
          />
        </CardContent>
      </Card>

      {/* View Shoot Details Modal */}
      <Dialog open={!!selectedShoot} onOpenChange={(isOpen) => !isOpen && setSelectedShoot(null)}>
        <DialogContent>
            {selectedShoot && (
                <>
                    <DialogHeader>
                        <DialogTitle>{selectedShoot.title}</DialogTitle>
                        <DialogDescription>
                            <Badge className={`${clientColors[selectedShoot.resourceId || 'default']} my-2`}>{selectedShoot.client}</Badge>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <p className="flex items-center"><Video className="mr-2 h-4 w-4"/><strong>Type:</strong> &nbsp; {selectedShoot.shootType}</p>
                        <p className="flex items-center"><Clock className="mr-2 h-4 w-4"/><strong>Time:</strong> &nbsp; {format(selectedShoot.start, 'p')} - {format(selectedShoot.end, 'p')}</p>
                        <p className="flex items-center"><MapPin className="mr-2 h-4 w-4"/><strong>Location:</strong> &nbsp; {selectedShoot.location}</p>
                        <p className="flex items-center"><Users className="mr-2 h-4 w-4"/><strong>Team:</strong> &nbsp; {selectedShoot.assignedTeam.join(', ')}</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedShoot(null)}>Close</Button>
                        <Button>Upload Assets</Button>
                    </DialogFooter>
                </>
            )}
        </DialogContent>
      </Dialog>

      {/* Add Shoot Modal */}
       <Dialog open={isAddModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Schedule a New Shoot</DialogTitle>
                <DialogDescription>
                    Scheduling for {newEvent && format(newEvent.start, 'MMMM do, yyyy')} from {newEvent && format(newEvent.start, 'p')} to {newEvent && format(newEvent.end, 'p')}.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddShoot} className="space-y-4 py-4">
                 <div>
                  <Label>Client</Label>
                  <Select name="client" required>
                    <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TechStart Solutions">TechStart Solutions</SelectItem>
                      <SelectItem value="Digital Innovations">Digital Innovations</SelectItem>
                      <SelectItem value="BrandBoost">BrandBoost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Shoot Type</Label>
                  <Select name="type" required>
                    <SelectTrigger><SelectValue placeholder="Select shoot type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Brand Storytelling">Brand Storytelling</SelectItem>
                      <SelectItem value="Product Demo">Product Demo</SelectItem>
                      <SelectItem value="Interview Setup">Interview Setup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Location</Label>
                  <Select name="location" required>
                    <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Studio A">Studio A</SelectItem>
                      <SelectItem value="Studio B">Studio B</SelectItem>
                      <SelectItem value="Client Office">Client Office</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setAddModalOpen(false)}>Cancel</Button>
                    <Button type="submit">Schedule Shoot</Button>
                </DialogFooter>
            </form>
        </DialogContent>
       </Dialog>
    </div>
  )
}
