import { NextRequest, NextResponse } from 'next/server';
import { LeadService, FirestoreService, NotificationService } from '@/lib/services/firestore';
import { Lead } from '@/lib/types/models';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    let leads: Lead[];

    if (status === 'new') {
      leads = await LeadService.getNewLeads();
    } else if (status) {
      leads = await FirestoreService.getMany<Lead>('leads', [
        { field: 'status', operator: '==', value: status } as any,
      ]);
    } else {
      leads = await FirestoreService.getMany<Lead>('leads');
    }

    return NextResponse.json({ success: true, data: leads });
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { code: 500, message: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const leadData = await request.json();

    if (!leadData.client_name || !leadData.contact_email) {
      return NextResponse.json(
        { code: 400, message: 'Client name and email are required' },
        { status: 400 }
      );
    }

    const leadId = await LeadService.createLead({
      ...leadData,
      status: leadData.status || 'new',
    });

    // Notify executives about new lead
    const executives = await FirestoreService.getMany('users', [
      { field: 'role', operator: '==', value: 'executive' } as any,
    ]);

    for (const exec of executives) {
      await NotificationService.createNotification(exec.id, {
        type: 'lead',
        title: 'New Lead',
        message: `New lead from ${leadData.client_name}`,
        actionUrl: `/dashboard/executive/leads-management`,
      });
    }

    const newLead = await FirestoreService.getById<Lead>('leads', leadId);

    return NextResponse.json({ 
      success: true, 
      data: newLead,
      message: 'Lead created successfully' 
    });
  } catch (error: any) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { code: 500, message: 'Failed to create lead' },
      { status: 500 }
    );
  }
}
