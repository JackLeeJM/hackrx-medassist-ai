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
  const [stats, setStats] = useState({
    totalPatients: 0,
    newAdmissions: 0,
    pendingDischarge: 0,
    tasksAutomated: 0
  })
  const [prepStates, setPrepStates] = useState({})

  useEffect(() => {
    // Animate stats on component mount
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

  return (
    <ErrorBoundary>
      <div className="bg-gray-50 font-sans min-h-screen flex flex-col">
        {/* Header */}
        <Header
          onBack={handleBack}
          timeSaved={mockDashboardData.doctor.timeSaved}
          notificationCount={3}
          onNotifications={handleNotifications}
          title="MedAssist AI"
          subtitle={mockDashboardData.doctor.name}
          showBackButton={false}
        />

        {/* Main Dashboard Content */}
        <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {/* Patient Search Bar */}
        <section className="mb-8">
          <PatientSearchBar 
            onPatientSelect={handlePatientSelect}
            onSearch={handleSearch}
          />
        </section>

        {/* Quick Stats Row */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon="fas fa-users"
            value={stats.totalPatients}
            label="Total Patients"
            iconColor="bg-gray-800"
          />
          <StatCard 
            icon="fas fa-user-plus"
            value={stats.newAdmissions}
            label="New Admissions"
            iconColor="bg-gray-700"
          />
          <StatCard 
            icon="fas fa-sign-out-alt"
            value={stats.pendingDischarge}
            label="Pending Discharge"
            iconColor="bg-gray-600"
          />
          <StatCard 
            icon="fas fa-robot"
            value={`${stats.tasksAutomated}%`}
            label="Tasks Automated"
            iconColor="bg-gray-500"
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Critical Patients + Schedule */}
          <section className="lg:col-span-3 space-y-8">
            <CriticalPatientsSection
              criticalPatients={mockDashboardData.criticalPatients}
              onViewPatient={handleViewPatient}
            />

            <ScheduleSection
              schedule={mockDashboardData.schedule}
              prepStates={prepStates}
              onPrepareVisit={handlePrepareVisit}
            />
          </section>

          {/* Right Column - Recent Activity */}
          <section className="lg:col-span-1">
            <RecentActivitySection
              recentActivity={mockDashboardData.recentActivity}
              onViewAll={handleViewAllActivity}
            />
          </section>
        </div>
      </main>
      </div>
    </ErrorBoundary>
  )
}
