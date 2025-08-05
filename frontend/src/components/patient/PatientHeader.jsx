import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, Bed, IdCard, Activity, AlertTriangle } from 'lucide-react';

const PatientHeader = ({ patient, onStartConsultation }) => {
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

  const getStatusIcon = (status) => {
    return status === 'critical' ? AlertTriangle : User;
  };

  const StatusIcon = getStatusIcon(patient.status);

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className={`w-20 h-20 rounded-xl flex items-center justify-center text-white text-2xl ${
              patient.status === 'critical' ? 'bg-red-600' : 'bg-gray-600'
            }`}>
              <StatusIcon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{patient.name}</h2>
              <div className="flex items-center gap-4 text-gray-600">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Age {patient.age}</span>
                </span>
                <span className="flex items-center gap-2">
                  <Bed className="w-4 h-4" />
                  <span>Room {patient.room}</span>
                </span>
                <span className="flex items-center gap-2">
                  <IdCard className="w-4 h-4" />
                  <span>ID: {patient.id}</span>
                </span>
                <Badge variant={getStatusVariant(patient.status)}>
                  {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={onStartConsultation}
              className="bg-primary hover:bg-primary/90"
            >
              <Activity className="w-4 h-4 mr-2" />
              New Consultation
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientHeader;
