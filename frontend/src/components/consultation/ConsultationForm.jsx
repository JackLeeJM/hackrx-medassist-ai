import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText } from 'lucide-react';

const ConsultationForm = ({ formData, onInputChange }) => {
  const formFields = [
    {
      id: 'chiefComplaint',
      label: 'Chief Complaint',
      placeholder: "Patient's primary concern or reason for visit...",
      rows: 3
    },
    {
      id: 'historyPresent',
      label: 'History of Present Illness',
      placeholder: 'Detailed description of current symptoms and timeline...',
      rows: 4
    },
    {
      id: 'physicalExam',
      label: 'Physical Examination',
      placeholder: 'Physical examination findings...',
      rows: 3
    },
    {
      id: 'assessment',
      label: 'Assessment',
      placeholder: 'Clinical assessment and diagnosis...',
      rows: 3
    },
    {
      id: 'plan',
      label: 'Plan',
      placeholder: 'Treatment plan and next steps...',
      rows: 3
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <FileText className="w-5 h-5 text-gray-700" />
          Consultation Notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          {formFields.map((field) => (
            <div key={field.id}>
              <Label htmlFor={field.id} className="text-sm font-medium text-gray-700 mb-2 block">
                {field.label}
              </Label>
              <Textarea
                id={field.id}
                rows={field.rows}
                placeholder={field.placeholder}
                value={formData[field.id]}
                onChange={(e) => onInputChange(field.id, e.target.value)}
                className="resize-none"
              />
            </div>
          ))}
        </form>
      </CardContent>
    </Card>
  );
};

export default ConsultationForm;
