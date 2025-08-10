import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, User, AlertTriangle } from 'lucide-react';
import { getPatientStatusColor, useCombinedPatients } from '@/lib/data';

const PatientSearchBar = ({ onPatientSelect, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [hasFocused, setHasFocused] = useState(false);

  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Use React Query hook to fetch and cache all combined patients
  const { data: allPatients = [], isLoading, error } = useCombinedPatients();

  // Filter patients based on search query using useMemo for performance
  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) {
      return allPatients.slice(0, 20); // Show first 20 when no search
    }

    const searchTerm = searchQuery.toLowerCase().trim();
    const normalized = searchTerm.replace(/[^a-z0-9]/gi, '');

    // Helper to compute IC for mock patients
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
      // Ensure patient object exists
      if (!patient) return false;
      
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
  }, [searchQuery, allPatients]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target) &&
          dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchFocus = () => {
    setShowDropdown(true);
    setHasFocused(true);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowDropdown(true);
  };

  const handlePatientSelect = (patient) => {
    // Include more information in search box to differentiate patients
    const displayText = `${patient.name} - Room ${patient.room} (ID: ${patient.id})`;
    setSearchQuery(displayText);
    setShowDropdown(false);
    onPatientSelect(patient);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-gray-100 overflow-visible relative z-10">
      <CardContent className="p-6 overflow-visible">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                onKeyDown={handleKeyDown}
                placeholder="Search patients by name, room number, patient ID, or IC..."
                className="pl-12 text-lg h-12"
              />
            </div>

            {/* Search Dropdown */}
            {showDropdown && hasFocused && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl mt-1 max-h-96 overflow-y-auto z-50"
              >
                <div className="p-2">
                  {isLoading ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="animate-spin w-8 h-8 mx-auto mb-2 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
                      <p>Loading patients...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>Error loading patients. Using local data.</p>
                    </div>
                  ) : (
                    <>
                      <div className="text-xs text-gray-500 px-3 py-2 font-medium">
                        {searchQuery ? `FOUND ${filteredPatients.length} PATIENT${filteredPatients.length !== 1 ? 'S' : ''}` : `ALL PATIENTS (${filteredPatients.length})`}
                      </div>
                      {filteredPatients.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p>No patients found matching "{searchQuery}"</p>
                        </div>
                      ) : (
                    filteredPatients.map((patient) => {
                      const statusColor = getPatientStatusColor(patient.status);
                      const StatusIcon = patient.status === 'critical' ? AlertTriangle : User;
                      
                      return (
                        <div 
                          key={patient.id}
                          onClick={() => handlePatientSelect(patient)}
                          className="flex items-center gap-3 px-3 py-3 hover:bg-gray-50 rounded-lg cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className={`w-10 h-10 ${statusColor} rounded-lg flex items-center justify-center text-white`}>
                            <StatusIcon className="w-5 h-5" />
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
                      );
                    })
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={handleSearch}
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 h-12"
          >
            Search
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientSearchBar;
