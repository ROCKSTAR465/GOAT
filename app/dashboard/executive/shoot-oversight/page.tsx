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
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Calendar, ChevronLeft, ChevronRight, Video, Clock, MapPin, Users, CheckCircle, Clock4, UserPlus, Paperclip } from "lucide-react"

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

type ShootStatus = "Pending Approval" | "Approved" | "Scheduled"

interface ShootEvent {
  id: string
  title: string
  start: Date
  end: Date
  client: string
  shootType: string
  location: string
  assignedTeam: string[]
  assets: { name: string, url: string }[]
  status: ShootStatus
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
    assets: [{name: "script_v3.pdf", url: "#"}],
    status: "Approved",
    resourceId: 'high'
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
    assets: [{name: "storyboard_v1.pdf", url: "#"}],
    status: "Scheduled",
    resourceId: 'medium'
  },
  {
    id: "3",
    title: "Interview - BrandBoost",
    start: new Date(2024, 8, 9, 9, 0),
    end: new Date(2024, 8, 9, 11, 0),
    client: "BrandBoost",
    shootType: "Interview Setup",
    location: "Client Office",
    assignedTeam: ["Casey"],
    assets: [],
    status: "Pending Approval",
    resourceId: 'low'
  },
]

const priorityColors: { [key: string]: string } = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500',
    default: 'bg-gray-500'
}

const CustomEvent = ({ event }: EventProps<ShootEvent>) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger className="h-full w-full">
        <div className={`h-full p-1 text-white rounded-md ${priorityColors[event.resourceId || 'default']}`}>
          <p className="text-xs font-semibold truncate">{event.title}</p>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{event.client} - {event.shootType}</p>
        <p>Status: {event.status}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
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

export default function ExecutiveShootOversightPage() {
  const [shoots, setShoots] = React.useState<ShootEvent[]>(initialShoots)
  const [selectedShoot, setSelectedShoot] = React.useState<ShootEvent | null>(null)

  const handleApprove = () => {
      if(!selectedShoot) return;
      setShoots(shoots.map(s => s.id === selectedShoot.id ? {...s, status: "Approved"} : s));
      setSelectedShoot(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Shoot Oversight</h1>
        <p className="text-muted-foreground">Master calendar of all scheduled and pending shoots.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <BigCalendar
            localizer={localizer}
            events={shoots}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 'calc(100vh - 18rem)' }}
            onSelectEvent={event => setSelectedShoot(event)}
            components={{
                event: CustomEvent,
                toolbar: CustomToolbar
            }}
            eventPropGetter={(event) => ({
                className: `${priorityColors[event.resourceId || 'default']} border-none`,
            })}
          />
        </CardContent>
      </Card>

      <Dialog open={!!selectedShoot} onOpenChange={(isOpen) => !isOpen && setSelectedShoot(null)}>
        <DialogContent>
            {selectedShoot && (
                <>
                    <DialogHeader>
                        <DialogTitle>{selectedShoot.title}</DialogTitle>
                        <DialogDescription>
                            <Badge className={`${priorityColors[selectedShoot.resourceId || 'default']} my-2`}>Priority: {selectedShoot.resourceId?.toUpperCase()}</Badge>
                            <Badge variant="outline" className="ml-2">Status: {selectedShoot.status}</Badge>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <p className="flex items-center"><Video className="mr-2 h-4 w-4"/><strong>Client:</strong> &nbsp; {selectedShoot.client}</p>
                        <p className="flex items-center"><Clock className="mr-2 h-4 w-4"/><strong>Time:</strong> &nbsp; {format(selectedShoot.start, 'p')} - {format(selectedShoot.end, 'p')}</p>
                        <p className="flex items-center"><MapPin className="mr-2 h-4 w-4"/><strong>Location:</strong> &nbsp; {selectedShoot.location}</p>
                        <p className="flex items-center"><Users className="mr-2 h-4 w-4"/><strong>Team:</strong> &nbsp; {selectedShoot.assignedTeam.join(', ')}</p>
                        <div>
                            <h4 className="font-semibold flex items-center mb-2"><Paperclip className="mr-2 h-4 w-4"/> Assets</h4>
                            {selectedShoot.assets.length > 0 ? (
                                <ul className="list-disc list-inside">
                                    {selectedShoot.assets.map(asset => <li key={asset.name}><a href={asset.url} className="text-primary hover:underline">{asset.name}</a></li>)}
                                </ul>
                            ) : <p className="text-muted-foreground text-sm">No assets uploaded.</p>}
                        </div>
                    </div>
                    <DialogFooter className="justify-between">
                        <Button variant="outline" onClick={() => setSelectedShoot(null)}>Close</Button>
                        <div className="flex gap-2">
                           {selectedShoot.status === "Pending Approval" && <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700"><CheckCircle className="mr-2 h-4 w-4"/> Approve Shoot</Button>}
                           <Button variant="secondary"><Clock4 className="mr-2 h-4 w-4"/> Reschedule</Button>
                           <Button variant="secondary"><UserPlus className="mr-2 h-4 w-4"/> Assign Staff</Button>
                        </div>
                    </DialogFooter>
                </>
            )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
