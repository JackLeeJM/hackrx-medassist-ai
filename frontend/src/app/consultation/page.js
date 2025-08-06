'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// Import components
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingScreen, ErrorMessage } from '@/components/ui/loading-spinner';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import RecordingControls from '@/components/consultation/RecordingControls';
import ConsultationForm from '@/components/consultation/ConsultationForm';
import SummarySection from '@/components/consultation/SummarySection';

// Import data and utilities
import { mockPatients, findPatientById, formatTime } from '@/lib/data';
import { User, AlertTriangle, CheckCircle, Save } from 'lucide-react';

function ConsultationPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [currentPatient, setCurrentPatient] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [recordings, setRecordings] = useState([]);
    const [currentRecordingNumber, setCurrentRecordingNumber] = useState(1);
    const [showAISummary, setShowAISummary] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiSummary, setAiSummary] = useState(null);
    const [copySuccess, setCopySuccess] = useState(false);
    const [formData, setFormData] = useState({
        chiefComplaint: '',
        historyPresent: '',
        physicalExam: '',
        assessment: '',
        plan: ''
    });

    const timerRef = useRef(null);
    const recordingStartTime = useRef(null);

    useEffect(() => {
        // Check authentication
        const userData = localStorage.getItem('user');
        if (!userData) {
            router.push('/login');
            return;
        }
        setUser(JSON.parse(userData));

        const patientId = searchParams.get('id');
        if (!patientId) {
            alert('No patient ID provided');
            router.push('/');
            return;
        }

        const patient = findPatientById(patientId);
        if (!patient) {
            alert(`Patient with ID ${patientId} not found`);
            router.push('/');
            return;
        }

        setCurrentPatient(patient);
    }, [searchParams, router]);

    const startRecording = () => {
        setIsRecording(true);
        setIsPaused(false);
        recordingStartTime.current = Date.now() - (recordingTime * 1000);
        
        timerRef.current = setInterval(() => {
            const elapsed = Math.floor((Date.now() - recordingStartTime.current) / 1000);
            setRecordingTime(elapsed);
        }, 1000);
    };

    const pauseRecording = () => {
        setIsPaused(!isPaused);
        if (!isPaused) {
            clearInterval(timerRef.current);
        } else {
            recordingStartTime.current = Date.now() - (recordingTime * 1000);
            timerRef.current = setInterval(() => {
                const elapsed = Math.floor((Date.now() - recordingStartTime.current) / 1000);
                setRecordingTime(elapsed);
            }, 1000);
        }
    };

    const stopRecording = () => {
        setIsRecording(false);
        setIsPaused(false);
        clearInterval(timerRef.current);
        
        const newRecording = {
            id: currentRecordingNumber,
            duration: recordingTime,
            timestamp: new Date(),
            title: `Recording ${currentRecordingNumber}`
        };
        
        setRecordings(prev => [...prev, newRecording]);
        setRecordingTime(0);
        setCurrentRecordingNumber(prev => prev + 1);
    };

    const generateSummary = () => {
        if (recordings.length === 0) {
            alert('No recordings available to generate summary');
            return;
        }
        
        setIsGenerating(true);
        setTimeout(() => {
            const summary = {
                chiefComplaint: `${currentPatient.condition} - Based on comprehensive analysis of all consultation recordings, patient presents with primary concern requiring medical attention.`,
                historyPresent: `Throughout the consultation sessions, patient ${currentPatient.name} described ${currentPatient.condition.toLowerCase()} with detailed symptom progression.`,
                physicalExam: `Comprehensive examination documented across multiple recording sessions. ${currentPatient.status === 'critical' ? 'Patient shows signs of distress with concerning vital parameters.' : 'Patient appears comfortable with stable vital signs.'}`,
                assessment: `Comprehensive assessment based on ${recordings.length} consultation recordings: ${currentPatient.condition} in ${currentPatient.age}-year-old patient.`,
                plan: `Based on comprehensive consultation analysis: ${currentPatient.status === 'critical' ? 'Immediate intervention required, continuous monitoring, specialized care consultation.' : 'Continue current management plan, scheduled follow-up care, patient education reinforcement.'}`,
                timestamp: new Date(),
                recordingsAnalyzed: recordings.length,
                processingTime: 4
            };
            
            setAiSummary(summary);
            setShowAISummary(true);
            setIsGenerating(false);
            populateFormFromSummary(summary);
        }, 4000);
    };

    const populateFormFromSummary = (summary) => {
        // Append AI summary to existing form data instead of replacing
        setFormData(prev => ({
            chiefComplaint: prev.chiefComplaint ? 
                `${prev.chiefComplaint}\n\n--- AI Generated Summary ---\n${summary.chiefComplaint}` : 
                summary.chiefComplaint,
            historyPresent: prev.historyPresent ? 
                `${prev.historyPresent}\n\n--- AI Generated Summary ---\n${summary.historyPresent}` : 
                summary.historyPresent,
            physicalExam: prev.physicalExam ? 
                `${prev.physicalExam}\n\n--- AI Generated Summary ---\n${summary.physicalExam}` : 
                summary.physicalExam,
            assessment: prev.assessment ? 
                `${prev.assessment}\n\n--- AI Generated Summary ---\n${summary.assessment}` : 
                summary.assessment,
            plan: prev.plan ? 
                `${prev.plan}\n\n--- AI Generated Summary ---\n${summary.plan}` : 
                summary.plan
        }));
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleDownloadSummary = () => {
        alert('Download PDF functionality - feature coming soon!');
    };

    const handleShareSummary = () => {
        alert('Share with team functionality - feature coming soon!');
    };

    const handleCopySummary = () => {
        const summaryText = `
Chief Complaint: ${aiSummary.chiefComplaint}

History of Present Illness: ${aiSummary.historyPresent}

Physical Examination: ${aiSummary.physicalExam}

Assessment: ${aiSummary.assessment}

Plan: ${aiSummary.plan}
        `.trim();
        
        navigator.clipboard.writeText(summaryText).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    const completeConsultation = () => {
        alert(`Consultation completed for ${currentPatient?.name} with ${recordings.length} recordings`);
        setTimeout(() => {
            router.push(`/patient-details?id=${currentPatient?.id}`);
        }, 1000);
    };

    const handleBack = () => {
        router.back();
    };

    const handleNotifications = () => {
        const notifications = [
            "Recording auto-saved",
            "Patient vitals updated", 
            "Lab results available"
        ];
        alert(`Notifications:\n${notifications.join('\n')}`);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        router.push('/login');
    };

    if (!currentPatient || !user) {
        return <LoadingScreen message="Loading consultation..." />;
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50 font-sans overflow-hidden">
            {/* Compact Header - Consistent with Doctor/Nurse Dashboard */}
            <div className="flex-shrink-0 bg-gray-900 text-white px-4 py-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleBack}
                        className="px-2 py-1 bg-white/10 rounded text-xs hover:bg-white/20"
                    >
                        ← Back
                    </button>
                    <span className="font-bold">MedAssist AI</span>
                    <span>{user.name} ({user.role})</span>
                    <span className="text-green-400">New Consultation</span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleNotifications} className="px-2 py-1 bg-white/10 rounded text-xs">
                        🔔 {3}
                    </button>
                    <button onClick={handleLogout} className="px-2 py-1 bg-red-600 rounded text-xs">
                        Logout
                    </button>
                </div>
            </div>

            {/* Patient Header - Ultra Compact */}
            <div className="flex-shrink-0 px-3 py-1 bg-white border-b">
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold ${currentPatient.status === 'critical' ? 'bg-red-600' : 'bg-gray-600'}`}>
                            {currentPatient.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-sm">{currentPatient.name}</span>
                            <span>Age {currentPatient.age}</span>
                            <span>Room {currentPatient.room}</span>
                            <span>ID: {currentPatient.id}</span>
                            <Badge variant={currentPatient.status === 'critical' ? 'destructive' : 'secondary'} className="text-xs px-1 py-0">
                                {currentPatient.status}
                            </Badge>
                            <span className="text-gray-500">{new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-2">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                    {/* Recording Controls - 1/3 width */}
                    <div className="lg:col-span-1">
                        <RecordingControls 
                            isRecording={isRecording}
                            isPaused={isPaused}
                            recordingTime={recordingTime}
                            currentRecordingNumber={currentRecordingNumber}
                            recordings={recordings}
                            isGenerating={isGenerating}
                            onStartRecording={startRecording}
                            onPauseRecording={pauseRecording}
                            onStopRecording={stopRecording}
                            onGenerateSummary={generateSummary}
                        />
                    </div>

                    {/* Consultation Form - 2/3 width */}
                    <div className="lg:col-span-2">
                        <ConsultationForm 
                            formData={formData}
                            onInputChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* AI Generated Summary */}
                {showAISummary && aiSummary && (
                    <div className="col-span-full mt-2">
                        <SummarySection 
                            summary={aiSummary}
                            onDownload={handleDownloadSummary}
                            onShare={handleShareSummary}
                            onCopy={handleCopySummary}
                            copySuccess={copySuccess}
                        />
                    </div>
                )}

                {/* Save Consultation - Compact */}
                <div className="mt-2 mb-4">
                    <div className="bg-white rounded border p-2">
                        <div className="flex items-center justify-between text-xs">
                            <div>
                                <span className="font-semibold">Save Consultation</span>
                                <span className="text-gray-500 ml-2">Will be added to patient record</span>
                            </div>
                            <div className="flex gap-1">
                                <Button 
                                    onClick={() => alert('Consultation saved as draft')}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs px-2 py-1 h-6"
                                >
                                    💾 Draft
                                </Button>
                                <Button 
                                    onClick={completeConsultation}
                                    size="sm"
                                    className="text-xs px-2 py-1 h-6"
                                >
                                    ✅ Complete
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function ConsultationPage() {
    return (
        <ErrorBoundary>
            <Suspense fallback={<LoadingScreen message="Loading consultation..." />}>
                <ConsultationPageContent />
            </Suspense>
        </ErrorBoundary>
    );
}
