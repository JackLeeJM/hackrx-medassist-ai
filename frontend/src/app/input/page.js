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
// RecordingControls removed per new design
import AudioRecorder from '@/components/ui/AudioRecorder';
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
    const [uploading, setUploading] = useState(false);
    const [uploadInfo, setUploadInfo] = useState(null);
    const [transcribeOp, setTranscribeOp] = useState(null);
    const [transcribeStatus, setTranscribeStatus] = useState('idle');
    const pollRef = useRef(null);
    const [transcriptText, setTranscriptText] = useState('');
    const [pipelineStatus, setPipelineStatus] = useState('idle'); // idle|summarizing|reviewing|finalising|done|error
    const [pipelineNote, setPipelineNote] = useState('');
    const [pipelineApproved, setPipelineApproved] = useState(null); // null|boolean
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

    // New: handle audio blob from the actual recorder component and upload to GCS via signed URL
    const handleRecordingComplete = async (blob) => {
        try {
            setUploading(true);
            setUploadInfo(null);
            const contentType = blob?.type || 'audio/webm';
            const fileExt = contentType.includes('mp4') ? 'mp4' : 'webm';
            const fileName = `consultation-${Date.now()}.${fileExt}`;

            const res = await fetch('/api/audio/upload-init', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contentType, fileName, languageCode: 'en-US' }),
            });
            const data = await res.json();
            if (!res.ok || !data?.uploadUrl) {
                throw new Error(data?.error || 'Failed to init upload');
            }

            const putRes = await fetch(data.uploadUrl, {
                method: 'PUT',
                headers: { 'Content-Type': contentType },
                body: blob,
            });
            if (!putRes.ok) {
                throw new Error(`Upload failed with status ${putRes.status}`);
            }

            setUploadInfo({ gcsUri: data.gcsUri, conversation: data.conversation });

            // Immediately start transcription
            const startRes = await fetch('/api/transcribe/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gcsUri: data.gcsUri, languageCode: 'en-US' }),
            });
            const startJson = await startRes.json();
            if (!startRes.ok || !startJson?.operationName) {
                throw new Error(startJson?.error || 'Failed to start transcription');
            }
            setTranscribeOp(startJson.operationName);
            setTranscribeStatus('processing');

            // Poll status every 5s until done
            if (pollRef.current) clearInterval(pollRef.current);
            pollRef.current = setInterval(async () => {
                try {
                    const sres = await fetch(`/api/transcribe/status?operationName=${encodeURIComponent(startJson.operationName)}`);
                    const sjson = await sres.json();
                    if (!sres.ok) throw new Error(sjson?.error || 'status error');
                    if (sjson.done) {
                        clearInterval(pollRef.current);
                        setTranscribeStatus('done');
                        const t = sjson.transcript || '';
                        setTranscriptText(t);
                        if (t) {
                            setFormData(prev => ({ ...prev, chiefComplaint: t }));
                        }
                        // Start AI pipeline automatically
                        runAIPipeline(t);
                    }
                } catch (e) {
                    clearInterval(pollRef.current);
                    setTranscribeStatus('error');
                    alert(`Transcription polling failed: ${e?.message || e}`);
                }
            }, 5000);
        } catch (err) {
            alert(`Upload error: ${err?.message || err}`);
        } finally {
            setUploading(false);
        }
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
        if (!aiSummary) return;
        const summaryText = `
Chief Complaint: ${aiSummary.chiefComplaint || ''}

History of Present Illness: ${aiSummary.historyPresent || ''}

Vital Signs: ${aiSummary.vitalSigns || ''}

Physical Examination: ${aiSummary.physicalExam || ''}

Assessment: ${aiSummary.assessment || ''}

Plan: ${aiSummary.plan || ''}
        `.trim();
        
        navigator.clipboard.writeText(summaryText).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    // Runs summarize -> review -> finalise and fills the form based on rules
    const runAIPipeline = async (transcript) => {
        if (!transcript?.trim()) return;
        try {
            setPipelineStatus('summarizing');
            setPipelineNote('');
            setPipelineApproved(null);

            const sRes = await fetch('/api/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transcript, patientContext: { patientId: currentPatient?.id } }),
            });
            const sJson = await sRes.json();
            if (!sRes.ok || !sJson?.ok) throw new Error(sJson?.error || 'summarize failed');

            setPipelineStatus('reviewing');
            const rRes = await fetch('/api/review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transcript, proposedJson: sJson.summaryJson }),
            });
            const rJson = await rRes.json();
            if (!rRes.ok || !rJson?.ok) throw new Error(rJson?.error || 'review failed');

            setPipelineStatus('finalising');
            const fRes = await fetch('/api/finalise', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ review: rJson.review }),
            });
            const fJson = await fRes.json();
            if (!fRes.ok || !fJson?.ok) throw new Error(fJson?.error || 'finalise failed');

            setPipelineApproved(Boolean(fJson.approved));
            setPipelineNote(fJson?.notes || '');
            setPipelineStatus('done');

            // Apply mapping to form (always fill regardless of verdict)
            const fields =
                fJson.fields ||
                rJson?.review?.finalJson ||
                sJson?.summaryJson ||
                {};
            setFormData(prev => ({
                ...prev,
                chiefComplaint: fields.chiefComplaint ?? prev.chiefComplaint,
                historyPresent: fields.historyPresent ?? prev.historyPresent,
                vitalSigns: fields.vitalSigns ?? prev.vitalSigns,
                physicalExam: fields.physicalExam ?? prev.physicalExam,
                assessment: fields.assessment ?? prev.assessment,
                plan: fields.plan ?? prev.plan,
            }));
        } catch (err) {
            setPipelineStatus('error');
            setPipelineNote(err?.message || String(err));
        }
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
        if (currentPatient?.id) {
            router.push(`/patient-details?id=${currentPatient.id}`);
        } else {
            router.push('/');
        }
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
                    {/* Left column: Start Recording + Conversation Transcription */}
                    <div className="lg:col-span-1 space-y-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Start Recording</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <AudioRecorder onRecordingComplete={handleRecordingComplete} cta />
                                {uploading && (
                                    <div className="text-xs text-gray-500 mt-2">Uploading audio...</div>
                                )}
                                {uploadInfo && (
                                    <div className="text-xs text-green-600 mt-2 break-all">Uploaded to: {uploadInfo.gcsUri}</div>
                                )}
                                {transcribeStatus !== 'idle' && (
                                    <div className="text-xs mt-2">Transcription status: {transcribeStatus}</div>
                                )}
                                {pipelineStatus !== 'idle' && (
                                    <div className="text-xs mt-2">AI pipeline: {pipelineStatus}</div>
                                )}
                                {pipelineStatus === 'done' && pipelineApproved === false && (
                                    <div className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 p-2 rounded">
                                        {pipelineNote || 'Manual clinician review required.'}
                                    </div>
                                )}
                                {pipelineStatus === 'done' && pipelineApproved === true && (
                                    <div className="mt-2 text-xs text-green-700 bg-green-50 border border-green-200 p-2 rounded">
                                        AI reviewed pass
                                    </div>
                                )}
                                {pipelineStatus === 'error' && (
                                    <div className="mt-2 text-xs text-red-700 bg-red-50 border border-red-200 p-2 rounded">
                                        {pipelineNote}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Conversation Transcription</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {transcribeStatus === 'processing' && (
                                    <div className="text-sm text-gray-600">Processing audio… your transcript will appear here.</div>
                                )}
                                {transcribeStatus === 'error' && (
                                    <div className="text-sm text-red-600">Transcription failed. Please try recording again.</div>
                                )}
                                {transcribeStatus === 'done' && (
                                    <div className="text-sm whitespace-pre-wrap break-words">{transcriptText || 'No text extracted.'}</div>
                                )}
                                {transcribeStatus === 'idle' && (
                                    <div className="text-sm text-gray-500">Record a conversation to see the transcript.</div>
                                )}
                            </CardContent>
                        </Card>
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
