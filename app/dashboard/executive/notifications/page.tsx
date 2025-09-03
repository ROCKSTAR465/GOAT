"use client"

import * as React from "react"
import {
  Card,
  CardContent,
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
import { AlertTriangle, CheckCircle, DollarSign, ArrowRight } from "lucide-react"

type NotificationCategory = "Urgent" | "Approvals Pending" | "Financial Alerts"

interface Notification {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  category: NotificationCategory
  link: string
}

const initialNotifications: Notification[] = [
  {
    id: "NOTIF-101",
    title: "Lead Y awaiting approval",
    description: "A new high-value lead, 'Lead Y' from 'Innovate Corp', is awaiting your approval for assignment.",
    time: "25m ago",
    read: false,
    category: "Approvals Pending",
    link: "/dashboard/executive/leads-management"
  },
  {
    id: "NOTIF-102",
    title: "Client X invoice overdue",
    description: "Invoice #INV-0120 for Client X is now 15 days overdue. The outstanding amount is $8,500.",
    time: "2h ago",
    read: false,
    category: "Financial Alerts",
    link: "/dashboard/executive/revenue"
  },
  {
    id: "NOTIF-103",
    title: "Team Performance Anomaly",
    description: "The 'Alpha Team' has shown a 15% drop in task completion rate this week compared to the previous week.",
    time: "8h ago",
    read: true,
    category: "Urgent",
    link: "/dashboard/executive/team-performance"
  },
  {
    id: "NOTIF-104",
    title: "Shoot approval requested: Project Gamma",
    description: "A new shoot for 'Project Gamma' has been planned and requires your approval to proceed with resource allocation.",
    time: "1d ago",
    read: false,
    category: "Approvals Pending",
    link: "/dashboard/executive/shoot-oversight"
  },
    {
    id: "NOTIF-105",
    title: "Q3 Profit Margin Alert",
    description: "The projected profit margin for Q3 is currently 5% below the target of 25%.",
    time: "2d ago",
    read: true,
    category: "Financial Alerts",
    link: "/dashboard/executive/revenue"
  },
]

export default function ExecutiveNotificationsPage() {
  const [notifications, setNotifications] = React.useState<Notification[]>(initialNotifications)
  const [selectedNotification, setSelectedNotification] = React.useState<Notification | null>(null)

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case "Urgent":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "Approvals Pending":
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      case "Financial Alerts":
        return <DollarSign className="h-5 w-5 text-green-500" />
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
             {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No notifications in this category.</p>}
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">Critical alerts, approvals, and financial updates.</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="urgent">Urgent</TabsTrigger>
          <TabsTrigger value="approvals">Approvals Pending</TabsTrigger>
          <TabsTrigger value="financial">Financial Alerts</TabsTrigger>
        </TabsList>
        <TabsContent value="all">{renderNotificationList()}</TabsContent>
        <TabsContent value="urgent">{renderNotificationList("Urgent")}</TabsContent>
        <TabsContent value="approvals">{renderNotificationList("Approvals Pending")}</TabsContent>
        <TabsContent value="financial">{renderNotificationList("Financial Alerts")}</TabsContent>
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
              <DialogFooter className="sm:justify-end">
                <Button onClick={() => alert(`Deep linking to: ${selectedNotification.link}`)}>
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
