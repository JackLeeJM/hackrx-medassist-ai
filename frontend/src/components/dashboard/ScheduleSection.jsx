import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, Clock } from 'lucide-react';

const ScheduleSection = ({ schedule, prepStates, onPrepareVisit }) => {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-gray-100">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Calendar className="w-5 h-5 text-blue-500" />
            Today's Schedule
          </CardTitle>
          <span className="text-gray-500 text-sm">Tuesday, March 14, 2024</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {schedule.map((appointment, index) => (
            <div
              key={index}
              className={`${
                appointment.status === 'completed' ? 'bg-gray-100 opacity-70' : 'bg-gray-50'
              } border-l-4 ${
                appointment.status === 'completed' ? 'border-green-500' : 'border-blue-500'
              } p-3 rounded-r-lg hover:bg-gray-100 transition-colors`}
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold text-gray-800">{appointment.time}</span>
                  </div>
                  <h4 className="font-medium text-gray-800 truncate">{appointment.patient}</h4>
                  <p className="text-gray-600 text-sm">{appointment.type}</p>
                </div>
                {appointment.status === 'completed' ? (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Completed
                  </Badge>
                ) : (
                  <Button 
                    onClick={() => onPrepareVisit(appointment.patient, index)}
                    disabled={prepStates[index] === 'preparing'}
                    variant={
                      prepStates[index] === 'ready' 
                        ? 'default' 
                        : prepStates[index] === 'preparing'
                        ? 'secondary'
                        : 'outline'
                    }
                    size="sm"
                  >
                    {prepStates[index] === 'ready' ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Ready
                      </>
                    ) : prepStates[index] === 'preparing' ? (
                      'Preparing...'
                    ) : (
                      'AI Prep'
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleSection;
