// Shared mock data for the application

export const mockPatients = [
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
];

export const mockDashboardData = {
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
};

// Patient utility functions
export const findPatientById = (id) => {
  return mockPatients.find(patient => patient.id === id);
};

export const filterPatients = (query) => {
  if (!query.trim()) return mockPatients;
  
  const searchTerm = query.toLowerCase();
  return mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm) ||
    patient.room.toLowerCase().includes(searchTerm) ||
    patient.id.toLowerCase().includes(searchTerm) ||
    patient.condition.toLowerCase().includes(searchTerm)
  );
};

export const getPatientStatusVariant = (status) => {
  switch (status) {
    case 'critical':
      return 'destructive';
    case 'stable':
      return 'secondary';
    default:
      return 'outline';
  }
};

export const getPatientStatusColor = (status) => {
  switch (status) {
    case 'critical':
      return 'bg-red-600';
    case 'stable':
      return 'bg-green-600';
    default:
      return 'bg-gray-600';
  }
};

// Time formatting utilities
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const formatDateTime = (date = new Date()) => {
  return date.toLocaleString();
};

// Animation utilities
export const animateStats = (finalStats, setStats) => {
  const duration = 1000;
  const steps = 20;
  const stepDuration = duration / steps;
  
  let currentStep = 0;
  const interval = setInterval(() => {
    currentStep++;
    const progress = currentStep / steps;
    
    setStats({
      totalPatients: Math.floor(finalStats.totalPatients * progress),
      newAdmissions: Math.floor(finalStats.newAdmissions * progress),
      pendingDischarge: Math.floor(finalStats.pendingDischarge * progress),
      tasksAutomated: Math.floor(finalStats.tasksAutomated * progress)
    });
    
    if (currentStep >= steps) {
      clearInterval(interval);
      setStats(finalStats);
    }
  }, stepDuration);
  
  return interval;
};
