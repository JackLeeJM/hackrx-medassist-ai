// Test script to verify patientAPI integration in data.js
import { getAllCombinedPatients, findPatientById, searchCombinedPatients } from './src/lib/data.js';

async function testAPIIntegration() {
  console.log('Testing API Integration in data.js...\n');
  
  try {
    // Test 1: Get all combined patients
    console.log('1. Testing getAllCombinedPatients()...');
    const allPatients = await getAllCombinedPatients();
    console.log(`   - Total patients fetched: ${allPatients.length}`);
    
    // Count by source
    const apiPatients = allPatients.filter(p => p.source === 'api');
    const mockPatients = allPatients.filter(p => p.source === 'mock');
    console.log(`   - API patients: ${apiPatients.length}`);
    console.log(`   - Mock patients: ${mockPatients.length}`);
    
    if (apiPatients.length > 0) {
      console.log(`   ✅ API integration successful - fetched ${apiPatients.length} patients from API`);
      console.log(`   - Sample API patient:`, apiPatients[0]);
    } else {
      console.log('   ⚠️ No patients fetched from API - may be offline or API issue');
    }
    
    // Test 2: Search patients
    console.log('\n2. Testing searchCombinedPatients()...');
    const searchResults = await searchCombinedPatients('siti');
    console.log(`   - Search for "siti" returned ${searchResults.length} results`);
    if (searchResults.length > 0) {
      console.log(`   - First result:`, searchResults[0].name);
    }
    
    // Test 3: Find patient by ID
    console.log('\n3. Testing findPatientById()...');
    const testId = 'P001';
    const patient = await findPatientById(testId);
    if (patient) {
      console.log(`   - Found patient ${testId}:`, patient.name);
      console.log(`   - Source: ${patient.source}`);
    } else {
      console.log(`   - Patient ${testId} not found`);
    }
    
    // Test 4: Cache functionality
    console.log('\n4. Testing cache...');
    console.time('   - First call');
    await getAllCombinedPatients();
    console.timeEnd('   - First call');
    
    console.time('   - Second call (should use cache)');
    await getAllCombinedPatients();
    console.timeEnd('   - Second call (should use cache)');
    
    console.log('\n✅ All tests completed!');
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
  }
}

// Run the tests
testAPIIntegration();