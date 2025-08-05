'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// Import components
import Header from '@/components/layout/Header';
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
        setFormData({
            chiefComplaint: summary.chiefComplaint,
            historyPresent: summary.historyPresent,
            physicalExam: summary.physicalExam,
            assessment: summary.assessment,
            plan: summary.plan
        });
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
        alert('Notifications - feature coming soon!');
    };

    if (!currentPatient) {
        return <LoadingScreen message="Loading consultation..." />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            {/* Header */}
            <Header 
                onBack={handleBack}
                timeSaved="2h 15m"
                notificationCount={3}
                onNotifications={handleNotifications}
                title="New Consultation"
                subtitle="Dr. Sarah Johnson"
                showBackButton={true}
            />

            {/* Main Content */}
            <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
                {/* Patient Info Header */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 ${currentPatient.status === 'critical' ? 'bg-red-600' : 'bg-green-600'} rounded-xl flex items-center justify-center text-white text-xl`}>
                                {currentPatient.status === 'critical' ? <AlertTriangle className="w-8 h-8" /> : <User className="w-8 h-8" />}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-1">{currentPatient.name}</h2>
                                <div className="flex items-center gap-4 text-gray-600 text-sm">
                                    <span>Age {currentPatient.age} • Room {currentPatient.room} • ID: {currentPatient.id}</span>
                                    <Badge variant="outline">Today - {new Date().toLocaleString()}</Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recording Controls */}
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

                    {/* Consultation Form */}
                    <ConsultationForm 
                        formData={formData}
                        onInputChange={handleInputChange}
                    />
                </div>

                {/* AI Generated Summary */}
                {showAISummary && aiSummary && (
                    <div className="mt-8">
                        <SummarySection 
                            summary={aiSummary}
                            onDownload={handleDownloadSummary}
                            onShare={handleShareSummary}
                            onCopy={handleCopySummary}
                            copySuccess={copySuccess}
                        />
                    </div>
                )}

                {/* Save Consultation */}
                <Card className="mt-8">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Save Consultation</h3>
                                <p className="text-gray-600 text-sm">This consultation will be added to the patient's medical record</p>
                            </div>
                            <div className="flex gap-3">
                                <Button 
                                    onClick={() => alert('Consultation saved as draft')}
                                    variant="outline"
                                    size="lg"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save as Draft
                                </Button>
                                <Button 
                                    onClick={completeConsultation}
                                    size="lg"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Complete Consultation
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
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
