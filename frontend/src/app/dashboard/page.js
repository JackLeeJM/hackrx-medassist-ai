'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
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
import { mockDashboardData, findPatientById, findPatientByName, searchCombinedPatients, prefetchCombinedPatients, useCombinedPatients } from '@/lib/data'
import { patientAPI } from '@/lib/api'

// Function to generate critical patients from combined data
const generateCriticalPatients = (combinedPatients) => {
  if (!combinedPatients || combinedPatients.length === 0) {
    // Fallback to mock data if no combined patients available
    return [
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
    ];
  }

  // Filter out Nurul Asyikin and select critical/serious patients
  const filteredPatients = combinedPatients
    .filter(p => p.name && !p.name.toLowerCase().includes('nurul asyikin'))
    .filter(p => p.status === 'critical' || p.status === 'serious' || 
                 p.condition?.toLowerCase().includes('critical') ||
                 p.condition?.toLowerCase().includes('serious') ||
                 p.condition?.toLowerCase().includes('emergency'))
    .slice(0, 12)
    .map(p => ({
      name: p.name,
      room: p.room || `${Math.floor(Math.random() * 400) + 100}${['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]}`,
      condition: p.condition || 'Monitoring required',
      severity: p.status === 'critical' ? 'Critical' : 
                p.status === 'serious' ? 'Serious' : 
                'Critical',
      type: 'inpatient'
    }));

  // If we don't have enough critical patients, add some mock ones
  const mockCritical = [
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
  ];

  // Combine and ensure we have 12 patients
  const combined = [...filteredPatients];
  for (const mockPatient of mockCritical) {
    if (combined.length >= 12) break;
    if (!combined.some(p => p.name === mockPatient.name)) {
      combined.push(mockPatient);
    }
  }

  return combined.slice(0, 12);
};

// Mock data for different specialties
const mockDrSitiData = {
  criticalPatients: [],
  schedule: [
    { time: "08:00", patient: "Siti Nuraini", type: "Post-op Round", room: "302A", status: "Completed" },
    { time: "09:30", patient: "Raj Kumar", type: "Cardiac Consult", room: "412B", status: "In Progress" },
    { time: "11:00", patient: "Lim Hui Fen", type: "Wound Check", room: "289D", status: "Pending" },
    { time: "14:00", patient: "Ahmad Farid", type: "Emergency Eval", room: "367C", status: "Pending" }
  ],
  recentActivity: [
    { icon: '💊', action: "Insulin dosage adjusted", patient: "Ahmad Rahman", time: "1h ago" },
    { icon: '📊', action: "HbA1c results reviewed", patient: "Mohd Hafiz", time: "2h ago" },
    { icon: '🩺', action: "Diabetes screening completed", patient: "Siti Hajar", time: "3h ago" },
    { icon: '📋', action: "Diet plan updated", patient: "Ahmad Farid", time: "4h ago" }
  ]
}

const mockDrAhmadData = {
  criticalPatients: [],
  schedule: [
    { time: "09:00", patient: "Ahmad Rahman", type: "Diabetic Retinopathy - Laser Treatment", room: "205A", status: "Completed" },
    { time: "10:00", patient: "Ahmad Hafiz", type: "Glaucoma Surgery", room: "205B", status: "In Progress" },
    { time: "13:00", patient: "Sarirah Binti Ahmad", type: "Cataract Surgery", room: "OR-3", status: "Pending" },
    { time: "15:00", patient: "Ravi Shankar", type: "Diabetic Retinopathy Screening", room: "210C", status: "Pending" }
  ],
  recentActivity: [
    { icon: '👁️', action: "Glaucoma surgery completed", patient: "Ahmad Hafiz", time: "1h ago" },
    { icon: '💉', action: "Anti-VEGF injection administered", patient: "Lim Siew Chen", time: "2h ago" },
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
    { time: "08:00", patient: "Ahmad Rahman", type: "Diabetic Retinopathy - Follow-up", status: "Completed" },
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

export default function Dashboard() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [user, setUser] = useState(null)
  const [currentData, setCurrentData] = useState(mockInpatientData)
  const [selectedDate, setSelectedDate] = useState(new Date())
  
  // Use React Query to fetch combined patients
  const { data: combinedPatients, isLoading: isPatientsLoading } = useCombinedPatients()
  
  // Generate appointments from combined patients
  const generateAppointments = () => {
    if (!combinedPatients || combinedPatients.length === 0) {
      return mockOutpatientData.schedule
    }
    
    const times = ["08:00", "09:30", "10:00", "11:00", "14:00", "15:30", "16:00"]
    const appointmentTypes = [
      "Follow-up", "New Consult", "Annual Physical", "Lab Review", 
      "Diabetes Management", "BP Check", "Vaccination"
    ]
    const statuses = ["Completed", "In Progress", "Pending", "Pending", "Pending"]
    
    // Take up to 7 patients from combined data for appointments
    const appointmentPatients = combinedPatients.slice(0, 7)
    
    return appointmentPatients.map((patient, index) => ({
      time: times[index] || `${9 + index}:00`,
      patient: patient.name,
      type: appointmentTypes[index % appointmentTypes.length],
      status: statuses[Math.min(index, statuses.length - 1)],
      patientId: patient.id,
      source: patient.source
    }))
  }
  
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

    // Initial data setup will be updated when combined patients load

    // Prefetch combined patients data on initialization
    prefetchCombinedPatients(queryClient)
  }, [router, queryClient])

  // Update critical patients when combined data loads
  useEffect(() => {
    console.log('Combined patients in dashboard:', combinedPatients);
    console.log('User:', user);
    
    if (combinedPatients && combinedPatients.length > 0 && user) {
      const criticalPatients = generateCriticalPatients(combinedPatients);
      console.log('Generated critical patients:', criticalPatients);
      
      if (user.email === 'drahmad@hospital.com') {
        setCurrentData({
          ...mockDrAhmadData,
          criticalPatients: criticalPatients
        });
      } else {
        setCurrentData({
          ...mockDrSitiData,
          criticalPatients: criticalPatients
        });
      }
    }
  }, [combinedPatients, user])

  const handlePatientSelect = (patient) => {
    if (patient && patient.id) {
      router.push(`/patient-details?id=${patient.id}`)
    } else {
      console.error('Invalid patient selected:', patient)
      alert('Unable to view patient details. Patient ID is missing.')
    }
  }

  const handleSearch = async (query) => {
    try {
      // Search in combined patient data (API + mock) with React Query cache
      const searchResults = await searchCombinedPatients(query, queryClient)
      console.log(searchResults)
      
      if (searchResults && searchResults.length > 0) {
        // Find the first result with a valid ID
        const validPatient = searchResults.find(p => p && p.id)
        
        if (validPatient) {
          router.push(`/patient-details?id=${validPatient.id}`)
        } else {
          console.error('No valid patient found in search results:', searchResults)
          alert(`Found patients but no valid IDs for "${query}"`)
        }
      } else {
        alert(`No patient found matching "${query}"`)
      }
    } catch (error) {
      console.error('Search failed:', error)
      alert('Search failed. Please try again.')
    }
  }

  const handleViewPatient = async (patientName) => {
    try {
      // Search for patient by name using combined data with React Query cache
      const searchResults = await searchCombinedPatients(patientName, queryClient)
      
      // Find exact match first
      const exactMatch = searchResults.find(p => p.name.toLowerCase() === patientName.toLowerCase())
      if (exactMatch) {
        router.push(`/patient-details?id=${exactMatch.id}`)
        return
      }
      
      // If no exact match, use first partial match
      if (searchResults && searchResults.length > 0) {
        router.push(`/patient-details?id=${searchResults[0].id}`)
      } else {
        alert(`Patient ${patientName} not found in the system`)
      }
    } catch (error) {
      console.error('Failed to find patient:', error)
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
                      {generateAppointments().slice(0, appointmentCount).map((appointment, index) => {
                        // Replace Nurul Asyikin if present in appointments
                        const displayAppointment = appointment.patient === "Nurul Asyikin" 
                          ? { ...appointment, patient: "Ahmad Rahman" }
                          : appointment;
                        return (
                        <div key={index} className="py-1 px-2 hover:bg-gray-50 cursor-pointer text-xs border-b border-gray-100 last:border-0"
                             onClick={() => handleViewPatient(displayAppointment.patient)}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{displayAppointment.time}</span>
                            <span className={`px-1 py-0 rounded text-xs ${
                              displayAppointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              displayAppointment.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {displayAppointment.status}
                            </span>
                          </div>
                          <div className="text-foreground">{displayAppointment.patient}</div>
                          <div className="text-muted-foreground">{displayAppointment.type}</div>
                        </div>
                        );
                      })}
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