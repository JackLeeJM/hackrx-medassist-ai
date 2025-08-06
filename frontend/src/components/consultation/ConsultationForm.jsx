import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText } from 'lucide-react';

const ConsultationForm = ({ formData, onInputChange }) => {
  const formFields = [
    {
      id: 'chiefComplaint',
      label: 'Subjective (Patient Report)',
      placeholder: "Patient's reported symptoms, concerns, and subjective information...",
      rows: 3
    },
    {
      id: 'historyPresent',
      label: 'History & Background',
      placeholder: 'Relevant medical history, current medications, and background information...',
      rows: 4
    },
    {
      id: 'physicalExam',
      label: 'Objective (Examination & Findings)',
      placeholder: 'Physical examination findings, vital signs, test results...',
      rows: 3
    },
    {
      id: 'assessment',
      label: 'Assessment (Clinical Impression)',
      placeholder: 'Clinical assessment, diagnosis, and interpretation of findings...',
      rows: 3
    },
    {
      id: 'plan',
      label: 'Plan (Treatment & Follow-up)',
      placeholder: 'Treatment plan, medications, follow-up instructions, and next steps...',
      rows: 3
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <FileText className="w-5 h-5 text-gray-700" />
          Clinical Note Documentation
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
