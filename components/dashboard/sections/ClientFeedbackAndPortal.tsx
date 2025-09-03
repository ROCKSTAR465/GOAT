import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, CheckCircle, Smile } from "lucide-react";

const feedbackData = {
  pendingApprovals: [
    { project: "Product Demo Video", client: "Quantum Solutions" },
    { project: "Testimonial Ad", client: "Innovate Inc." },
  ],
  revisionRequests: [
    { time: "2 hours ago", request: "Change background music at 0:45.", project: "Product Demo" },
    { time: "1 day ago", request: "Update logo to new version.", project: "Testimonial Ad" },
  ],
  satisfactionScore: 88,
};

export function ClientFeedbackAndPortal() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Client Feedback & Portal
        </CardTitle>
        <CardDescription>
          Manage client approvals and feedback.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2"><CheckCircle className="h-4 w-4"/>Pending Approvals</h4>
                <div className="space-y-2">
                    {feedbackData.pendingApprovals.map(item => (
                        <div key={item.project} className="p-3 rounded-lg bg-secondary">
                            <p className="font-semibold text-sm">{item.project}</p>
                            <p className="text-xs text-muted-foreground">{item.client}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2"><Smile className="h-4 w-4"/>Client Satisfaction</h4>
                <div className="flex-1 flex items-center justify-center p-4 bg-secondary rounded-lg">
                    <div className="relative h-24 w-24">
                        <svg className="h-full w-full" viewBox="0 0 36 36">
                            <path
                            className="text-border"
                            d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            />
                            <path
                            className="text-primary"
                            d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeDasharray={`${feedbackData.satisfactionScore}, 100`}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold">{feedbackData.satisfactionScore}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">Timestamped Revision Requests</h4>
          <div className="space-y-2">
            {feedbackData.revisionRequests.map(item => (
              <div key={item.request} className="p-3 rounded-lg bg-secondary">
                <div className="flex justify-between items-center">
                    <p className="text-sm">{item.request}</p>
                    <Badge variant="outline">{item.time}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{item.project}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
