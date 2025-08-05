import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Share, Copy, CheckCircle } from 'lucide-react';

const SummarySection = ({ summary, onDownload, onShare, onCopy, copySuccess }) => {
  if (!summary) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileText className="w-5 h-5 text-green-600" />
            AI Generated Summary
          </CardTitle>
          <Badge variant="secondary" className="text-sm">
            Generated {summary.timestamp.toLocaleTimeString()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary Content */}
          <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-green-500">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Chief Complaint</h4>
                <p className="text-gray-700">{summary.chiefComplaint}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">History of Present Illness</h4>
                <p className="text-gray-700">{summary.historyPresent}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Physical Examination</h4>
                <p className="text-gray-700">{summary.physicalExam}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Assessment</h4>
                <p className="text-gray-700">{summary.assessment}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Plan</h4>
                <p className="text-gray-700">{summary.plan}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={onDownload} variant="default">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            
            <Button onClick={onShare} variant="outline">
              <Share className="w-4 h-4 mr-2" />
              Share with Team
            </Button>
            
            <Button 
              onClick={onCopy} 
              variant="outline"
              className={copySuccess ? 'text-green-600 border-green-600' : ''}
            >
              {copySuccess ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Text
                </>
              )}
            </Button>
          </div>

          {/* Summary Stats */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-800">
                <strong>Summary Quality:</strong> High confidence based on {summary.recordingsAnalyzed} recording(s)
              </span>
              <span className="text-blue-600">
                Processing time: {summary.processingTime}s
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummarySection;
