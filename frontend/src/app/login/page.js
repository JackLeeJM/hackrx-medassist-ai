'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const TEST_CREDENTIALS = {
  'nurse@hospital.com': { password: '111111', role: 'nurse', name: 'Nurse Johnson' },
  'doctor@hospital.com': { password: '111111', role: 'doctor', name: 'Dr. Smith' }
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const user = TEST_CREDENTIALS[email]
    
    if (!user || user.password !== password) {
      setError('Invalid email or password')
      setLoading(false)
      return
    }

    // Store user data in localStorage for session management
    localStorage.setItem('user', JSON.stringify({
      email,
      role: user.role,
      name: user.name
    }))

    // Redirect to dashboard
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            MedAssist AI
          </CardTitle>
          <p className="text-muted-foreground">Sign in to your account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="text-destructive text-sm text-center">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-foreground mb-3">Test Accounts:</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>
                <strong>Doctor:</strong> doctor@hospital.com / 111111
              </div>
              <div>
                <strong>Nurse:</strong> nurse@hospital.com / 111111
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}