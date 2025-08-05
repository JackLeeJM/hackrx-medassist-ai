import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, Circle } from 'lucide-react';

const PatientStatus = ({ patient }) => {
  if (!patient) return null;

  const getStatusVariant = (status) => {
    switch (status) {
      case 'critical':
        return 'critical';
      case 'stable':
        return 'success';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Info className="w-5 h-5 text-blue-500" />
          Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Circle className={`w-3 h-3 ${
              patient.status === 'critical' ? 'fill-red-600 text-red-600' : 'fill-green-600 text-green-600'
            }`} />
            <Badge variant={getStatusVariant(patient.status)}>
              {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
            </Badge>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientStatus;
