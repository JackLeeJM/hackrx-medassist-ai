'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Import new modular components
import PatientHeader from '@/components/patient/PatientHeader';
import AIChat from '@/components/patient/AIChat';
import PatientCondition from '@/components/patient/PatientCondition';
import Timeline from '@/components/patient/Timeline';
import VitalSigns from '@/components/patient/VitalSigns';
import QuickActions from '@/components/patient/QuickActions';
import PatientStatus from '@/components/patient/PatientStatus';

// Mock blood test data for all patients
const mockBloodTestData = {
    'P001': [
        {
            date: '2024-01-15',
            time: '08:00',
            testType: 'Complete Blood Count with Differential',
            orderedBy: 'Dr. Smith',
            results: {
                wbc: { value: 15.0, unit: 'K/µL', range: '4.5-11.0', status: 'high' },
                rbc: { value: 4.2, unit: 'M/µL', range: '4.5-5.5', status: 'low' },
                hgb: { value: 12.1, unit: 'g/dL', range: '14.0-17.4', status: 'low' },
                hct: { value: 36.2, unit: '%', range: '42-52', status: 'low' },
                plt: { value: 245, unit: 'K/µL', range: '150-400', status: 'normal' },
                crp: { value: 25.3, unit: 'mg/L', range: '<3.0', status: 'high' },
                glucose: { value: 145, unit: 'mg/dL', range: '70-100', status: 'high' },
                creatinine: { value: 1.1, unit: 'mg/dL', range: '0.7-1.3', status: 'normal' },
                bun: { value: 18, unit: 'mg/dL', range: '7-20', status: 'normal' }
            }
        },
        {
            date: '2024-01-14',
            time: '06:30',
            testType: 'Basic Metabolic Panel',
            orderedBy: 'Dr. Johnson',
            results: {
                wbc: { value: 16.2, unit: 'K/µL', range: '4.5-11.0', status: 'high' },
                crp: { value: 28.7, unit: 'mg/L', range: '<3.0', status: 'high' },
                glucose: { value: 152, unit: 'mg/dL', range: '70-100', status: 'high' },
                creatinine: { value: 1.2, unit: 'mg/dL', range: '0.7-1.3', status: 'normal' },
                bun: { value: 19, unit: 'mg/dL', range: '7-20', status: 'normal' }
            }
        },
        {
            date: '2024-01-13',
            time: '07:15',
            testType: 'Complete Blood Count',
            orderedBy: 'Dr. Smith',
            results: {
                wbc: { value: 18.5, unit: 'K/µL', range: '4.5-11.0', status: 'high' },
                rbc: { value: 4.1, unit: 'M/µL', range: '4.5-5.5', status: 'low' },
                hgb: { value: 11.8, unit: 'g/dL', range: '14.0-17.4', status: 'low' },
                hct: { value: 35.1, unit: '%', range: '42-52', status: 'low' },
                plt: { value: 230, unit: 'K/µL', range: '150-400', status: 'normal' },
                crp: { value: 32.1, unit: 'mg/L', range: '<3.0', status: 'high' },
                glucose: { value: 158, unit: 'mg/dL', range: '70-100', status: 'high' }
            }
        }
    ]
};

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

// Patient Information Tabs Component
function PatientInfoTabs({ patient, onNewClinicalNote }) {
    const [activeTab, setActiveTab] = useState('summary');
    const [patientUpdates, setPatientUpdates] = useState([]);
    const [selectedTrend, setSelectedTrend] = useState(null);

    const tabs = [
        { id: 'summary', label: 'Summary', icon: '📋' },
        { id: 'vitals', label: 'Vital Signs', icon: '💗' },
        { id: 'treatment', label: 'Treatment Plan', icon: '💊' },
        { id: 'clinical', label: 'Clinical Notes', icon: '📝' },
        { id: 'imaging', label: 'Imaging & Labs', icon: '🧪' },
        { id: 'timeline', label: 'Timeline', icon: '📅' },
        { id: 'log', label: 'Log', icon: '📊' },
        { id: 'referrals', label: 'Referrals', icon: '👥' },
        { id: 'discharge', label: 'Discharge', icon: '🏥' }
    ];

    const handleGenerateSummary = () => {
        console.log('Generating summary for', patient?.name);
    };

    const handleUpdateTreatment = () => {
        console.log('Updating treatment for', patient?.name);
    };

    const handleShareWithTeam = () => {
        console.log('Sharing with team for', patient?.name);
    };

    // Load patient updates from localStorage
    useEffect(() => {
        if (patient?.id) {
            const loadUpdates = () => {
                const allUpdates = JSON.parse(localStorage.getItem('patientUpdates') || '{}');
                const currentPatientUpdates = allUpdates[patient.id] || [];
                console.log('Loading patient updates for', patient.id, ':', currentPatientUpdates);
                setPatientUpdates(currentPatientUpdates);
            };

            loadUpdates();

            // Also reload when the window focuses (in case data was added from another tab)
            const handleFocus = () => loadUpdates();
            window.addEventListener('focus', handleFocus);
            
            return () => {
                window.removeEventListener('focus', handleFocus);
            };
        }
    }, [patient?.id]);

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex-shrink-0 border-b bg-card">
                <div className="flex">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
                                activeTab === tab.id
                                    ? 'border-primary text-primary bg-accent'
                                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted'
                            }`}
                        >
                            <span className="mr-1 text-sm">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-2 bg-card text-xs">
                {activeTab === 'summary' && (
                    <div className="space-y-2">
                        {/* Critical Status Alert */}
                        {patient.status === 'critical' && (
                            <div className="bg-red-50 border border-red-200 rounded p-2">
                                <div className="flex items-center gap-2 text-red-800">
                                    <span className="text-lg">🚨</span>
                                    <span className="font-bold">CRITICAL PATIENT</span>
                                </div>
                                <div className="text-red-700 text-xs mt-1">
                                    Requires immediate attention and continuous monitoring
                                </div>
                            </div>
                        )}

                        {/* Patient Overview Card */}
                        <div className="bg-blue-50 border border-blue-200 rounded p-2">
                            <div className="flex items-center justify-between mb-2">
                                <div className="font-bold text-blue-900">Patient Overview</div>
                                <Badge variant={patient.status === 'critical' ? 'destructive' : 'secondary'} className="text-xs">
                                    {patient.status.toUpperCase()}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                <div><strong>Room:</strong> {patient.room}</div>
                                <div><strong>Age:</strong> {patient.age} years old</div>
                                <div><strong>Primary Condition:</strong> {patient.condition}</div>
                                <div><strong>Admission:</strong> 3 days ago</div>
                            </div>
                        </div>

                        {/* Clinical Assessment */}
                        <div className="bg-purple-50 border border-purple-200 rounded p-2">
                            <div className="font-bold text-purple-900 mb-1">🧠 AI Clinical Assessment</div>
                            <div className="text-purple-800 text-xs leading-relaxed">{patient.insights}</div>
                        </div>

                        {/* Current Vitals with Status */}
                        <div className="bg-gray-50 border rounded p-2">
                            <div className="font-bold text-gray-900 mb-2">📊 Current Vital Signs</div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className={`p-2 rounded ${patient.status === 'critical' ? 'bg-red-100' : 'bg-white'} border`}>
                                    <div className="font-medium">Blood Pressure</div>
                                    <div className={`text-lg font-bold ${patient.status === 'critical' ? 'text-red-600' : 'text-gray-800'}`}>
                                        {patient.vitals.bp}
                                    </div>
                                    <div className="text-gray-500">
                                        {patient.status === 'critical' ? 'HYPERTENSIVE' : 'mmHg'}
                                    </div>
                                </div>
                                <div className="p-2 rounded bg-white border">
                                    <div className="font-medium">Heart Rate</div>
                                    <div className={`text-lg font-bold ${patient.status === 'critical' ? 'text-orange-600' : 'text-blue-600'}`}>
                                        {patient.vitals.hr}
                                    </div>
                                    <div className="text-gray-500">
                                        {patient.status === 'critical' ? 'TACHYCARDIC' : 'bpm'}
                                    </div>
                                </div>
                                <div className="p-2 rounded bg-white border">
                                    <div className="font-medium">Temperature</div>
                                    <div className={`text-lg font-bold ${patient.status === 'critical' ? 'text-red-600' : 'text-green-600'}`}>
                                        {patient.vitals.temp}°F
                                    </div>
                                    <div className="text-gray-500">
                                        {patient.status === 'critical' ? 'FEBRILE' : 'Normal'}
                                    </div>
                                </div>
                                <div className="p-2 rounded bg-white border">
                                    <div className="font-medium">O2 Saturation</div>
                                    <div className={`text-lg font-bold ${patient.status === 'critical' ? 'text-yellow-600' : 'text-purple-600'}`}>
                                        {patient.vitals.o2sat}%
                                    </div>
                                    <div className="text-gray-500">
                                        {patient.status === 'critical' ? 'HYPOXIC' : 'Good'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Critical Lab Values */}
                        {mockBloodTestData[patient?.id] && (
                            <div className="bg-orange-50 border border-orange-200 rounded p-2">
                                <div className="font-bold text-orange-900 mb-2">🧪 Critical Lab Values (Latest)</div>
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    {Object.entries(mockBloodTestData[patient.id][0].results)
                                        .filter(([key, result]) => result.status === 'high' || result.status === 'low')
                                        .slice(0, 6)
                                        .map(([key, result]) => (
                                        <div key={key} className="p-1 bg-white rounded border">
                                            <div className="font-medium">{key.toUpperCase()}</div>
                                            <div className={`font-bold ${result.status === 'high' ? 'text-red-600' : 'text-blue-600'}`}>
                                                {result.value} {result.unit}
                                            </div>
                                            <div className="text-gray-500">
                                                {result.status === 'high' ? '↑ HIGH' : '↓ LOW'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="text-orange-700 text-xs mt-2 font-medium">
                                    ⚠️ {Object.entries(mockBloodTestData[patient.id][0].results).filter(([key, result]) => result.status !== 'normal').length} abnormal values require attention
                                </div>
                            </div>
                        )}

                        {/* Active Treatment Plan */}
                        <div className="bg-green-50 border border-green-200 rounded p-2">
                            <div className="font-bold text-green-900 mb-2">💊 Active Treatment</div>
                            <div className="space-y-1 text-xs">
                                {patient.status === 'critical' ? (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                            <span><strong>Ceftriaxone 1g IV daily</strong> - Antibiotic therapy (Day 2)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                            <span><strong>Continuous monitoring</strong> - Hourly vitals</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                            <span><strong>Pain management</strong> - PRN morphine 2-4mg IV</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                            <span><strong>Standard care protocol</strong> - Routine monitoring</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                            <span><strong>Discharge planning</strong> - In progress</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Recent Critical Events */}
                        <div className="border rounded p-2">
                            <div className="font-bold text-gray-900 mb-2">⏰ Recent Critical Events</div>
                            <div className="space-y-1">
                                {patient.timeline
                                    .filter(item => item.status === 'completed' || item.status === 'ongoing')
                                    .slice(0, 4)
                                    .map((item, index) => (
                                    <div key={index} className="flex items-start gap-2 py-1 border-b border-gray-100 last:border-0">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
                                            item.type === 'surgery' ? 'bg-red-500' :
                                            item.type === 'lab' ? 'bg-blue-500' :
                                            item.type === 'medication' ? 'bg-green-500' :
                                            item.type === 'monitoring' ? 'bg-purple-500' :
                                            'bg-gray-500'
                                        }`}>
                                            {item.type === 'surgery' ? '🏥' :
                                             item.type === 'lab' ? '🧪' :
                                             item.type === 'medication' ? '💊' :
                                             item.type === 'monitoring' ? '📊' :
                                             '📋'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-xs">{item.action}</span>
                                                <span className="text-gray-500 text-xs flex-shrink-0">{item.time}</span>
                                            </div>
                                            <div className="text-gray-600 text-xs leading-relaxed">{item.details}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Action Recommendations */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                            <div className="font-bold text-yellow-900 mb-2">💡 Recommended Actions</div>
                            <div className="space-y-1 text-xs">
                                {patient.status === 'critical' ? (
                                    <>
                                        <div className="flex items-center gap-2 text-yellow-800">
                                            <span>🔴</span>
                                            <span><strong>PRIORITY:</strong> Review latest blood culture results</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-yellow-800">
                                            <span>🟡</span>
                                            <span><strong>MONITOR:</strong> Temperature trend - consider cooling measures</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-yellow-800">
                                            <span>🟡</span>
                                            <span><strong>CONSIDER:</strong> Infectious disease consult if no improvement</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2 text-yellow-800">
                                            <span>🟢</span>
                                            <span><strong>ROUTINE:</strong> Continue current treatment plan</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-yellow-800">
                                            <span>🟢</span>
                                            <span><strong>DISCHARGE:</strong> Prepare discharge planning materials</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'vitals' && (
                    <div className="space-y-1">
                        {/* Current Vitals - Inline Grid */}
                        <div className="grid grid-cols-4 gap-2 py-1 border-b text-center">
                            <div>
                                <div className="font-semibold text-red-600">{patient.vitals.bp}</div>
                                <div className="text-xs text-gray-500">BP (mmHg)</div>
                            </div>
                            <div>
                                <div className="font-semibold text-blue-600">{patient.vitals.hr}</div>
                                <div className="text-xs text-gray-500">HR (bpm)</div>
                            </div>
                            <div>
                                <div className="font-semibold text-green-600">{patient.vitals.temp}</div>
                                <div className="text-xs text-gray-500">Temp (°F)</div>
                            </div>
                            <div>
                                <div className="font-semibold text-purple-600">{patient.vitals.o2sat}</div>
                                <div className="text-xs text-gray-500">O2 (%)</div>
                            </div>
                        </div>

                        {/* Vitals Charts with Recharts */}
                        <div className="py-1 border-b">
                            <div className="font-semibold mb-1">Vital Signs Trends (Last 8 Hours):</div>
                            <div className="space-y-3">
                                {/* Blood Pressure Chart */}
                                <div className="bg-red-50 border border-red-200 rounded p-2">
                                    <div className="text-xs font-medium text-red-800 mb-2">Blood Pressure (mmHg)</div>
                                    <div className="h-20">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={[
                                                { time: '8h ago', systolic: 185, diastolic: 112 },
                                                { time: '6h ago', systolic: 172, diastolic: 105 },
                                                { time: '4h ago', systolic: 175, diastolic: 108 },
                                                { time: '2h ago', systolic: 178, diastolic: 110 },
                                                { time: 'Now', systolic: parseInt(patient.vitals.bp.split('/')[0]), diastolic: parseInt(patient.vitals.bp.split('/')[1]) }
                                            ]}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#fee2e2" />
                                                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#7f1d1d' }} />
                                                <YAxis tick={{ fontSize: 10, fill: '#7f1d1d' }} />
                                                <Tooltip 
                                                    contentStyle={{ 
                                                        backgroundColor: '#fef2f2', 
                                                        border: '1px solid #fecaca', 
                                                        fontSize: '12px',
                                                        borderRadius: '4px'
                                                    }} 
                                                />
                                                <Line type="monotone" dataKey="systolic" stroke="#dc2626" strokeWidth={2} dot={{ fill: '#dc2626', strokeWidth: 2, r: 3 }} />
                                                <Line type="monotone" dataKey="diastolic" stroke="#b91c1c" strokeWidth={2} dot={{ fill: '#b91c1c', strokeWidth: 2, r: 3 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="text-xs text-red-700 mt-1">Current: {patient.vitals.bp} • Trend: ↗ Elevated (Systolic/Diastolic)</div>
                                </div>

                                {/* Heart Rate Chart */}
                                <div className="bg-blue-50 border border-blue-200 rounded p-2">
                                    <div className="text-xs font-medium text-blue-800 mb-2">Heart Rate (bpm)</div>
                                    <div className="h-20">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={[
                                                { time: '8h ago', hr: 130 },
                                                { time: '6h ago', hr: 118 },
                                                { time: '4h ago', hr: 122 },
                                                { time: '2h ago', hr: 128 },
                                                { time: 'Now', hr: parseInt(patient.vitals.hr) }
                                            ]}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
                                                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#1e3a8a' }} />
                                                <YAxis tick={{ fontSize: 10, fill: '#1e3a8a' }} />
                                                <Tooltip 
                                                    contentStyle={{ 
                                                        backgroundColor: '#eff6ff', 
                                                        border: '1px solid #93c5fd', 
                                                        fontSize: '12px',
                                                        borderRadius: '4px'
                                                    }} 
                                                />
                                                <Line type="monotone" dataKey="hr" stroke="#2563eb" strokeWidth={2} dot={{ fill: '#2563eb', strokeWidth: 2, r: 3 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="text-xs text-blue-700 mt-1">Current: {patient.vitals.hr} bpm • Trend: ↘ Improving</div>
                                </div>

                                {/* Temperature Chart */}
                                <div className="bg-green-50 border border-green-200 rounded p-2">
                                    <div className="text-xs font-medium text-green-800 mb-2">Temperature (°F)</div>
                                    <div className="h-20">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={[
                                                { time: '8h ago', temp: 102.1 },
                                                { time: '6h ago', temp: 101.8 },
                                                { time: '4h ago', temp: 101.5 },
                                                { time: '2h ago', temp: 101.2 },
                                                { time: 'Now', temp: parseFloat(patient.vitals.temp) }
                                            ]}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#dcfce7" />
                                                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#14532d' }} />
                                                <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} tick={{ fontSize: 10, fill: '#14532d' }} />
                                                <Tooltip 
                                                    contentStyle={{ 
                                                        backgroundColor: '#f0fdf4', 
                                                        border: '1px solid #86efac', 
                                                        fontSize: '12px',
                                                        borderRadius: '4px'
                                                    }} 
                                                />
                                                <Line type="monotone" dataKey="temp" stroke="#16a34a" strokeWidth={2} dot={{ fill: '#16a34a', strokeWidth: 2, r: 3 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="text-xs text-green-700 mt-1">Current: {patient.vitals.temp}°F • Trend: ↘ Decreasing</div>
                                </div>

                                {/* Oxygen Saturation Chart */}
                                <div className="bg-purple-50 border border-purple-200 rounded p-2">
                                    <div className="text-xs font-medium text-purple-800 mb-2">Oxygen Saturation (%)</div>
                                    <div className="h-20">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={[
                                                { time: '8h ago', o2: 92 },
                                                { time: '6h ago', o2: 95 },
                                                { time: '4h ago', o2: 94 },
                                                { time: '2h ago', o2: 96 },
                                                { time: 'Now', o2: parseInt(patient.vitals.o2sat) }
                                            ]}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" />
                                                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#581c87' }} />
                                                <YAxis domain={[90, 100]} tick={{ fontSize: 10, fill: '#581c87' }} />
                                                <Tooltip 
                                                    contentStyle={{ 
                                                        backgroundColor: '#faf5ff', 
                                                        border: '1px solid #c084fc', 
                                                        fontSize: '12px',
                                                        borderRadius: '4px'
                                                    }} 
                                                />
                                                <Line type="monotone" dataKey="o2" stroke="#9333ea" strokeWidth={2} dot={{ fill: '#9333ea', strokeWidth: 2, r: 3 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="text-xs text-purple-700 mt-1">Current: {patient.vitals.o2sat}% • Trend: ↗ Improving</div>
                                </div>
                            </div>
                        </div>

                        {/* Debug Info */}
                        <div className="py-1 border-b bg-yellow-50">
                            <div className="font-semibold mb-1 text-xs text-yellow-800">
                                Debug: Total updates: {patientUpdates.length}, Vital signs updates: {patientUpdates.filter(update => update.vitalSigns?.trim()).length}
                            </div>
                        </div>

                        {/* New Vital Signs Updates */}
                        {patientUpdates.filter(update => update.vitalSigns?.trim()).length > 0 && (
                            <div className="py-1 border-b">
                                <div className="font-semibold mb-1">Recent Vital Signs Updates:</div>
                                <div className="space-y-0.5">
                                    {patientUpdates
                                        .filter(update => update.vitalSigns?.trim())
                                        .slice(-3) // Show last 3 updates
                                        .reverse()
                                        .map((update, index) => (
                                        <div key={index} className="bg-blue-50 border border-blue-200 rounded p-2">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-medium text-xs text-blue-800">
                                                    {new Date(update.timestamp).toLocaleString()}
                                                </span>
                                                <span className="text-blue-600 text-xs">📝 New Entry</span>
                                            </div>
                                            <div className="text-xs text-gray-700 bg-white p-2 rounded">
                                                {update.vitalSigns}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Vitals History - Table Format */}
                        <div className="py-1">
                            <div className="font-semibold mb-1">Vital Signs History:</div>
                            <div className="space-y-0.5">
                                <div className="grid grid-cols-5 gap-2 font-semibold py-0.5 border-b">
                                    <span>Time</span>
                                    <span>BP</span>
                                    <span>HR</span>
                                    <span>Temp</span>
                                    <span>O2</span>
                                </div>
                                <div className="grid grid-cols-5 gap-2 py-0.5">
                                    <span>Current</span>
                                    <span>{patient.vitals.bp}</span>
                                    <span>{patient.vitals.hr}</span>
                                    <span>{patient.vitals.temp}</span>
                                    <span>{patient.vitals.o2sat}</span>
                                </div>
                                <div className="grid grid-cols-5 gap-2 py-0.5">
                                    <span>2h ago</span>
                                    <span>175/108</span>
                                    <span>122</span>
                                    <span>101.5</span>
                                    <span>94</span>
                                </div>
                                <div className="grid grid-cols-5 gap-2 py-0.5">
                                    <span>4h ago</span>
                                    <span>172/105</span>
                                    <span>118</span>
                                    <span>101.8</span>
                                    <span>95</span>
                                </div>
                                <div className="grid grid-cols-5 gap-2 py-0.5">
                                    <span>6h ago</span>
                                    <span>185/112</span>
                                    <span>130</span>
                                    <span>102.1</span>
                                    <span>92</span>
                                </div>
                            </div>
                        </div>

                        {/* Vitals Notes */}
                        <div className="py-1 border-t">
                            <strong>Notes:</strong> Blood pressure trending down with treatment. Heart rate stabilizing. Temperature still elevated but improving.
                        </div>

                        {/* Vitals Actions */}
                        <div className="py-1 border-t">
                            <div className="font-semibold mb-1">Manage Vitals:</div>
                            <div className="flex gap-1">
                                <Button size="sm" className="text-xs px-2 py-1 h-6">➕ Add Reading</Button>
                                <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6">✏️ Edit</Button>
                                <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6">🗑️ Delete</Button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'timeline' && (
                    <div className="space-y-0.5">
                        <div className="font-semibold mb-1">Medical Timeline:</div>
                        {patient.timeline.map((item, index) => (
                            <div key={index} className="flex items-start gap-2 py-0.5 border-b border-gray-100">
                                <span className="text-gray-500 w-20 flex-shrink-0 text-xs">{item.time}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{item.action}</span>
                                        <Badge variant="outline" className="text-xs px-1 py-0">{item.status}</Badge>
                                    </div>
                                    {item.details && (
                                        <div className="text-gray-600 mt-0.5 text-xs leading-tight">{item.details}</div>
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        {/* Timeline Actions */}
                        <div className="py-1 border-t mt-2">
                            <div className="font-semibold mb-1">Manage Timeline:</div>
                            <div className="flex gap-1">
                                <Button size="sm" className="text-xs px-2 py-1 h-6">➕ Add Event</Button>
                                <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6">✏️ Edit</Button>
                                <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6">🗑️ Delete</Button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'log' && (
                    <div className="space-y-0.5">
                        <div className="font-semibold mb-1">Activity Log:</div>
                        <div className="space-y-0.5">
                            {/* Dynamic Log Entries from Patient Updates */}
                            {patientUpdates.map((update, index) => (
                                <div key={`update-${index}`}>
                                    {update.vitalSigns?.trim() && (
                                        <div className="flex items-start gap-2 py-1 border-b border-gray-100 bg-red-50 rounded px-2">
                                            <span className="text-red-600 w-16 flex-shrink-0 text-xs font-medium">
                                                {new Date(update.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-red-600">💗</span>
                                                    <span className="font-medium text-xs">Vital Signs Updated</span>
                                                </div>
                                                <div className="text-gray-600 text-xs">{update.vitalSigns.substring(0, 80)}...</div>
                                                <div className="text-red-600 text-xs">New vital signs recorded</div>
                                            </div>
                                        </div>
                                    )}
                                    {update.treatmentPlan?.trim() && (
                                        <div className="flex items-start gap-2 py-1 border-b border-gray-100 bg-green-50 rounded px-2">
                                            <span className="text-green-600 w-16 flex-shrink-0 text-xs font-medium">
                                                {new Date(update.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-green-600">💊</span>
                                                    <span className="font-medium text-xs">Treatment Plan Updated</span>
                                                </div>
                                                <div className="text-gray-600 text-xs">{update.treatmentPlan.substring(0, 80)}...</div>
                                                <div className="text-green-600 text-xs">Plan modifications recorded</div>
                                            </div>
                                        </div>
                                    )}
                                    {(update.clinicalNote?.subjective?.trim() || 
                                      update.clinicalNote?.history?.trim() || 
                                      update.clinicalNote?.objective?.trim() || 
                                      update.clinicalNote?.assessment?.trim()) && (
                                        <div className="flex items-start gap-2 py-1 border-b border-gray-100 bg-blue-50 rounded px-2">
                                            <span className="text-blue-600 w-16 flex-shrink-0 text-xs font-medium">
                                                {new Date(update.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-blue-600">📝</span>
                                                    <span className="font-medium text-xs">Clinical Note Added</span>
                                                </div>
                                                <div className="text-gray-600 text-xs">
                                                    {(update.clinicalNote.subjective || update.clinicalNote.history || 
                                                      update.clinicalNote.objective || update.clinicalNote.assessment)?.substring(0, 80)}...
                                                </div>
                                                <div className="text-blue-600 text-xs">SOAP documentation updated</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )).reverse()}
                            <div className="flex items-start gap-2 py-1 border-b border-gray-100 bg-blue-50 rounded px-2">
                                <span className="text-blue-600 w-16 flex-shrink-0 text-xs font-medium">2:30 PM</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-blue-600">📝</span>
                                        <span className="font-medium text-xs">Clinical Note Added</span>
                                    </div>
                                    <div className="text-gray-600 text-xs">Dr. Smith documented post-operative assessment</div>
                                    <div className="text-blue-600 text-xs">Status: Active</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 py-1 border-b border-gray-100 bg-red-50 rounded px-2">
                                <span className="text-red-600 w-16 flex-shrink-0 text-xs font-medium">1:45 PM</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-red-600">💗</span>
                                        <span className="font-medium text-xs">Vital Signs Updated</span>
                                    </div>
                                    <div className="text-gray-600 text-xs">BP: 180/110 → 175/108, HR: 125 → 122 (Nurse Martinez)</div>
                                    <div className="text-red-600 text-xs">Critical: Hypertension persisting</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 py-1 border-b border-gray-100 bg-green-50 rounded px-2">
                                <span className="text-green-600 w-16 flex-shrink-0 text-xs font-medium">12:15 PM</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-green-600">💊</span>
                                        <span className="font-medium text-xs">Medication Administered</span>
                                    </div>
                                    <div className="text-gray-600 text-xs">Ceftriaxone 1g IV - Antibiotic therapy (Nurse Johnson)</div>
                                    <div className="text-green-600 text-xs">Completed successfully</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 py-1 border-b border-gray-100 bg-purple-50 rounded px-2">
                                <span className="text-purple-600 w-16 flex-shrink-0 text-xs font-medium">11:30 AM</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-purple-600">🧪</span>
                                        <span className="font-medium text-xs">Lab Results Uploaded</span>
                                    </div>
                                    <div className="text-gray-600 text-xs">Complete Blood Count - WBC: 15,000 (elevated)</div>
                                    <div className="text-purple-600 text-xs">Requires attention</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 py-1 border-b border-gray-100 bg-orange-50 rounded px-2">
                                <span className="text-orange-600 w-16 flex-shrink-0 text-xs font-medium">10:45 AM</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-orange-600">📷</span>
                                        <span className="font-medium text-xs">Imaging Ordered</span>
                                    </div>
                                    <div className="text-gray-600 text-xs">CT Abdomen/Pelvis with contrast - Dr. Smith</div>
                                    <div className="text-orange-600 text-xs">Scheduled for 2:00 PM</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 py-1 border-b border-gray-100 bg-yellow-50 rounded px-2">
                                <span className="text-yellow-600 w-16 flex-shrink-0 text-xs font-medium">9:20 AM</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-yellow-600">👥</span>
                                        <span className="font-medium text-xs">Referral Sent</span>
                                    </div>
                                    <div className="text-gray-600 text-xs">Infectious Disease consultation - Dr. Kim</div>
                                    <div className="text-yellow-600 text-xs">Pending response</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 py-1 border-b border-gray-100 bg-gray-50 rounded px-2">
                                <span className="text-gray-600 w-16 flex-shrink-0 text-xs font-medium">8:00 AM</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-600">👤</span>
                                        <span className="font-medium text-xs">Patient Assessment</span>
                                    </div>
                                    <div className="text-gray-600 text-xs">Morning rounds completed - Dr. Smith</div>
                                    <div className="text-gray-600 text-xs">General condition noted</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 py-1 border-b border-gray-100 bg-indigo-50 rounded px-2">
                                <span className="text-indigo-600 w-16 flex-shrink-0 text-xs font-medium">7:30 AM</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-indigo-600">🏥</span>
                                        <span className="font-medium text-xs">Discharge Planning</span>
                                    </div>
                                    <div className="text-gray-600 text-xs">Discharge criteria reviewed by care team</div>
                                    <div className="text-indigo-600 text-xs">3 of 5 criteria met</div>
                                </div>
                            </div>
                        </div>

                        {/* Log Management */}
                        <div className="py-1 border-t mt-2">
                            <div className="font-semibold mb-1">View Options:</div>
                            <div className="flex gap-1">
                                <Button size="sm" className="text-xs px-2 py-1 h-6">📊 Filter</Button>
                                <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6">📅 Date Range</Button>
                                <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6">👤 By User</Button>
                                <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6">📥 Export</Button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'treatment' && (
                    <div className="space-y-1">
                        {/* Current Treatment Plan */}
                        <div className="py-1 border-b">
                            <div className="font-semibold mb-1">Current Treatment Plan:</div>
                            <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-2">
                                <div className="font-medium text-xs text-blue-800 mb-1">Primary Diagnosis: {patient.condition}</div>
                                <div className="text-xs text-blue-700">{patient.insights}</div>
                            </div>
                        </div>

                        {/* Active Medications */}
                        <div className="py-1 border-b">
                            <div className="font-semibold mb-1">Active Medications:</div>
                            <div className="space-y-1">
                                <div className="bg-white border rounded p-2">
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <div className="font-medium text-xs">Ceftriaxone 1g IV</div>
                                            <div className="text-xs text-gray-600">Antibiotic - Daily at 08:00</div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-green-600 text-xs font-medium">Active</span>
                                            <Button variant="outline" size="sm" className="text-xs px-1 py-0.5 h-5">Edit</Button>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500">Started: 3 days ago • Next due: 08:00 tomorrow</div>
                                </div>
                                <div className="bg-white border rounded p-2">
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <div className="font-medium text-xs">Morphine 2mg IV</div>
                                            <div className="text-xs text-gray-600">Pain relief - PRN (as needed)</div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-blue-600 text-xs font-medium">PRN</span>
                                            <Button variant="outline" size="sm" className="text-xs px-1 py-0.5 h-5">Edit</Button>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500">Last given: 4 hours ago • Pain score: 5/10</div>
                                </div>
                                <div className="bg-white border rounded p-2">
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <div className="font-medium text-xs">Lisinopril 10mg PO</div>
                                            <div className="text-xs text-gray-600">ACE Inhibitor - BID (twice daily)</div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-green-600 text-xs font-medium">Active</span>
                                            <Button variant="outline" size="sm" className="text-xs px-1 py-0.5 h-5">Edit</Button>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500">08:00 & 20:00 • Last given: 08:00 today</div>
                                </div>
                            </div>
                            <div className="mt-2 flex gap-1">
                                <Button size="sm" className="text-xs px-2 py-1 h-6">➕ Add Medication</Button>
                                <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6">💊 Med Review</Button>
                            </div>
                        </div>

                        {/* Treatment Goals */}
                        <div className="py-1 border-b">
                            <div className="font-semibold mb-1">Treatment Goals:</div>
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                    <span className="text-green-600">✓</span>
                                    <span className="text-xs">Control infection - WBC trending down</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-orange-600">◐</span>
                                    <span className="text-xs">Pain management - Currently 5/10, target &lt;3/10</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-orange-600">◐</span>
                                    <span className="text-xs">Blood pressure control - Currently elevated</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-red-600">○</span>
                                    <span className="text-xs">Restore mobility - PT consultation pending</span>
                                </div>
                            </div>
                        </div>

                        {/* Medication Schedule */}
                        <div className="py-1 border-b">
                            <div className="font-semibold mb-1">Today's Schedule:</div>
                            <div className="space-y-0.5">
                                <div className="grid grid-cols-4 gap-1 text-xs font-semibold py-0.5 border-b">
                                    <span>Time</span>
                                    <span>Medication</span>
                                    <span>Dose</span>
                                    <span>Status</span>
                                </div>
                                <div className="grid grid-cols-4 gap-1 text-xs py-0.5 bg-green-50">
                                    <span>08:00</span>
                                    <span>Ceftriaxone</span>
                                    <span>1g IV</span>
                                    <span className="text-green-600 font-medium">✓ Given</span>
                                </div>
                                <div className="grid grid-cols-4 gap-1 text-xs py-0.5 bg-green-50">
                                    <span>08:00</span>
                                    <span>Lisinopril</span>
                                    <span>10mg PO</span>
                                    <span className="text-green-600 font-medium">✓ Given</span>
                                </div>
                                <div className="grid grid-cols-4 gap-1 text-xs py-0.5 bg-yellow-50">
                                    <span>20:00</span>
                                    <span>Lisinopril</span>
                                    <span>10mg PO</span>
                                    <span className="text-orange-600 font-medium">⏱ Due</span>
                                </div>
                                <div className="grid grid-cols-4 gap-1 text-xs py-0.5">
                                    <span>PRN</span>
                                    <span>Morphine</span>
                                    <span>2mg IV</span>
                                    <span className="text-blue-600 font-medium">As needed</span>
                                </div>
                            </div>
                        </div>

                        {/* New Treatment Plan Updates */}
                        {patientUpdates.filter(update => update.treatmentPlan?.trim()).length > 0 && (
                            <div className="py-1 border-b">
                                <div className="font-semibold mb-1">Recent Treatment Plan Updates:</div>
                                <div className="space-y-0.5">
                                    {patientUpdates
                                        .filter(update => update.treatmentPlan?.trim())
                                        .slice(-2) // Show last 2 updates
                                        .reverse()
                                        .map((update, index) => (
                                        <div key={index} className="bg-green-50 border border-green-200 rounded p-2">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-medium text-xs text-green-800">
                                                    {new Date(update.timestamp).toLocaleString()}
                                                </span>
                                                <span className="text-green-600 text-xs">💊 Plan Update</span>
                                            </div>
                                            <div className="text-xs text-gray-700 bg-white p-2 rounded">
                                                {update.treatmentPlan}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Allergies & Contraindications */}
                        <div className="py-1 border-b">
                            <div className="font-semibold mb-1">Allergies & Contraindications:</div>
                            <div className="space-y-0.5">
                                <div className="bg-red-50 border border-red-200 rounded p-2">
                                    <div className="font-medium text-xs text-red-800">⚠️ Drug Allergies:</div>
                                    <div className="text-xs text-red-700">Penicillin - Severe reaction (rash, difficulty breathing)</div>
                                </div>
                                <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                                    <div className="font-medium text-xs text-yellow-800">⚠️ Precautions:</div>
                                    <div className="text-xs text-yellow-700">Renal function monitoring required with current medications</div>
                                </div>
                            </div>
                        </div>

                        {/* Treatment Plan Actions */}
                        <div className="py-1">
                            <div className="font-semibold mb-1">Manage Treatment:</div>
                            <div className="flex gap-1">
                                <Button size="sm" className="text-xs px-2 py-1 h-6">➕ Add Item</Button>
                                <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6">✏️ Edit Plan</Button>
                                <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6">🗑️ Remove</Button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'clinical' && (
                    <div className="space-y-1">
                        {/* Current Medications - Table */}
                        <div className="py-1 border-b">
                            <div className="font-semibold mb-1">Current Medications:</div>
                            <div className="space-y-0.5">
                                <div className="flex justify-between items-center">
                                    <span><strong>Ceftriaxone 1g IV</strong> - Daily</span>
                                    <span className="text-green-600 text-xs">Active</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span><strong>Morphine 2mg IV</strong> - PRN pain</span>
                                    <span className="text-blue-600 text-xs">As needed</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span><strong>Lisinopril 10mg PO</strong> - BID</span>
                                    <span className="text-green-600 text-xs">Active</span>
                                </div>
                            </div>
                        </div>

                        {/* Complete Clinical Notes from Input - Show ALL fields */}
                        {patientUpdates.length > 0 && (
                            <div className="py-1 border-b">
                                <div className="font-semibold mb-1">Your Clinical Input Notes:</div>
                                <div className="space-y-0.5 text-xs">
                                    {patientUpdates
                                        .slice(-5) // Show last 5 complete notes
                                        .reverse()
                                        .map((update, index) => (
                                        <div key={index} className="border-l-2 border-purple-500 pl-2 bg-purple-50 rounded-r p-2">
                                            <div className="font-medium text-purple-800">
                                                Complete Note - {new Date(update.timestamp).toLocaleString()}
                                            </div>
                                            
                                            {update.clinicalNote?.subjective?.trim() && (
                                                <div className="mt-1">
                                                    <strong>Subjective (Patient Report):</strong> {update.clinicalNote.subjective}
                                                </div>
                                            )}
                                            {update.clinicalNote?.history?.trim() && (
                                                <div className="mt-1">
                                                    <strong>History & Background:</strong> {update.clinicalNote.history}
                                                </div>
                                            )}
                                            {update.vitalSigns?.trim() && (
                                                <div className="mt-1">
                                                    <strong>Vital Signs:</strong> {update.vitalSigns}
                                                </div>
                                            )}
                                            {update.clinicalNote?.objective?.trim() && (
                                                <div className="mt-1">
                                                    <strong>Objective (Examination & Findings):</strong> {update.clinicalNote.objective}
                                                </div>
                                            )}
                                            {update.clinicalNote?.assessment?.trim() && (
                                                <div className="mt-1">
                                                    <strong>Assessment (Clinical Impression):</strong> {update.clinicalNote.assessment}
                                                </div>
                                            )}
                                            {update.treatmentPlan?.trim() && (
                                                <div className="mt-1">
                                                    <strong>Plan (Treatment & Follow-up):</strong> {update.treatmentPlan}
                                                </div>
                                            )}
                                            
                                            <div className="mt-2 text-xs text-gray-500 bg-white p-1 rounded">
                                                📊 Data also routed to: 
                                                {update.vitalSigns?.trim() && <span className="text-red-600"> Vital Signs</span>}
                                                {update.treatmentPlan?.trim() && <span className="text-green-600"> Treatment Plan</span>}
                                                <span className="text-blue-600"> Activity Log</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Clinical Notes */}
                        <div className="py-1 border-b">
                            <div className="font-semibold mb-1">Previous Clinical Notes:</div>
                            <div className="space-y-0.5 text-xs">
                                <div className="border-l-2 border-blue-500 pl-2">
                                    <div className="font-medium">Dr. Johnson - Today 08:30</div>
                                    <div>Patient continues to show signs of improvement. Pain levels decreased from 8/10 to 5/10. Wound site appears clean and healing properly.</div>
                                </div>
                                <div className="border-l-2 border-green-500 pl-2">
                                    <div className="font-medium">Nurse Martinez - Yesterday 14:00</div>
                                    <div>Vitals stable. Patient ambulating independently. Diet tolerance good. No complaints of nausea or vomiting.</div>
                                </div>
                                <div className="border-l-2 border-orange-500 pl-2">
                                    <div className="font-medium">Dr. Smith - Yesterday 09:15</div>
                                    <div>Post-operative check. Surgical site healing well. Recommend continuing current antibiotic regimen. Consider PT consultation.</div>
                                </div>
                            </div>
                        </div>

                        {/* Clinical Notes Actions */}
                        <div className="py-1">
                            <div className="font-semibold mb-1">Manage Notes:</div>
                            <div className="flex gap-1">
                                <Button size="sm" className="text-xs px-2 py-1 h-6">➕ Add</Button>
                                <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6">✏️ Edit</Button>
                                <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6">🗑️ Delete</Button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'imaging' && (
                    <div className="space-y-1">
                        {/* Latest Blood Test Results */}
                        <div className="py-1 border-b">
                            <div className="font-semibold mb-1 flex items-center justify-between">
                                <span>Latest Blood Test Results ({mockBloodTestData[patient?.id]?.[0]?.date} {mockBloodTestData[patient?.id]?.[0]?.time}):</span>
                                <span className="text-xs text-gray-500">{mockBloodTestData[patient?.id]?.[0]?.testType}</span>
                            </div>
                            <div className="space-y-0.5">
                                <div className="grid grid-cols-5 gap-2 text-xs font-medium border-b pb-1 text-gray-600">
                                    <span>Test</span>
                                    <span>Value</span>
                                    <span>Range</span>
                                    <span>Status</span>
                                    <span>Compare</span>
                                </div>
                                {mockBloodTestData[patient?.id]?.[0]?.results && Object.entries(mockBloodTestData[patient?.id][0].results).map(([key, result]) => (
                                    <div key={key} className="grid grid-cols-5 gap-2 text-xs py-0.5">
                                        <span>{key.toUpperCase()}</span>
                                        <span className="font-medium">{result.value} {result.unit}</span>
                                        <span className="text-gray-500">{result.range}</span>
                                        <span className={`font-medium ${
                                            result.status === 'high' ? 'text-red-600' : 
                                            result.status === 'low' ? 'text-red-600' : 
                                            'text-green-600'
                                        }`}>
                                            {result.status === 'high' ? 'High ↑' : 
                                             result.status === 'low' ? 'Low ↓' : 'Normal'}
                                        </span>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="text-xs px-2 py-0.5 h-5"
                                            onClick={() => setSelectedTrend(key)}
                                        >
                                            📊 Compare
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>


                        {/* Complete Blood Test History */}
                        <div className="py-1 border-b">
                            <div className="font-semibold mb-1">Complete Blood Test History:</div>
                            <div className="space-y-0.5">
                                {mockBloodTestData[patient?.id]?.map((test, index) => (
                                    <div key={index} className="flex items-center justify-between py-0.5 border-b border-gray-100">
                                        <div>
                                            <div className="font-medium text-xs">{test.testType}</div>
                                            <div className="text-xs text-gray-600">{test.date} {test.time} - {test.orderedBy}</div>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button variant="outline" size="sm" className="text-xs px-1 py-0.5 h-5">View</Button>
                                            <Button variant="outline" size="sm" className="text-xs px-1 py-0.5 h-5">Report</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Imaging Studies */}
                        <div className="py-1 border-b">
                            <div className="font-semibold mb-1">Imaging Studies:</div>
                            <div className="space-y-0.5">
                                <div className="flex items-center justify-between py-0.5 border-b border-gray-100">
                                    <div>
                                        <div className="font-medium text-xs">CT Abdomen/Pelvis with Contrast</div>
                                        <div className="text-xs text-gray-600">Today 06:30 - Dr. Radiologist</div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="outline" size="sm" className="text-xs px-1 py-0.5 h-5">View</Button>
                                        <Button variant="outline" size="sm" className="text-xs px-1 py-0.5 h-5">Report</Button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-0.5 border-b border-gray-100">
                                    <div>
                                        <div className="font-medium text-xs">Chest X-Ray PA/Lateral</div>
                                        <div className="text-xs text-gray-600">Yesterday 14:15 - Dr. Chen</div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="outline" size="sm" className="text-xs px-1 py-0.5 h-5">View</Button>
                                        <Button variant="outline" size="sm" className="text-xs px-1 py-0.5 h-5">Report</Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pending Orders */}
                        <div className="py-1 border-b">
                            <div className="font-semibold mb-1">Pending Orders:</div>
                            <div className="space-y-0.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs">📊 Complete Blood Count</span>
                                    <span className="text-orange-600 text-xs">Pending</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs">🧪 Blood Culture x2</span>
                                    <span className="text-blue-600 text-xs">In Progress</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs">📷 Follow-up CT Scan</span>
                                    <span className="text-gray-600 text-xs">Scheduled</span>
                                </div>
                            </div>
                        </div>

                        {/* Imaging & Labs Actions */}
                        <div className="py-1">
                            <div className="font-semibold mb-1">Manage Records:</div>
                            <div className="flex gap-1">
                                <Button size="sm" className="text-xs px-2 py-1 h-6">➕ Add Result</Button>
                                <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6">✏️ Edit</Button>
                                <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6">🗑️ Delete</Button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'referrals' && (
                    <div className="space-y-1">
                        {/* Active Referrals */}
                        <div className="py-1 border-b">
                            <div className="font-semibold mb-1">Active Referrals:</div>
                            <div className="space-y-0.5">
                                <div className="border border-blue-200 rounded p-2 bg-blue-50">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-xs">Cardiology Consultation</span>
                                        <span className="text-blue-600 text-xs font-medium">Urgent</span>
                                    </div>
                                    <div className="text-xs text-gray-600 mb-1">Dr. Martinez - Requested today for cardiac evaluation</div>
                                    <div className="text-xs text-gray-500">Status: Appointment scheduled for tomorrow 10:00 AM</div>
                                    <div className="text-xs text-blue-600 mt-1">📞 Contact: (555) 123-4567</div>
                                </div>
                                <div className="border border-green-200 rounded p-2 bg-green-50">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-xs">Physical Therapy</span>
                                        <span className="text-green-600 text-xs font-medium">Routine</span>
                                    </div>
                                    <div className="text-xs text-gray-600 mb-1">Post-surgical mobility assessment and treatment plan</div>
                                    <div className="text-xs text-gray-500">Status: Initial eval completed - ongoing sessions</div>
                                    <div className="text-xs text-green-600 mt-1">📅 Next: March 16, 2024 at 2:00 PM</div>
                                </div>
                                <div className="border border-purple-200 rounded p-2 bg-purple-50">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-xs">Infectious Disease Consultation</span>
                                        <span className="text-purple-600 text-xs font-medium">Pending</span>
                                    </div>
                                    <div className="text-xs text-gray-600 mb-1">Dr. Kim - For antibiotic resistance evaluation</div>
                                    <div className="text-xs text-gray-500">Status: Referral sent, awaiting response</div>
                                    <div className="text-xs text-purple-600 mt-1">⏳ Expected response: 24-48 hours</div>
                                </div>
                            </div>
                        </div>

                        {/* Referral History */}
                        <div className="py-1 border-b">
                            <div className="font-semibold mb-1">Recent Referral History:</div>
                            <div className="space-y-0.5">
                                <div className="grid grid-cols-4 gap-1 text-xs font-semibold py-0.5 border-b">
                                    <span>Date</span>
                                    <span>Specialty</span>
                                    <span>Provider</span>
                                    <span>Status</span>
                                </div>
                                <div className="grid grid-cols-4 gap-1 text-xs py-0.5">
                                    <span>Mar 10</span>
                                    <span>Surgery</span>
                                    <span>Dr. Johnson</span>
                                    <span className="text-green-600 font-medium">Completed</span>
                                </div>
                                <div className="grid grid-cols-4 gap-1 text-xs py-0.5">
                                    <span>Mar 8</span>
                                    <span>Anesthesia</span>
                                    <span>Dr. Lee</span>
                                    <span className="text-green-600 font-medium">Completed</span>
                                </div>
                                <div className="grid grid-cols-4 gap-1 text-xs py-0.5">
                                    <span>Mar 5</span>
                                    <span>Radiology</span>
                                    <span>Dr. Chen</span>
                                    <span className="text-green-600 font-medium">Completed</span>
                                </div>
                            </div>
                        </div>

                        {/* Referral Management */}
                        <div className="py-1">
                            <div className="font-semibold mb-1">Manage Referrals:</div>
                            <div className="flex gap-1">
                                <Button size="sm" className="text-xs px-2 py-1 h-6">📞 New Referral</Button>
                                <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6">✏️ Edit</Button>
                                <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6">🗑️ Cancel</Button>
                                <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6">📋 Track Status</Button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'discharge' && (
                    <div className="space-y-1">
                        {/* Discharge Planning */}
                        <div className="py-1 border-b">
                            <div className="font-semibold mb-1">Discharge Planning:</div>
                            <div className="bg-blue-50 border border-blue-200 rounded p-2">
                                <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                                    <div>
                                        <span className="font-medium">Est. Discharge:</span>
                                        <div className="text-blue-800 font-medium">March 18, 2024</div>
                                        <div className="text-gray-500">(3 days)</div>
                                    </div>
                                    <div>
                                        <span className="font-medium">Discharge To:</span>
                                        <div className="text-blue-800">Home</div>
                                        <div className="text-gray-500">Family support</div>
                                    </div>
                                    <div>
                                        <span className="font-medium">Follow-up:</span>
                                        <div className="text-blue-800">Clinic</div>
                                        <div className="text-gray-500">1 week</div>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-600">
                                    <strong>Discharge Planner:</strong> Sarah Williams, RN • <strong>Contact:</strong> (555) 987-6543
                                </div>
                            </div>
                        </div>

                        {/* Discharge Criteria */}
                        <div className="py-1 border-b">
                            <div className="font-semibold mb-1">Discharge Criteria Progress:</div>
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-2 p-1 rounded bg-green-50">
                                    <span className="text-green-600 font-bold">✓</span>
                                    <span className="text-xs flex-1">Pain controlled with oral medications</span>
                                    <span className="text-green-600 text-xs font-medium">Met</span>
                                </div>
                                <div className="flex items-center gap-2 p-1 rounded bg-green-50">
                                    <span className="text-green-600 font-bold">✓</span>
                                    <span className="text-xs flex-1">Tolerating regular diet</span>
                                    <span className="text-green-600 text-xs font-medium">Met</span>
                                </div>
                                <div className="flex items-center gap-2 p-1 rounded bg-yellow-50">
                                    <span className="text-orange-600 font-bold">◐</span>
                                    <span className="text-xs flex-1">Ambulating independently (&gt;50 feet)</span>
                                    <span className="text-orange-600 text-xs font-medium">Partial</span>
                                </div>
                                <div className="flex items-center gap-2 p-1 rounded bg-red-50">
                                    <span className="text-red-600 font-bold">○</span>
                                    <span className="text-xs flex-1">Normal WBC count (&lt;11,000)</span>
                                    <span className="text-red-600 text-xs font-medium">Not Met</span>
                                </div>
                                <div className="flex items-center gap-2 p-1 rounded bg-yellow-50">
                                    <span className="text-orange-600 font-bold">◐</span>
                                    <span className="text-xs flex-1">Wound healing appropriately</span>
                                    <span className="text-orange-600 text-xs font-medium">Improving</span>
                                </div>
                            </div>
                        </div>

                        {/* Discharge Preparations */}
                        <div className="py-1 border-b">
                            <div className="font-semibold mb-1">Discharge Preparations:</div>
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                    <span className="text-green-600">✓</span>
                                    <span className="text-xs">Discharge medications reconciled</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-green-600">✓</span>
                                    <span className="text-xs">Patient education materials provided</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-orange-600">◐</span>
                                    <span className="text-xs">Home care arrangements pending</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-red-600">○</span>
                                    <span className="text-xs">Transportation arranged</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-green-600">✓</span>
                                    <span className="text-xs">Follow-up appointments scheduled</span>
                                </div>
                            </div>
                        </div>

                        {/* Discharge Summary Status */}
                        <div className="py-1 border-b">
                            <div className="font-semibold mb-1">Documentation:</div>
                            <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-xs">Discharge Summary</span>
                                    <span className="text-orange-600 text-xs font-medium">In Progress</span>
                                </div>
                                <div className="text-xs text-gray-600 mb-1">Last updated: Today 2:30 PM by Dr. Smith</div>
                                <div className="text-xs text-orange-600">⚠️ Pending final review and signatures</div>
                            </div>
                        </div>

                        {/* Discharge Management */}
                        <div className="py-1">
                            <div className="font-semibold mb-1">Manage Discharge:</div>
                            <div className="flex gap-1">
                                <Button size="sm" className="text-xs px-2 py-1 h-6">📋 Complete Summary</Button>
                                <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6">✏️ Edit Plan</Button>
                                <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6">📅 Reschedule</Button>
                                <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6">🏠 Home Care</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Trend Comparison Modal */}
            {selectedTrend && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedTrend(null)}>
                    <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">
                                {selectedTrend.toUpperCase()} Trend Analysis for {patient?.name}
                            </h3>
                            <button 
                                onClick={() => setSelectedTrend(null)}
                                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                            >
                                ×
                            </button>
                        </div>
                        
                        {/* Trend Chart */}
                        <div className="mb-6">
                            {mockBloodTestData[patient?.id] && (() => {
                                const trendData = mockBloodTestData[patient.id]
                                    .filter(test => test.results[selectedTrend])
                                    .map(test => ({
                                        date: test.date,
                                        value: test.results[selectedTrend].value,
                                        normal: selectedTrend === 'wbc' ? 7.75 : 
                                               selectedTrend === 'crp' ? 1.5 : 
                                               selectedTrend === 'glucose' ? 85 : 
                                               selectedTrend === 'hgb' ? 15.7 :
                                               selectedTrend === 'hct' ? 47 :
                                               selectedTrend === 'rbc' ? 5.0 :
                                               selectedTrend === 'plt' ? 275 :
                                               selectedTrend === 'creatinine' ? 1.0 :
                                               selectedTrend === 'bun' ? 13.5 : 50,
                                        unit: test.results[selectedTrend].unit,
                                        range: test.results[selectedTrend].range,
                                        status: test.results[selectedTrend].status
                                    }))
                                    .reverse();
                                
                                const getStrokeColor = () => {
                                    switch(selectedTrend) {
                                        case 'wbc': return '#ef4444';
                                        case 'crp': return '#f59e0b';
                                        case 'glucose': return '#8b5cf6';
                                        case 'hgb': return '#dc2626';
                                        case 'hct': return '#059669';
                                        case 'rbc': return '#7c2d12';
                                        case 'plt': return '#1e40af';
                                        case 'creatinine': return '#0891b2';
                                        case 'bun': return '#86198f';
                                        default: return '#6b7280';
                                    }
                                };

                                return trendData.length > 0 && (
                                    <div>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                                <XAxis 
                                                    dataKey="date" 
                                                    tick={{ fontSize: 12 }}
                                                    angle={-45}
                                                    textAnchor="end"
                                                    height={80}
                                                />
                                                <YAxis tick={{ fontSize: 12 }} />
                                                <Tooltip 
                                                    contentStyle={{ fontSize: '12px', padding: '8px' }}
                                                    formatter={(value, name) => [`${value} ${trendData[0]?.unit}`, selectedTrend.toUpperCase()]}
                                                    labelFormatter={(label) => `Date: ${label}`}
                                                />
                                                <Line 
                                                    type="monotone" 
                                                    dataKey="value" 
                                                    stroke={getStrokeColor()} 
                                                    strokeWidth={3} 
                                                    dot={{ r: 4, fill: getStrokeColor() }} 
                                                    activeDot={{ r: 6 }}
                                                />
                                                <Line 
                                                    type="monotone" 
                                                    dataKey="normal" 
                                                    stroke="#10b981" 
                                                    strokeWidth={2} 
                                                    strokeDasharray="4 4" 
                                                    dot={false}
                                                    name="Normal Range"
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                        
                                        {/* Analysis Summary */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                            <div className="bg-gray-50 p-3 rounded">
                                                <div className="text-sm font-medium text-gray-600">Current Value</div>
                                                <div className="text-lg font-bold">
                                                    {trendData[trendData.length - 1]?.value} {trendData[0]?.unit}
                                                </div>
                                                <div className={`text-sm ${
                                                    trendData[trendData.length - 1]?.status === 'high' ? 'text-red-600' : 
                                                    trendData[trendData.length - 1]?.status === 'low' ? 'text-red-600' : 
                                                    'text-green-600'
                                                }`}>
                                                    {trendData[trendData.length - 1]?.status === 'high' ? 'Above Normal' : 
                                                     trendData[trendData.length - 1]?.status === 'low' ? 'Below Normal' : 'Normal'}
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded">
                                                <div className="text-sm font-medium text-gray-600">Normal Range</div>
                                                <div className="text-lg font-bold">{trendData[0]?.range}</div>
                                                <div className="text-sm text-gray-500">Reference values</div>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded">
                                                <div className="text-sm font-medium text-gray-600">Trend Direction</div>
                                                <div className="text-lg font-bold">
                                                    {trendData[0]?.value > trendData[trendData.length - 1]?.value ? '↓ Decreasing' : 
                                                     trendData[0]?.value < trendData[trendData.length - 1]?.value ? '↑ Increasing' : 
                                                     '→ Stable'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {trendData.length} data points
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                        
                        <div className="flex justify-end">
                            <Button onClick={() => setSelectedTrend(null)} className="px-4 py-2">
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function PatientDetailsPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [currentPatient, setCurrentPatient] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);

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
            timestamp: '2024-01-15T09:00:00Z'
        }]);
    }, [searchParams, router]);

    const startNewClinicalNote = () => {
        if (currentPatient) {
            console.log(`Starting new clinical note for ${currentPatient.name}`);
            router.push(`/input?id=${currentPatient.id}`);
        } else {
            alert('Patient data not available');
        }
    };

    const handleSendMessage = (message) => {
        if (!message.trim()) return;

        const userMessage = {
            id: chatMessages.length + 1,
            type: 'user',
            message: message,
            timestamp: '2024-01-15T10:00:00Z'
        };

        setChatMessages(prev => [...prev, userMessage]);

        // Generate AI response
        setTimeout(() => {
            const aiResponse = {
                id: chatMessages.length + 2,
                type: 'ai',
                message: generateAIResponse(message),
                timestamp: '2024-01-15T10:01:00Z'
            };
            setChatMessages(prev => [...prev, aiResponse]);
        }, 1000);
    };

    const handleQuickQuestion = (question) => {
        handleSendMessage(question);
    };

    const handleGenerateSummary = () => {
        console.log('Generating summary for', currentPatient?.name);
        // Implementation for generating summary
    };

    const handleUpdateTreatment = () => {
        console.log('Updating treatment for', currentPatient?.name);
        // Implementation for updating treatment
    };

    const handleShareWithTeam = () => {
        console.log('Sharing with team for', currentPatient?.name);
        // Implementation for sharing with team
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

    const handleLogout = () => {
        localStorage.removeItem('user');
        router.push('/login');
    };

    const handleNotifications = () => {
        const notifications = [
            "Lab results ready for review",
            "Medication due in 30 minutes", 
            "Vitals trending upward"
        ];
        alert(`Notifications:\n${notifications.join('\n')}`);
    };

    if (!currentPatient || !user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="h-screen flex flex-col bg-background text-foreground font-sans overflow-hidden">
            {/* Compact Header - Consistent with Doctor/Nurse Dashboard */}
            <div className="flex-shrink-0 bg-primary text-primary-foreground px-4 py-2 flex items-center justify-between text-xs shadow-md">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.back()}
                        className="px-2 py-1 bg-white/10 rounded text-xs hover:bg-white/20"
                    >
                        ← Back
                    </button>
                    <span className="font-bold">MedAssist AI</span>
                    <span>{user.name} ({user.role})</span>
                    <span className="text-green-400">Patient Details</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={handleNotifications} className="text-xs">
                        🔔 {3}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleLogout} className="text-xs">
                        Logout
                    </Button>
                </div>
            </div>

            {/* Patient Header - Ultra Compact */}
            <div className="flex-shrink-0 px-3 py-1 bg-card border-b">
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold ${
                            currentPatient.status === 'critical' ? 'bg-red-600' : 'bg-gray-600'
                        }`}>
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
                            <span className="font-medium">{currentPatient.condition}</span>
                        </div>
                    </div>
                    <div>
                        <Button 
                            onClick={startNewClinicalNote}
                            size="sm" 
                            className="text-xs px-3 py-1 h-7"
                        >
                            📝 New Input
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Two Column Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Column - Chat (reduced from 1/3 to ~23% width) */}
                <div className="w-[23%] border-r bg-card flex flex-col overflow-hidden">
                    <div className="flex-shrink-0 px-2 py-1 border-b bg-muted flex items-center justify-between">
                        <span className="text-xs font-semibold">AI Assistant</span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                            <span>Online</span>
                        </div>
                    </div>
                    
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-2 bg-background">
                        {chatMessages.map((msg) => (
                            <div key={msg.id} className={`flex items-start gap-1 mb-2 ${msg.type === 'user' ? 'justify-end' : ''}`}>
                                {msg.type === 'ai' && (
                                    <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center text-primary-foreground flex-shrink-0">
                                        <span className="text-xs">🤖</span>
                                    </div>
                                )}
                                <div className={`${msg.type === 'user' ? 'text-right' : ''}`}>
                                    <div className={`rounded p-2 text-xs max-w-xs ${
                                        msg.type === 'user' 
                                            ? 'bg-primary text-primary-foreground inline-block' 
                                            : 'bg-card border'
                                    }`}>
                                        {msg.message}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-0.5">Just now</div>
                                </div>
                                {msg.type === 'user' && (
                                    <div className="w-4 h-4 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground flex-shrink-0">
                                        <span className="text-xs">👤</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    
                    {/* Chat Input */}
                    <div className="flex-shrink-0 p-2 border-t bg-white">
                        <div className="flex gap-1 mb-2">
                            <input
                                type="text"
                                placeholder="Ask about patient..."
                                className="flex-1 text-xs px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                        handleSendMessage(e.target.value);
                                        e.target.value = '';
                                    }
                                }}
                            />
                            <Button size="sm" className="text-xs">
                                Send
                            </Button>
                        </div>
                        
                        {/* Quick Questions */}
                        <div className="flex flex-wrap gap-1">
                            <button 
                                onClick={() => handleQuickQuestion("What's the patient's current condition?")}
                                className="text-xs px-2 py-0.5 border rounded hover:bg-gray-50"
                            >
                                Condition
                            </button>
                            <button 
                                onClick={() => handleQuickQuestion("What are the latest lab results?")}
                                className="text-xs px-2 py-0.5 border rounded hover:bg-gray-50"
                            >
                                Labs
                            </button>
                            <button 
                                onClick={() => handleQuickQuestion("Any medication interactions?")}
                                className="text-xs px-2 py-0.5 border rounded hover:bg-gray-50"
                            >
                                Drugs
                            </button>
                            <button 
                                onClick={() => handleQuickQuestion("Recommend next steps?")}
                                className="text-xs px-2 py-0.5 border rounded hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column - Patient Information (expanded to ~77% width) */}
                <div className="w-[77%] flex flex-col overflow-hidden">
                    <PatientInfoTabs patient={currentPatient} onNewClinicalNote={startNewClinicalNote} />
                </div>
            </div>
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