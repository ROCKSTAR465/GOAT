'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight, User, Briefcase, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WelcomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            ...userDoc.data(),
          });
        }
      } else {
        // No user logged in, redirect to login
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleContinue = async () => {
    if (!user) return;
    
    setRedirecting(true);
    
    try {
      // Get fresh ID token and call login API to set JWT cookie
      const idToken = await auth.currentUser?.getIdToken();
      
      if (idToken) {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken }),
        });

        if (response.ok) {
          const redirectPath = user.role === 'executive' 
            ? '/dashboard/executive' 
            : '/dashboard/employee';
          
          toast.success(`Welcome back, ${user.name}!`);
          router.push(redirectPath);
        } else {
          throw new Error('Failed to create session');
        }
      } else {
        throw new Error('No authentication token');
      }
    } catch (error) {
      console.error('Session creation error:', error);
      toast.error('Failed to create session. Please try logging in again.');
      await auth.signOut();
      router.push('/login');
    } finally {
      setRedirecting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-gray-300">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const features = user.role === 'executive' 
    ? [
        'Lead Management & Conversion Tracking',
        'Team Performance Analytics',
        'Revenue & Financial Dashboard',
        'Shoot & Editing Oversight',
        'Executive Notifications & Approvals',
      ]
    : [
        'Task Management & Tracking',
        'AI-Powered Content Studio',
        'Shoot Planning & Calendar',
        'Editing Workflow Management',
        'Real-time Notifications',
      ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">Welcome to GOAT Media</h1>
          <p className="text-gray-400 text-lg">Powered by SNR Automations</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/10 border-gray-700">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full w-20 h-20 flex items-center justify-center">
              {user.role === 'executive' ? (
                <Briefcase className="h-10 w-10 text-white" />
              ) : (
                <User className="h-10 w-10 text-white" />
              )}
            </div>
            <CardTitle className="text-3xl text-white">
              Hello, {user.name}!
            </CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              {user.designation} • {user.role === 'executive' ? 'Executive' : 'Employee'} Access
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Your Dashboard Features
              </h3>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="text-gray-300 flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-4 border border-blue-700/50">
              <p className="text-gray-200 text-sm">
                <span className="font-semibold text-white">Quick Tip:</span> Your dashboard is customized based on your role. 
                You'll have access to all the tools and features you need to excel in your position.
              </p>
            </div>

            <Button
              onClick={handleContinue}
              disabled={redirecting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg"
            >
              {redirecting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Redirecting to Dashboard...
                </>
              ) : (
                <>
                  Continue to {user.role === 'executive' ? 'Executive' : 'Employee'} Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>

            <div className="text-center">
              <Button
                variant="ghost"
                onClick={async () => {
                  await auth.signOut();
                  toast.success('Logged out successfully');
                  router.push('/login');
                }}
                className="text-gray-400 hover:text-white"
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>
            Need help? Check out the Help Centre in your dashboard or contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
