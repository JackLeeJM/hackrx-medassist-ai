import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, Brain, CheckCircle } from 'lucide-react';

const PatientCondition = ({ patient }) => {
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
    <div className="space-y-8">
      {/* Current Condition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Stethoscope className="w-5 h-5 text-blue-500" />
            Current Condition
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`border rounded-lg p-4 ${
            patient.status === 'critical' 
              ? 'border-red-200 bg-red-50' 
              : 'border-gray-300 bg-gray-100'
          }`}>
            <h4 className="font-medium text-gray-800 mb-2">Primary Diagnosis</h4>
            <p className="text-gray-600 mb-3">{patient.condition}</p>
            <div className="flex items-center gap-2">
              <Badge variant={getStatusVariant(patient.status)}>
                {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Synthesized Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Brain className="w-5 h-5 text-purple-500" />
            AI Synthesized Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Medical History Summary</h4>
              <p className="text-gray-600 mb-3">AI has synthesized data from multiple sources:</p>
              <ul className="space-y-2 text-sm text-gray-600">
                {[
                  'EMR records processed',
                  'Lab results integrated',
                  'Vital signs monitored',
                  'Handwritten notes digitized'
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Key Insights</h4>
              <div className="text-gray-600">
                <p>{patient.insights}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientCondition;
