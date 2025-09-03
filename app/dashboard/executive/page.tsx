"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Pie, PieChart, Cell } from "recharts"
import { Briefcase, TrendingUp, Users, CheckCircle, DollarSign, Activity, ArrowUp, ArrowDown } from "lucide-react"
import { NumberTicker } from "@/components/ui/number-ticker"

// Mock Data
const summaryCards = {
  leads: { value: 42, change: 12.5, icon: Briefcase },
  revenue: { value: 125340, change: -2.1, icon: DollarSign },
  activeCampaigns: { value: 12, change: 0, icon: Activity },
  pendingApprovals: { value: 8, change: 0, icon: CheckCircle },
}

const revenueByClientData = [
    { client: "Client A", revenue: 45000, fill: "hsl(var(--chart-1))" },
    { client: "Client B", revenue: 32000, fill: "hsl(var(--chart-2))" },
    { client: "Client C", revenue: 28000, fill: "hsl(var(--chart-3))" },
    { client: "Client D", revenue: 20340, fill: "hsl(var(--chart-4))" },
]

const revenueTrendData = [
  { month: "Jan", revenue: 80000 },
  { month: "Feb", revenue: 95000 },
  { month: "Mar", revenue: 110000 },
  { month: "Apr", revenue: 105000 },
  { month: "May", revenue: 120000 },
  { month: "Jun", revenue: 125340 },
]

const expensesProfitData = [
  { month: "Jan", expenses: 60000, profit: 20000 },
  { month: "Feb", expenses: 65000, profit: 30000 },
  { month: "Mar", expenses: 70000, profit: 40000 },
  { month: "Apr", expenses: 72000, profit: 33000 },
  { month: "May", expenses: 75000, profit: 45000 },
  { month: "Jun", expenses: 80000, profit: 45340 },
]

const pipelineLeads = [
    { id: 1, name: "Lead Alpha", status: "Negotiation", assigned: "Alex" },
    { id: 2, name: "Lead Beta", status: "Contacted", assigned: "Casey" },
    { id: 3, name: "Lead Gamma", status: "New", assigned: "N/A" },
    { id: 4, name: "Lead Delta", status: "Proposal", assigned: "Alex" },
]

export default function ExecutiveDashboardPage() {
    const [userName, setUserName] = React.useState("Morgan")

    React.useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if(storedUser.name) setUserName(storedUser.name)
    }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Executive Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {userName}.</p>
        </div>
        <p className="text-sm text-muted-foreground italic">&quot;Vision without execution is just hallucination.&quot;</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(summaryCards).map(([key, card]) => (
          <Card key={key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <NumberTicker value={card.value} />
                {key === 'revenue' && ' USD'}
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                {card.change !== 0 ? (
                  <>
                    {card.change > 0 ? <ArrowUp className="h-4 w-4 text-green-500" /> : <ArrowDown className="h-4 w-4 text-red-500" />}
                    {card.change}% vs last month
                  </>
                ) : 'No change from last month'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue by Client</CardTitle>
            <CardDescription>Distribution of total revenue by client.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-64 w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie data={revenueByClientData} dataKey="revenue" nameKey="client" cx="50%" cy="50%" outerRadius={80} label>
                    {revenueByClientData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Revenue Growth Trend</CardTitle>
            <CardDescription>Month-over-month revenue trends.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-64 w-full">
              <LineChart data={revenueTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Expenses vs Profit Chart */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Expenses vs. Profit</CardTitle>
            <CardDescription>Compare income with operational costs.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={{}} className="h-64 w-full">
                <BarChart data={expensesProfitData} stackOffset="sign" margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="profit" fill="hsl(var(--chart-1))" stackId="a" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" fill="hsl(var(--chart-2))" stackId="a" />
                </BarChart>
             </ChartContainer>
          </CardContent>
        </Card>

        {/* Pipeline Preview */}
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Pipeline Preview</CardTitle>
                <CardDescription>Latest leads with quick status badges.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Lead</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Assigned</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pipelineLeads.map((lead) => (
                            <TableRow key={lead.id}>
                                <TableCell className="font-medium">{lead.name}</TableCell>
                                <TableCell><Badge variant="outline">{lead.status}</Badge></TableCell>
                                <TableCell>{lead.assigned}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
