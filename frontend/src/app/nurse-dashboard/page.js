'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, ChevronLeft, ChevronRight, Clock, User, Phone, FileText } from 'lucide-react'
import { ErrorBoundary } from '@/components/ui/error-boundary'

// Static mock data for 30 doctors to avoid hydration mismatch
const mockDoctorsSchedule = {
  'Dr. John Smith': {
    specialty: 'Cardiology',
    phone: '+1 (555) 123-4567',
    schedules: {
      '2024-01-15': [
        { time: '09:00', patient: 'Mary Johnson', condition: 'Heart Checkup', room: '201A', status: 'confirmed' },
        { time: '10:30', patient: 'Robert Wilson', condition: 'Chest Pain', room: '201A', status: 'confirmed' },
        { time: '14:00', patient: 'Lisa Anderson', condition: 'Follow-up', room: '201A', status: 'pending' }
      ],
      '2024-01-16': [
        { time: '09:30', patient: 'David Brown', condition: 'ECG Review', room: '201A', status: 'confirmed' }
      ]
    }
  },
  'Dr. Sarah Williams': {
    specialty: 'Neurology',
    phone: '+1 (555) 234-5678',
    schedules: {
      '2024-01-15': [
        { time: '08:30', patient: 'Emma Davis', condition: 'Migraine Treatment', room: '302B', status: 'confirmed' },
        { time: '11:00', patient: 'Michael Rodriguez', condition: 'Seizure Management', room: '302B', status: 'confirmed' }
      ]
    }
  },
  'Dr. Emily Johnson': {
    specialty: 'Pediatrics',
    phone: '+1 (555) 345-6789',
    schedules: {
      '2024-01-15': [
        { time: '09:00', patient: 'Lucy Martinez', condition: 'Vaccination', room: '105C', status: 'confirmed' },
        { time: '10:00', patient: 'Oliver Garcia', condition: 'Growth Assessment', room: '105C', status: 'confirmed' }
      ]
    }
  },
  'Dr. Michael Brown': {
    specialty: 'Orthopedics',
    phone: '+1 (555) 456-7890',
    schedules: {
      '2024-01-15': [
        { time: '08:00', patient: 'James Taylor', condition: 'Knee Surgery Follow-up', room: '401D', status: 'confirmed' },
        { time: '14:30', patient: 'Amanda Clark', condition: 'Back Pain Assessment', room: '401D', status: 'pending' }
      ]
    }
  },
  'Dr. Jennifer Wilson': {
    specialty: 'Dermatology',
    phone: '+1 (555) 567-8901',
    schedules: {
      '2024-01-15': [
        { time: '10:00', patient: 'Sophie Lewis', condition: 'Skin Cancer Screening', room: '203E', status: 'confirmed' },
        { time: '15:00', patient: 'Thomas White', condition: 'Acne Treatment', room: '203E', status: 'confirmed' }
      ]
    }
  },
  'Dr. David Martinez': {
    specialty: 'Psychiatry',
    phone: '+1 (555) 678-9012',
    schedules: {
      '2024-01-15': [
        { time: '09:30', patient: 'Jessica Harris', condition: 'Therapy Session', room: '501F', status: 'confirmed' },
        { time: '11:30', patient: 'Christopher Lee', condition: 'Medication Review', room: '501F', status: 'confirmed' }
      ]
    }
  },
  'Dr. Lisa Thompson': {
    specialty: 'Oncology',
    phone: '+1 (555) 789-0123',
    schedules: {
      '2024-01-15': [
        { time: '08:30', patient: 'Daniel Moore', condition: 'Chemotherapy Follow-up', room: '601G', status: 'confirmed' },
        { time: '13:00', patient: 'Michelle Jackson', condition: 'Cancer Consultation', room: '601G', status: 'pending' }
      ]
    }
  },
  'Dr. Robert Anderson': {
    specialty: 'Gastroenterology',
    phone: '+1 (555) 890-1234',
    schedules: {
      '2024-01-15': [
        { time: '10:30', patient: 'Ashley Martin', condition: 'Endoscopy', room: '304H', status: 'confirmed' },
        { time: '15:30', patient: 'William Thompson', condition: 'IBS Treatment', room: '304H', status: 'confirmed' }
      ]
    }
  },
  'Dr. Amanda Garcia': {
    specialty: 'Pulmonology',
    phone: '+1 (555) 901-2345',
    schedules: {
      '2024-01-15': [
        { time: '09:00', patient: 'Matthew Wilson', condition: 'Lung Function Test', room: '405I', status: 'confirmed' },
        { time: '14:00', patient: 'Kimberly Davis', condition: 'Asthma Management', room: '405I', status: 'confirmed' }
      ]
    }
  },
  'Dr. Christopher Lopez': {
    specialty: 'Endocrinology',
    phone: '+1 (555) 012-3456',
    schedules: {
      '2024-01-15': [
        { time: '11:00', patient: 'Anthony Rodriguez', condition: 'Diabetes Management', room: '206J', status: 'confirmed' },
        { time: '16:00', patient: 'Lisa Hernandez', condition: 'Thyroid Check', room: '206J', status: 'pending' }
      ]
    }
  },
  'Dr. Mark Gonzalez': {
    specialty: 'Rheumatology',
    phone: '+1 (555) 123-4567',
    schedules: {
      '2024-01-15': [
        { time: '08:00', patient: 'Angela Miller', condition: 'Arthritis Treatment', room: '507K', status: 'confirmed' },
        { time: '13:30', patient: 'Donald Taylor', condition: 'Joint Pain Assessment', room: '507K', status: 'confirmed' }
      ]
    }
  },
  'Dr. Michelle Perez': {
    specialty: 'Urology',
    phone: '+1 (555) 234-5678',
    schedules: {
      '2024-01-15': [
        { time: '09:30', patient: 'Brenda Moore', condition: 'Kidney Stone Treatment', room: '408L', status: 'confirmed' },
        { time: '14:30', patient: 'Steven Jackson', condition: 'Prostate Exam', room: '408L', status: 'confirmed' }
      ]
    }
  },
  'Dr. Daniel White': {
    specialty: 'Ophthalmology',
    phone: '+1 (555) 345-6789',
    schedules: {
      '2024-01-15': [
        { time: '10:00', patient: 'Emma Martin', condition: 'Eye Exam', room: '209M', status: 'confirmed' },
        { time: '15:00', patient: 'Andrew Thompson', condition: 'Cataract Surgery Follow-up', room: '209M', status: 'pending' }
      ]
    }
  },
  'Dr. Olivia Harris': {
    specialty: 'ENT',
    phone: '+1 (555) 456-7890',
    schedules: {
      '2024-01-15': [
        { time: '08:30', patient: 'Brian Garcia', condition: 'Hearing Test', room: '310N', status: 'confirmed' },
        { time: '11:30', patient: 'Cynthia Martinez', condition: 'Sinus Treatment', room: '310N', status: 'confirmed' }
      ]
    }
  },
  'Dr. Brian Sanchez': {
    specialty: 'General Medicine',
    phone: '+1 (555) 567-8901',
    schedules: {
      '2024-01-15': [
        { time: '09:00', patient: 'Ashley Rodriguez', condition: 'Annual Physical', room: '111O', status: 'confirmed' },
        { time: '12:00', patient: 'William Lopez', condition: 'Health Screening', room: '111O', status: 'confirmed' }
      ]
    }
  }
}

export default function NurseDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [selectedDate, setSelectedDate] = useState('2024-01-15')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('all')
  const [filteredDoctors, setFilteredDoctors] = useState(Object.keys(mockDoctorsSchedule))
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedPatient, setSelectedPatient] = useState(null)

  // Generate date options (today + 6 days)
  const generateDates = () => {
    const dates = []
    const today = new Date('2024-01-15') // Mock today date
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        }),
        isToday: i === 0
      })
    }
    return dates
  }

  const [dates] = useState(generateDates())

  // Get unique specialties for filter
  const specialties = ['all', ...new Set(Object.values(mockDoctorsSchedule).map(doctor => doctor.specialty))]

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    
    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'nurse') {
      router.push('/')
      return
    }
    
    setUser(parsedUser)
  }, [router])

  useEffect(() => {
    // Filter doctors based on search term and specialty
    const filtered = Object.keys(mockDoctorsSchedule).filter(doctor => {
      const doctorData = mockDoctorsSchedule[doctor]
      
      // Filter by specialty first
      if (selectedSpecialty !== 'all' && doctorData.specialty !== selectedSpecialty) {
        return false
      }
      
      // If no search term, show all doctors of selected specialty
      if (!searchTerm.trim()) {
        return true
      }
      
      // Check doctor name and specialty
      if (doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctorData.specialty.toLowerCase().includes(searchTerm.toLowerCase())) {
        return true
      }
      
      // Check patient names in selected date's schedule
      const daySchedule = doctorData.schedules[selectedDate] || []
      return daySchedule.some(appointment => 
        appointment.patient.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
    setFilteredDoctors(filtered)
    
    // Auto-select first doctor if none selected or if selected doctor is filtered out
    if (!selectedDoctor || !filtered.includes(selectedDoctor)) {
      setSelectedDoctor(filtered[0] || null)
      setSelectedPatient(null)
    }
  }, [searchTerm, selectedDate, selectedSpecialty, selectedDoctor])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  const handleDoctorSelect = (doctorName) => {
    setSelectedDoctor(doctorName)
    setSelectedPatient(null)
  }

  const handlePatientSelect = (patient, appointment) => {
    setSelectedPatient({ ...patient, appointment })
  }

  const navigateDate = (direction) => {
    const currentIndex = dates.findIndex(date => date.value === selectedDate)
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1
    
    if (newIndex >= 0 && newIndex < dates.length) {
      setSelectedDate(dates[newIndex].value)
    }
  }

  if (!user) {
    return null
  }

  return (
    <ErrorBoundary>
      <div className="bg-gray-50 font-sans min-h-screen flex flex-col">
        <Header
          title="MedAssist AI - Nurse Portal"
          subtitle={`${user.name} (${user.role})`}
          showBackButton={false}
          onLogout={handleLogout}
          timeSaved="1h 30m"
          notificationCount={2}
          onNotifications={() => alert('Notifications: New patient admission, Lab results ready')}
        />

        <main className="flex-1 flex flex-col h-full">
          {/* Header with Search, Filter, and Date Selector */}
          <div className="bg-white border-b p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search doctors, specialties, or patient names..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Specialty Filter */}
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">All Specialties</option>
                {specialties.slice(1).map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>

              {/* Date Selector */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateDate('prev')}
                  disabled={dates.findIndex(date => date.value === selectedDate) === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="flex gap-1">
                  {dates.map((date) => (
                    <Button
                      key={date.value}
                      variant={selectedDate === date.value ? "default" : "outline"}
                      size="sm"
                      className={`min-w-fit px-3 ${date.isToday ? 'ring-2 ring-blue-500' : ''}`}
                      onClick={() => setSelectedDate(date.value)}
                    >
                      {date.label}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateDate('next')}
                  disabled={dates.findIndex(date => date.value === selectedDate) === dates.length - 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Three Column Layout */}
          <div className="flex-1 grid grid-cols-12 h-full">
            {/* Column 1: Doctor List */}
            <div className="col-span-3 border-r bg-gray-50 overflow-y-auto">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Doctors ({filteredDoctors.length})</h3>
                <div className="space-y-2">
                  {filteredDoctors.map((doctorName) => {
                    const doctor = mockDoctorsSchedule[doctorName]
                    const daySchedule = doctor.schedules[selectedDate] || []
                    const isSelected = selectedDoctor === doctorName
                    
                    return (
                      <div
                        key={doctorName}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-100 border-blue-300 border' : 'bg-white hover:bg-gray-100'
                        }`}
                        onClick={() => handleDoctorSelect(doctorName)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-sm">{doctorName}</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{doctor.specialty}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{daySchedule.length} patients</span>
                          <Badge variant="outline" className="text-xs">
                            {doctor.phone.slice(-4)}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Column 2: Patient List for Selected Doctor */}
            <div className="col-span-4 border-r overflow-y-auto">
              <div className="p-4">
                {selectedDoctor ? (
                  <>
                    <h3 className="text-lg font-semibold mb-4">
                      Patients - {selectedDoctor}
                    </h3>
                    <div className="space-y-2">
                      {(mockDoctorsSchedule[selectedDoctor]?.schedules[selectedDate] || []).map((appointment, index) => {
                        const isSelected = selectedPatient?.appointment === appointment
                        
                        return (
                          <div
                            key={index}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              isSelected ? 'bg-green-50 border-green-300' : 'hover:bg-gray-50'
                            }`}
                            onClick={() => handlePatientSelect(appointment.patient, appointment)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span className="font-medium text-sm">{appointment.time}</span>
                              </div>
                              <Badge 
                                variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {appointment.status}
                              </Badge>
                            </div>
                            <h4 className="font-medium text-gray-900 mb-1">{appointment.patient}</h4>
                            <p className="text-sm text-gray-600 mb-1">{appointment.condition}</p>
                            <p className="text-xs text-gray-500">Room: {appointment.room}</p>
                          </div>
                        )
                      })}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Doctor</h3>
                    <p className="text-gray-600">Choose a doctor from the list to see their patients</p>
                  </div>
                )}
              </div>
            </div>

            {/* Column 3: Patient Details Overview */}
            <div className="col-span-5 overflow-y-auto">
              <div className="p-4">
                {selectedPatient ? (
                  <>
                    <h3 className="text-lg font-semibold mb-4">Patient Details</h3>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-xl">{selectedPatient.appointment.patient}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>👨‍⚕️ {selectedDoctor}</span>
                          <span>🕒 {selectedPatient.appointment.time}</span>
                          <Badge variant={selectedPatient.appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                            {selectedPatient.appointment.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <h4 className="font-medium mb-2">Appointment Information</h4>
                          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                            <div><strong>Condition:</strong> {selectedPatient.appointment.condition}</div>
                            <div><strong>Room:</strong> {selectedPatient.appointment.room}</div>
                            <div><strong>Date:</strong> {selectedDate}</div>
                            <div><strong>Doctor:</strong> {selectedDoctor}</div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Patient Information</h4>
                          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                            <div><strong>Patient ID:</strong> PT-{Math.floor(Math.random() * 10000)}</div>
                            <div><strong>Age:</strong> {Math.floor(Math.random() * 50) + 25}</div>
                            <div><strong>Gender:</strong> {Math.random() > 0.5 ? 'Female' : 'Male'}</div>
                            <div><strong>Contact:</strong> +1 (555) {Math.floor(Math.random() * 900) + 100}-{Math.floor(Math.random() * 9000) + 1000}</div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Medical History</h4>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600">Previous visits, allergies, and medical notes would appear here.</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Actions</h4>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Upload Documents
                            </Button>
                            <Button size="sm" variant="outline">
                              Edit Information
                            </Button>
                            <Button size="sm">
                              View Full Profile
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Patient</h3>
                    <p className="text-gray-600">Choose a patient to see their details and medical information</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  )
}