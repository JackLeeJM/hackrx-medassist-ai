'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Import new modular components
import PatientHeader from '@/components/patient/PatientHeader';
import AIChat from '@/components/patient/AIChat';
import PatientCondition from '@/components/patient/PatientCondition';
import Timeline from '@/components/patient/Timeline';
import VitalSigns from '@/components/patient/VitalSigns';
import QuickActions from '@/components/patient/QuickActions';
import PatientStatus from '@/components/patient/PatientStatus';

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
function PatientInfoTabs({ patient }) {
    const [activeTab, setActiveTab] = useState('summary');

    const tabs = [
        { id: 'summary', label: 'Summary', icon: '📋' },
        { id: 'vitals', label: 'Vital Signs', icon: '💗' },
        { id: 'treatment', label: 'Treatment Plan', icon: '💊' },
        { id: 'clinical', label: 'Clinical Notes', icon: '📝' },
        { id: 'imaging', label: 'Imaging & Labs', icon: '🧪' },
        { id: 'timeline', label: 'Timeline', icon: '📅' },
        { id: 'referral', label: 'Referral & Discharge', icon: '🏥' }
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

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex-shrink-0 border-b bg-white">
                <div className="flex">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
                                activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <span className="mr-1 text-sm">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-2 bg-white text-xs">
                {activeTab === 'summary' && (
                    <div className="space-y-1">
                        {/* Patient Basic Info - Inline */}
                        <div className="flex items-center gap-4 py-1 border-b">
                            <span><strong>Room:</strong> {patient.room}</span>
                            <span><strong>Age:</strong> {patient.age}</span>
                            <span><strong>Status:</strong> <Badge variant={patient.status === 'critical' ? 'destructive' : 'secondary'} className="text-xs px-1 py-0">{patient.status}</Badge></span>
                            <span><strong>Condition:</strong> {patient.condition}</span>
                        </div>

                        {/* AI Insights - Compact */}
                        <div className="py-1 border-b">
                            <strong>AI Insights:</strong> {patient.insights}
                        </div>

                        {/* Current Vitals - Inline */}
                        <div className="flex items-center gap-4 py-1 border-b">
                            <span><strong>BP:</strong> <span className="text-red-600">{patient.vitals.bp}</span></span>
                            <span><strong>HR:</strong> <span className="text-blue-600">{patient.vitals.hr} bpm</span></span>
                            <span><strong>Temp:</strong> <span className="text-green-600">{patient.vitals.temp}°F</span></span>
                            <span><strong>O2:</strong> <span className="text-purple-600">{patient.vitals.o2sat}%</span></span>
                        </div>

                        {/* Recent Timeline - Compact List */}
                        <div className="py-1">
                            <div className="font-semibold mb-1">Recent Activity:</div>
                            {patient.timeline.slice(0, 6).map((item, index) => (
                                <div key={index} className="flex items-center gap-2 py-0.5 text-xs leading-tight">
                                    <span className="text-gray-500 w-16 flex-shrink-0">{item.time}</span>
                                    <span className="flex-1">{item.action}</span>
                                    <Badge variant="outline" className="text-xs px-1 py-0">{item.status}</Badge>
                                </div>
                            ))}
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

                        {/* Allergies & Contraindications */}
                        <div className="py-1">
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

                        {/* Clinical Notes */}
                        <div className="py-1 border-b">
                            <div className="font-semibold mb-1">Recent Clinical Notes:</div>
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

                        {/* Add New Note */}
                        <div className="py-1">
                            <div className="font-semibold mb-1">Add Clinical Note:</div>
                            <textarea 
                                placeholder="Enter clinical observations, assessments, or plan updates..."
                                className="w-full text-xs p-2 border rounded resize-none h-16 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <div className="mt-1 flex gap-1">
                                <Button size="sm" className="text-xs px-2 py-1 h-6">Save Note</Button>
                                <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6">Voice Note</Button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'imaging' && (
                    <div className="space-y-1">
                        {/* Lab Results */}
                        <div className="py-1 border-b">
                            <div className="font-semibold mb-1">Recent Lab Results:</div>
                            <div className="space-y-0.5">
                                <div className="grid grid-cols-4 gap-2 text-xs font-semibold py-0.5 border-b">
                                    <span>Test</span>
                                    <span>Result</span>
                                    <span>Range</span>
                                    <span>Status</span>
                                </div>
                                <div className="grid grid-cols-4 gap-2 text-xs py-0.5">
                                    <span>WBC</span>
                                    <span className="font-medium">15,000</span>
                                    <span className="text-gray-500">4,500-11,000</span>
                                    <span className="text-red-600 font-medium">High</span>
                                </div>
                                <div className="grid grid-cols-4 gap-2 text-xs py-0.5">
                                    <span>CRP</span>
                                    <span className="font-medium">25</span>
                                    <span className="text-gray-500">&lt;3.0</span>
                                    <span className="text-red-600 font-medium">Elevated</span>
                                </div>
                                <div className="grid grid-cols-4 gap-2 text-xs py-0.5">
                                    <span>Creatinine</span>
                                    <span className="font-medium">1.1</span>
                                    <span className="text-gray-500">0.7-1.3</span>
                                    <span className="text-green-600 font-medium">Normal</span>
                                </div>
                                <div className="grid grid-cols-4 gap-2 text-xs py-0.5">
                                    <span>Glucose</span>
                                    <span className="font-medium">145</span>
                                    <span className="text-gray-500">70-100</span>
                                    <span className="text-orange-600 font-medium">Mild ↑</span>
                                </div>
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
                        <div className="py-1">
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
                    </div>
                )}

                {activeTab === 'referral' && (
                    <div className="space-y-1">
                        {/* Referrals */}
                        <div className="py-1 border-b">
                            <div className="font-semibold mb-1">Active Referrals:</div>
                            <div className="space-y-0.5">
                                <div className="border border-blue-200 rounded p-2 bg-blue-50">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-xs">Cardiology Consultation</span>
                                        <span className="text-blue-600 text-xs">Urgent</span>
                                    </div>
                                    <div className="text-xs text-gray-600">Dr. Martinez - Requested today for cardiac evaluation</div>
                                    <div className="text-xs text-gray-500 mt-1">Status: Appointment scheduled for tomorrow 10:00 AM</div>
                                </div>
                                <div className="border border-green-200 rounded p-2 bg-green-50">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-xs">Physical Therapy</span>
                                        <span className="text-green-600 text-xs">Routine</span>
                                    </div>
                                    <div className="text-xs text-gray-600">Post-surgical mobility assessment and treatment plan</div>
                                    <div className="text-xs text-gray-500 mt-1">Status: Initial eval completed - ongoing sessions</div>
                                </div>
                            </div>
                        </div>

                        {/* Discharge Planning */}
                        <div className="py-1 border-b">
                            <div className="font-semibold mb-1">Discharge Planning:</div>
                            <div className="space-y-0.5">
                                <div className="grid grid-cols-3 gap-1 text-xs">
                                    <span className="font-medium">Est. Discharge:</span>
                                    <span className="col-span-2">March 18, 2024 (3 days)</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1 text-xs">
                                    <span className="font-medium">Discharge To:</span>
                                    <span className="col-span-2">Home with family support</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1 text-xs">
                                    <span className="font-medium">Follow-up:</span>
                                    <span className="col-span-2">Clinic in 1 week</span>
                                </div>
                            </div>
                        </div>

                        {/* Discharge Criteria */}
                        <div className="py-1 border-b">
                            <div className="font-semibold mb-1">Discharge Criteria:</div>
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                    <span className="text-green-600">✓</span>
                                    <span className="text-xs">Pain controlled with oral medications</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-green-600">✓</span>
                                    <span className="text-xs">Tolerating regular diet</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-orange-600">◐</span>
                                    <span className="text-xs">Ambulating independently</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-red-600">○</span>
                                    <span className="text-xs">Normal WBC count</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="py-1">
                            <div className="font-semibold mb-1">Actions:</div>
                            <div className="flex gap-1">
                                <Button size="sm" className="text-xs px-2 py-1 h-6">📋 Discharge Summary</Button>
                                <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6">📞 New Referral</Button>
                                <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6">📅 Schedule</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
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

    const handleSendMessage = (message) => {
        if (!message.trim()) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            message: message,
            timestamp: new Date()
        };

        setChatMessages(prev => [...prev, userMessage]);

        // Generate AI response
        setTimeout(() => {
            const aiResponse = {
                id: Date.now() + 1,
                type: 'ai',
                message: generateAIResponse(message),
                timestamp: new Date()
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
        <div className="h-screen flex flex-col bg-gray-50 font-sans overflow-hidden">
            {/* Compact Header - Consistent with Doctor/Nurse Dashboard */}
            <div className="flex-shrink-0 bg-gray-900 text-white px-4 py-2 flex items-center justify-between text-xs">
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
                    <Button onClick={startNewConsultation} size="sm" className="text-xs px-2 py-1 h-6">
                        New Consultation
                    </Button>
                </div>
            </div>

            {/* Main Two Column Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Column - Chat (1/3 width) */}
                <div className="w-1/3 border-r bg-white flex flex-col overflow-hidden">
                    <div className="flex-shrink-0 px-2 py-1 border-b bg-gray-50 flex items-center justify-between">
                        <span className="text-xs font-semibold">AI Assistant</span>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                            <span>Online</span>
                        </div>
                    </div>
                    
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-2 bg-gray-50">
                        {chatMessages.map((msg) => (
                            <div key={msg.id} className={`flex items-start gap-1 mb-2 ${msg.type === 'user' ? 'justify-end' : ''}`}>
                                {msg.type === 'ai' && (
                                    <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                                        <span className="text-xs">🤖</span>
                                    </div>
                                )}
                                <div className={`${msg.type === 'user' ? 'text-right' : ''}`}>
                                    <div className={`rounded p-2 text-xs max-w-xs ${
                                        msg.type === 'user' 
                                            ? 'bg-blue-600 text-white inline-block' 
                                            : 'bg-white border'
                                    }`}>
                                        {msg.message}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-0.5">Just now</div>
                                </div>
                                {msg.type === 'user' && (
                                    <div className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
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
                            <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                                Send
                            </button>
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

                {/* Right Column - Patient Information (2/3 width) */}
                <div className="w-2/3 flex flex-col overflow-hidden">
                    <PatientInfoTabs patient={currentPatient} />
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