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
import { DollarSign, TrendingUp, TrendingDown, FileWarning } from "lucide-react"

// Mock Data from Executive Dashboard
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

// New Mock Data for Revenue Page
const topClients = [
    { rank: 1, name: "Client A", revenue: 45000, change: 5.2 },
    { rank: 2, name: "Client B", revenue: 32000, change: -1.5 },
    { rank: 3, name: "Client C", revenue: 28000, change: 10.1 },
    { rank: 4, name: "Client D", revenue: 20340, change: 2.3 },
]

const outstandingInvoices = [
    { invoiceId: "INV-0123", client: "Client B", amount: 5000, dueDate: "2024-09-01", status: "Overdue" },
    { invoiceId: "INV-0124", client: "Client E", amount: 12000, dueDate: "2024-09-15", status: "Due Soon" },
    { invoiceId: "INV-0125", client: "Client A", amount: 22000, dueDate: "2024-09-30", status: "Pending" },
]

const revenueForecast = [
    { month: "Jul", forecast: 130000, actual: 128000 },
    { month: "Aug", forecast: 135000, actual: 138000 },
    { month: "Sep", forecast: 140000, actual: null },
    { month: "Oct", forecast: 145000, actual: null },
]


export default function ExecutiveRevenuePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Revenue</h1>
        <p className="text-muted-foreground">Detailed financial performance and forecasts.</p>
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

      <Card>
        <CardHeader>
          <CardTitle>Expenses vs. Profit</CardTitle>
          <CardDescription>Compare income with operational costs.</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={{}} className="h-64 w-full">
            <BarChart data={expensesProfitData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Top Performing Clients</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Rank</TableHead><TableHead>Client</TableHead><TableHead>Revenue</TableHead><TableHead>Change</TableHead></TableRow></TableHeader>
              <TableBody>
                {topClients.map(client => (
                  <TableRow key={client.rank}>
                    <TableCell>{client.rank}</TableCell>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>${client.revenue.toLocaleString()}</TableCell>
                    <TableCell className={`flex items-center ${client.change > 0 ? "text-green-500" : "text-red-500"}`}>
                        {client.change > 0 ? <TrendingUp className="h-4 w-4 mr-1"/> : <TrendingDown className="h-4 w-4 mr-1"/>}
                        {client.change}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Outstanding Invoices</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Invoice ID</TableHead><TableHead>Client</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {outstandingInvoices.map(invoice => (
                  <TableRow key={invoice.invoiceId}>
                    <TableCell>{invoice.invoiceId}</TableCell>
                    <TableCell>{invoice.client}</TableCell>
                    <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                    <TableCell>
                        <Badge variant={invoice.status === "Overdue" ? "destructive" : "outline"}>{invoice.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
          <CardHeader><CardTitle>Revenue Forecast</CardTitle></CardHeader>
          <CardContent>
             <Table>
              <TableHeader><TableRow><TableHead>Month</TableHead><TableHead>Forecast</TableHead><TableHead>Actual</TableHead><TableHead>Variance</TableHead></TableRow></TableHeader>
              <TableBody>
                {revenueForecast.map(item => (
                  <TableRow key={item.month}>
                    <TableCell>{item.month}</TableCell>
                    <TableCell>${item.forecast.toLocaleString()}</TableCell>
                    <TableCell>{item.actual ? `$${item.actual.toLocaleString()}` : 'N/A'}</TableCell>
                    <TableCell>
                        {item.actual ?
                            <span className={item.actual >= item.forecast ? 'text-green-500' : 'text-red-500'}>
                                {(((item.actual - item.forecast) / item.forecast) * 100).toFixed(1)}%
                            </span>
                            : 'N/A'
                        }
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
