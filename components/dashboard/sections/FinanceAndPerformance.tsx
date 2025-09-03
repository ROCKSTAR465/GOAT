"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { DollarSign, AlertTriangle, BarChart as BarChartIcon, Users } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const financeData = {
  profitability: [
    { client: "Innovate Inc.", profit: 90 },
    { client: "Quantum Solutions", profit: 75 },
    { client: "Apex Enterprises", profit: 40 },
    { client: "Zendesk", profit: 60 },
  ],
  overBudgetProjects: [
    { name: "Project Alpha", over: "15%" },
  ],
  budgetBurnRate: [
    { name: 'Q1', budget: 4000, burn: 2400 },
    { name: 'Q2', budget: 3000, burn: 1398 },
    { name: 'Q3', budget: 2000, burn: 9800 },
    { name: 'Q4', budget: 2780, burn: 3908 },
  ],
  revenueMargin: [
    { name: 'Jan', revenue: 4000, margin: 2400 },
    { name: 'Feb', revenue: 3000, margin: 1398 },
    { name: 'Mar', revenue: 2000, margin: 9800 },
    { name: 'Apr', revenue: 2780, margin: 3908 },
    { name: 'May', revenue: 1890, margin: 4800 },
    { name: 'Jun', revenue: 2390, margin: 3800 },
  ],
};

// Chart configurations for better tooltip styling
const budgetBurnConfig = {
  budget: {
    label: "Budget",
    color: "hsl(var(--chart-1))",
  },
  burn: {
    label: "Burn Rate",
    color: "hsl(var(--chart-2))",
  },
};

const revenueMarginConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  margin: {
    label: "Margin",
    color: "hsl(var(--chart-2))",
  },
};

const getProfitabilityColor = (profit: number) => {
  if (profit > 80) return "bg-green-500/20 text-green-400 border-green-500/30";
  if (profit > 50) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  return "bg-red-500/20 text-red-400 border-red-500/30";
};

export function FinanceAndPerformance() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Finance & Performance
        </CardTitle>
        <CardDescription>
          Track profitability, budgets, and revenue.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2"><Users className="h-4 w-4" />Client Profitability Heatmap</h4>
                <div className="grid grid-cols-2 gap-2">
                {financeData.profitability.map(item => (
                    <div key={item.client} className={`p-3 rounded-lg border text-sm ${getProfitabilityColor(item.profit)}`}>
                        {item.client}
                    </div>
                ))}
                </div>
            </div>
            <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2"><AlertTriangle className="h-4 w-4" />Over-Budget Alerts</h4>
                <div className="space-y-2">
                {financeData.overBudgetProjects.map(project => (
                    <Alert key={project.name} variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            {project.name} is {project.over} over budget.
                        </AlertDescription>
                    </Alert>
                ))}
                </div>
            </div>
        </div>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base"><BarChartIcon className="h-4 w-4" />Budget vs. Burn Rate</CardTitle>
                </CardHeader>
                <CardContent className="h-48">
                    <ChartContainer config={budgetBurnConfig}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={financeData.budgetBurnRate}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} />
                                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                                <ChartTooltip
                                    cursor={{fill: 'var(--color-secondary)'}}
                                    content={<ChartTooltipContent indicator="dot" />}
                                />
                                <Legend iconSize={10} />
                                <Bar dataKey="budget" fill="var(--color-budget)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="burn" fill="var(--color-burn)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base"><BarChartIcon className="h-4 w-4" />Monthly Revenue & Margin</CardTitle>
                </CardHeader>
                <CardContent className="h-48">
                    <ChartContainer config={revenueMarginConfig}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={financeData.revenueMargin}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} />
                                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                                <ChartTooltip
                                    cursor={{fill: 'var(--color-secondary)'}}
                                    content={<ChartTooltipContent indicator="line" />}
                                />
                                <Legend iconSize={10} />
                                <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={{r: 4}} />
                                <Line type="monotone" dataKey="margin" stroke="var(--color-margin)" strokeWidth={2} dot={{r: 4}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
      </CardContent>
    </Card>
  );
}
