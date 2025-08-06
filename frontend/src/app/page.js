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

// Import data and utilities
import { mockDashboardData, findPatientById, animateStats } from '@/lib/data'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    totalPatients: 0,
    newAdmissions: 0,
    pendingDischarge: 0,
    tasksAutomated: 0
  })
  const [prepStates, setPrepStates] = useState({})

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

    // Animate stats on component mount for doctors
    const interval = animateStats(mockDashboardData.stats, setStats)
    return () => clearInterval(interval)
  }, [])

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
    const patient = mockDashboardData.criticalPatients.find(p => p.name === patientName)
    if (patient) {
      // Find the patient ID from the main patient list
      const fullPatient = findPatientById(patient.name) || { id: 'P001' } // fallback
      router.push(`/patient-details?id=${fullPatient.id}`)
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
      <div className="bg-gray-50 font-sans h-screen flex flex-col overflow-hidden">
        {/* Compact Header */}
        <div className="flex-shrink-0 bg-gray-900 text-white px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="font-bold">MedAssist AI</span>
            <span>{user.name} ({user.role})</span>
            <span className="text-green-400">{mockDashboardData.doctor.timeSaved} saved today</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleNotifications} className="px-2 py-1 bg-white/10 rounded text-xs">
              🔔 {3}
            </button>
            <button onClick={handleLogout} className="px-2 py-1 bg-red-600 rounded text-xs">
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col p-3">
          {/* Compact Search & Stats */}
          <div className="flex-shrink-0 mb-3">
            <div className="flex gap-3 items-center mb-2">
              <input
                type="text"
                placeholder="Search patients..."
                className="flex-1 text-xs px-3 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSearch(e.target.value);
                }}
              />
              <div className="flex gap-2 text-xs">
                <div className="px-2 py-1 bg-blue-600 text-white rounded text-center min-w-16">
                  <div className="font-bold">{stats.totalPatients}</div>
                  <div>Patients</div>
                </div>
                <div className="px-2 py-1 bg-green-600 text-white rounded text-center min-w-16">
                  <div className="font-bold">{stats.newAdmissions}</div>
                  <div>New</div>
                </div>
                <div className="px-2 py-1 bg-orange-600 text-white rounded text-center min-w-16">
                  <div className="font-bold">{stats.pendingDischarge}</div>
                  <div>Discharge</div>
                </div>
                <div className="px-2 py-1 bg-purple-600 text-white rounded text-center min-w-16">
                  <div className="font-bold">{stats.tasksAutomated}%</div>
                  <div>Auto</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="flex-1 grid grid-cols-4 gap-3 overflow-hidden">
            {/* Critical Patients - Compact */}
            <div className="col-span-2 bg-white rounded border overflow-hidden flex flex-col">
              <div className="px-3 py-2 bg-red-50 border-b text-xs font-semibold text-red-800">
                🚨 Critical Patients ({mockDashboardData.criticalPatients.length})
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {mockDashboardData.criticalPatients.map((patient, index) => (
                  <div key={index} className="flex items-center justify-between py-1 px-2 hover:bg-gray-50 cursor-pointer text-xs border-b border-gray-100 last:border-0"
                       onClick={() => handleViewPatient(patient.name)}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-red-600 rounded text-white text-xs flex items-center justify-center">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-gray-500">Room {patient.room} • {patient.condition}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-red-600 font-medium">{patient.severity}</div>
                      <div className="text-gray-500">{patient.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule - Compact */}
            <div className="col-span-1 bg-white rounded border overflow-hidden flex flex-col">
              <div className="px-3 py-2 bg-blue-50 border-b text-xs font-semibold text-blue-800">
                📅 Today's Schedule
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {mockDashboardData.schedule.map((appointment, index) => (
                  <div key={index} className="py-1 px-2 hover:bg-gray-50 text-xs border-b border-gray-100 last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{appointment.time}</span>
                      <span className={`px-1 py-0 rounded text-xs ${
                        prepStates[index] === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                        prepStates[index] === 'ready' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {prepStates[index] === 'preparing' ? 'Prep...' :
                         prepStates[index] === 'ready' ? 'Ready' : 'Pending'}
                      </span>
                    </div>
                    <div className="text-gray-600">{appointment.patient}</div>
                    <div className="text-gray-500">{appointment.type}</div>
                    <button 
                      onClick={() => handlePrepareVisit(appointment.patient, index)}
                      className="mt-1 px-2 py-0.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    >
                      Prepare
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity - Compact */}
            <div className="col-span-1 bg-white rounded border overflow-hidden flex flex-col">
              <div className="px-3 py-2 bg-green-50 border-b text-xs font-semibold text-green-800 flex justify-between">
                <span>📊 Recent Activity</span>
                <button onClick={handleViewAllActivity} className="text-blue-600 hover:underline">View All</button>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {mockDashboardData.recentActivity.map((activity, index) => (
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
