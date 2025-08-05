'use client'

import { useState, useEffect, useRef } from 'react'

const mockPatients = [
  { id: "P001", name: "Maria Rodriguez", room: "302", age: 67, condition: "Post-op complications", status: "critical" },
  { id: "P002", name: "James Wilson", room: "418", age: 45, condition: "Chest pain", status: "critical" },
  { id: "P003", name: "Emma Thompson", room: "205", age: 34, condition: "Follow-up", status: "stable" },
  { id: "P004", name: "Michael Chen", room: "301", age: 52, condition: "New patient", status: "stable" },
  { id: "P005", name: "Lisa Parker", room: "156", age: 28, condition: "Routine checkup", status: "stable" },
  { id: "P006", name: "David Brown", room: "223", age: 61, condition: "Diabetes management", status: "stable" },
  { id: "P007", name: "Sarah Johnson", room: "334", age: 39, condition: "Hypertension", status: "stable" },
  { id: "P008", name: "Robert Davis", room: "412", age: 55, condition: "Cardiac monitoring", status: "critical" },
  { id: "P009", name: "Jennifer Miller", room: "289", age: 42, condition: "Post-surgery", status: "stable" },
  { id: "P010", name: "William Garcia", room: "367", age: 33, condition: "Emergency admission", status: "critical" }
]

const mockData = {
  doctor: {
    name: "Dr. Sarah Johnson",
    timeSaved: "2h 15m"
  },
  stats: {
    totalPatients: 24,
    newAdmissions: 3,
    pendingDischarge: 5,
    tasksAutomated: 87
  },
  criticalPatients: [
    {
      id: 1,
      name: "Maria Rodriguez",
      room: "302",
      age: 67,
      condition: "Post-op complications",
      vitals: {
        bp: "180/110",
        hr: "125",
        alerts: ["BP", "HR"]
      }
    },
    {
      id: 2,
      name: "James Wilson",
      room: "418",
      age: 45,
      condition: "Chest pain, elevated troponin",
      vitals: {
        troponin: "5.2",
        hr: "88",
        alerts: ["Troponin"]
      }
    }
  ],
  schedule: [
    {
      time: "9:00 AM",
      patient: "Lisa Parker",
      type: "Routine checkup",
      status: "completed"
    },
    {
      time: "10:30 AM",
      patient: "Emma Thompson",
      type: "Follow-up consultation",
      status: "upcoming"
    },
    {
      time: "11:15 AM",
      patient: "Michael Chen",
      type: "New patient consultation",
      status: "upcoming"
    }
  ],
  recentActivity: [
    {
      type: "recording",
      action: "Recording summary generated",
      patient: "Maria Rodriguez",
      time: "15 minutes ago",
      icon: "fas fa-microphone"
    },
    {
      type: "chat",
      action: "AI Chat query",
      patient: "James Wilson's lab results",
      time: "32 minutes ago",
      icon: "fas fa-comments"
    },
    {
      type: "data",
      action: "Patient data synthesized",
      patient: "Emma Thompson",
      time: "1 hour ago",
      icon: "fas fa-database"
    }
  ]
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [filteredPatients, setFilteredPatients] = useState(mockPatients)
  const [notificationCount, setNotificationCount] = useState(3)
  const [stats, setStats] = useState({
    totalPatients: 0,
    newAdmissions: 0,
    pendingDischarge: 0,
    tasksAutomated: 0
  })
  const [prepStates, setPrepStates] = useState({})
  
  const searchRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    // Animate stats on component mount
    const animateStats = () => {
      const finalStats = mockData.stats
      const duration = 1000
      const steps = 20
      const stepDuration = duration / steps
      
      let currentStep = 0
      const interval = setInterval(() => {
        currentStep++
        const progress = currentStep / steps
        
        setStats({
          totalPatients: Math.floor(finalStats.totalPatients * progress),
          newAdmissions: Math.floor(finalStats.newAdmissions * progress),
          pendingDischarge: Math.floor(finalStats.pendingDischarge * progress),
          tasksAutomated: Math.floor(finalStats.tasksAutomated * progress)
        })
        
        if (currentStep >= steps) {
          clearInterval(interval)
          setStats(finalStats)
        }
      }, stepDuration)
    }

    animateStats()

    // Click outside handler
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target) &&
          dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPatients(mockPatients)
    } else {
      const filtered = mockPatients.filter(patient =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.condition.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredPatients(filtered)
    }
  }, [searchQuery])

  const handleSearchFocus = () => {
    setShowDropdown(true)
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setShowDropdown(true)
  }

  const handlePatientSelect = (patient) => {
    setSearchQuery(patient.name)
    setShowDropdown(false)
    // Navigate to patient details page
    window.location.href = `/patient-details?id=${patient.id}`
  }

  const handleViewPatient = (patientName) => {
    alert(`Opening detailed view for ${patientName}`)
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

  const handleNotifications = () => {
    const notifications = [
      "New lab results available for Maria Rodriguez",
      "Discharge summary pending for Room 205",
      "System maintenance scheduled for tonight"
    ]
    alert(`Notifications:\n${notifications.join('\n')}`)
  }

  const handleViewAll = () => {
    alert('Opening complete activity history...')
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log(`Searching for: ${searchQuery}`)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="bg-gray-50 font-sans min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white px-8 py-4 shadow-xl border-b border-gray-700">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold mb-1 animate-fade-in">
              <i className="fas fa-stethoscope text-gray-300 mr-2"></i>
              MedAssist AI
            </h1>
            <span className="text-white/90 text-sm">{mockData.doctor.name}</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-300">
              <i className="fas fa-clock text-green-400"></i>
              <span className="font-medium">{mockData.doctor.timeSaved} saved today</span>
            </div>
            <button 
              onClick={handleNotifications}
              className="relative bg-white/10 backdrop-blur-sm p-2 rounded-lg hover:bg-white/20 transition-all duration-300 group"
            >
              <i className="fas fa-bell group-hover:animate-bounce"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs px-2 py-1 rounded-full min-w-[18px] text-center animate-pulse">
                {notificationCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {/* Patient Search Bar */}
        <section className="mb-8">
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 backdrop-blur-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative" ref={searchRef}>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onKeyDown={handleKeyDown}
                  placeholder="Search patients by name, room number, or patient ID..." 
                  className="w-full px-4 py-3 pl-12 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none"
                />
                <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"></i>
                
                {/* Search Dropdown */}
                {showDropdown && (
                  <div 
                    ref={dropdownRef}
                    className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 max-h-96 overflow-y-auto"
                  >
                    <div className="p-2">
                      <div className="text-xs text-gray-500 px-3 py-2 font-medium">
                        {searchQuery ? `FOUND ${filteredPatients.length} PATIENT${filteredPatients.length !== 1 ? 'S' : ''}` : `ALL PATIENTS (${mockPatients.length})`}
                      </div>
                      {filteredPatients.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <i className="fas fa-search text-2xl mb-2"></i>
                          <p>No patients found matching &ldquo;{searchQuery}&rdquo;</p>
                        </div>
                      ) : (
                        filteredPatients.map((patient) => {
                          const statusColor = patient.status === 'critical' ? 'bg-gray-800' : 'bg-gray-500'
                          const statusIcon = patient.status === 'critical' ? 'fas fa-exclamation-triangle' : 'fas fa-user'
                          
                          return (
                            <div 
                              key={patient.id}
                              onClick={() => handlePatientSelect(patient)}
                              className="flex items-center gap-3 px-3 py-3 hover:bg-gray-50 rounded-lg cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              <div className={`w-10 h-10 ${statusColor} rounded-lg flex items-center justify-center text-white`}>
                                <i className={statusIcon}></i>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-gray-800">{patient.name}</h4>
                                  <span className="text-sm text-gray-500">Room {patient.room}</span>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                  <p className="text-sm text-gray-600">{patient.condition}</p>
                                  <span className="text-xs text-gray-500">Age {patient.age} • ID: {patient.id}</span>
                                </div>
                              </div>
                              <div className="text-gray-400">
                                <i className="fas fa-chevron-right"></i>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
              <button 
                onClick={handleSearch}
                className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium text-lg"
              >
                <i className="fas fa-search mr-2"></i>
                Search
              </button>
            </div>
          </div>
        </section>

        {/* Quick Stats Row */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-white">
                <i className="fas fa-users text-xl"></i>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{stats.totalPatients}</h3>
                <p className="text-gray-600 text-sm">Total Patients</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-white">
                <i className="fas fa-user-plus text-xl"></i>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{stats.newAdmissions}</h3>
                <p className="text-gray-600 text-sm">New Admissions</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center text-white">
                <i className="fas fa-sign-out-alt text-xl"></i>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{stats.pendingDischarge}</h3>
                <p className="text-gray-600 text-sm">Pending Discharge</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-500 rounded-lg flex items-center justify-center text-white">
                <i className="fas fa-robot text-xl"></i>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{stats.tasksAutomated}%</h3>
                <p className="text-gray-600 text-sm">Tasks Automated</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Critical Patients Alert */}
          <section className="lg:col-span-2 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 backdrop-blur-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                <i className="fas fa-exclamation-triangle text-gray-700 mr-2"></i>
                Critical Patients
              </h2>
              <span className="text-gray-600 text-sm font-medium">2 require immediate attention</span>
            </div>
            <div className="space-y-4">
              {mockData.criticalPatients.map((patient, index) => (
                <div key={patient.id} className="border border-gray-300 bg-gray-100 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">{patient.name}</h4>
                      <p className="text-gray-600 text-sm mb-2">Room {patient.room} • Age {patient.age}</p>
                      <span className="bg-gray-800 text-white px-2 py-1 rounded text-xs">{patient.condition}</span>
                    </div>
                    <div className="flex flex-col gap-1 mr-4">
                      {patient.vitals.bp && (
                        <span className="bg-gray-700 text-white px-2 py-1 rounded text-xs">BP: {patient.vitals.bp}</span>
                      )}
                      {patient.vitals.hr && (
                        <span className="bg-gray-700 text-white px-2 py-1 rounded text-xs">HR: {patient.vitals.hr}</span>
                      )}
                      {patient.vitals.troponin && (
                        <span className="bg-gray-700 text-white px-2 py-1 rounded text-xs">Troponin: {patient.vitals.troponin}</span>
                      )}
                    </div>
                    <button 
                      onClick={() => handleViewPatient(patient.name)}
                      className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      View Patient
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Today's Schedule */}
          <section className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 backdrop-blur-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                <i className="fas fa-calendar-alt text-gray-700 mr-2"></i>
                Today&apos;s Schedule
              </h2>
              <span className="text-gray-500 text-sm">Tuesday, March 14, 2024</span>
            </div>
            <div className="space-y-4">
              {mockData.schedule.map((appointment, index) => (
                <div 
                  key={index}
                  className={`${appointment.status === 'completed' ? 'bg-gray-100 opacity-70' : 'bg-gray-50'} border-l-4 ${appointment.status === 'completed' ? 'border-gray-400' : 'border-gray-700'} p-4 rounded-r-lg`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 mb-1">{appointment.time}</div>
                      <h4 className="font-medium text-gray-800">{appointment.patient}</h4>
                      <p className="text-gray-600 text-sm">{appointment.type}</p>
                    </div>
                    {appointment.status === 'completed' ? (
                      <span className="text-gray-600 font-medium text-sm">✓ Completed</span>
                    ) : (
                      <button 
                        onClick={() => handlePrepareVisit(appointment.patient, index)}
                        disabled={prepStates[index] === 'preparing'}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          prepStates[index] === 'ready' 
                            ? 'bg-green-600 text-white' 
                            : prepStates[index] === 'preparing'
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-gray-800 text-white hover:bg-gray-700'
                        }`}
                      >
                        {prepStates[index] === 'ready' ? '✓ Ready' : prepStates[index] === 'preparing' ? 'Preparing...' : 'AI Prep'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Recent Activity */}
          <section className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 backdrop-blur-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                <i className="fas fa-history text-gray-700 mr-2"></i>
                Recent Activity
              </h2>
              <button 
                onClick={handleViewAll}
                className="text-gray-700 hover:text-gray-600 text-sm font-medium"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {mockData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`w-10 h-10 ${
                    activity.type === 'recording' ? 'bg-gray-600' : 
                    activity.type === 'chat' ? 'bg-gray-700' : 'bg-gray-500'
                  } rounded-lg flex items-center justify-center text-white`}>
                    <i className={activity.icon}></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800">
                      <strong>{activity.action}</strong> for {activity.patient}
                    </p>
                    <span className="text-gray-500 text-sm">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}