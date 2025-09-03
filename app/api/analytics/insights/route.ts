import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService, InvoiceService, LeadService } from '@/lib/services/firestore';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const userId = request.headers.get('x-user-id');

    let data: any;

    switch (type) {
      case 'weekly-tasks':
        data = await AnalyticsService.getWeeklyTaskCompletion();
        break;

      case 'team-workload':
        const workloadMap = await AnalyticsService.getTeamWorkload();
        data = Array.from(workloadMap.entries()).map(([userId, count]) => ({
          userId,
          taskCount: count,
        }));
        break;

      case 'revenue-growth':
        const months = parseInt(searchParams.get('months') || '6');
        data = await AnalyticsService.getRevenueGrowth(months);
        break;

      case 'productivity-score':
        const targetUserId = searchParams.get('userId') || userId;
        if (!targetUserId) {
          return NextResponse.json(
            { code: 400, message: 'User ID is required for productivity score' },
            { status: 400 }
          );
        }
        const score = await AnalyticsService.getProductivityScore(targetUserId);
        data = { userId: targetUserId, score };
        break;

      case 'lead-conversion':
        const conversionRate = await LeadService.getLeadConversionRate();
        data = { conversionRate };
        break;

      case 'monthly-revenue':
        const month = searchParams.get('month') || new Date().toISOString().slice(0, 7);
        const revenue = await InvoiceService.getRevenueByMonth(month);
        data = { month, revenue };
        break;

      default:
        // Return all available insights
        const [weeklyTasks, revenueGrowth, leadConversion] = await Promise.all([
          AnalyticsService.getWeeklyTaskCompletion(),
          AnalyticsService.getRevenueGrowth(6),
          LeadService.getLeadConversionRate(),
        ]);

        data = {
          weeklyTasks,
          revenueGrowth,
          leadConversion,
        };
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { code: 500, message: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
