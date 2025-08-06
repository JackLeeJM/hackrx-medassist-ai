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
      <div className="bg-gray-50 font-sans h-screen flex flex-col overflow-hidden">
        {/* Compact Header - Consistent with Doctor Dashboard */}
        <div className="flex-shrink-0 bg-gray-900 text-white px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="font-bold">MedAssist AI</span>
            <span>{user.name} ({user.role})</span>
            <span className="text-green-400">1h 30m saved today</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => alert('Notifications: New patient admission, Lab results ready')} className="px-2 py-1 bg-white/10 rounded text-xs">
              🔔 {2}
            </button>
            <button onClick={handleLogout} className="px-2 py-1 bg-red-600 rounded text-xs">
              Logout
            </button>
          </div>
        </div>

        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Compact Header */}
          <div className="bg-white border-b p-2 flex-shrink-0">
            <div className="flex items-center gap-2 text-xs">
              {/* Search */}
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                <input
                  placeholder="Search doctors, specialties, patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-7 pr-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                />
              </div>
              
              {/* Specialty Filter */}
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="all">All Specialties</option>
                {specialties.slice(1).map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>

              {/* Date Selector */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => navigateDate('prev')}
                  disabled={dates.findIndex(date => date.value === selectedDate) === 0}
                  className="p-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                
                <div className="flex gap-1">
                  {dates.map((date) => (
                    <button
                      key={date.value}
                      className={`px-2 py-1 text-xs rounded ${
                        selectedDate === date.value 
                          ? 'bg-blue-600 text-white' 
                          : 'border hover:bg-gray-50'
                      } ${date.isToday ? 'ring-1 ring-blue-400' : ''}`}
                      onClick={() => setSelectedDate(date.value)}
                    >
                      {date.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => navigateDate('next')}
                  disabled={dates.findIndex(date => date.value === selectedDate) === dates.length - 1}
                  className="p-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <span className="text-gray-500">({filteredDoctors.length} doctors)</span>
            </div>
          </div>

          {/* Three Column Layout */}
          <div className="flex-1 grid grid-cols-12 overflow-hidden">
            {/* Column 1: Doctor List */}
            <div className="col-span-3 border-r bg-gray-50 flex flex-col overflow-hidden">
              <div className="flex-shrink-0 px-2 py-1 border-b border-gray-200 bg-white">
                <h3 className="text-xs font-semibold">Doctors ({filteredDoctors.length})</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                <div className="space-y-1">
                  {filteredDoctors.map((doctorName) => {
                    const doctor = mockDoctorsSchedule[doctorName]
                    const daySchedule = doctor.schedules[selectedDate] || []
                    const isSelected = selectedDoctor === doctorName
                    
                    return (
                      <div
                        key={doctorName}
                        className={`p-2 rounded cursor-pointer transition-colors text-xs ${
                          isSelected ? 'bg-blue-100 border-blue-300 border' : 'bg-white hover:bg-gray-100 border'
                        }`}
                        onClick={() => handleDoctorSelect(doctorName)}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <div className="w-3 h-3 bg-blue-600 rounded-full flex-shrink-0"></div>
                          <span className="font-medium truncate">{doctorName}</span>
                        </div>
                        <div className="text-xs text-gray-600 mb-1">{doctor.specialty}</div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">{daySchedule.length} pts</span>
                          <span className="text-gray-400">{doctor.phone.slice(-4)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Column 2: Patient List for Selected Doctor */}
            <div className="col-span-4 border-r flex flex-col overflow-hidden">
              <div className="flex-shrink-0 px-2 py-1 border-b border-gray-200 bg-white">
                {selectedDoctor ? (
                  <h3 className="text-xs font-semibold truncate">
                    Patients - {selectedDoctor}
                  </h3>
                ) : (
                  <h3 className="text-xs font-semibold text-gray-400">
                    Select a Doctor
                  </h3>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {selectedDoctor ? (
                  <div className="space-y-1">
                    {(mockDoctorsSchedule[selectedDoctor]?.schedules[selectedDate] || []).map((appointment, index) => {
                      const isSelected = selectedPatient?.appointment === appointment
                      
                      return (
                        <div
                          key={index}
                          className={`p-2 border rounded cursor-pointer transition-colors text-xs ${
                            isSelected ? 'bg-green-50 border-green-300' : 'hover:bg-gray-50 border-gray-200'
                          }`}
                          onClick={() => handlePatientSelect(appointment.patient, appointment)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-500" />
                              <span className="font-medium">{appointment.time}</span>
                            </div>
                            <span className={`px-1 py-0 rounded text-xs ${
                              appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {appointment.status}
                            </span>
                          </div>
                          <div className="font-medium text-gray-900 mb-1">{appointment.patient}</div>
                          <div className="text-gray-600 mb-1">{appointment.condition}</div>
                          <div className="text-gray-500">Room: {appointment.room}</div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-center">
                    <div>
                      <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto mb-2"></div>
                      <div className="text-xs font-medium text-gray-900 mb-1">Select a Doctor</div>
                      <div className="text-xs text-gray-600">Choose from the list</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Column 3: Patient Details Overview */}
            <div className="col-span-5 flex flex-col overflow-hidden">
              <div className="flex-shrink-0 px-2 py-1 border-b border-gray-200 bg-white">
                {selectedPatient ? (
                  <h3 className="text-xs font-semibold">Patient Details</h3>
                ) : (
                  <h3 className="text-xs font-semibold text-gray-400">Select a Patient</h3>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-2 text-xs">
                {selectedPatient ? (
                  <div className="space-y-2">
                    {/* Patient Header - Inline */}
                    <div className="border-b pb-2">
                      <div className="font-semibold text-sm">{selectedPatient.appointment.patient}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span>👨‍⚕️ {selectedDoctor}</span>
                        <span>🕒 {selectedPatient.appointment.time}</span>
                        <span className={`px-1 py-0 rounded text-xs ${
                          selectedPatient.appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {selectedPatient.appointment.status}
                        </span>
                      </div>
                    </div>

                    {/* Appointment Info - Compact */}
                    <div className="border-b pb-2">
                      <div className="font-semibold mb-1">Appointment</div>
                      <div className="space-y-0.5">
                        <div><strong>Condition:</strong> {selectedPatient.appointment.condition}</div>
                        <div><strong>Room:</strong> {selectedPatient.appointment.room} • <strong>Date:</strong> {selectedDate}</div>
                      </div>
                    </div>
                    
                    {/* Patient Info - Compact */}
                    <div className="border-b pb-2">
                      <div className="font-semibold mb-1">Patient Info</div>
                      <div className="space-y-0.5">
                        <div><strong>ID:</strong> PT-{Math.floor(Math.random() * 10000)} • <strong>Age:</strong> {Math.floor(Math.random() * 50) + 25} • <strong>Gender:</strong> {Math.random() > 0.5 ? 'F' : 'M'}</div>
                        <div><strong>Contact:</strong> +1 (555) {Math.floor(Math.random() * 900) + 100}-{Math.floor(Math.random() * 9000) + 1000}</div>
                      </div>
                    </div>

                    {/* Medical History - Compact */}
                    <div className="border-b pb-2">
                      <div className="font-semibold mb-1">Medical History</div>
                      <div className="text-gray-600">
                        Previous visits, allergies, and medical notes would appear here. This section can contain detailed patient medical background.
                      </div>
                    </div>

                    {/* Quick Actions - Inline */}
                    <div className="border-b pb-2">
                      <div className="font-semibold mb-1">Actions</div>
                      <div className="flex gap-1">
                        <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                          Upload Docs
                        </button>
                        <button className="px-2 py-1 border rounded text-xs hover:bg-gray-50">
                          Edit Info
                        </button>
                        <button className="px-2 py-1 border rounded text-xs hover:bg-gray-50">
                          Full Profile
                        </button>
                      </div>
                    </div>

                    {/* Additional Info - Compact */}
                    <div className="space-y-1">
                      <div className="font-semibold">Recent Activity</div>
                      <div className="space-y-0.5">
                        <div className="flex justify-between">
                          <span>Vitals Check</span>
                          <span className="text-gray-500">2h ago</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Lab Results</span>
                          <span className="text-gray-500">4h ago</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Medication Admin</span>
                          <span className="text-gray-500">6h ago</span>
                        </div>
                      </div>
                    </div>

                    {/* Nurse Notes */}
                    <div>
                      <div className="font-semibold mb-1">Nurse Notes</div>
                      <textarea 
                        placeholder="Add nursing notes..."
                        className="w-full text-xs p-2 border rounded resize-none h-16 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-center">
                    <div>
                      <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto mb-2"></div>
                      <div className="text-xs font-medium text-gray-900 mb-1">Select a Patient</div>
                      <div className="text-xs text-gray-600">Choose a patient to see details</div>
                    </div>
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