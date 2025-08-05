import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const StatCard = ({ icon, value, label, iconColor = "bg-gray-800" }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 ${iconColor} rounded-lg flex items-center justify-center text-white`}>
            <i className={`${icon} text-xl`}></i>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            <p className="text-gray-600 text-sm">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
