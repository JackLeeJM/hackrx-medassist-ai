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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

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
        vitalSigns: '',
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
            timestamp: '2024-01-15T10:00:00Z',
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
                vitalSigns: `BP: ${currentPatient.vitals.bp}, HR: ${currentPatient.vitals.hr} bpm, Temp: ${currentPatient.vitals.temp}°F, O2Sat: ${currentPatient.vitals.o2sat}%. ${currentPatient.status === 'critical' ? 'Vitals indicate acute distress requiring immediate attention.' : 'Vital signs within acceptable ranges for current condition.'}`,
                physicalExam: `Comprehensive examination documented across multiple recording sessions. ${currentPatient.status === 'critical' ? 'Patient shows signs of distress with concerning findings.' : 'Patient appears comfortable with stable examination findings.'}`,
                assessment: `Comprehensive assessment based on ${recordings.length} consultation recordings: ${currentPatient.condition} in ${currentPatient.age}-year-old patient.`,
                plan: `Based on comprehensive consultation analysis: ${currentPatient.status === 'critical' ? 'Immediate intervention required, continuous monitoring, specialized care consultation.' : 'Continue current management plan, scheduled follow-up care, patient education reinforcement.'}`,
                timestamp: '2024-01-15T10:00:00Z',
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
            vitalSigns: prev.vitalSigns ? 
                `${prev.vitalSigns}\n\n--- AI Generated Summary ---\n${summary.vitalSigns}` : 
                summary.vitalSigns,
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

Vital Signs: ${aiSummary.vitalSigns}

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
        // Parse and route data to appropriate tabs
        const inputData = {
            patientId: currentPatient?.id,
            timestamp: new Date().toISOString(),
            vitalSigns: formData.vitalSigns,
            treatmentPlan: formData.plan,
            clinicalNote: {
                subjective: formData.chiefComplaint,
                history: formData.historyPresent,
                objective: formData.physicalExam,
                assessment: formData.assessment
            }
        };

        // Store the data in localStorage for the patient details page to pick up
        const existingData = JSON.parse(localStorage.getItem('patientUpdates') || '{}');
        if (!existingData[currentPatient?.id]) {
            existingData[currentPatient?.id] = [];
        }
        existingData[currentPatient?.id].push(inputData);
        localStorage.setItem('patientUpdates', JSON.stringify(existingData));

        // Debug: Show what data is being saved
        console.log('Saving input data:', inputData);
        console.log('All patient updates:', existingData);

        alert(`Clinical input completed for ${currentPatient?.name} - data routed to appropriate tabs`);
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
        <div className="h-screen flex flex-col bg-background text-foreground font-sans overflow-hidden">
            <Header
                showBackButton={true}
                onBack={handleBack}
                onLogout={handleLogout}
                onProfile={() => alert('Profile page - feature coming soon!')}
                userName={user.name}
                userEmail={user.email}
                notificationCount={3}
            />

            {/* Patient Overview Row - Same as patient-details page */}
            <div className="flex-shrink-0 px-3 py-1 bg-card border-b">
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-sm">{currentPatient.name}</span>
                            <span>Age {currentPatient.age}</span>
                            {/* Only show room for inpatients */}
                            {currentPatient.id !== 'P020' && <span>Room {currentPatient.room}</span>}
                            <span>IC: {(() => {
                                // Generate IC number based on patient data
                                const birthYear = 2024 - currentPatient.age;
                                const yy = birthYear.toString().slice(-2);
                                const mm = currentPatient.id === 'P020' ? '03' : // March for Nurul Asyikin
                                          '03'; // March for others
                                const dd = currentPatient.id === 'P020' ? '12' :
                                          '10';
                                const kl = currentPatient.id === 'P020' ? '10' : // Selangor
                                          '10'; // Selangor
                                const serial = currentPatient.id === 'P020' ? '9876' :
                                              '9012';
                                return `${yy}${mm}${dd}-${kl}-${serial}`;
                            })()}</span>
                            <Badge variant={currentPatient.status === 'critical' ? 'destructive' : 'secondary'} className="text-xs px-1 py-0">
                                {currentPatient.status}
                            </Badge>
                            <span className="font-medium">{currentPatient.condition}</span>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <Button 
                            onClick={() => alert('Clinical note saved as draft')}
                            variant="outline"
                            size="sm"
                            className="text-xs px-2 py-1 h-6"
                        >
                            <FontAwesomeIcon icon={faSave} className="mr-1" />Draft
                        </Button>
                        <Button 
                            onClick={completeConsultation}
                            size="sm"
                            className="text-xs px-2 py-1 h-6"
                        >
                            <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />Save Note
                        </Button>
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
