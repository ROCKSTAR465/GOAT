import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, Phone, Calendar } from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";

const leadData = {
  totalLeads: 152,
  qualificationRate: 78,
  closeRate: 23,
  pipeline: [
    { status: "New", count: 45 },
    { status: "Verified", count: 35 },
    { status: "Shortlist", count: 25 },
    { status: "Pitch", count: 20 },
    { status: "Closed", count: 12 },
  ],
  leadSources: [
    { name: "Mastermind", count: 45 },
    { name: "Media", count: 62 },
    { name: "Kenneth Alphy", count: 25 },
    { name: "Alfred Joshua", count: 20 },
  ],
  scheduledCalls: [
    { time: "10:00 AM", client: "Innovate Inc." },
    { time: "11:30 AM", client: "Quantum Solutions" },
    { time: "2:00 PM", client: "Apex Enterprises" },
  ],
};

export function LeadIntakeAndSales() {
  return (
    <Card className="relative">
      <BorderBeam />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Lead Intake & Sales
        </CardTitle>
        <CardDescription>
          Monthly overview of lead generation and sales pipeline.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Leads (This Month)</CardDescription>
              <CardTitle className="text-4xl">{leadData.totalLeads}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {leadData.leadSources.map(source => (
                  <div key={source.name} className="flex justify-between">
                    <span>{source.name}</span>
                    <span>{source.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Qualification Rate</CardDescription>
              <CardTitle className="text-4xl">{leadData.qualificationRate}%</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={leadData.qualificationRate} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Close Rate</CardDescription>
              <CardTitle className="text-4xl">{leadData.closeRate}%</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={leadData.closeRate} />
            </CardContent>
          </Card>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">Pipeline Status</h4>
          <div className="flex items-center justify-between space-x-2 text-xs text-muted-foreground">
            {leadData.pipeline.map((stage, index) => (
              <>
                <div key={stage.status} className="text-center">
                  <Badge variant="outline">{stage.status}</Badge>
                  <p className="font-semibold text-lg text-foreground">{stage.count}</p>
                </div>
                {index < leadData.pipeline.length - 1 && <div className="flex-1 h-px bg-border" />}
              </>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Scheduled Calls (Today)
          </h4>
          <div className="space-y-2">
            {leadData.scheduledCalls.map(call => (
              <div key={call.time} className="flex items-center justify-between p-2 rounded-lg bg-secondary">
                <span className="text-sm">{call.time} - {call.client}</span>
                <Phone className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
            <p className="text-xs text-muted-foreground text-center pt-1">
              Placeholder for Google Calendar API
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
