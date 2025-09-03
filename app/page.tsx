"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    if (isAuthenticated === 'true') {
      const userData = localStorage.getItem('user')
      if (userData) {
        try {
          const user = JSON.parse(userData)
          if (user.role === 'employee') {
            router.push('/dashboard/employee')
          } else if (user.role === 'executive') {
            router.push('/dashboard/executive')
          } else {
            // Fallback to login if role is unknown
            router.push('/login')
          }
        } catch (error) {
          console.error('Error parsing user data, redirecting to login:', error)
          router.push('/login')
        }
      } else {
        // If no user data, treat as unauthenticated
        router.push('/login')
      }
    } else {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
