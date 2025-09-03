import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clapperboard, Share2, UserCheck, Captions } from "lucide-react";

const postProductionData = {
  projects: [
    { name: "Client Testimonial", progress: 80 },
    { name: "Product Demo", progress: 45 },
    { name: "Behind the Scenes", progress: 20 },
  ],
  exportStatus: [
    { platform: "YT Shorts", status: "Complete" },
    { platform: "IG Reels", status: "In Progress" },
    { platform: "Facebook", status: "Pending" },
  ],
  approvalStatus: {
    drafts: 3,
    approved: 1,
    pending: 2,
  },
  automationSummary: {
    subtitles: "85% automated",
    branding: "98% automated",
  },
};

const getStatusVariant = (status: string) => {
  if (status === "Complete") return "default";
  if (status === "In Progress") return "secondary";
  return "outline";
};

export function PostProductionAndPublishing() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clapperboard className="h-5 w-5" />
          Post-Production & Publishing
        </CardTitle>
        <CardDescription>
          Track editing progress, exports, and approvals.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-2">Edit Progress</h4>
          <div className="space-y-3">
            {postProductionData.projects.map(project => (
              <div key={project.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{project.name}</span>
                  <span className="text-sm text-muted-foreground">{project.progress}%</span>
                </div>
                <Progress value={project.progress} />
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Multi-Platform Export
            </h4>
            <div className="space-y-2">
              {postProductionData.exportStatus.map(item => (
                <div key={item.platform} className="flex justify-between items-center p-2 rounded-lg bg-secondary">
                  <span className="text-sm">{item.platform}</span>
                  <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Draft Review & Approval
            </h4>
            <div className="p-3 rounded-lg bg-secondary space-y-2">
                <div className="flex justify-between text-sm"><span>Pending Client Approval</span><Badge>{postProductionData.approvalStatus.pending}</Badge></div>
                <div className="flex justify-between text-sm"><span>Approved</span><Badge variant="default">{postProductionData.approvalStatus.approved}</Badge></div>
            </div>
          </div>
        </div>
         <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Captions className="h-4 w-4" />
            Automation Summary
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <Card>
                <CardContent className="p-3 text-center">
                    <p className="text-sm font-medium">Subtitles</p>
                    <p className="text-lg font-bold">{postProductionData.automationSummary.subtitles}</p>
                </CardContent>
            </Card>
             <Card>
                <CardContent className="p-3 text-center">
                    <p className="text-sm font-medium">Branding</p>
                    <p className="text-lg font-bold">{postProductionData.automationSummary.branding}</p>
                </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
