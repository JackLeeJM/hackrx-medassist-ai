'use client';

import { useState, useEffect } from 'react';
import { getAllCombinedPatients, findPatientById, searchCombinedPatients } from '@/lib/data';
import { patientAPI } from '@/lib/api';

export default function APITestPage() {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    const results = {};
    
    try {
      // Test 1: Direct API call
      console.log('Testing direct API call...');
      const apiPatients = await patientAPI.getPatients(10);
      results.directAPI = {
        success: true,
        count: apiPatients.length,
        sample: apiPatients.length > 0 ? apiPatients[0] : null
      };
    } catch (error) {
      results.directAPI = {
        success: false,
        error: error.message
      };
    }

    try {
      // Test 2: Combined patients
      console.log('Testing getAllCombinedPatients...');
      const allPatients = await getAllCombinedPatients();
      const apiPatients = allPatients.filter(p => p.source === 'api');
      const mockPatients = allPatients.filter(p => p.source === 'mock');
      
      results.combinedPatients = {
        success: true,
        total: allPatients.length,
        apiCount: apiPatients.length,
        mockCount: mockPatients.length
      };
    } catch (error) {
      results.combinedPatients = {
        success: false,
        error: error.message
      };
    }

    try {
      // Test 3: Search
      console.log('Testing search...');
      const searchResults = await searchCombinedPatients('siti');
      results.search = {
        success: true,
        query: 'siti',
        count: searchResults.length,
        results: searchResults.slice(0, 3).map(p => p.name)
      };
    } catch (error) {
      results.search = {
        success: false,
        error: error.message
      };
    }

    try {
      // Test 4: Find by ID
      console.log('Testing findPatientById...');
      const patient = await findPatientById('P001');
      results.findById = {
        success: true,
        found: !!patient,
        patient: patient ? { name: patient.name, source: patient.source } : null
      };
    } catch (error) {
      results.findById = {
        success: false,
        error: error.message
      };
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Integration Test</h1>
      
      {loading ? (
        <div>Running tests...</div>
      ) : (
        <div className="space-y-6">
          {/* Direct API Test */}
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">1. Direct API Call (patientAPI.getPatients)</h2>
            {testResults.directAPI?.success ? (
              <div className="text-green-600">
                ✅ Success - Fetched {testResults.directAPI.count} patients
                {testResults.directAPI.sample && (
                  <div className="mt-2 text-sm text-gray-600">
                    Sample: {JSON.stringify(testResults.directAPI.sample, null, 2)}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-red-600">
                ❌ Failed: {testResults.directAPI?.error}
              </div>
            )}
          </div>

          {/* Combined Patients Test */}
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">2. getAllCombinedPatients()</h2>
            {testResults.combinedPatients?.success ? (
              <div className="text-green-600">
                ✅ Success
                <ul className="mt-2 text-sm text-gray-600">
                  <li>Total: {testResults.combinedPatients.total} patients</li>
                  <li>From API: {testResults.combinedPatients.apiCount} patients</li>
                  <li>From Mock: {testResults.combinedPatients.mockCount} patients</li>
                </ul>
              </div>
            ) : (
              <div className="text-red-600">
                ❌ Failed: {testResults.combinedPatients?.error}
              </div>
            )}
          </div>

          {/* Search Test */}
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">3. searchCombinedPatients('siti')</h2>
            {testResults.search?.success ? (
              <div className="text-green-600">
                ✅ Success - Found {testResults.search.count} results
                {testResults.search.results.length > 0 && (
                  <ul className="mt-2 text-sm text-gray-600">
                    {testResults.search.results.map((name, i) => (
                      <li key={i}>- {name}</li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <div className="text-red-600">
                ❌ Failed: {testResults.search?.error}
              </div>
            )}
          </div>

          {/* Find by ID Test */}
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">4. findPatientById('P001')</h2>
            {testResults.findById?.success ? (
              <div className="text-green-600">
                ✅ Success
                {testResults.findById.patient && (
                  <div className="mt-2 text-sm text-gray-600">
                    Found: {testResults.findById.patient.name} (source: {testResults.findById.patient.source})
                  </div>
                )}
              </div>
            ) : (
              <div className="text-red-600">
                ❌ Failed: {testResults.findById?.error}
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm">
              {testResults.directAPI?.success && testResults.directAPI.count > 0 ? (
                <span className="text-green-700 font-semibold">
                  🎉 API Integration is working! The patientAPI is successfully fetching data from the backend.
                </span>
              ) : (
                <span className="text-orange-700">
                  ⚠️ API may be offline or unreachable. Using fallback mock data.
                </span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}