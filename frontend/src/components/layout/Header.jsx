import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Clock, Bell } from 'lucide-react';

const Header = ({ onBack, timeSaved = "2h 15m", notificationCount = 3 }) => {
  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white px-8 py-4 shadow-xl border-b border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="bg-white/10 hover:bg-white/20 text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold mb-1 flex items-center gap-2">
              <User className="w-6 h-6 text-gray-300" />
              Patient Details
            </h1>
            <span className="text-white/90 text-sm">Dr. Sarah Johnson</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
            <Clock className="w-4 h-4" />
            <span className="font-medium">{timeSaved} saved today</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="relative bg-white/10 hover:bg-white/20 text-white"
          >
            <Bell className="w-4 h-4" />
            {notificationCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {notificationCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
