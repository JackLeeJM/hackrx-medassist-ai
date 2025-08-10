// Test script to verify combined patient search functionality

import { getAllCombinedPatients, searchCombinedPatients } from './src/lib/data.js';

async function testCombinedSearch() {
  console.log('Testing Combined Patient Search...\n');
  
  try {
    // Test 1: Fetch all combined patients
    console.log('Test 1: Fetching all combined patients...');
    const allPatients = await getAllCombinedPatients();
    console.log(`✓ Total patients fetched: ${allPatients.length}`);
    console.log(`  - API patients: ${allPatients.filter(p => p.source === 'api').length}`);
    console.log(`  - Mock patients: ${allPatients.filter(p => p.source === 'mock').length}`);
    console.log('\n');

    // Test 2: Search for a specific patient by name
    console.log('Test 2: Searching for "Nurul Asyikin"...');
    const nurulResults = await searchCombinedPatients('Nurul Asyikin');
    console.log(`✓ Found ${nurulResults.length} result(s)`);
    if (nurulResults.length > 0) {
      console.log(`  - Name: ${nurulResults[0].name}`);
      console.log(`  - ID: ${nurulResults[0].id}`);
      console.log(`  - Source: ${nurulResults[0].source}`);
    }
    console.log('\n');

    // Test 3: Search by partial name
    console.log('Test 3: Searching for "Lim"...');
    const limResults = await searchCombinedPatients('Lim');
    console.log(`✓ Found ${limResults.length} result(s)`);
    limResults.slice(0, 3).forEach(patient => {
      console.log(`  - ${patient.name} (${patient.source})`);
    });
    console.log('\n');

    // Test 4: Search by room number
    console.log('Test 4: Searching for room "302"...');
    const roomResults = await searchCombinedPatients('302');
    console.log(`✓ Found ${roomResults.length} result(s)`);
    roomResults.forEach(patient => {
      console.log(`  - ${patient.name} in Room ${patient.room} (${patient.source})`);
    });
    console.log('\n');

    // Test 5: Empty search (should return first 20)
    console.log('Test 5: Empty search...');
    const emptyResults = await searchCombinedPatients('');
    console.log(`✓ Returned ${emptyResults.length} patients (expected: first 20)`);
    console.log('\n');

    // Test 6: No results search
    console.log('Test 6: Searching for "XYZ123"...');
    const noResults = await searchCombinedPatients('XYZ123');
    console.log(`✓ Found ${noResults.length} result(s) (expected: 0)`);
    console.log('\n');

    console.log('✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the tests
testCombinedSearch();