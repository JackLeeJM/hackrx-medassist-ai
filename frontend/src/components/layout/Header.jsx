import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowLeft, Bell, Search, X } from 'lucide-react';
import { filterPatients } from '@/lib/data';

const Header = ({
  onBack,
  onLogout,
  onProfile,
  onSearch,
  notificationCount = 5,
  userName = "Dr. Siti Aminah",
  userEmail = "",
  showBackButton = true,
  showSearch = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState([]);

  const handleSearchChange = async (value) => {
    setSearchQuery(value);
    if (value.trim()) {
      // Filter only by name and room
      const searchTerm = value.toLowerCase();
      const patients = await filterPatients(value);
      const filtered = patients.filter(patient =>
        patient.name?.toLowerCase().includes(searchTerm) ||
        String(patient.room || '').toLowerCase().includes(searchTerm)
      );
      setFilteredPatients(filtered.slice(0, 8)); // Show max 8 results
      setShowDropdown(filtered.length > 0);
    } else {
      setFilteredPatients([]);
      setShowDropdown(false);
    }
  };

  const handlePatientSelect = (patient) => {
    setSearchQuery('');
    setShowDropdown(false);
    if (onSearch && patient && patient.id) {
      onSearch(patient.id);
    } else {
      console.warn('Patient selected but no valid ID found:', patient);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredPatients([]);
    setShowDropdown(false);
  };
  
  // Determine profile photo based on user email
  const getProfilePhoto = () => {
    if (userEmail === 'drahmad@hospital.com') {
      return '/drahmad.jpg';
    } else if (userEmail === 'drsiti@hospital.com') {
      return '/drsiti.jpg';
    } else if (userEmail === 'nurse@hospital.com') {
      return '/drsiti.jpg'; // Default for nurse or fallback
    }
    return '/drsiti.jpg'; // Default fallback
  };
  return (
    <header className="bg-white text-gray-900 px-6 py-2 shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between gap-4">
        {/* Logo section */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="hover:bg-gray-100 text-gray-700 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div className="flex items-center">
            <Image
              src="/mymia_icon.svg"
              alt="MyMia Icon"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
          </div>
        </div>
        
        {/* Search Bar - Takes remaining space */}
        {showSearch && (
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search by patient name or room..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-10 text-sm w-full"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && filteredPatients.length > 0) {
                  handlePatientSelect(filteredPatients[0]);
                }
              }}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 hover:bg-gray-100"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
            
            {/* Patient Dropdown */}
            {showDropdown && filteredPatients.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => handlePatientSelect(patient)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                  >
                    <div className={`w-8 h-8 rounded text-white text-xs flex items-center justify-center ${
                      patient.status === 'critical' ? 'bg-red-600' : 
                      patient.status === 'serious' ? 'bg-orange-600' : 'bg-green-600'
                    }`}>
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-foreground">{patient.name}</div>
                      <div className="text-xs text-muted-foreground">Room {patient.room}</div>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      patient.status === 'critical' ? 'bg-red-100 text-red-800' :
                      patient.status === 'serious' ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {patient.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Actions section */}
        <div className="flex items-center gap-4 flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-gray-100 text-blue-600 transition-all duration-300 group p-2"
                >
                  <Bell className="w-5 h-5 group-hover:animate-bounce" />
                  {notificationCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
                    >
                      {notificationCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="px-3 py-2 text-sm font-semibold text-foreground border-b">
                  Notifications ({notificationCount})
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <DropdownMenuItem className="flex flex-col items-start p-3 hover:bg-accent">
                    <div className="flex items-center gap-2 w-full">
                      <div className="w-2 h-2 bg-destructive rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-foreground">Critical Patient Alert</div>
                        <div className="text-xs text-muted-foreground mt-1">Ahmed Hassan - IOP elevated to 45mmHg, requires immediate attention</div>
                        <div className="text-xs text-muted-foreground/70 mt-1">2 minutes ago</div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start p-3 hover:bg-accent">
                    <div className="flex items-center gap-2 w-full">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-foreground">Lab Results Available</div>
                        <div className="text-xs text-muted-foreground mt-1">Complete Blood Count results for Maria Rodriguez are ready for review</div>
                        <div className="text-xs text-muted-foreground/70 mt-1">15 minutes ago</div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start p-3 hover:bg-accent">
                    <div className="flex items-center gap-2 w-full">
                      <div className="w-2 h-2 bg-secondary-foreground rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-foreground">Medication Reminder</div>
                        <div className="text-xs text-muted-foreground mt-1">Robert Davis - Next medication due in 30 minutes (Metoprolol 25mg)</div>
                        <div className="text-xs text-muted-foreground/70 mt-1">1 hour ago</div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start p-3 hover:bg-accent">
                    <div className="flex items-center gap-2 w-full">
                      <div className="w-2 h-2 bg-primary/60 rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-foreground">Discharge Ready</div>
                        <div className="text-xs text-muted-foreground mt-1">Jennifer Miller cleared for discharge - all documentation completed</div>
                        <div className="text-xs text-muted-foreground/70 mt-1">2 hours ago</div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start p-3 hover:bg-accent">
                    <div className="flex items-center gap-2 w-full">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-foreground">System Update</div>
                        <div className="text-xs text-muted-foreground mt-1">MyMia system maintenance scheduled for tonight 11:00 PM - 2:00 AM</div>
                        <div className="text-xs text-muted-foreground/70 mt-1">3 hours ago</div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </div>
                <div className="border-t p-2">
                  <div className="text-center">
                    <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary/80">
                      View All Notifications
                    </Button>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-1 transition-all duration-200">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={getProfilePhoto()}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-gray-600 text-sm font-medium">{userName}</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onProfile}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLogout}>
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
