'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, User, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState<'employee' | 'executive'>('employee');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      
      // Get ID token
      const idToken = await userCredential.user.getIdToken();

      // Send to backend to create session
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Successfully logged in!');
        router.push('/welcome');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // For demo purposes, show message about using existing accounts
      toast.error('Please use one of the demo accounts for testing');
      setError('Signup is disabled in demo mode. Please use the demo accounts provided.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (role: 'employee' | 'executive') => {
    if (role === 'employee') {
      setLoginEmail('alex.employee@goat.media');
      setLoginPassword('password123');
    } else {
      setLoginEmail('mia.exec@goat.media');
      setLoginPassword('password123');
    }
    toast.success(`Demo ${role} credentials filled!`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">GOAT Media</h1>
          <p className="text-gray-400">Powered by SNR Automations</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/10 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Welcome Back</CardTitle>
            <CardDescription className="text-gray-300">
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-200">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-200">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert className="bg-red-900/20 border-red-800">
                      <AlertDescription className="text-red-400">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>

                <div className="space-y-2 pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400 text-center mb-2">Demo Accounts</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fillDemoCredentials('employee')}
                      className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Employee
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fillDemoCredentials('executive')}
                      className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                    >
                      <Briefcase className="mr-2 h-4 w-4" />
                      Executive
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-gray-200">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        required
                        className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-gray-200">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                        className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-gray-200">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                        className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-200">Role</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={signupRole === 'employee' ? 'default' : 'outline'}
                        onClick={() => setSignupRole('employee')}
                        className={signupRole === 'employee' 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700'}
                      >
                        Employee
                      </Button>
                      <Button
                        type="button"
                        variant={signupRole === 'executive' ? 'default' : 'outline'}
                        onClick={() => setSignupRole('executive')}
                        className={signupRole === 'executive' 
                          ? 'bg-purple-600 hover:bg-purple-700' 
                          : 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700'}
                      >
                        Executive
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <Alert className="bg-red-900/20 border-red-800">
                      <AlertDescription className="text-red-400">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>

                <Alert className="bg-yellow-900/20 border-yellow-800">
                  <AlertDescription className="text-yellow-400 text-sm">
                    Note: In demo mode, please use the provided test accounts. 
                    Signup is disabled for security.
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="text-center text-sm text-gray-400">
            <p className="w-full">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
            <p className="text-sm text-gray-300 mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-gray-400">
              <p>Employee: alex.employee@goat.media / password123</p>
              <p>Executive: mia.exec@goat.media / password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}