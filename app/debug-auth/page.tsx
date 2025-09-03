'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

export default function DebugAuthPage() {
  const [authState, setAuthState] = useState<any>(null);
  const [cookies, setCookies] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthState({
        isSignedIn: !!user,
        uid: user?.uid,
        email: user?.email,
        displayName: user?.displayName,
      });
    });

    // Get cookies
    setCookies(document.cookie);

    return () => unsubscribe();
  }, []);

  const testAPI = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      console.log('API Response:', data);
      alert(`API Response: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error('API Error:', error);
      alert(`API Error: ${error}`);
    }
  };

  const createSession = async () => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (idToken) {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        });
        const data = await response.json();
        console.log('Session Response:', data);
        alert(`Session created: ${JSON.stringify(data, null, 2)}`);
        // Refresh cookies
        setCookies(document.cookie);
      }
    } catch (error) {
      console.error('Session Error:', error);
      alert(`Session Error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Firebase Auth State:</h2>
          <pre className="text-sm">{JSON.stringify(authState, null, 2)}</pre>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Cookies:</h2>
          <pre className="text-sm">{cookies || 'No cookies found'}</pre>
        </div>

        <div className="space-x-4">
          <button 
            onClick={createSession}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Session
          </button>
          <button 
            onClick={testAPI}
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
          >
            Test API
          </button>
        </div>
      </div>
    </div>
  );
}
