// API Service for HackRx Medical AI Assistant

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.jackleejm.com/api/v1';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// Helper function to make API calls with proper headers
const apiCall = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error);
    throw error;
  }
};

// Patient API endpoints
export const patientAPI = {
  // Get list of all patients
  getPatients: async (limit = 50) => {
    try {
      return await apiCall(`/patients/?limit=${limit}`);
    } catch (error) {
      console.error('Failed to fetch patients from API, returning empty array:', error);
      return [];
    }
  },

  // Search patients by query (name, ID, etc.)
  // Since there's no search endpoint, we fetch all and filter client-side
  searchPatients: async (query, limit = 100) => {
    try {
      // Fetch all patients (or up to limit)
      const allPatients = await apiCall(`/patients/?limit=${limit}`);
      
      // If no query, return all
      if (!query || query.trim() === '') {
        return allPatients;
      }
      
      // Filter locally based on query
      const lowerQuery = query.toLowerCase().trim();
      return allPatients.filter(patient => {
        // Search in name, ID, and construct potential IC from age/gender
        const nameMatch = patient.name?.toLowerCase().includes(lowerQuery);
        const idMatch = patient.id?.toLowerCase().includes(lowerQuery);
        
        // Also check if query might be a room number
        const roomMatch = lowerQuery.match(/^\d+$/) && patient.room?.toString().includes(lowerQuery);
        
        return nameMatch || idMatch || roomMatch;
      });
    } catch (error) {
      console.error('Failed to fetch/search patients:', error);
      return [];
    }
  },

  // Get comprehensive patient profile with generated summary
  getPatientDetails: async (patientId) => {
    try {
      const response = await apiCall(`/services/patients/generated-summary/${patientId}`, {
        method: 'POST',
      });
      return response;
    } catch (error) {
      console.error(`Failed to fetch patient details for ${patientId}:`, error);
      return null;
    }
  },

  // Get list of conditions
  getConditions: async () => {
    try {
      return await apiCall('/patients/conditions');
    } catch (error) {
      console.error('Failed to fetch conditions:', error);
      return [];
    }
  },

  // Get patients by condition IDs
  getPatientsByConditions: async (conditionIds) => {
    try {
      const response = await apiCall('/patients/by-conditions', {
        method: 'POST',
        body: JSON.stringify({ condition_ids: conditionIds }),
      });
      return response;
    } catch (error) {
      console.error('Failed to fetch patients by conditions:', error);
      return { patient_ids: [] };
    }
  },

  // Generate patient summary
  generatePatientSummary: async (patientId) => {
    try {
      const response = await apiCall(`/services/${patientId}`, {
        method: 'POST',
      });
      return response;
    } catch (error) {
      console.error(`Failed to generate summary for patient ${patientId}:`, error);
      return null;
    }
  },
};

// Health check API
export const healthAPI = {
  check: async () => {
    try {
      return await apiCall('/health/');
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'error', message: error.message };
    }
  },
};