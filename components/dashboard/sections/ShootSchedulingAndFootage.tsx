import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Video, Tag } from "lucide-react";

const scheduleData = {
  upcomingShoots: [
    { date: "2024-09-15", title: "Client Testimonial" },
    { date: "2024-09-18", title: "Product Demo" },
    { date: "2024-09-22", title: "Behind the Scenes" },
  ],
  shootStatus: [
    { name: "Scheduled", active: true },
    { name: "In Progress", active: true },
    { name: "Footage Uploaded", active: false },
    { name: "Editing Started", active: false },
  ],
  taggedClips: [
    { tag: "B-Roll", count: 142 },
    { tag: "Interview", count: 68 },
    { tag: "Product Shot", count: 210 },
    { tag: "Testimonial", count: 45 },
  ],
};

export function ShootSchedulingAndFootage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Shoot Scheduling & Footage
        </CardTitle>
        <CardDescription>
          Manage upcoming shoots and access footage library.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-2">Upcoming Shoots</h4>
          <div className="p-4 rounded-lg bg-secondary h-32 flex items-center justify-center">
            <p className="text-muted-foreground">Calendar View Placeholder</p>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">Shoot Status Tracker</h4>
          <div className="flex items-center space-x-2">
            {scheduleData.shootStatus.map((status, index) => (
              <>
                <div key={status.name} className={`text-center ${status.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                  <Badge variant={status.active ? "default" : "outline"}>{status.name}</Badge>
                </div>
                {index < scheduleData.shootStatus.length - 1 && <div className={`flex-1 h-1 ${status.active ? 'bg-primary' : 'bg-border'}`} />}
              </>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Tag className="h-4 w-4" />
            AI-Tagged Clips Library
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {scheduleData.taggedClips.map(clip => (
              <div key={clip.tag} className="p-3 rounded-lg bg-secondary text-center">
                <p className="text-sm font-semibold">{clip.tag}</p>
                <p className="text-xs text-muted-foreground">{clip.count} clips</p>
              </div>
            ))}
          </div>
           <p className="text-xs text-muted-foreground text-center pt-2">
              Placeholder for Premiere Pro Integration
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
