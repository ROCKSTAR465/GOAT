import { TrendingDown, TrendingUp } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            $487,350
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <Badge variant="outline" className="text-green-600">
              <TrendingUp className="h-3 w-3" />
              +18.2%
            </Badge>
          </div>
          <div className="text-muted-foreground">
            Monthly revenue from AI automation
          </div>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardDescription>Active AI Bots</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            6
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <Badge variant="outline" className="text-green-600">
              <TrendingUp className="h-3 w-3" />
              All Online
            </Badge>
          </div>
          <div className="text-muted-foreground">
            All systems operational
          </div>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardDescription>Conversion Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            23.7%
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <Badge variant="outline" className="text-green-600">
              <TrendingUp className="h-3 w-3" />
              +2.3%
            </Badge>
          </div>
          <div className="text-muted-foreground">
            Lead to customer conversion
          </div>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardDescription>Processing Time</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            0.3s
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <Badge variant="outline" className="text-green-600">
              <TrendingDown className="h-3 w-3" />
              -45%
            </Badge>
          </div>
          <div className="text-muted-foreground">
            Average AI response time
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
