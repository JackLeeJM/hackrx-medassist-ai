import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import AudioRecorder from '@/components/ui/AudioRecorder';
import { Bot, User, Send, Circle } from 'lucide-react';

const AIChat = ({ patient, chatMessages, onSendMessage, onQuickQuestion }) => {
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    // Add a small delay to prevent jarring scroll during recording state changes
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    onSendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleQuickQuestionClick = (question) => {
    onQuickQuestion(question);
  };

  const handleRecordingStart = () => {
    setIsRecording(true);
  };

  const handleRecordingStop = () => {
    setIsRecording(false);
  };

  const handleAudioRecording = (audioBlob) => {
    // For now, we'll just show a message that audio was recorded
    // In a real implementation, you'd send this to a speech-to-text service
    setIsRecording(false);

    // Add a small delay before sending the message to allow UI to settle
    setTimeout(() => {
      onSendMessage("🎤 Audio message recorded (speech-to-text processing would happen here)");
    }, 150);
  };

  const quickQuestions = [
    "What's the patient's current condition?",
    "What are the latest lab results?",
    "Any medication interactions?",
    "Recommend next steps?"
  ];

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Bot className="w-5 h-5 text-blue-500" />
            AI Assistant
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Circle className="w-2 h-2 fill-green-500 text-green-500" />
            <span>Online</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Chat Messages */}
        <div ref={chatContainerRef} className="bg-gray-50 rounded-lg p-4 mb-4 h-64 overflow-y-auto">
          {chatMessages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-3 mb-4 ${msg.type === 'user' ? 'justify-end' : ''}`}>
              {msg.type === 'ai' && (
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div className={`flex-1 ${msg.type === 'user' ? 'text-right' : ''}`}>
                <div className={`rounded-lg p-3 shadow-sm ${
                  msg.type === 'user' 
                    ? 'bg-primary text-primary-foreground inline-block max-w-xs' 
                    : 'bg-white'
                }`}>
                  <p className={msg.type === 'user' ? 'text-primary-foreground' : 'text-gray-800'}>
                    {msg.message}
                  </p>
                </div>
                <span className="text-xs text-gray-500 mt-1 block">Just now</span>
              </div>
              {msg.type === 'user' && (
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat Input */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            {/* Consistent Height Container - Prevents layout shifts */}
            <div className={`transition-all duration-200 ease-in-out ${
              isRecording ? 'h-10' : 'h-10'
            }`}>
              {/* Text Input - Hidden when recording */}
              {!isRecording && (
                <Input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about this patient's condition, history, or treatment..."
                  className="pr-16 h-full"
                />
              )}

              {/* Recording Interface Container - Same height as input */}
              {isRecording && (
                <div className="h-full bg-gray-50 border border-gray-300 rounded-lg relative overflow-hidden">
                  {/* This div maintains consistent height */}
                </div>
              )}

              {/* Audio Recorder - Positioned based on recording state */}
              <div className={`absolute transition-all duration-200 ease-in-out ${
                isRecording
                  ? 'inset-0 z-10'
                  : 'right-3 top-1/2 transform -translate-y-1/2 z-0'
              }`}>
                <AudioRecorder
                  onRecordingComplete={handleAudioRecording}
                  onRecordingStart={handleRecordingStart}
                  onRecordingStop={handleRecordingStop}
                  isExpanded={isRecording}
                />
              </div>
            </div>
          </div>

          {/* Send Button - Hidden when recording */}
          {!isRecording && (
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        {/* Quick Questions */}
        <div>
          <p className="text-sm text-gray-600 mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickQuestionClick(question)}
                className="text-xs"
              >
                {question.replace("What's the patient's current condition?", "Current condition")
                         .replace("What are the latest lab results?", "Lab results")
                         .replace("Any medication interactions?", "Drug interactions")
                         .replace("Recommend next steps?", "Next steps")}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChat;
