'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Import components
import Header from '@/components/layout/Header'
import StatCard from '@/components/dashboard/StatCard'
import PatientSearchBar from '@/components/dashboard/PatientSearchBar'
import CriticalPatientsSection from '@/components/dashboard/CriticalPatientsSection'
import ScheduleSection from '@/components/dashboard/ScheduleSection'
import RecentActivitySection from '@/components/dashboard/RecentActivitySection'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'

// Import data and utilities
import { mockDashboardData, findPatientById, findPatientByName } from '@/lib/data'

// Mock data for different specialties
const mockDrSitiData = {
  criticalPatients: [
    { name: "Maria Rodriguez", room: "302A", condition: "Post-op complications", severity: "Critical", time: "2h ago", type: "inpatient" },
    { name: "Robert Davis", room: "412B", condition: "Cardiac monitoring", severity: "Serious", time: "4h ago", type: "inpatient" },
    { name: "William Garcia", room: "367C", condition: "Emergency admission", severity: "Critical", time: "1h ago", type: "inpatient" }
  ],
  schedule: [
    { time: "08:00", patient: "Maria Rodriguez", type: "Post-op Round", room: "302A" },
    { time: "09:30", patient: "Robert Davis", type: "Cardiac Consult", room: "412B" },
    { time: "11:00", patient: "Jennifer Miller", type: "Wound Check", room: "289D" },
    { time: "14:00", patient: "William Garcia", type: "Emergency Eval", room: "367C" }
  ],
  recentActivity: [
    { icon: "🏥", action: "Admitted patient", patient: "William Garcia", time: "1h ago" },
    { icon: "💊", action: "Medication adjusted", patient: "Maria Rodriguez", time: "2h ago" },
    { icon: "📊", action: "Lab results reviewed", patient: "Robert Davis", time: "3h ago" },
    { icon: "🔔", action: "Critical alert resolved", patient: "Jennifer Miller", time: "4h ago" }
  ]
}

const mockDrAhmadData = {
  criticalPatients: [
    { name: "Ahmed Hassan", room: "205B", condition: "Acute angle-closure glaucoma", severity: "Critical", time: "1h ago", type: "inpatient" },
    { name: "Linda Chen", room: "208A", condition: "Retinal detachment", severity: "Critical", time: "3h ago", type: "inpatient" },
    { name: "Omar Malik", room: "210C", condition: "Corneal perforation", severity: "Serious", time: "5h ago", type: "inpatient" }
  ],
  schedule: [
    { time: "08:00", patient: "Ahmed Hassan", type: "Emergency Surgery", room: "205B" },
    { time: "10:00", patient: "Linda Chen", type: "Vitrectomy", room: "208A" },
    { time: "13:00", patient: "Sarah Al-Zahra", type: "Cataract Surgery", room: "OR-3" },
    { time: "15:00", patient: "Omar Malik", type: "Corneal Repair", room: "210C" }
  ],
  recentActivity: [
    { icon: "👁️", action: "Emergency surgery completed", patient: "Ahmed Hassan", time: "1h ago" },
    { icon: "📊", action: "OCT scan reviewed", patient: "Linda Chen", time: "2h ago" },
    { icon: "💊", action: "IOP lowering drops prescribed", patient: "Fatima Al-Rashid", time: "3h ago" },
    { icon: "🔍", action: "Fundus photography ordered", patient: "Omar Malik", time: "4h ago" }
  ]
}

// Default to GP data for backward compatibility
const mockInpatientData = mockDrSitiData;

const mockOutpatientData = {
  criticalPatients: [
    { name: "James Wilson", room: "Clinic A", condition: "Chest pain eval", severity: "Urgent", time: "30m ago", type: "outpatient" },
    { name: "Sarah Johnson", room: "Clinic B", condition: "Hypertension crisis", severity: "Serious", time: "1h ago", type: "outpatient" }
  ],
  schedule: [
    { time: "09:00", patient: "Emma Thompson", type: "Follow-up visit", location: "Clinic A" },
    { time: "10:00", patient: "Michael Chen", type: "New patient consult", location: "Clinic B" },
    { time: "11:00", patient: "Lisa Parker", type: "Annual physical", location: "Clinic A" },
    { time: "14:00", patient: "David Brown", type: "Diabetes management", location: "Clinic C" },
    { time: "15:30", patient: "Sarah Johnson", type: "BP follow-up", location: "Clinic B" }
  ],
  recentActivity: [
    { icon: "📋", action: "Consultation completed", patient: "Emma Thompson", time: "30m ago" },
    { icon: "🧪", action: "Lab ordered", patient: "Michael Chen", time: "1h ago" },
    { icon: "💊", action: "Prescription sent", patient: "Lisa Parker", time: "1.5h ago" },
    { icon: "📞", action: "Follow-up scheduled", patient: "David Brown", time: "2h ago" }
  ]
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [prepStates, setPrepStates] = useState({})
  const [currentData, setCurrentData] = useState(mockInpatientData)

  useEffect(() => {
    // Check if user is authenticated
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // Redirect nurses to their specific dashboard
    if (parsedUser.role === 'nurse') {
      router.push('/nurse-dashboard')
      return
    }

    // Set appropriate data based on doctor's email
    if (parsedUser.email === 'drahmad@hospital.com') {
      setCurrentData(mockDrAhmadData)
    } else {
      setCurrentData(mockDrSitiData)
    }

    // No stats animation needed
  }, [router])

  const handlePatientSelect = (patient) => {
    router.push(`/patient-details?id=${patient.id}`)
  }

  const handleSearch = (query) => {
    const patient = findPatientById(query)
    if (patient) {
      router.push(`/patient-details?id=${patient.id}`)
    } else {
      alert(`No patient found matching "${query}"`)
    }
  }

  const handleViewPatient = (patientName) => {
    // Find the patient by name from the main patient list
    const fullPatient = findPatientByName(patientName)
    if (fullPatient) {
      router.push(`/patient-details?id=${fullPatient.id}`)
    } else {
      alert(`Patient ${patientName} not found in the system`)
    }
  }

  const handlePrepareVisit = (patientName, index) => {
    setPrepStates(prev => ({ ...prev, [index]: 'preparing' }))
    
    setTimeout(() => {
      setPrepStates(prev => ({ ...prev, [index]: 'ready' }))
      
      setTimeout(() => {
        setPrepStates(prev => ({ ...prev, [index]: null }))
      }, 2000)
    }, 1500)
  }

  const handleViewAllActivity = () => {
    alert('View all activity - feature coming soon!')
  }

  const handleNotifications = () => {
    const notifications = [
      "New lab results available for Maria Rodriguez",
      "Discharge summary pending for Room 205", 
      "System maintenance scheduled for tonight"
    ]
    alert(`Notifications:\n${notifications.join('\n')}`)
  }

  const handleBack = () => {
    router.push('/')
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <ErrorBoundary>
      <div className="bg-background text-foreground font-sans h-screen flex flex-col overflow-hidden">
        <Header
          showBackButton={false}
          onNotifications={handleNotifications}
          onLogout={handleLogout}
          onProfile={() => alert('Profile page - feature coming soon!')}
          userName={user.name}
          userEmail={user.email}
          notificationCount={3}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col p-3" style={{ backgroundColor: '#f9f9f9' }}>
          {/* Compact Search & Stats */}
          <div className="flex-shrink-0 mb-3">
            <div className="flex gap-3 items-center mb-2">
              <Input
                type="text"
                placeholder="Search patients..."
                className="flex-1 text-xs"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSearch(e.target.value);
                }}
              />
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="flex-1 grid grid-cols-4 gap-3 overflow-hidden">
            {/* Inpatient List - Critical Patients */}
            <Card className="col-span-1 overflow-hidden flex flex-col">
              <CardHeader className="px-3 py-2 bg-red-50 border-b text-xs font-semibold text-red-800">
                🏥 Critical Inpatients ({currentData.criticalPatients.length})
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-2">
                {currentData.criticalPatients.map((patient, index) => (
                  <div key={index} className="flex items-center justify-between py-1 px-2 hover:bg-gray-50 cursor-pointer text-xs border-b border-gray-100 last:border-0"
                       onClick={() => handleViewPatient(patient.name)}>
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded text-white text-xs flex items-center justify-center ${
                        patient.severity === 'Critical' ? 'bg-red-600' : 
                        patient.severity === 'Serious' ? 'bg-orange-600' : 'bg-yellow-600'
                      }`}>
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-muted-foreground">Room {patient.room} • {patient.condition}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${
                        patient.severity === 'Critical' ? 'text-red-600' : 
                        patient.severity === 'Serious' ? 'text-orange-600' : 'text-yellow-600'
                      }`}>{patient.severity}</div>
                      <div className="text-muted-foreground">{patient.time}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Outpatient Schedule */}
            <Card className="col-span-1 overflow-hidden flex flex-col">
              <CardHeader className="px-3 py-2 bg-blue-50 border-b text-xs font-semibold text-blue-800">
                🏢 Today&apos;s Appointments ({mockOutpatientData.schedule.length})
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-2">
                {mockOutpatientData.schedule.map((appointment, index) => (
                  <div key={index} className="py-1 px-2 hover:bg-gray-50 text-xs border-b border-gray-100 last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{appointment.time}</span>
                      <span className={`px-1 py-0 rounded text-xs ${
                        prepStates[`out_${index}`] === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                        prepStates[`out_${index}`] === 'ready' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {prepStates[`out_${index}`] === 'preparing' ? 'Prep...' :
                         prepStates[`out_${index}`] === 'ready' ? 'Ready' : 'Pending'}
                      </span>
                    </div>
                    <div className="text-foreground">{appointment.patient}</div>
                    <div className="text-muted-foreground">{appointment.type}</div>
                    <div className="text-muted-foreground text-xs">{appointment.location}</div>
                    <Button 
                      onClick={() => handlePrepareVisit(appointment.patient, `out_${index}`)}
                      size="sm"
                      className="mt-1 text-xs"
                    >
                      Prepare
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Inpatient Rounds Schedule */}
            <Card className="col-span-1 overflow-hidden flex flex-col">
              <CardHeader className="px-3 py-2 bg-green-50 border-b text-xs font-semibold text-green-800">
                📅 Today's Rounds ({currentData.schedule.length})
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-2">
                {currentData.schedule.map((appointment, index) => (
                  <div key={index} className="py-1 px-2 hover:bg-gray-50 text-xs border-b border-gray-100 last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{appointment.time}</span>
                      <span className={`px-1 py-0 rounded text-xs ${
                        prepStates[`in_${index}`] === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                        prepStates[`in_${index}`] === 'ready' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {prepStates[`in_${index}`] === 'preparing' ? 'Prep...' :
                         prepStates[`in_${index}`] === 'ready' ? 'Ready' : 'Pending'}
                      </span>
                    </div>
                    <div className="text-gray-600">{appointment.patient}</div>
                    <div className="text-gray-500">{appointment.type}</div>
                    <div className="text-gray-400 text-xs">{appointment.room}</div>
                    <Button 
                      onClick={() => handlePrepareVisit(appointment.patient, `in_${index}`)}
                      size="sm"
                      variant="secondary"
                      className="mt-1 text-xs"
                    >
                      Prepare
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity - Compact */}
            <Card className="col-span-1 overflow-hidden flex flex-col">
              <CardHeader className="px-3 py-2 bg-purple-50 border-b text-xs font-semibold text-purple-800 flex justify-between">
                <span>📊 Recent Activity</span>
                <Button variant="link" onClick={handleViewAllActivity} className="text-xs p-0 h-auto">View All</Button>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-2">
                {/* Mix of inpatient and outpatient activities */}
                {[...currentData.recentActivity.slice(0, 2), ...mockOutpatientData.recentActivity.slice(0, 2)].map((activity, index) => (
                  <div key={index} className="py-1 px-2 hover:bg-gray-50 text-xs border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{activity.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{activity.action}</div>
                        <div className="text-gray-500">{activity.patient}</div>
                        <div className="text-gray-400">{activity.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
