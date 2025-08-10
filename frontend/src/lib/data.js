// Shared mock data for the application

export const mockPatients = [
  // General Medicine patients - Dr. Siti
  { id: "P001", name: "Siti Nuraini", room: "302A", age: 67, condition: "Post-op complications", status: "critical", vitals: { bp: "180/110", hr: "125", temp: "38.2", o2sat: "92%" } },
  { id: "P002", name: "Raj Kumar", room: "412B", age: 55, condition: "Cardiac monitoring", status: "serious", vitals: { bp: "160/95", hr: "88", temp: "37.0", o2sat: "95%" } },
  { id: "P003", name: "Ahmad Farid", room: "367C", age: 33, condition: "Emergency admission", status: "critical", vitals: { bp: "90/50", hr: "135", temp: "39.1", o2sat: "89%" } },
  { id: "P004", name: "Lim Mei Ling", room: "204B", age: 45, condition: "Respiratory distress", status: "critical", vitals: { bp: "170/100", hr: "115", temp: "38.8", o2sat: "90%" } },
  { id: "P005", name: "Tan Wei Ming", room: "315A", age: 38, condition: "Sepsis protocol", status: "critical", vitals: { bp: "85/45", hr: "145", temp: "40.2", o2sat: "88%" } },
  { id: "P006", name: "Priya Devi", room: "428C", age: 52, condition: "Stroke monitoring", status: "serious", vitals: { bp: "190/110", hr: "78", temp: "37.5", o2sat: "96%" } },
  { id: "P007", name: "Mohd Azman", room: "196D", age: 61, condition: "Cardiac arrest recovery", status: "critical", vitals: { bp: "100/60", hr: "65", temp: "36.8", o2sat: "94%" } },
  { id: "P008", name: "Wong Ai Ling", room: "351B", age: 29, condition: "Multiple trauma", status: "critical", vitals: { bp: "110/70", hr: "125", temp: "37.9", o2sat: "91%" } },
  { id: "P009", name: "Suresh Kumar", room: "289A", age: 58, condition: "Pneumonia complications", status: "serious", vitals: { bp: "145/85", hr: "95", temp: "38.5", o2sat: "93%" } },
  { id: "P010", name: "Nurul Huda", room: "403C", age: 42, condition: "Diabetic ketoacidosis", status: "critical", vitals: { bp: "95/55", hr: "120", temp: "37.8", o2sat: "92%" } },
  { id: "P011", name: "Lee Jun Wei", room: "267B", age: 35, condition: "Post-surgical bleeding", status: "serious", vitals: { bp: "105/65", hr: "110", temp: "37.2", o2sat: "95%" } },
  { id: "P012", name: "Kavitha Devi", room: "392A", age: 67, condition: "Kidney failure", status: "critical", vitals: { bp: "180/105", hr: "85", temp: "37.6", o2sat: "94%" } },
  { id: "P013", name: "Lim Hui Fen", room: "289D", age: 42, condition: "Wound Check", status: "stable", vitals: { bp: "125/80", hr: "75", temp: "37.0", o2sat: "98%" } },
  
  // Shared patient - Nurul Asyikin (both Dr Siti and Dr Ahmad)
  { id: "P020", name: "Nurul Asyikin", room: "205B", age: 59, condition: "Diabetes Type 2 with Diabetic Macular Edema", status: "serious", vitals: { bp: "135/85", hr: "78", temp: "36.9", o2sat: "98%" } },
  { id: "P021", name: "Muthu Krishnan", room: "301", age: 52, condition: "New patient consult", status: "stable", vitals: { bp: "130/85", hr: "78", temp: "36.9", o2sat: "99%" } },
  { id: "P022", name: "Lim Su Anne", room: "156", age: 28, condition: "Annual physical", status: "stable", vitals: { bp: "115/75", hr: "68", temp: "36.8", o2sat: "99%" } },
  { id: "P023", name: "Mohd Hafiz", room: "223", age: 61, condition: "Diabetes management", status: "stable", vitals: { bp: "140/90", hr: "82", temp: "37.0", o2sat: "97%" } },
  { id: "P024", name: "Siti Hajar", room: "334", age: 39, condition: "BP follow-up", status: "stable", vitals: { bp: "135/88", hr: "76", temp: "36.9", o2sat: "98%" } },
  { id: "P025", name: "Jamal Ibrahim", room: "Clinic A", age: 45, condition: "Chest pain eval", status: "urgent", vitals: { bp: "150/95", hr: "95", temp: "37.2", o2sat: "96%" } },
  
  // Ophthalmology patients - Dr. Ahmad
  { id: "P031", name: "Lim Siew Chen", room: "208A", age: 58, condition: "Retinal detachment", status: "critical", vitals: { bp: "145/90", hr: "82", temp: "37.0", o2sat: "97%" } },
  { id: "P032", name: "Ravi Shankar", room: "210C", age: 72, condition: "Corneal perforation", status: "serious", vitals: { bp: "155/95", hr: "75", temp: "37.1", o2sat: "95%" } },
  { id: "P033", name: "Fatimah Zahra", room: "212A", age: 49, condition: "Endophthalmitis", status: "critical", vitals: { bp: "160/95", hr: "90", temp: "38.1", o2sat: "94%" } },
  { id: "P034", name: "Chua Jin Ming", room: "215B", age: 41, condition: "Orbital cellulitis", status: "critical", vitals: { bp: "140/85", hr: "95", temp: "38.5", o2sat: "93%" } },
  { id: "P035", name: "Chong Mei Yee", room: "218C", age: 33, condition: "Traumatic globe rupture", status: "critical", vitals: { bp: "120/75", hr: "105", temp: "37.8", o2sat: "94%" } },
  { id: "P036", name: "Mohd Rizal", room: "220A", age: 55, condition: "Chemical burn injury", status: "serious", vitals: { bp: "135/80", hr: "85", temp: "37.4", o2sat: "96%" } },
  { id: "P037", name: "Deepa Kumari", room: "222B", age: 47, condition: "Severe uveitis", status: "serious", vitals: { bp: "125/75", hr: "78", temp: "37.0", o2sat: "97%" } },
  { id: "P038", name: "Hassan Rahman", room: "224C", age: 39, condition: "Optic neuritis", status: "serious", vitals: { bp: "130/85", hr: "80", temp: "37.2", o2sat: "98%" } },
  { id: "P039", name: "Siti Khadijah", room: "226A", age: 44, condition: "Retinal artery occlusion", status: "critical", vitals: { bp: "165/100", hr: "92", temp: "37.5", o2sat: "95%" } },
  { id: "P040", name: "Tan Boon Hock", room: "228B", age: 63, condition: "Vitreous hemorrhage", status: "serious", vitals: { bp: "150/90", hr: "77", temp: "37.1", o2sat: "96%" } },
  { id: "P041", name: "Priya Nair", room: "230C", age: 36, condition: "Acute retinal necrosis", status: "critical", vitals: { bp: "140/88", hr: "88", temp: "37.9", o2sat: "94%" } },
  { id: "P042", name: "Sarirah Binti Ahmad", room: "OR-3", age: 68, condition: "Cataract Surgery", status: "stable", vitals: { bp: "135/80", hr: "72", temp: "36.8", o2sat: "98%" } }
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

// Import API functions
import { patientAPI } from './api.js';
import { useQuery } from '@tanstack/react-query';

// Query keys for React Query
export const queryKeys = {
  patients: ['patients'],
  combinedPatients: ['combinedPatients'],
  patientDetails: (id) => ['patientDetails', id],
};

// Function to fetch and combine all patients from API and mock data
export const fetchCombinedPatients = async () => {
  try {
    // Fetch patients from API
    const apiPatients = await patientAPI.getPatients(100);
    
    // Mark API patients with source and filter out invalid ones
    const markedApiPatients = apiPatients
      .filter(patient => patient && patient.id) // Only include patients with valid IDs
      .map(patient => ({
        ...patient,
        source: 'api'
      }));
    
    // Mark mock patients with source
    const markedMockPatients = mockPatients.map(patient => ({
      ...patient,
      source: 'mock'
    }));
    
    // Combine API and mock patients, removing duplicates by ID
    const patientMap = new Map();
    
    // Add API patients first (they have priority)
    markedApiPatients.forEach(patient => {
      patientMap.set(patient.id, patient);
    });
    
    // Add mock patients (only if not already present)
    markedMockPatients.forEach(patient => {
      if (!patientMap.has(patient.id)) {
        patientMap.set(patient.id, patient);
      }
    });
    
    return Array.from(patientMap.values());
  } catch (error) {
    console.error('Failed to fetch patients from API, falling back to mock data:', error);
    
    // On API error, fall back to mock data only
    const markedMockPatients = mockPatients.map(patient => ({
      ...patient,
      source: 'mock'
    }));
    
    return markedMockPatients;
  }
};

// React Query hook to use combined patients data
export const useCombinedPatients = () => {
  return useQuery({
    queryKey: queryKeys.combinedPatients,
    queryFn: fetchCombinedPatients,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

// Prefetch combined patients data (for initialization)
export const prefetchCombinedPatients = async (queryClient) => {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.combinedPatients,
    queryFn: fetchCombinedPatients,
    staleTime: 5 * 60 * 1000,
  });
};

// Get all combined patients (for non-hook usage)
export const getAllCombinedPatients = async () => {
  return fetchCombinedPatients();
};

// Function to search in combined patient data with React Query integration
export const searchCombinedPatients = async (query, queryClient = null) => {
  // Try to get from cache first if queryClient is provided
  let allPatients;
  
  if (queryClient) {
    const cachedData = queryClient.getQueryData(queryKeys.combinedPatients);
    if (cachedData) {
      allPatients = cachedData;
    } else {
      // Fetch and cache if not available
      allPatients = await queryClient.fetchQuery({
        queryKey: queryKeys.combinedPatients,
        queryFn: fetchCombinedPatients,
      });
    }
  } else {
    // Fallback to direct fetch if no queryClient
    allPatients = await fetchCombinedPatients();
  }
  
  if (!query || query.trim() === '') {
    return allPatients.slice(0, 20); // Return first 20 if no query
  }
  
  const searchTerm = query.toLowerCase().trim();
  const normalized = searchTerm.replace(/[^a-z0-9]/gi, '');
  
  // Helper to compute IC
  const computeIC = (p) => {
    try {
      const birthYear = 2024 - p.age;
      const yy = String(birthYear).slice(-2);
      const mm = p.id === 'P020' ? '03' : '03';
      const dd = p.id === 'P020' ? '12' : '10';
      const kl = p.id === 'P020' ? '10' : '10';
      const serial = p.id === 'P020' ? '9876' : '9012';
      return `${yy}${mm}${dd}-${kl}-${serial}`;
    } catch {
      return '';
    }
  };
  
  return allPatients.filter(patient => {
    // Ensure patient object exists and has a valid ID
    if (!patient || !patient.id) return false;
    
    // Safe property checks with null coalescing
    const nameMatch = patient.name ? patient.name.toLowerCase().includes(searchTerm) : false;
    const idMatch = patient.id ? patient.id.toLowerCase().includes(searchTerm) : false;
    const roomMatch = patient.room ? String(patient.room).toLowerCase().includes(searchTerm) : false;
    const ageMatch = patient.age ? String(patient.age) === searchTerm : false;
    const conditionMatch = patient.condition ? patient.condition.toLowerCase().includes(searchTerm) : false;
    
    // IC matching for mock patients
    if (patient.source === 'mock') {
      const ic = computeIC(patient);
      const icNormalized = ic ? ic.replace(/[^a-z0-9]/gi, '').toLowerCase() : '';
      const icMatch = ic ? (ic.toLowerCase().includes(searchTerm) || icNormalized.includes(normalized)) : false;
      return nameMatch || idMatch || roomMatch || ageMatch || conditionMatch || icMatch;
    }
    
    return nameMatch || idMatch || roomMatch || ageMatch || conditionMatch;
  });
};

// Patient utility functions
export const findPatientById = async (id, queryClient = null) => {
  try {
    let allPatients;
    
    // Try to get from cache first if queryClient is provided
    if (queryClient) {
      const cachedData = queryClient.getQueryData(queryKeys.combinedPatients);
      if (cachedData) {
        allPatients = cachedData;
      } else {
        // Fetch and cache if not available
        allPatients = await queryClient.fetchQuery({
          queryKey: queryKeys.combinedPatients,
          queryFn: fetchCombinedPatients,
        });
      }
    } else {
      // Fallback to direct fetch if no queryClient
      allPatients = await fetchCombinedPatients();
    }
    
    const patient = allPatients.find(p => p.id === id);
    
    if (patient) {
      return patient;
    }
    
    // If not found, try fetching fresh from API
    const apiPatients = await patientAPI.getPatients(100);
    return apiPatients.find(p => p.id === id) || mockPatients.find(p => p.id === id);
  } catch (error) {
    console.error('Failed to find patient by ID:', error);
    // Fall back to mock data
    return mockPatients.find(patient => patient.id === id);
  }
};

export const findPatientByName = (name) => {
  if (!name) return null;
  return mockPatients.find(patient => patient.name.toLowerCase() === name.toLowerCase());
};

export const filterPatients = async (query, queryClient = null) => {
  let allPatients;
  
  // Try to get from cache first if queryClient is provided
  if (queryClient) {
    const cachedData = queryClient.getQueryData(queryKeys.combinedPatients);
    if (cachedData) {
      allPatients = cachedData;
    } else {
      // Fetch and cache if not available
      allPatients = await queryClient.fetchQuery({
        queryKey: queryKeys.combinedPatients,
        queryFn: fetchCombinedPatients,
      });
    }
  } else {
    // Fallback to direct fetch if no queryClient
    allPatients = await fetchCombinedPatients();
  }
  
  if (!query.trim()) {
    return allPatients;
  }
  
  const searchTerm = query.toLowerCase();
  // Helper to compute IC used elsewhere in the app header
  const computeIC = (p) => {
    try {
      const birthYear = 2024 - p.age;
      const yy = String(birthYear).slice(-2);
      const mm = p.id === 'P020' ? '03' : '03';
      const dd = p.id === 'P020' ? '12' : '10';
      const kl = p.id === 'P020' ? '10' : '10';
      const serial = p.id === 'P020' ? '9876' : '9012';
      return `${yy}${mm}${dd}-${kl}-${serial}`;
    } catch {
      return '';
    }
  };

  const normalized = searchTerm.replace(/[^a-z0-9]/gi, '');
  
  return allPatients.filter((patient) => {
    // Ensure patient object exists and has a valid ID
    if (!patient || !patient.id) return false;
    
    const ic = computeIC(patient);
    const icNormalized = ic ? ic.replace(/[^a-z0-9]/gi, '').toLowerCase() : '';
    
    return (
      (patient.name && patient.name.toLowerCase().includes(searchTerm)) ||
      (patient.room && String(patient.room).toLowerCase().includes(searchTerm)) ||
      (patient.id && patient.id.toLowerCase().includes(searchTerm)) ||
      (patient.condition && patient.condition.toLowerCase().includes(searchTerm)) ||
      (ic && ic.toLowerCase().includes(searchTerm)) ||
      (ic && icNormalized.includes(normalized))
    );
  });
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
