import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowLeft, Bell, User } from 'lucide-react';

const Header = ({
  onBack,
  onNotifications,
  onLogout,
  onProfile,
  notificationCount = 3,
  userName = "Dr. Siti Aminah",
  userEmail = "",
  showBackButton = true
}) => {
  
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
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
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onNotifications}
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
