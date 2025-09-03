import { NextRequest, NextResponse } from 'next/server';
import { ShootService, FirestoreService } from '@/lib/services/firestore';
import { Shoot } from '@/lib/types/models';
import { Timestamp } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const clientId = searchParams.get('clientId');
    const upcoming = searchParams.get('upcoming');

    let shoots: Shoot[];

    if (clientId) {
      shoots = await ShootService.getShootsByClient(clientId);
    } else if (upcoming === 'true') {
      shoots = await ShootService.getUpcomingShoots();
    } else {
      shoots = await FirestoreService.getMany<Shoot>('shoots');
    }

    return NextResponse.json({ success: true, data: shoots });
  } catch (error: any) {
    console.error('Error fetching shoots:', error);
    return NextResponse.json(
      { code: 500, message: 'Failed to fetch shoots' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const shootData = await request.json();

    if (!shootData.title || !shootData.date || !shootData.clientId) {
      return NextResponse.json(
        { code: 400, message: 'Title, date, and client are required' },
        { status: 400 }
      );
    }

    // Convert date string to Timestamp
    const shootDate = new Date(shootData.date);
    
    const shootId = await ShootService.createShoot({
      ...shootData,
      date: Timestamp.fromDate(shootDate),
      created_by: userId,
      status: shootData.status || 'scheduled',
    });

    const newShoot = await FirestoreService.getById<Shoot>('shoots', shootId);

    return NextResponse.json({ 
      success: true, 
      data: newShoot,
      message: 'Shoot scheduled successfully' 
    });
  } catch (error: any) {
    console.error('Error creating shoot:', error);
    return NextResponse.json(
      { code: 500, message: 'Failed to create shoot' },
      { status: 500 }
    );
  }
}
