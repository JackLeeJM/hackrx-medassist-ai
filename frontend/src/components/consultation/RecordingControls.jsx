import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, Play, Pause, Square, Loader2 } from 'lucide-react';
import { formatTime } from '@/lib/data';

const RecordingControls = ({ 
  isRecording, 
  isPaused, 
  recordingTime, 
  currentRecordingNumber,
  recordings,
  isGenerating,
  onStartRecording, 
  onPauseRecording, 
  onStopRecording,
  onGenerateSummary 
}) => {
  const getRecordingStatus = () => {
    if (isRecording && !isPaused) return { text: 'Recording...', color: 'bg-red-500', variant: 'destructive' };
    if (isPaused) return { text: 'Paused', color: 'bg-yellow-500', variant: 'secondary' };
    return { text: 'Ready to record', color: 'bg-gray-400', variant: 'outline' };
  };

  const status = getRecordingStatus();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Mic className="w-5 h-5 text-gray-700" />
            Voice Recording
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className={`w-2 h-2 rounded-full ${status.color} ${isRecording && !isPaused ? 'animate-pulse' : ''}`}></div>
            <span>{status.text}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Recording Controls */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            {!isRecording ? (
              <Button 
                onClick={onStartRecording}
                size="lg"
                className="w-16 h-16 rounded-full text-xl shadow-lg hover:shadow-xl"
              >
                <Mic className="w-6 h-6" />
              </Button>
            ) : (
              <>
                <Button 
                  onClick={onPauseRecording}
                  variant="secondary"
                  size="lg"
                  className="w-16 h-16 rounded-full text-xl shadow-lg hover:shadow-xl"
                >
                  {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
                </Button>
                <Button 
                  onClick={onStopRecording}
                  variant="destructive"
                  size="lg"
                  className="w-16 h-16 rounded-full text-xl shadow-lg hover:shadow-xl"
                >
                  <Square className="w-6 h-6" />
                </Button>
              </>
            )}
          </div>
          <p className="text-gray-600">
            {isRecording 
              ? (isPaused ? 'Recording paused - click play to resume' : 'Recording in progress - you can pause or stop')
              : 'Click to start recording consultation'
            }
          </p>
        </div>

        {/* Recording Timer */}
        {isRecording && (
          <div className="text-center mb-6">
            <div className="text-3xl font-mono text-gray-800">{formatTime(recordingTime)}</div>
            <p className="text-gray-600">Recording session {currentRecordingNumber}</p>
          </div>
        )}

        {/* Recordings List */}
        {recordings.length > 0 && (
          <div className="space-y-3 mb-6">
            {recordings.map((recording) => (
              <div key={recording.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center text-white">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{recording.title}</h4>
                    <p className="text-sm text-gray-600">
                      {formatTime(recording.duration)} • {recording.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Generate Summary */}
        {recordings.length > 0 && (
          <div>
            <Button 
              onClick={onGenerateSummary}
              disabled={isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing All Recordings...
                </>
              ) : (
                <>
                  <i className="fas fa-magic mr-2"></i>
                  Generate Summary from All Recordings
                </>
              )}
            </Button>
            <p className="text-sm text-gray-500 mt-2 text-center">
              AI will analyze all {recordings.length} recording(s) to create a comprehensive summary
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecordingControls;
