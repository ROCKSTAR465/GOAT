"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const chartData = [
  { date: "2024-01-01", leads: 435, conversions: 87 },
  { date: "2024-01-02", leads: 687, conversions: 142 },
  { date: "2024-01-03", leads: 523, conversions: 98 },
  { date: "2024-01-04", leads: 789, conversions: 175 },
  { date: "2024-01-05", leads: 612, conversions: 134 },
  { date: "2024-01-06", leads: 834, conversions: 198 },
  { date: "2024-01-07", leads: 567, conversions: 115 },
  { date: "2024-01-08", leads: 923, conversions: 234 },
  { date: "2024-01-09", leads: 445, conversions: 89 },
  { date: "2024-01-10", leads: 678, conversions: 145 },
  { date: "2024-01-11", leads: 756, conversions: 167 },
  { date: "2024-01-12", leads: 589, conversions: 123 },
  { date: "2024-01-13", leads: 812, conversions: 189 },
  { date: "2024-01-14", leads: 634, conversions: 134 },
  { date: "2024-01-15", leads: 723, conversions: 156 },
]

const chartConfig = {
  leads: {
    label: "Leads",
    color: "hsl(var(--chart-1))",
  },
  conversions: {
    label: "Conversions",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("30d")

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>AI Performance Analytics</CardTitle>
        <CardDescription>
          Lead generation and conversion tracking over time
        </CardDescription>
        <CardAction>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40" aria-label="Select time range">
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
              <SelectItem value="90d" className="rounded-lg">
                Last 90 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillLeads" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-leads)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-leads)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillConversions" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-conversions)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-conversions)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="conversions"
              type="natural"
              fill="url(#fillConversions)"
              stroke="var(--color-conversions)"
              stackId="a"
            />
            <Area
              dataKey="leads"
              type="natural"
              fill="url(#fillLeads)"
              stroke="var(--color-leads)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
