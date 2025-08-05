import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Tag, Info } from 'lucide-react';

const Timeline = ({ timeline }) => {
  if (!timeline || timeline.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Clock className="w-5 h-5 text-blue-500" />
            Medical Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm relative z-10">
              <Info className="w-4 h-4" />
            </div>
            <div className="flex-1 pb-4">
              <p className="text-gray-500">No timeline data available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'ongoing':
        return 'default';
      case 'active':
        return 'warning';
      case 'pending':
        return 'secondary';
      case 'scheduled':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600';
      case 'ongoing':
        return 'bg-blue-600';
      case 'active':
        return 'bg-yellow-600';
      case 'pending':
        return 'bg-gray-400';
      case 'scheduled':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Clock className="w-5 h-5 text-blue-500" />
          Medical Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          <div className="space-y-0">
            {timeline.map((item, index) => {
              const isLast = index === timeline.length - 1;
              const iconColor = getStatusColor(item.status);

              return (
                <div key={index} className="relative">
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 ${iconColor} rounded-full flex items-center justify-center text-white text-sm relative z-10 shadow-sm`}>
                      <i className={`${item.icon} text-xs`}></i>
                    </div>
                    <div className={`flex-1 ${isLast ? '' : 'pb-6'}`}>
                      <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-300 hover:border-gray-400 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-gray-800 font-medium">{item.action}</h4>
                          <Badge variant={getStatusVariant(item.status)}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{item.details}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {item.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.time}
                          </span>
                          <span className="flex items-center gap-1 capitalize">
                            <Tag className="w-3 h-3" />
                            {item.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Timeline;
