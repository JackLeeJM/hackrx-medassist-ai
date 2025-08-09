'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

const TEST_CREDENTIALS = {
  'nurse@hospital.com': { password: '111111', role: 'nurse', name: 'Nurse Johnson', specialty: null },
  'drsiti@hospital.com': { password: '111111', role: 'doctor', name: 'Dr. Siti', specialty: 'GP' },
  'drahmad@hospital.com': { password: '111111', role: 'doctor', name: 'Dr. Ahmad', specialty: 'Ophthalmologist' }
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const prefillCredentials = (testEmail, testPassword) => {
    setEmail(testEmail)
    setPassword(testPassword)
    setError('')
  }

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
      name: user.name,
      specialty: user.specialty
    }))

    // Redirect to dashboard
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f8f6f0' }}>
      <div className="w-full max-w-md">
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/mymia_verticallogo.svg"
                alt="MyMia Logo"
                width={300}
                height={180}
                className="max-w-full h-auto"
              />
            </div>
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
          </CardContent>
        </Card>

        <div className="mt-4">
          <h3 className="text-sm font-medium text-foreground mb-3">Test Accounts:</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                <strong>Dr. Siti (GP)</strong>
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs px-2 py-1 h-6"
                onClick={() => prefillCredentials('drsiti@hospital.com', '111111')}
              >
                Use
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                <strong>Dr. Ahmad (Ophthalmologist)</strong>
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs px-2 py-1 h-6"
                onClick={() => prefillCredentials('drahmad@hospital.com', '111111')}
              >
                Use
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                <strong>Nurse</strong>
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs px-2 py-1 h-6"
                onClick={() => prefillCredentials('nurse@hospital.com', '111111')}
              >
                Use
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}