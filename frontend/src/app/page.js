'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { GridCalendar } from '@/components/ui/grid-calendar'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'

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
    { name: "Siti Nuraini", room: "302A", condition: "Post-op complications", severity: "Critical", type: "inpatient" },
    { name: "Raj Kumar", room: "412B", condition: "Cardiac monitoring", severity: "Serious", type: "inpatient" },
    { name: "Ahmad Farid", room: "367C", condition: "Emergency admission", severity: "Critical", type: "inpatient" },
    { name: "Lim Mei Ling", room: "204B", condition: "Respiratory distress", severity: "Critical", type: "inpatient" },
    { name: "Tan Wei Ming", room: "315A", condition: "Sepsis protocol", severity: "Critical", type: "inpatient" },
    { name: "Priya Devi", room: "428C", condition: "Stroke monitoring", severity: "Serious", type: "inpatient" },
    { name: "Mohd Azman", room: "196D", condition: "Cardiac arrest recovery", severity: "Critical", type: "inpatient" },
    { name: "Wong Ai Ling", room: "351B", condition: "Multiple trauma", severity: "Critical", type: "inpatient" },
    { name: "Suresh Kumar", room: "289A", condition: "Pneumonia complications", severity: "Serious", type: "inpatient" },
    { name: "Nurul Huda", room: "403C", condition: "Diabetic ketoacidosis", severity: "Critical", type: "inpatient" },
    { name: "Lee Jun Wei", room: "267B", condition: "Post-surgical bleeding", severity: "Serious", type: "inpatient" },
    { name: "Kavitha Devi", room: "392A", condition: "Kidney failure", severity: "Critical", type: "inpatient" }
  ],
  schedule: [
    { time: "08:00", patient: "Siti Nuraini", type: "Post-op Round", room: "302A", status: "Completed" },
    { time: "09:30", patient: "Raj Kumar", type: "Cardiac Consult", room: "412B", status: "In Progress" },
    { time: "11:00", patient: "Lim Hui Fen", type: "Wound Check", room: "289D", status: "Pending" },
    { time: "14:00", patient: "Ahmad Farid", type: "Emergency Eval", room: "367C", status: "Pending" }
  ],
  recentActivity: [
    { icon: '💊', action: "Insulin dosage adjusted", patient: "Nurul Asyikin", time: "1h ago" },
    { icon: '📊', action: "HbA1c results reviewed", patient: "Mohd Hafiz", time: "2h ago" },
    { icon: '🩺', action: "Diabetes screening completed", patient: "Siti Hajar", time: "3h ago" },
    { icon: '📋', action: "Diet plan updated", patient: "Ahmad Farid", time: "4h ago" }
  ]
}

const mockDrAhmadData = {
  criticalPatients: [
    { name: "Ahmad Hafiz", room: "205B", condition: "Acute angle-closure glaucoma", severity: "Critical", type: "inpatient" },
    { name: "Lim Siew Chen", room: "208A", condition: "Retinal detachment", severity: "Critical", type: "inpatient" },
    { name: "Ravi Shankar", room: "210C", condition: "Corneal perforation", severity: "Serious", type: "inpatient" },
    { name: "Fatimah Zahra", room: "212A", condition: "Endophthalmitis", severity: "Critical", type: "inpatient" },
    { name: "Chua Jin Ming", room: "215B", condition: "Orbital cellulitis", severity: "Critical", type: "inpatient" },
    { name: "Chong Mei Yee", room: "218C", condition: "Traumatic globe rupture", severity: "Critical", type: "inpatient" },
    { name: "Mohd Rizal", room: "220A", condition: "Chemical burn injury", severity: "Serious", type: "inpatient" },
    { name: "Deepa Kumari", room: "222B", condition: "Severe uveitis", severity: "Serious", type: "inpatient" },
    { name: "Hassan Rahman", room: "224C", condition: "Optic neuritis", severity: "Serious", type: "inpatient" },
    { name: "Siti Khadijah", room: "226A", condition: "Retinal artery occlusion", severity: "Critical", type: "inpatient" },
    { name: "Tan Boon Hock", room: "228B", condition: "Vitreous hemorrhage", severity: "Serious", type: "inpatient" },
    { name: "Priya Nair", room: "230C", condition: "Acute retinal necrosis", severity: "Critical", type: "inpatient" }
  ],
  schedule: [
    { time: "09:00", patient: "Ahmad Rahman", type: "Diabetic Retinopathy - Laser Treatment", room: "205A", status: "Completed" },
    { time: "10:00", patient: "Ahmad Hafiz", type: "Glaucoma Surgery", room: "205B", status: "In Progress" },
    { time: "13:00", patient: "Sarirah Binti Ahmad", type: "Cataract Surgery", room: "OR-3", status: "Pending" },
    { time: "15:00", patient: "Ravi Shankar", type: "Diabetic Retinopathy Screening", room: "210C", status: "Pending" }
  ],
  recentActivity: [
    { icon: '👁️', action: "Glaucoma surgery completed", patient: "Ahmad Hafiz", time: "1h ago" },
    { icon: '💉', action: "Anti-VEGF injection administered", patient: "Nurul Asyikin", time: "2h ago" },
    { icon: '📊', action: "OCT scan reviewed", patient: "Fatimah Zahra", time: "3h ago" },
    { icon: '👁️', action: "Retinal assessment completed", patient: "Ravi Shankar", time: "4h ago" }
  ]
}

// Default to GP data for backward compatibility
const mockInpatientData = mockDrSitiData;

const mockOutpatientData = {
  criticalPatients: [
    { name: "Jamal Ibrahim", room: "Clinic A", condition: "Chest pain eval", severity: "Urgent", time: "30m ago", type: "outpatient" },
    { name: "Siti Hajar", room: "Clinic B", condition: "Hypertension crisis", severity: "Serious", time: "1h ago", type: "outpatient" }
  ],
  schedule: [
    { time: "08:00", patient: "Nurul Asyikin", type: "Diabetic Macular Edema - Follow-up", status: "Completed" },
    { time: "10:00", patient: "Muthu Krishnan", type: "New patient consult", status: "In Progress" },
    { time: "11:00", patient: "Lim Su Anne", type: "Annual physical", status: "Pending" },
    { time: "14:00", patient: "Mohd Hafiz", type: "Diabetes management", status: "Pending" },
    { time: "15:30", patient: "Siti Hajar", type: "BP follow-up", status: "Pending" }
  ],
  recentActivity: [
    { icon: '📋', action: "Consultation completed", patient: "Loh Xin Yi", time: "30m ago" },
    { icon: '🩺', action: "Lab ordered", patient: "Muthu Krishnan", time: "1h ago" },
    { icon: '💊', action: "Prescription sent", patient: "Lim Su Anne", time: "1.5h ago" },
    { icon: '📅', action: "Follow-up scheduled", patient: "Mohd Hafiz", time: "2h ago" }
  ]
}

// Mock data for inpatient and outpatient views
const mockInpatientData = {
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
  const [currentData, setCurrentData] = useState(mockInpatientData)
  const [selectedDate, setSelectedDate] = useState(new Date())
  
  // Generate dates for the week with consistent patient counts
  const generateWeekDates = () => {
    const today = new Date()
    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      weekDates.push(date)
    }
    return weekDates
  }
  const weekDates = generateWeekDates()
  
  // Generate consistent patient counts based on date
  const getConsistentPatientCounts = (date) => {
    const dateKey = date.toDateString()
    // Use date as seed for consistent random numbers
    const seed = date.getDate() + date.getMonth() * 31 + date.getFullYear() * 365
    const inpatientCount = ((seed * 7) % 15) + 8 // 8-22
    const outpatientCount = ((seed * 13) % 25) + 12 // 12-36
    return { inpatientCount, outpatientCount }
  }
  
  // Generate consistent appointment and round counts based on selected date
  const getDateSpecificCounts = (date) => {
    const seed = date.getDate() + date.getMonth() * 31 + date.getFullYear() * 365
    const appointmentCount = ((seed * 11) % 8) + 3 // 3-10
    const roundCount = ((seed * 17) % 6) + 2 // 2-7
    return { appointmentCount, roundCount }
  }
  
  const { appointmentCount, roundCount } = getDateSpecificCounts(selectedDate)

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

  const formatDate = (date) => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow'
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    }
  }
  
  // Format date for card titles
  const formatDateTitle = (date) => {
    const today = new Date()
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })
    }
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
          showSearch={true}
          onSearch={handleSearch}
          onLogout={handleLogout}
          onProfile={() => alert('Profile page - feature coming soon!')}
          userName={user.name}
          userEmail={user.email}
          notificationCount={3}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col p-3" style={{ backgroundColor: '#f8f6f0' }}>
          {/* Main Content Grid */}
          <div className="flex-1 grid grid-cols-3 gap-3 overflow-hidden">
            {/* Left Column - Critical Patients and Recent Activity Stacked */}
            <div className="col-span-1 flex flex-col gap-3 overflow-hidden">
              {/* Critical Patients */}
              <Card className="flex-1 overflow-hidden flex flex-col">
                <CardHeader className="px-3 py-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold" style={{color: '#1B4F72', fontSize: '16px'}}>Critical Inpatients</div>
                    <div className="font-bold" style={{color: '#2e86ab', fontSize: '36px'}}>{currentData.criticalPatients.length}</div>
                  </div>
                </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-2">
                {currentData.criticalPatients.map((patient, index) => (
                  <div key={index} className="py-1 px-2 hover:bg-gray-50 text-xs border-b border-gray-100 last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{patient.name}</span>
                      <span className={`px-1 py-0 rounded text-xs ${
                        patient.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                        patient.severity === 'Serious' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {patient.severity}
                      </span>
                    </div>
                    <div className="text-muted-foreground">{patient.condition}</div>
                    <div className="text-muted-foreground">Room {patient.room}</div>
                  </div>
                ))}
                </CardContent>
              </Card>
              
              {/* Recent Activity */}
              <Card className="flex-1 overflow-hidden flex flex-col">
                <CardHeader className="px-3 py-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold" style={{color: '#1B4F72', fontSize: '16px'}}>Recent Activity</div>
                    <div className="font-bold" style={{color: '#2e86ab', fontSize: '36px'}}>{[...currentData.recentActivity, ...mockOutpatientData.recentActivity].length}</div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-2">
                  {/* Show all activities */}
                  {[...currentData.recentActivity, ...mockOutpatientData.recentActivity].map((activity, index) => (
                    <div key={index} className="py-1 px-2 hover:bg-gray-50 text-xs border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-primary text-sm">{activity.icon}</span>
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

            {/* Schedule Sections - Date Filtered */}
            <div className="col-span-2 flex flex-col gap-3">
              {/* Combined Schedule Card with Date Row */}
              <Card className="flex-1 overflow-hidden flex flex-col">
                {/* Date Row Header */}
                <div className="px-3 pt-3 pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-2 overflow-x-auto flex-1">
                      {weekDates.map((date, index) => {
                        const isSelected = date.toDateString() === selectedDate.toDateString();
                        const { inpatientCount, outpatientCount } = getConsistentPatientCounts(date);
                        
                        return (
                          <button
                            key={index}
                            onClick={() => setSelectedDate(date)}
                            className={`flex-shrink-0 px-3 py-2 rounded-md text-center transition-colors ${
                              isSelected 
                                ? 'bg-primary text-primary-foreground' 
                                : 'text-muted-foreground hover:text-foreground hover:bg-opacity-20'
                            }`}
                            style={{
                              backgroundColor: isSelected ? undefined : 'transparent',
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelected) {
                                e.target.style.backgroundColor = 'rgba(46, 134, 171, 0.2)'
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) {
                                e.target.style.backgroundColor = 'transparent'
                              }
                            }}
                          >
                            <div className="text-xs font-medium">
                              {formatDate(date)}
                            </div>
                            <div className="text-xs mt-1 opacity-60">
                              {inpatientCount}ip • {outpatientCount}op
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <div className="ml-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <span className="text-sm">📅</span>
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="p-0">
                          <GridCalendar
                            selected={selectedDate}
                            onSelect={(date) => {
                              setSelectedDate(date);
                            }}
                            className="border-0"
                          />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
                
                {/* Date Display */}
                <div className="px-3 pt-3">
                  <div className="text-left">
                    <div className="font-bold" style={{color: '#1B4F72', fontSize: '24px'}}>
                      {formatDateTitle(selectedDate)}
                    </div>
                  </div>
                </div>
                
                {/* Schedule Content Grid */}
                <div className="flex-1 grid grid-cols-2 overflow-hidden">
                  {/* Today's Appointments */}
                  <div className="flex flex-col border-r">
                    <div className="px-3 py-2">
                      <div className="flex items-center justify-between">
                        <div className="font-bold" style={{color: '#1B4F72', fontSize: '16px'}}>Today&apos;s Appointments</div>
                        <div className="font-bold" style={{color: '#2e86ab', fontSize: '36px'}}>{appointmentCount}</div>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2">
                      {mockOutpatientData.schedule.slice(0, appointmentCount).map((appointment, index) => (
                        <div key={index} className="py-1 px-2 hover:bg-gray-50 cursor-pointer text-xs border-b border-gray-100 last:border-0"
                             onClick={() => handleViewPatient(appointment.patient)}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{appointment.time}</span>
                            <span className={`px-1 py-0 rounded text-xs ${
                              appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              appointment.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {appointment.status}
                            </span>
                          </div>
                          <div className="text-foreground">{appointment.patient}</div>
                          <div className="text-muted-foreground">{appointment.type}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Today's Rounds */}
                  <div className="flex flex-col">
                    <div className="px-3 py-2">
                      <div className="flex items-center justify-between">
                        <div className="font-bold" style={{color: '#1B4F72', fontSize: '16px'}}>Today&apos;s Rounds</div>
                        <div className="font-bold" style={{color: '#2e86ab', fontSize: '36px'}}>{roundCount}</div>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2">
                      {currentData.schedule.slice(0, roundCount).map((appointment, index) => (
                        <div key={index} className="py-1 px-2 hover:bg-gray-50 text-xs border-b border-gray-100 last:border-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{appointment.time}</span>
                            <span className={`px-1 py-0 rounded text-xs ${
                              appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              appointment.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {appointment.status}
                            </span>
                          </div>
                          <div className="text-foreground">{appointment.patient}</div>
                          <div className="text-muted-foreground">{appointment.type}</div>
                          <div className="text-muted-foreground text-xs">Room {appointment.room}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
