'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// Mock patients data
const mockPatients = [
    { 
        id: "P001", 
        name: "Maria Rodriguez", 
        room: "302", 
        age: 67, 
        condition: "Post-op complications", 
        status: "critical",
        vitals: { bp: "180/110", hr: "125", temp: "101.2", o2sat: "94" },
        insights: "Patient showing signs of post-operative infection. Elevated white blood cell count and fever indicate possible surgical site infection. Recommend immediate antibiotic therapy and close monitoring.",
        timeline: [
            { type: "surgery", action: "Abdominal Surgery - Appendectomy", time: "3 days ago", date: "March 11, 2024", icon: "fas fa-scalpel", status: "completed", details: "Laparoscopic appendectomy performed successfully. No immediate complications observed." },
            { type: "consultation", action: "Post-Operative Consultation", time: "2 days ago", date: "March 12, 2024", icon: "fas fa-user-md", status: "completed", details: "Initial post-op assessment. Patient reported mild pain, vital signs stable." },
            { type: "lab", action: "Blood Work - CBC with Differential", time: "1 day ago", date: "March 13, 2024", icon: "fas fa-vial", status: "completed", details: "Elevated WBC count (15,000), indicating possible infection. CRP elevated." },
            { type: "medication", action: "Antibiotic Therapy Started", time: "1 day ago", date: "March 13, 2024", icon: "fas fa-pills", status: "ongoing", details: "Started on Ceftriaxone 1g IV daily for suspected surgical site infection." },
            { type: "monitoring", action: "Continuous Vital Monitoring", time: "ongoing", date: "March 14, 2024", icon: "fas fa-heartbeat", status: "active", details: "Hourly vital signs monitoring. Fever persisting, blood pressure elevated." },
            { type: "imaging", action: "CT Scan Scheduled", time: "scheduled", date: "March 14, 2024", icon: "fas fa-x-ray", status: "pending", details: "CT abdomen/pelvis to evaluate for complications or abscess formation." }
        ]
    },
    { 
        id: "P002", 
        name: "James Wilson", 
        room: "418", 
        age: 45, 
        condition: "Chest pain", 
        status: "critical",
        vitals: { bp: "140/95", hr: "88", temp: "98.6", o2sat: "98" },
        insights: "Elevated troponin levels suggest acute myocardial infarction. EKG changes consistent with STEMI. Patient requires immediate cardiac catheterization and possible PCI intervention.",
        timeline: [
            { type: "emergency", action: "Emergency admission", time: "6 hours ago", date: "March 14, 2024", icon: "fas fa-ambulance", status: "completed", details: "Patient presented with acute chest pain and shortness of breath." },
            { type: "diagnostic", action: "EKG performed", time: "5 hours ago", date: "March 14, 2024", icon: "fas fa-heartbeat", status: "completed", details: "EKG shows ST elevation consistent with anterior STEMI." },
            { type: "lab", action: "Lab results reviewed", time: "3 hours ago", date: "March 14, 2024", icon: "fas fa-vial", status: "completed", details: "Troponin levels significantly elevated, confirming myocardial infarction." }
        ]
    },
    { 
        id: "P003", 
        name: "Emma Thompson", 
        room: "205", 
        age: 34, 
        condition: "Follow-up", 
        status: "stable",
        vitals: { bp: "120/80", hr: "72", temp: "98.4", o2sat: "99" },
        insights: "Patient recovering well from previous treatment. All vital signs within normal limits. Ready for discharge pending final consultation.",
        timeline: [
            { type: "consultation", action: "Follow-up consultation", time: "1 hour ago", date: "March 14, 2024", icon: "fas fa-user-md", status: "completed", details: "Patient reports feeling well, no new symptoms." },
            { type: "vitals", action: "Vitals check", time: "3 hours ago", date: "March 14, 2024", icon: "fas fa-thermometer", status: "completed", details: "All vital signs stable and within normal ranges." },
            { type: "medication", action: "Medication review", time: "5 hours ago", date: "March 14, 2024", icon: "fas fa-pills", status: "completed", details: "Current medications reviewed, no changes needed." }
        ]
    },
    { 
        id: "P004", 
        name: "Michael Chen", 
        room: "301", 
        age: 52, 
        condition: "New patient", 
        status: "stable",
        vitals: { bp: "130/85", hr: "78", temp: "98.2", o2sat: "97" },
        insights: "Initial assessment shows mild hypertension. Patient history indicates family history of cardiovascular disease. Recommend lifestyle modifications and monitoring.",
        timeline: [
            { type: "assessment", action: "Initial assessment", time: "30 minutes ago", date: "March 14, 2024", icon: "fas fa-clipboard", status: "completed", details: "Comprehensive initial patient assessment completed." },
            { type: "history", action: "Medical history taken", time: "45 minutes ago", date: "March 14, 2024", icon: "fas fa-notes-medical", status: "completed", details: "Detailed medical and family history documented." },
            { type: "admission", action: "Admission processing", time: "1 hour ago", date: "March 14, 2024", icon: "fas fa-hospital", status: "completed", details: "Patient admitted for observation and further evaluation." }
        ]
    },
    { 
        id: "P005", 
        name: "Lisa Parker", 
        room: "156", 
        age: 28, 
        condition: "Routine checkup", 
        status: "stable",
        vitals: { bp: "115/75", hr: "68", temp: "98.1", o2sat: "100" },
        insights: "Excellent health status. All parameters within optimal ranges. Patient maintains good lifestyle habits and regular exercise routine.",
        timeline: [
            { type: "examination", action: "Routine examination", time: "2 hours ago", date: "March 14, 2024", icon: "fas fa-stethoscope", status: "completed", details: "Comprehensive physical examination completed, all normal." },
            { type: "lab", action: "Blood work completed", time: "3 hours ago", date: "March 14, 2024", icon: "fas fa-vial", status: "completed", details: "Complete blood panel within normal limits." },
            { type: "checkin", action: "Check-in", time: "4 hours ago", date: "March 14, 2024", icon: "fas fa-check-circle", status: "completed", details: "Patient checked in for routine annual physical." }
        ]
    },
    { 
        id: "P006", 
        name: "David Brown", 
        room: "223", 
        age: 61, 
        condition: "Diabetes management", 
        status: "stable",
        vitals: { bp: "135/88", hr: "75", temp: "98.3", o2sat: "96" },
        insights: "Blood glucose levels stabilizing with current medication regimen. HbA1c showing improvement. Continue current treatment plan with dietary counseling.",
        timeline: [
            { type: "monitoring", action: "Glucose monitoring", time: "1 hour ago", date: "March 14, 2024", icon: "fas fa-tint", status: "ongoing", details: "Regular blood glucose monitoring showing improved control." },
            { type: "medication", action: "Medication adjustment", time: "4 hours ago", date: "March 14, 2024", icon: "fas fa-pills", status: "completed", details: "Diabetes medication dosage adjusted based on recent glucose levels." },
            { type: "consultation", action: "Dietary consultation", time: "1 day ago", date: "March 13, 2024", icon: "fas fa-apple-alt", status: "completed", details: "Nutritionist consultation for diabetes management diet plan." }
        ]
    },
    { 
        id: "P007", 
        name: "Sarah Johnson", 
        room: "334", 
        age: 39, 
        condition: "Hypertension", 
        status: "stable",
        vitals: { bp: "145/92", hr: "82", temp: "98.5", o2sat: "98" },
        insights: "Blood pressure responding well to ACE inhibitor therapy. Patient showing good compliance with medication regimen. Continue monitoring and lifestyle modifications.",
        timeline: [
            { type: "monitoring", action: "BP monitoring", time: "2 hours ago", date: "March 14, 2024", icon: "fas fa-heartbeat", status: "ongoing", details: "Blood pressure monitoring shows improvement with current therapy." },
            { type: "medication", action: "Medication review", time: "6 hours ago", date: "March 14, 2024", icon: "fas fa-prescription", status: "completed", details: "Hypertension medications reviewed and optimized." },
            { type: "education", action: "Patient education", time: "1 day ago", date: "March 13, 2024", icon: "fas fa-graduation-cap", status: "completed", details: "Patient education on lifestyle modifications for hypertension management." }
        ]
    },
    { 
        id: "P008", 
        name: "Robert Davis", 
        room: "412", 
        age: 55, 
        condition: "Cardiac monitoring", 
        status: "critical",
        vitals: { bp: "160/100", hr: "95", temp: "99.1", o2sat: "95" },
        insights: "Continuous cardiac monitoring shows intermittent arrhythmias. Elevated cardiac enzymes suggest ongoing cardiac stress. Consider electrophysiology consultation.",
        timeline: [
            { type: "monitoring", action: "Cardiac monitoring", time: "Ongoing", date: "March 14, 2024", icon: "fas fa-heart", status: "active", details: "Continuous cardiac monitoring showing intermittent arrhythmias." },
            { type: "lab", action: "Enzyme levels checked", time: "2 hours ago", date: "March 14, 2024", icon: "fas fa-vial", status: "completed", details: "Cardiac enzymes elevated, indicating ongoing cardiac stress." },
            { type: "event", action: "Arrhythmia episode", time: "4 hours ago", date: "March 14, 2024", icon: "fas fa-exclamation-triangle", status: "completed", details: "Patient experienced episode of atrial fibrillation, now back in sinus rhythm." }
        ]
    },
    { 
        id: "P009", 
        name: "Jennifer Miller", 
        room: "289", 
        age: 42, 
        condition: "Post-surgery", 
        status: "stable",
        vitals: { bp: "125/82", hr: "70", temp: "98.7", o2sat: "97" },
        insights: "Post-operative recovery progressing as expected. Surgical site healing well with no signs of infection. Pain management effective with current protocol.",
        timeline: [
            { type: "examination", action: "Wound inspection", time: "1 hour ago", date: "March 14, 2024", icon: "fas fa-bandage", status: "completed", details: "Surgical site healing well, no signs of infection or complications." },
            { type: "assessment", action: "Pain assessment", time: "3 hours ago", date: "March 14, 2024", icon: "fas fa-thermometer", status: "completed", details: "Pain levels manageable with current medication protocol." },
            { type: "therapy", action: "Physical therapy", time: "6 hours ago", date: "March 14, 2024", icon: "fas fa-dumbbell", status: "completed", details: "Physical therapy session completed, patient mobility improving." }
        ]
    },
    { 
        id: "P010", 
        name: "William Garcia", 
        room: "367", 
        age: 33, 
        condition: "Emergency admission", 
        status: "critical",
        vitals: { bp: "170/105", hr: "110", temp: "102.3", o2sat: "92" },
        insights: "Acute presentation with severe abdominal pain and fever. CT scan reveals possible appendicitis with perforation. Surgical consultation requested urgently.",
        timeline: [
            { type: "emergency", action: "Emergency admission", time: "3 hours ago", date: "March 14, 2024", icon: "fas fa-ambulance", status: "completed", details: "Patient brought in by ambulance with severe abdominal pain." },
            { type: "imaging", action: "CT scan completed", time: "2 hours ago", date: "March 14, 2024", icon: "fas fa-x-ray", status: "completed", details: "CT scan shows appendicitis with possible perforation and abscess formation." },
            { type: "consultation", action: "Surgical consult", time: "1 hour ago", date: "March 14, 2024", icon: "fas fa-user-md", status: "completed", details: "General surgery consulted, recommends immediate surgical intervention." }
        ]
    }
];

function PatientDetailsPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [currentPatient, setCurrentPatient] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');

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
        
        // Initialize chat with AI greeting
        setChatMessages([{
            id: 1,
            type: 'ai',
            message: `Hello! I'm your AI assistant. I have access to ${patient.name}'s complete medical data. How can I help you today?`,
            timestamp: new Date()
        }]);
    }, [searchParams, router]);

    const startNewConsultation = () => {
        if (currentPatient) {
            console.log(`Starting new consultation for ${currentPatient.name}`);
            router.push(`/consultation?id=${currentPatient.id}`);
        } else {
            alert('Patient data not available');
        }
    };

    const sendChatMessage = () => {
        if (!chatInput.trim()) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            message: chatInput,
            timestamp: new Date()
        };

        setChatMessages(prev => [...prev, userMessage]);
        
        // Generate AI response
        setTimeout(() => {
            const aiResponse = {
                id: Date.now() + 1,
                type: 'ai',
                message: generateAIResponse(chatInput),
                timestamp: new Date()
            };
            setChatMessages(prev => [...prev, aiResponse]);
        }, 1000);

        setChatInput('');
    };

    const generateAIResponse = (userMessage) => {
        if (!currentPatient) return "I don't have access to patient data at the moment.";
        
        const patient = currentPatient;
        const message = userMessage.toLowerCase();
        
        if (message.includes('condition') || message.includes('diagnosis')) {
            return `${patient.name} is currently diagnosed with ${patient.condition}. Their status is ${patient.status}. ${patient.insights}`;
        }
        
        if (message.includes('vital') || message.includes('bp') || message.includes('heart rate')) {
            return `Current vitals for ${patient.name}: Blood pressure ${patient.vitals.bp}, Heart rate ${patient.vitals.hr} bpm, Temperature ${patient.vitals.temp}°F, Oxygen saturation ${patient.vitals.o2sat}%. ${patient.status === 'critical' ? 'These vitals require immediate attention.' : 'Vitals are within acceptable ranges.'}`;
        }
        
        if (message.includes('lab') || message.includes('result')) {
            if (patient.status === 'critical') {
                return `Recent lab results show concerning values. For ${patient.name}, elevated markers indicate the need for immediate intervention. I recommend reviewing the complete lab panel and considering additional testing.`;
            } else {
                return `Lab results for ${patient.name} are generally within normal limits. Routine monitoring continues as per protocol.`;
            }
        }
        
        if (message.includes('medication') || message.includes('drug') || message.includes('interaction')) {
            return `Based on ${patient.name}'s current condition (${patient.condition}) and medical history, I'm analyzing potential drug interactions. Always verify with the pharmacy database before prescribing new medications.`;
        }
        
        if (message.includes('next step') || message.includes('recommend')) {
            if (patient.status === 'critical') {
                return `For ${patient.name}'s critical condition, I recommend: 1) Continue close monitoring, 2) Consider escalating care if vitals don't improve, 3) Ensure patient comfort, 4) Prepare family consultation if needed.`;
            } else {
                return `For ${patient.name}: 1) Continue current treatment plan, 2) Schedule follow-up appointment, 3) Monitor for any changes, 4) Patient education on condition management.`;
            }
        }
        
        if (message.includes('history') || message.includes('background')) {
            return `${patient.name} is a ${patient.age}-year-old patient in room ${patient.room}. Current condition: ${patient.condition}. The AI has synthesized data from EMR, lab results, vital signs, and clinical notes to provide this comprehensive overview.`;
        }
        
        return `I understand you're asking about ${patient.name}. Based on their current status (${patient.status}) and condition (${patient.condition}), I can provide detailed insights. Could you be more specific about what aspect of their care you'd like to discuss?`;
    };

    const handleQuickQuestion = (question) => {
        setChatInput(question);
        setTimeout(() => sendChatMessage(), 100);
    };

    const generateTimelineHTML = (timeline) => {
        if (!timeline || timeline.length === 0) {
            return (
                <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm relative z-10">
                        <i className="fas fa-info-circle text-xs"></i>
                    </div>
                    <div className="flex-1 pb-4">
                        <p className="text-gray-500">No timeline data available</p>
                    </div>
                </div>
            );
        }

        const statusColors = {
            completed: 'bg-green-600',
            ongoing: 'bg-blue-600',
            active: 'bg-yellow-600',
            pending: 'bg-gray-400',
            scheduled: 'bg-purple-600'
        };

        const statusLabels = {
            completed: 'Completed',
            ongoing: 'Ongoing',
            active: 'Active',
            pending: 'Pending',
            scheduled: 'Scheduled'
        };

        return timeline.map((item, index) => {
            const iconColor = statusColors[item.status] || 'bg-gray-600';
            const isLast = index === timeline.length - 1;

            return (
                <div key={index} className="relative">
                    <div className="flex items-start gap-4">
                        <div className={`w-8 h-8 ${iconColor} rounded-full flex items-center justify-center text-white text-sm relative z-10 shadow-sm`}>
                            <i className={`${item.icon} text-xs`}></i>
                        </div>
                        <div className={`flex-1 ${isLast ? '' : 'pb-6'}`}>
                            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-300 hover:border-gray-400 transition-colors">
                                <div className="flex items-start justify-between mb-2">
                                    <h4 className="text-gray-800 font-medium">{item.action}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs px-2 py-1 rounded-full ${iconColor} text-white`}>
                                            {statusLabels[item.status]}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm mb-2">{item.details}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span><i className="fas fa-calendar mr-1"></i>{item.date}</span>
                                    <span><i className="fas fa-clock mr-1"></i>{item.time}</span>
                                    <span className="capitalize"><i className="fas fa-tag mr-1"></i>{item.type}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
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
                                <i className="fas fa-user-md text-gray-300 mr-2"></i>
                                Patient Details
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
                {/* Patient Header */}
                <section className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className={`w-20 h-20 ${currentPatient.status === 'critical' ? 'bg-gray-800' : 'bg-gray-600'} rounded-xl flex items-center justify-center text-white text-2xl`}>
                                <i className={currentPatient.status === 'critical' ? 'fas fa-exclamation-triangle' : 'fas fa-user'}></i>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">{currentPatient.name}</h2>
                                <div className="flex items-center gap-4 text-gray-600">
                                    <span className="flex items-center gap-2">
                                        <i className="fas fa-birthday-cake"></i>
                                        <span>Age {currentPatient.age}</span>
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <i className="fas fa-bed"></i>
                                        <span>Room {currentPatient.room}</span>
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <i className="fas fa-id-card"></i>
                                        <span>ID: {currentPatient.id}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={startNewConsultation}
                                className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium cursor-pointer"
                            >
                                <i className="fas fa-stethoscope mr-2"></i>
                                New Consultation
                            </button>
                        </div>
                    </div>
                </section>

                {/* AI Chat Interface */}
                <section className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">
                            <i className="fas fa-robot text-gray-700 mr-2"></i>
                            AI Assistant
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Online</span>
                        </div>
                    </div>
                    
                    {/* Chat Messages */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 h-64 overflow-y-auto">
                        {chatMessages.map((msg) => (
                            <div key={msg.id} className={`flex items-start gap-3 mb-4 ${msg.type === 'user' ? 'justify-end' : ''}`}>
                                {msg.type === 'ai' && (
                                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white text-sm">
                                        <i className="fas fa-robot"></i>
                                    </div>
                                )}
                                <div className={`flex-1 ${msg.type === 'user' ? 'text-right' : ''}`}>
                                    <div className={`rounded-lg p-3 shadow-sm ${msg.type === 'user' ? 'bg-gray-800 text-white inline-block' : 'bg-white'}`}>
                                        <p className={msg.type === 'user' ? 'text-white' : 'text-gray-800'}>{msg.message}</p>
                                    </div>
                                    <span className="text-xs text-gray-500 mt-1 block">Just now</span>
                                </div>
                                {msg.type === 'user' && (
                                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm">
                                        <i className="fas fa-user"></i>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    
                    {/* Chat Input */}
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <input 
                                type="text" 
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                                placeholder="Ask me anything about this patient's condition, history, or treatment..." 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none pr-12"
                            />
                            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <i className="fas fa-microphone"></i>
                            </button>
                        </div>
                        <button 
                            onClick={sendChatMessage}
                            className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    
                    {/* Quick Questions */}
                    <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Quick questions:</p>
                        <div className="flex flex-wrap gap-2">
                            <button 
                                onClick={() => handleQuickQuestion("What's the patient's current condition?")}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm transition-colors"
                            >
                                Current condition
                            </button>
                            <button 
                                onClick={() => handleQuickQuestion("What are the latest lab results?")}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm transition-colors"
                            >
                                Lab results
                            </button>
                            <button 
                                onClick={() => handleQuickQuestion("Any medication interactions?")}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm transition-colors"
                            >
                                Drug interactions
                            </button>
                            <button 
                                onClick={() => handleQuickQuestion("Recommend next steps?")}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm transition-colors"
                            >
                                Next steps
                            </button>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Patient Overview */}
                    <section className="lg:col-span-2 space-y-8">
                        {/* Current Condition */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                <i className="fas fa-stethoscope text-gray-700 mr-2"></i>
                                Current Condition
                            </h3>
                            <div className="space-y-4">
                                <div className={`border ${currentPatient.status === 'critical' ? 'border-gray-400 bg-gray-200' : 'border-gray-300 bg-gray-100'} rounded-lg p-4`}>
                                    <h4 className="font-medium text-gray-800 mb-2">Primary Diagnosis</h4>
                                    <p className="text-gray-600">{currentPatient.condition}</p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <div className={`w-3 h-3 ${currentPatient.status === 'critical' ? 'bg-gray-700' : 'bg-gray-500'} rounded-full`}></div>
                                        <span className="text-sm font-medium text-gray-700">{currentPatient.status.charAt(0).toUpperCase() + currentPatient.status.slice(1)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Synthesized Patient Data */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                <i className="fas fa-brain text-gray-700 mr-2"></i>
                                AI Synthesized Data
                            </h3>
                            <div className="space-y-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-800 mb-2">Medical History Summary</h4>
                                    <p className="text-gray-600 mb-3">AI has synthesized data from multiple sources:</p>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex items-center gap-2">
                                            <i className="fas fa-check-circle text-gray-500"></i>
                                            EMR records processed
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <i className="fas fa-check-circle text-gray-500"></i>
                                            Lab results integrated
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <i className="fas fa-check-circle text-gray-500"></i>
                                            Vital signs monitored
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <i className="fas fa-check-circle text-gray-500"></i>
                                            Handwritten notes digitized
                                        </li>
                                    </ul>
                                </div>
                                
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-800 mb-2">Key Insights</h4>
                                    <div className="text-gray-600">
                                        <p>{currentPatient.insights}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Patient Timeline */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                <i className="fas fa-timeline text-gray-700 mr-2"></i>
                                Medical Timeline
                            </h3>
                            <div className="relative">
                                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                                <div className="space-y-0">
                                    {generateTimelineHTML(currentPatient.timeline)}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sidebar */}
                    <section className="space-y-8">
                        {/* Vital Signs */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                <i className="fas fa-heartbeat text-gray-700 mr-2"></i>
                                Current Vitals
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Blood Pressure</span>
                                    <span className="font-medium">{currentPatient.vitals.bp}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Heart Rate</span>
                                    <span className="font-medium">{currentPatient.vitals.hr} bpm</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Temperature</span>
                                    <span className="font-medium">{currentPatient.vitals.temp} °F</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600">Oxygen Sat</span>
                                    <span className="font-medium">{currentPatient.vitals.o2sat}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                <i className="fas fa-bolt text-gray-700 mr-2"></i>
                                Quick Actions
                            </h3>
                            <div className="space-y-3">
                                <button className="w-full bg-gray-800 text-white p-3 rounded-lg hover:bg-gray-700 transition-colors text-left">
                                    <i className="fas fa-file-medical mr-2"></i>
                                    Generate Summary
                                </button>
                                <button className="w-full bg-gray-800 text-white p-3 rounded-lg hover:bg-gray-700 transition-colors text-left">
                                    <i className="fas fa-prescription mr-2"></i>
                                    Update Treatment
                                </button>
                                <button className="w-full bg-gray-800 text-white p-3 rounded-lg hover:bg-gray-700 transition-colors text-left">
                                    <i className="fas fa-share mr-2"></i>
                                    Share with Team
                                </button>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                <i className="fas fa-info-circle text-gray-700 mr-2"></i>
                                Status
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`w-3 h-3 ${currentPatient.status === 'critical' ? 'bg-gray-700' : 'bg-gray-500'} rounded-full`}></div>
                                    <span className="text-gray-600">{currentPatient.status.charAt(0).toUpperCase() + currentPatient.status.slice(1)}</span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    Last updated: {new Date().toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default function PatientDetailsPage() {
    return (
        <Suspense fallback={<div>Loading patient details...</div>}>
            <PatientDetailsPageContent />
        </Suspense>
    );
}