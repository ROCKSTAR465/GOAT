import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Target, Users, FileText, DollarSign, CheckCircle, ExternalLink } from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";

const kpiData = {
  leads: 152,
  sales: 12,
  workload: "82%",
  contentProgress: "75%",
  budget: "On Track",
  approvals: 2,
};

const pipelineHealth = [
    { client: "Innovate Inc.", status: "Green" },
    { client: "Quantum Solutions", status: "Amber" },
    { client: "Apex Enterprises", status: "Red" },
];

const getHealthColor = (status: string) => {
    if (status === "Green") return "bg-green-500/20 text-green-400 border-green-500/30";
    if (status === "Amber") return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    return "bg-red-500/20 text-red-400 border-red-500/30";
};

export function ExecutiveCommandCenter() {
  return (
    <Card className="relative">
      <BorderBeam />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Executive Command Center
        </CardTitle>
        <CardDescription>
          High-level KPIs and client pipeline health at a glance.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
            <h4 className="text-sm font-medium mb-2">Bird&apos;s-Eye KPIs</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
                <Card>
                    <CardContent className="p-3">
                        <Target className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-xl font-bold">{kpiData.leads}</p>
                        <p className="text-xs text-muted-foreground">Leads</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardContent className="p-3">
                        <DollarSign className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-xl font-bold">{kpiData.sales}</p>
                        <p className="text-xs text-muted-foreground">Sales</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardContent className="p-3">
                        <Users className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-xl font-bold">{kpiData.workload}</p>
                        <p className="text-xs text-muted-foreground">Workload</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardContent className="p-3">
                        <FileText className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-xl font-bold">{kpiData.contentProgress}</p>
                        <p className="text-xs text-muted-foreground">Content</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardContent className="p-3">
                        <DollarSign className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-xl font-bold">{kpiData.budget}</p>
                        <p className="text-xs text-muted-foreground">Budget</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardContent className="p-3">
                        <CheckCircle className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-xl font-bold">{kpiData.approvals}</p>
                        <p className="text-xs text-muted-foreground">Approvals</p>
                    </CardContent>
                </Card>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <h4 className="text-sm font-medium mb-2">Client Pipeline Health</h4>
                <div className="space-y-2">
                {pipelineHealth.map(item => (
                    <div key={item.client} className={`flex items-center justify-between p-2 rounded-lg border ${getHealthColor(item.status)}`}>
                        <span className="font-semibold text-sm">{item.client}</span>
                        <Badge variant="outline" className={`border-current`}>{item.status}</Badge>
                    </div>
                ))}
                </div>
            </div>
            <div>
                <h4 className="text-sm font-medium mb-2">Quick Links</h4>
                <div className="flex flex-col space-y-2">
                    <Button variant="outline" className="justify-start gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Full Financial Report
                    </Button>
                     <Button variant="outline" className="justify-start gap-2">
                        <ExternalLink className="h-4 w-4" />
                        All Project Timelines
                    </Button>
                     <Button variant="outline" className="justify-start gap-2">
                        <ExternalLink className="h-4 w-4" />
                        View Alert Center
                    </Button>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
