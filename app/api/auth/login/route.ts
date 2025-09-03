import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || 'your-secret-key-min-32-characters-long'
);

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { code: 400, message: 'ID token is required' },
        { status: 400 }
      );
    }

    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Get user data from Firestore
    const userDoc = await adminDb.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return NextResponse.json(
        { code: 404, message: 'User not found' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    const userRole = userData?.role || 'employee';

    // Create JWT token
    const token = await new SignJWT({ 
      userId, 
      email: decodedToken.email,
      role: userRole 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Log login history
    await adminDb.collection('users').doc(userId).collection('login_history').add({
      device: request.headers.get('user-agent') || 'Unknown',
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Unknown',
      timestamp: FieldValue.serverTimestamp(),
      status: 'success',
    });

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: decodedToken.email,
        name: userData?.name,
        role: userRole,
        designation: userData?.designation,
      },
      redirectUrl: userRole === 'executive' ? '/dashboard/executive' : '/dashboard/employee',
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { code: 401, message: error.message || 'Authentication failed' },
      { status: 401 }
    );
  }
}
