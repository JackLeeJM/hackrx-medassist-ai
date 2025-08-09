import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, Square, Play, Pause, AlertCircle, X } from 'lucide-react';

const AudioRecorder = ({ onRecordingComplete, onRecordingStart, onRecordingStop, isExpanded = false, cta = false }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [error, setError] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    // Check for browser support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Audio recording is not supported in this browser');
      return;
    }

    // Request microphone permission on component mount
    requestMicrophonePermission();

    return () => {
      // Cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionGranted(true);
      setError(null);
      // Stop the stream immediately, we'll request it again when recording
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      setError('Microphone permission denied. Please allow microphone access to record audio.');
      setPermissionGranted(false);
    }
  };

  const startRecording = async () => {
    if (!permissionGranted) {
      await requestMicrophonePermission();
      if (!permissionGranted) return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });

      streamRef.current = stream;
      chunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mediaRecorder.mimeType
        });
        setAudioBlob(blob);
        if (onRecordingComplete) {
          onRecordingComplete(blob);
        }
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      setError(null);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      if (onRecordingStart) {
        onRecordingStart();
      }

    } catch (err) {
      setError('Failed to start recording. Please check your microphone.');
      console.error('Recording error:', err);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        clearInterval(timerRef.current);
      }
      setIsPaused(!isPaused);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      clearInterval(timerRef.current);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      if (onRecordingStop) {
        onRecordingStop();
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <span className="text-sm text-red-700">{error}</span>
        <Button
          size="sm"
          variant="outline"
          onClick={requestMicrophonePermission}
          className="ml-auto"
        >
          Retry
        </Button>
      </div>
    );
  }

  // Expanded recording interface
  if (isRecording && isExpanded) {
    return (
      <div className="absolute inset-0 bg-white border border-gray-200 rounded-lg flex items-center justify-between px-4">
        {/* Timer */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-red-500'} ${!isPaused ? 'animate-pulse' : ''}`}></div>
          <span className="text-sm font-mono font-semibold text-gray-700">
            {formatTime(recordingTime)}
          </span>
        </div>

        {/* Microphone Button */}
        <div className="relative">
          <Button
            onClick={pauseRecording}
            className={`w-10 h-10 rounded-full ${
              isPaused ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-500 hover:bg-red-600'
            } text-white shadow-lg transition-all duration-300`}
            size="icon"
          >
            <Mic className="w-5 h-5" />
          </Button>

          {/* Pulse Ring */}
          {!isPaused && (
            <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20"></div>
          )}
        </div>

        {/* Stop Button */}
        <Button
          onClick={stopRecording}
          variant="outline"
          size="sm"
          className="px-3 py-1 text-xs text-gray-600 hover:text-red-600 hover:border-red-300"
        >
          <Square className="w-3 h-3 mr-1" />
          Stop
        </Button>
      </div>
    );
  }

  // Compact recording interface (when not expanded)
  if (isRecording && !isExpanded) {
    return (
      <div className="flex items-center gap-3">
        <Button
          onClick={pauseRecording}
          className="w-12 h-12 rounded-full bg-yellow-600 hover:bg-yellow-700 text-white"
          size="icon"
        >
          {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
        </Button>
        <Button
          onClick={stopRecording}
          className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-700 text-white"
          size="icon"
        >
          <Square className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Badge variant={isPaused ? "secondary" : "destructive"}>
            {isPaused ? "Paused" : "Recording"}
          </Badge>
          <span className="text-sm font-mono text-gray-600">
            {formatTime(recordingTime)}
          </span>
        </div>
      </div>
    );
  }

  // Default microphone button (not recording)
  if (cta) {
    return (
      <Button
        onClick={startRecording}
        disabled={!permissionGranted}
        className="w-full h-12 rounded-md"
      >
        <Mic className="w-4 h-4 mr-2" /> Start recording
      </Button>
    );
  }

  return (
    <Button
      onClick={startRecording}
      disabled={!permissionGranted}
      variant="ghost"
      size="icon"
      className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
    >
      <Mic className="w-4 h-4" />
    </Button>
  );
};

export default AudioRecorder;
