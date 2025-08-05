import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, Mic, MessageSquare, Database } from 'lucide-react';

const RecentActivitySection = ({ recentActivity, onViewAll }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'recording':
        return Mic;
      case 'chat':
        return MessageSquare;
      case 'data':
        return Database;
      default:
        return History;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'recording':
        return 'bg-blue-600';
      case 'chat':
        return 'bg-green-600';
      case 'data':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-gray-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <History className="w-5 h-5 text-gray-500" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => {
            const ActivityIcon = getActivityIcon(activity.type);
            const iconColor = getActivityColor(activity.type);

            return (
              <div key={index} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 ${iconColor} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                    <ActivityIcon className="w-3 h-3" />
                  </div>
                  <span className="text-gray-500 text-xs">{activity.time}</span>
                </div>
                <div>
                  <p className="text-gray-800 text-sm leading-tight">
                    <strong>{activity.action}</strong>
                  </p>
                  <p className="text-gray-600 text-xs mt-1">
                    for {activity.patient}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <Button
            onClick={onViewAll}
            variant="outline"
            size="sm"
            className="w-full"
          >
            View All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivitySection;
