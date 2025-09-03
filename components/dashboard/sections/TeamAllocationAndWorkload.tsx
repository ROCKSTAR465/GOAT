import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, AlertTriangle } from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";

const workloadData = {
  teams: [
    { name: "Del", workload: 85 },
    { name: "Centinals", workload: 60 },
    { name: "Alpha", workload: 95 },
  ],
  activeTasks: [
    { role: "Writers", count: 12 },
    { role: "Editors", count: 8 },
    { role: "Designers", count: 15 },
    { role: "Videographers", count: 5 },
  ],
  timeTracking: [
    { person: "Alex", task: "Script Writing", time: "3h 45m", overdue: false },
    { person: "Maria", task: "Video Editing", time: "7h 15m", overdue: true },
    { person: "David", task: "Thumbnail Design", time: "2h 30m", overdue: false },
  ],
};

const getWorkloadColor = (workload: number) => {
  if (workload > 90) return "bg-red-500/20 text-red-400 border-red-500/30";
  if (workload > 75) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  return "bg-green-500/20 text-green-400 border-green-500/30";
};

export function TeamAllocationAndWorkload() {
  return (
    <Card className="relative">
      <BorderBeam />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Team Allocation & Workload
        </CardTitle>
        <CardDescription>
          Real-time overview of team workload and task distribution.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-2">Workload Heatmap</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            {workloadData.teams.map(team => (
              <div key={team.name} className={`p-4 rounded-lg border ${getWorkloadColor(team.workload)}`}>
                <p className="font-semibold">{team.name}</p>
                <p className="text-2xl font-bold">{team.workload}%</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Active Tasks by Role</h4>
            <div className="space-y-2">
              {workloadData.activeTasks.map(role => (
                <div key={role.role} className="flex justify-between items-center p-2 rounded-lg bg-secondary">
                  <span className="text-sm">{role.role}</span>
                  <Badge variant="outline">{role.count} tasks</Badge>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time Tracking
            </h4>
            <div className="space-y-2">
              {workloadData.timeTracking.map(tracker => (
                <div key={tracker.person} className={`flex justify-between items-center p-2 rounded-lg ${tracker.overdue ? "bg-red-500/20" : "bg-secondary"}`}>
                  <div className="text-sm">
                    <p className="font-medium">{tracker.person}</p>
                    <p className="text-xs text-muted-foreground">{tracker.task}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {tracker.overdue && <AlertTriangle className="h-4 w-4 text-red-400" />}
                    <span className="text-sm font-semibold">{tracker.time}</span>
                  </div>
                </div>
              ))}
            </div>
             <p className="text-xs text-muted-foreground text-center pt-1">
              Placeholder for Time Tracking API
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
