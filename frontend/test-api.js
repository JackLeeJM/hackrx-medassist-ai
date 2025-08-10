// Test file to verify API integration
// Run this with: node test-api.js

const API_BASE_URL = 'https://api.jackleejm.com/api/v1';
const API_KEY = 'B+oabj/v8P96QMQXvPNBRf8xSSOyL65+R6BzjtipPD4=';

async function testAPI() {
    console.log('Testing API endpoints...\n');

    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    try {
        const healthResponse = await fetch(`${API_BASE_URL}/health/`, {
            headers: {
                'X-API-Key': API_KEY,
                'Content-Type': 'application/json'
            }
        });
        const healthData = await healthResponse.json();
        console.log('✅ Health check successful:', healthData.status);
    } catch (error) {
        console.log('❌ Health check failed:', error.message);
    }

    // Test 2: Get Patients List
    console.log('\n2. Testing Get Patients...');
    try {
        const patientsResponse = await fetch(`${API_BASE_URL}/patients/?limit=5`, {
            headers: {
                'X-API-Key': API_KEY,
                'Content-Type': 'application/json'
            }
        });
        const patientsData = await patientsResponse.json();
        console.log(`✅ Fetched ${patientsData.length} patients`);
        if (patientsData.length > 0) {
            console.log('   Sample patient:', patientsData[0].name);
        }
    } catch (error) {
        console.log('❌ Get patients failed:', error.message);
    }

    // Test 3: Search Patients
    console.log('\n3. Testing Patient Search...');
    try {
        const searchQuery = 'John'; // Adjust this based on your data
        const searchResponse = await fetch(`${API_BASE_URL}/patients/search?q=${encodeURIComponent(searchQuery)}&limit=5`, {
            headers: {
                'X-API-Key': API_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        if (searchResponse.ok) {
            const searchData = await searchResponse.json();
            console.log(`✅ Search for "${searchQuery}" returned ${searchData.length} results`);
            if (searchData.length > 0) {
                console.log('   First result:', searchData[0].name);
            }
        } else {
            console.log(`⚠️  Search endpoint not available (${searchResponse.status}), will use fallback`);
        }
    } catch (error) {
        console.log('⚠️  Search endpoint failed:', error.message);
    }

    // Test 4: Get Patient Details (if we have patients)
    console.log('\n4. Testing Get Patient Details...');
    try {
        const patientsResponse = await fetch(`${API_BASE_URL}/patients/?limit=1`, {
            headers: {
                'X-API-Key': API_KEY,
                'Content-Type': 'application/json'
            }
        });
        const patientsData = await patientsResponse.json();
        
        if (patientsData.length > 0) {
            const patientId = patientsData[0].id;
            console.log(`   Testing with patient ID: ${patientId}`);
            
            const detailsResponse = await fetch(`${API_BASE_URL}/services/patients/generated-summary/${patientId}`, {
                method: 'POST',
                headers: {
                    'X-API-Key': API_KEY,
                    'Content-Type': 'application/json'
                }
            });
            const detailsData = await detailsResponse.json();
            
            if (detailsData && detailsData.patient_info) {
                console.log('✅ Patient details fetched successfully');
                console.log('   Patient name:', detailsData.patient_info.name);
                console.log('   Conditions:', detailsData.conditions?.length || 0);
                console.log('   Medications:', detailsData.medications?.length || 0);
            } else {
                console.log('⚠️  Patient details response incomplete');
            }
        } else {
            console.log('⚠️  No patients available to test details');
        }
    } catch (error) {
        console.log('❌ Get patient details failed:', error.message);
    }

    console.log('\n✨ API testing complete!');
}

testAPI();