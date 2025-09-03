"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BorderBeam } from "@/components/ui/border-beam"
import { motion } from "framer-motion"
import { Users, TrendingUp, UserCheck, DollarSign, Bell, Eye } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const dashboardStats = [
  {
    title: "Total Revenue",
    value: "₹2.4L",
    change: "+18%",
    icon: DollarSign,
    color: "text-green-400",
  },
  {
    title: "Active Clients",
    value: "36",
    change: "+12%",
    icon: Users,
    color: "text-blue-400",
  },
  {
    title: "Avg Deal Size",
    value: "₹1.4L",
    change: "+8.2%",
    icon: TrendingUp,
    color: "text-yellow-400",
  },
  {
    title: "Conversion Rate",
    value: "23.8%",
    change: "+5.1%",
    icon: UserCheck,
    color: "text-purple-400",
  },
]

const performanceData = [
  { month: "Jan", revenue: 180000, leads: 45 },
  { month: "Feb", revenue: 220000, leads: 52 },
  { month: "Mar", revenue: 195000, leads: 48 },
  { month: "Apr", revenue: 240000, leads: 61 },
  { month: "May", revenue: 280000, leads: 55 },
  { month: "Jun", revenue: 320000, leads: 67 },
  { month: "Jul", revenue: 350000, leads: 58 },
  { month: "Aug", revenue: 248000, leads: 72 },
  { month: "Sep", revenue: 370000, leads: 78 },
  { month: "Oct", revenue: 390000, leads: 85 },
  { month: "Nov", revenue: 410000, leads: 92 },
  { month: "Dec", revenue: 450000, leads: 100 },
]

const teamPerformanceData = [
  { team: "Del Team", efficiency: 94, projects: 6, revenue: 180000 },
  { team: "Centinals", efficiency: 97, projects: 9, revenue: 250000 },
  { team: "Alpha Team", efficiency: 91, projects: 5, revenue: 150000 },
  { team: "Beta Team", efficiency: 88, projects: 7, revenue: 170000 },
  { team: "Gamma Team", efficiency: 95, projects: 8, revenue: 220000 },
]

const notificationsData = [
  {
    id: "1",
    type: "urgent",
    title: "Critical Alert",
    message: "Server maintenance required immediately",
    time: "10:30 AM",
  },
  {
    id: "2",
    type: "warning",
    title: "Low Inventory",
    message: "Stock levels for essential items are running low",
    time: "9:45 AM",
  },
  {
    id: "3",
    type: "info",
    title: "New Lead Assigned",
    message: "A new lead has been assigned to your team",
    time: "9:15 AM",
  },
]

function AnimatedCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      setCount(Math.floor(progress * value))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])

  return <span>{count}</span>
}

// Chart configurations for better tooltip styling
const performanceConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  leads: {
    label: "Leads",
    color: "hsl(var(--chart-2))",
  },
};

const teamConfig = {
  efficiency: {
    label: "Efficiency",
    color: "hsl(var(--chart-1))",
  },
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Dashboard Overview</h2>
          <p className="text-gray-400 mt-1">Real-time insights and performance metrics</p>
        </div>
        <div className="flex gap-3">
          <Button>
            <Eye className="w-4 h-4 mr-2" />
            Live View
          </Button>
        </div>
      </div>

      <Card className="relative">
        <BorderBeam />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Real-time Notifications & Next Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {notificationsData.map((notification, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-l-4 ${
                  notification.type === "urgent"
                    ? "bg-red-900/20 border-l-red-500"
                    : notification.type === "warning"
                      ? "bg-yellow-900/20 border-l-yellow-500"
                      : "bg-blue-900/20 border-l-blue-500"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-gray-400">{notification.message}</p>
                  </div>
                  <span className="text-xs text-gray-500">{notification.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div key={index} whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">{stat.title}</p>
                      <p className="text-2xl font-bold">
                        <AnimatedCounter value={Number.parseInt(stat.value.replace(/[^0-9]/g, ""))} />
                        {stat.value.replace(/[0-9]/g, "")}
                      </p>
                      <p className={`text-sm ${stat.color}`}>{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-secondary ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="relative">
          <BorderBeam />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Performance Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={performanceConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFD700" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#FFD700" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="var(--color-revenue)" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
                  <Area type="monotone" dataKey="leads" stroke="var(--color-leads)" fillOpacity={1} fill="url(#colorLeads)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="relative">
          <BorderBeam />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={teamConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={teamPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="team" stroke="black" />
                  <YAxis stroke="black" />
                  <ChartTooltip 
                    cursor={{ fill: 'transparent' }}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="efficiency" fill="url(#barGradient)" radius={[4, 4, 0, 0]} activeBar={false} />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FFD700" />
                      <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
