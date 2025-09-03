import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, TrendingUp, Lightbulb } from "lucide-react";

const contentData = {
  scriptsGenerated: {
    awareness: 48,
    conversion: 22,
  },
  trendingTopics: [
    { platform: "YouTube", topic: "AI in 2025" },
    { platform: "Instagram", topic: "#TechLifestyle" },
    { platform: "TikTok", topic: "Viral Gadgets" },
  ],
  recommendations: [
    { type: "Hook", insight: "Start with a question to boost engagement by 15%." },
    { type: "CTA", insight: "Use 'Link in Bio' for a 10% higher click-through rate." },
  ],
};

export function ContentHub() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Content Hub
        </CardTitle>
        <CardDescription>
          Insights and performance of your content strategy.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Scripts Generated</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm">Awareness</span>
                        <Badge variant="default">{contentData.scriptsGenerated.awareness}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm">Conversion</span>
                        <Badge variant="secondary">{contentData.scriptsGenerated.conversion}</Badge>
                    </div>
                </CardContent>
            </Card>
            <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Trending Topics
                </h4>
                <div className="space-y-2">
                    {contentData.trendingTopics.map(item => (
                        <div key={item.platform} className="flex items-center justify-between p-2 rounded-lg bg-secondary">
                            <span className="text-sm font-semibold">{item.platform}</span>
                            <span className="text-sm text-muted-foreground">{item.topic}</span>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground text-center pt-1">
                    Sourced from YouTube/Instagram/TikTok APIs
                </p>
            </div>
        </div>
        <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Performance Recommendations
            </h4>
            <div className="space-y-2">
                {contentData.recommendations.map((rec, index) => (
                    <div key={index} className="p-3 rounded-lg bg-secondary">
                        <Badge>{rec.type}</Badge>
                        <p className="text-sm mt-1">{rec.insight}</p>
                    </div>
                ))}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
