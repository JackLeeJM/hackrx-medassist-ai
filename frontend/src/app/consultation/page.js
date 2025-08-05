'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// Mock patients data
const mockPatients = [
    { 
        id: "P001", 
        name: "Maria Rodriguez", 
        room: "302", 
        age: 67, 
        condition: "Post-op complications", 
        status: "critical"
    },
    { 
        id: "P002", 
        name: "James Wilson", 
        room: "418", 
        age: 45, 
        condition: "Chest pain", 
        status: "critical"
    },
    { 
        id: "P003", 
        name: "Emma Thompson", 
        room: "205", 
        age: 34, 
        condition: "Follow-up", 
        status: "stable"
    },
    { 
        id: "P004", 
        name: "Michael Chen", 
        room: "301", 
        age: 52, 
        condition: "New patient", 
        status: "stable"
    },
    { 
        id: "P005", 
        name: "Lisa Parker", 
        room: "156", 
        age: 28, 
        condition: "Routine checkup", 
        status: "stable"
    },
    { 
        id: "P006", 
        name: "David Brown", 
        room: "223", 
        age: 61, 
        condition: "Diabetes management", 
        status: "stable"
    },
    { 
        id: "P007", 
        name: "Sarah Johnson", 
        room: "334", 
        age: 39, 
        condition: "Hypertension", 
        status: "stable"
    },
    { 
        id: "P008", 
        name: "Robert Davis", 
        room: "412", 
        age: 55, 
        condition: "Cardiac monitoring", 
        status: "critical"
    },
    { 
        id: "P009", 
        name: "Jennifer Miller", 
        room: "289", 
        age: 42, 
        condition: "Post-surgery", 
        status: "stable"
    },
    { 
        id: "P010", 
        name: "William Garcia", 
        room: "367", 
        age: 33, 
        condition: "Emergency admission", 
        status: "critical"
    }
];

export default function ConsultationPage() {
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

        const patient = mockPatients.find(p => p.id === patientId);
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
            setShowAISummary(true);
            setIsGenerating(false);
            populateFormFromSummary();
        }, 4000);
    };

    const populateFormFromSummary = () => {
        if (!currentPatient) return;
        
        setFormData({
            chiefComplaint: `${currentPatient.condition} - Based on comprehensive analysis of all consultation recordings, patient presents with primary concern requiring medical attention.`,
            historyPresent: `Throughout the consultation sessions, patient ${currentPatient.name} described ${currentPatient.condition.toLowerCase()} with detailed symptom progression.`,
            physicalExam: `Comprehensive examination documented across multiple recording sessions. ${currentPatient.status === 'critical' ? 'Patient shows signs of distress with concerning vital parameters.' : 'Patient appears comfortable with stable vital signs.'}`,
            assessment: `Comprehensive assessment based on ${recordings.length} consultation recordings: ${currentPatient.condition} in ${currentPatient.age}-year-old patient.`,
            plan: `Based on comprehensive consultation analysis: ${currentPatient.status === 'critical' ? 'Immediate intervention required, continuous monitoring, specialized care consultation.' : 'Continue current management plan, scheduled follow-up care, patient education reinforcement.'}`
        });
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const completeConsultation = () => {
        alert(`Consultation completed for ${currentPatient?.name} with ${recordings.length} recordings`);
        setTimeout(() => {
            router.push(`/patient-details?id=${currentPatient?.id}`);
        }, 1000);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (!currentPatient) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            {/* Header */}
            <header className="bg-gray-900 text-white px-8 py-4 shadow-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => router.back()} 
                            className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors"
                        >
                            <i className="fas fa-arrow-left"></i>
                        </button>
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-semibold mb-1">
                                <i className="fas fa-stethoscope text-gray-300 mr-2"></i>
                                New Consultation
                            </h1>
                            <span className="text-white/90 text-sm">Dr. Sarah Johnson</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                            <i className="fas fa-clock"></i>
                            <span className="font-medium">2h 15m saved today</span>
                        </div>
                        <button className="relative bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors">
                            <i className="fas fa-bell"></i>
                            <span className="absolute -top-1 -right-1 bg-gray-600 text-xs px-2 py-1 rounded-full min-w-[18px] text-center">3</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
                {/* Patient Info Header */}
                <section className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 ${currentPatient.status === 'critical' ? 'bg-gray-800' : 'bg-gray-600'} rounded-xl flex items-center justify-center text-white text-xl`}>
                            <i className={currentPatient.status === 'critical' ? 'fas fa-exclamation-triangle' : 'fas fa-user'}></i>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">{currentPatient.name}</h2>
                            <div className="flex items-center gap-4 text-gray-600 text-sm">
                                <span>Age {currentPatient.age} • Room {currentPatient.room} • ID: {currentPatient.id}</span>
                                <span className="bg-gray-100 px-2 py-1 rounded">Today - {new Date().toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Consultation Recording */}
                    <section className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-gray-800">
                                <i className="fas fa-microphone text-gray-700 mr-2"></i>
                                Voice Recording
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <div className={`w-2 h-2 rounded-full ${isRecording && !isPaused ? 'bg-red-500 animate-pulse' : isPaused ? 'bg-yellow-500' : 'bg-gray-400'}`}></div>
                                <span>{isRecording && !isPaused ? 'Recording...' : isPaused ? 'Paused' : 'Ready to record'}</span>
                            </div>
                        </div>

                        {/* Recording Controls */}
                        <div className="text-center mb-6">
                            <div className="flex items-center justify-center gap-4 mb-4">
                                {!isRecording ? (
                                    <button 
                                        onClick={startRecording}
                                        className="w-16 h-16 bg-gray-800 hover:bg-gray-700 text-white rounded-full flex items-center justify-center text-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        <i className="fas fa-microphone"></i>
                                    </button>
                                ) : (
                                    <>
                                        <button 
                                            onClick={pauseRecording}
                                            className="w-16 h-16 bg-yellow-600 hover:bg-yellow-700 text-white rounded-full flex items-center justify-center text-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                                        >
                                            <i className={`fas ${isPaused ? 'fa-play' : 'fa-pause'}`}></i>
                                        </button>
                                        <button 
                                            onClick={stopRecording}
                                            className="w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                                        >
                                            <i className="fas fa-stop"></i>
                                        </button>
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

                        {/* Multiple Recordings List */}
                        {recordings.length > 0 && (
                            <div className="space-y-3 mb-6">
                                {recordings.map((recording) => (
                                    <div key={recording.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center text-white">
                                                <i className="fas fa-microphone"></i>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-800">{recording.title}</h4>
                                                <p className="text-sm text-gray-600">{formatTime(recording.duration)} • {recording.timestamp.toLocaleTimeString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Generate Summary Action */}
                        {recordings.length > 0 && (
                            <div>
                                <button 
                                    onClick={generateSummary}
                                    disabled={isGenerating}
                                    className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-medium disabled:opacity-50"
                                >
                                    <i className={`fas ${isGenerating ? 'fa-spinner fa-spin' : 'fa-magic'} mr-2`}></i>
                                    {isGenerating ? 'Analyzing All Recordings...' : 'Generate Summary from All Recordings'}
                                </button>
                                <p className="text-sm text-gray-500 mt-2 text-center">
                                    AI will analyze all {recordings.length} recording(s) to create a comprehensive summary
                                </p>
                            </div>
                        )}
                    </section>

                    {/* Consultation Notes */}
                    <section className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">
                            <i className="fas fa-notes-medical text-gray-700 mr-2"></i>
                            Consultation Notes
                        </h3>

                        <form className="space-y-6">
                            {/* Chief Complaint */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Chief Complaint</label>
                                <textarea 
                                    rows="3" 
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none" 
                                    placeholder="Patient's primary concern or reason for visit..."
                                    value={formData.chiefComplaint}
                                    onChange={(e) => handleInputChange('chiefComplaint', e.target.value)}
                                />
                            </div>

                            {/* History of Present Illness */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">History of Present Illness</label>
                                <textarea 
                                    rows="4" 
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none" 
                                    placeholder="Detailed description of current symptoms and timeline..."
                                    value={formData.historyPresent}
                                    onChange={(e) => handleInputChange('historyPresent', e.target.value)}
                                />
                            </div>

                            {/* Physical Examination */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Physical Examination</label>
                                <textarea 
                                    rows="3" 
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none" 
                                    placeholder="Physical examination findings..."
                                    value={formData.physicalExam}
                                    onChange={(e) => handleInputChange('physicalExam', e.target.value)}
                                />
                            </div>

                            {/* Assessment */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Assessment</label>
                                <textarea 
                                    rows="3" 
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none" 
                                    placeholder="Clinical assessment and diagnosis..."
                                    value={formData.assessment}
                                    onChange={(e) => handleInputChange('assessment', e.target.value)}
                                />
                            </div>

                            {/* Plan */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Plan</label>
                                <textarea 
                                    rows="3" 
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none" 
                                    placeholder="Treatment plan and next steps..."
                                    value={formData.plan}
                                    onChange={(e) => handleInputChange('plan', e.target.value)}
                                />
                            </div>
                        </form>
                    </section>
                </div>

                {/* AI Generated Summary */}
                {showAISummary && (
                    <section className="bg-white rounded-xl shadow-sm p-6 mt-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-gray-800">
                                <i className="fas fa-brain text-gray-700 mr-2"></i>
                                AI Generated Summary
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-green-600">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>Generated from voice recording</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <i className="fas fa-info-circle text-blue-600"></i>
                                    <h4 className="font-medium text-blue-800">AI Comprehensive Analysis</h4>
                                </div>
                                <p className="text-blue-700 text-sm">Analyzed {recordings.length} recording(s) for comprehensive consultation summary</p>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-medium text-gray-800 mb-3">Overall Consultation Summary</h4>
                                <p className="text-gray-600">
                                    Patient {currentPatient.name} underwent comprehensive consultation consisting of {recordings.length} recorded sessions. 
                                    {currentPatient.status === 'critical' ? ' This is a critical case requiring immediate attention and thorough documentation.' : ' Patient consultation proceeded systematically with detailed assessment.'}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button 
                                onClick={() => alert(`Summary from ${recordings.length} recordings accepted and saved to patient record`)}
                                className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <i className="fas fa-check mr-2"></i>
                                Accept & Save
                            </button>
                            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                                <i className="fas fa-edit mr-2"></i>
                                Edit Summary
                            </button>
                            <button 
                                onClick={generateSummary}
                                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <i className="fas fa-redo mr-2"></i>
                                Regenerate
                            </button>
                        </div>
                    </section>
                )}

                {/* Save Consultation */}
                <section className="bg-white rounded-xl shadow-sm p-6 mt-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Save Consultation</h3>
                            <p className="text-gray-600 text-sm">This consultation will be added to the patient's medical record</p>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => alert('Consultation saved as draft')}
                                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <i className="fas fa-save mr-2"></i>
                                Save as Draft
                            </button>
                            <button 
                                onClick={completeConsultation}
                                className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                            >
                                <i className="fas fa-check-circle mr-2"></i>
                                Complete Consultation
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}