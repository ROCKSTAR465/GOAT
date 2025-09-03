"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
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
import { Bell, AlertTriangle, CheckCircle, Settings, ArrowRight } from "lucide-react"

type NotificationCategory = "Urgent" | "Approvals" | "System"

interface Notification {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  category: NotificationCategory
}

const initialNotifications: Notification[] = [
  {
    id: "NOTIF-001",
    title: "Shoot Rescheduled: Client Y",
    description: "The shoot for Client Y, originally scheduled for tomorrow at 10 AM, has been moved to 2 PM the same day due to location unavailability.",
    time: "15m ago",
    read: false,
    category: "Urgent",
  },
  {
    id: "NOTIF-002",
    title: "Script Approved: Project Beta",
    description: "Your script submission for 'Project Beta' has been approved by Morgan Lee. You can now proceed with storyboarding.",
    time: "1h ago",
    read: false,
    category: "Approvals",
  },
  {
    id: "NOTIF-003",
    title: "New Task Assigned: Q4 Graphics",
    description: "A new task 'Design Graphics for Q4 Campaign' has been assigned to you by Casey.",
    time: "3h ago",
    read: true,
    category: "System",
  },
  {
    id: "NOTIF-004",
    title: "Approval Needed: Ad Spend for Client Z",
    description: "Your approval is requested for the proposed ad spend for the Client Z campaign. Please review by EOD.",
    time: "5h ago",
    read: false,
    category: "Approvals",
  },
    {
    id: "NOTIF-005",
    title: "System Update Scheduled",
    description: "A system-wide update is scheduled for this Sunday at 2 AM. Expect brief downtime.",
    time: "1d ago",
    read: true,
    category: "System",
  },
  {
    id: "NOTIF-006",
    title: "URGENT: Footage Corrupted for Project Gamma",
    description: "Critical footage from the recent 'Project Gamma' shoot appears to be corrupted. Please investigate immediately and report to the tech team.",
    time: "2d ago",
    read: false,
    category: "Urgent",
  },
]

export default function EmployeeNotificationsPage() {
  const [notifications, setNotifications] = React.useState<Notification[]>(initialNotifications)
  const [selectedNotification, setSelectedNotification] = React.useState<Notification | null>(null)

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case "Urgent":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "Approvals":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "System":
        return <Settings className="h-5 w-5 text-blue-500" />
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    setNotifications(notifications.map(n => n.id === notification.id ? {...n, read: true} : n));
  }

  const renderNotificationList = (filter?: NotificationCategory) => {
    const filtered = filter ? notifications.filter(n => n.category === filter) : notifications;
    return (
        <div className="space-y-4">
            {filtered.map(n => (
                <Card key={n.id} className={`cursor-pointer hover:shadow-md transition-shadow ${!n.read && "bg-secondary"}`} onClick={() => handleNotificationClick(n)}>
                    <CardContent className="p-4 flex items-start gap-4">
                        <div className="mt-1">{getCategoryIcon(n.category)}</div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <p className="font-semibold">{n.title}</p>
                                <p className="text-xs text-muted-foreground">{n.time}</p>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{n.description}</p>
                        </div>
                        {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">Stay updated with important alerts and approvals.</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="urgent">Urgent</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        <TabsContent value="all">{renderNotificationList()}</TabsContent>
        <TabsContent value="urgent">{renderNotificationList("Urgent")}</TabsContent>
        <TabsContent value="approvals">{renderNotificationList("Approvals")}</TabsContent>
        <TabsContent value="system">{renderNotificationList("System")}</TabsContent>
      </Tabs>

      <Dialog open={!!selectedNotification} onOpenChange={(isOpen) => !isOpen && setSelectedNotification(null)}>
        <DialogContent>
          {selectedNotification && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getCategoryIcon(selectedNotification.category)}
                  {selectedNotification.title}
                </DialogTitle>
                <DialogDescription>{selectedNotification.time}</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p>{selectedNotification.description}</p>
              </div>
              <DialogFooter className="sm:justify-between">
                <Button onClick={() => setSelectedNotification(null)} variant="outline">
                  Mark as Unread
                </Button>
                <Button>
                  Go to Item <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
