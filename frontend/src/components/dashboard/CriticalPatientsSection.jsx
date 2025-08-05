import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

const CriticalPatientsSection = ({ criticalPatients, onViewPatient }) => {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-gray-100">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Critical Patients
          </CardTitle>
          <Badge variant="destructive" className="text-sm">
            {criticalPatients.length} require immediate attention
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {criticalPatients.map((patient, index) => (
            <div key={patient.id} className="border border-red-200 bg-red-50 rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-800">{patient.name}</h4>
                    <Badge variant="destructive" className="text-xs">
                      {patient.condition}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">Room {patient.room} • Age {patient.age}</p>

                  <div className="flex flex-wrap gap-2">
                    {patient.vitals.bp && (
                      <Badge variant="outline" className="text-xs">
                        BP: {patient.vitals.bp}
                      </Badge>
                    )}
                    {patient.vitals.hr && (
                      <Badge variant="outline" className="text-xs">
                        HR: {patient.vitals.hr}
                      </Badge>
                    )}
                    {patient.vitals.troponin && (
                      <Badge variant="outline" className="text-xs">
                        Troponin: {patient.vitals.troponin}
                      </Badge>
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => onViewPatient(patient.name)}
                  variant="default"
                  size="sm"
                  className="flex-shrink-0"
                >
                  View Patient
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CriticalPatientsSection;
