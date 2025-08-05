import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Pill, Share, Zap } from 'lucide-react';

const QuickActions = ({ onGenerateSummary, onUpdateTreatment, onShareWithTeam }) => {
  const actions = [
    {
      icon: FileText,
      label: 'Generate Summary',
      onClick: onGenerateSummary,
    },
    {
      icon: Pill,
      label: 'Update Treatment',
      onClick: onUpdateTreatment,
    },
    {
      icon: Share,
      label: 'Share with Team',
      onClick: onShareWithTeam,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Zap className="w-5 h-5 text-yellow-500" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={action.label}
                variant="default"
                className="w-full justify-start"
                onClick={action.onClick}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {action.label}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
