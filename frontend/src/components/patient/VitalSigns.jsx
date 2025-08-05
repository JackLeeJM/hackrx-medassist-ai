import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';

const VitalSigns = ({ vitals }) => {
  if (!vitals) return null;

  const vitalItems = [
    { label: 'Blood Pressure', value: vitals.bp, unit: '' },
    { label: 'Heart Rate', value: vitals.hr, unit: 'bpm' },
    { label: 'Temperature', value: vitals.temp, unit: '°F' },
    { label: 'Oxygen Sat', value: vitals.o2sat, unit: '%' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Heart className="w-5 h-5 text-red-500" />
          Current Vitals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {vitalItems.map((vital, index) => (
            <div 
              key={vital.label}
              className={`flex justify-between items-center py-2 ${
                index < vitalItems.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <span className="text-gray-600">{vital.label}</span>
              <span className="font-medium">
                {vital.value} {vital.unit}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VitalSigns;
