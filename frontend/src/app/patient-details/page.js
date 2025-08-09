'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
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

// Mock blood test data for selected patients
const mockBloodTestData = {
    'P020': [
        {
            date: '2024-08-08',
            time: '09:00',
            testType: 'HbA1c and Lipid Panel',
            orderedBy: 'Dr. Siti Aminah',
            results: {
                hba1c: { value: 6.8, unit: '%', range: '<7.0', status: 'borderline' },
                glucose: { value: 142, unit: 'mg/dL', range: '70-100', status: 'high' },
                totalCholesterol: { value: 185, unit: 'mg/dL', range: '<200', status: 'normal' },
                hdl: { value: 48, unit: 'mg/dL', range: '>40', status: 'normal' },
                ldl: { value: 115, unit: 'mg/dL', range: '<100', status: 'borderline' },
                triglycerides: { value: 160, unit: 'mg/dL', range: '<150', status: 'borderline' },
                creatinine: { value: 0.9, unit: 'mg/dL', range: '0.7-1.3', status: 'normal' },
                bun: { value: 15, unit: 'mg/dL', range: '7-20', status: 'normal' }
            }
        },
        {
            date: '2024-02-15',
            time: '09:30',
            testType: 'HbA1c and Basic Metabolic Panel',
            orderedBy: 'Dr. Siti Aminah',
            results: {
                hba1c: { value: 7.2, unit: '%', range: '<7.0', status: 'high' },
                glucose: { value: 165, unit: 'mg/dL', range: '70-100', status: 'high' },
                creatinine: { value: 0.8, unit: 'mg/dL', range: '0.7-1.3', status: 'normal' },
                bun: { value: 14, unit: 'mg/dL', range: '7-20', status: 'normal' }
            }
        },
        {
            date: '2023-08-22',
            time: '10:15',
            testType: 'Initial Diabetes Screening Panel',
            orderedBy: 'Dr. Siti Aminah',
            results: {
                hba1c: { value: 7.8, unit: '%', range: '<7.0', status: 'high' },
                glucose: { value: 188, unit: 'mg/dL', range: '70-100', status: 'high' },
                totalCholesterol: { value: 205, unit: 'mg/dL', range: '<200', status: 'borderline' },
                creatinine: { value: 0.8, unit: 'mg/dL', range: '0.7-1.3', status: 'normal' }
            }
        }
    ],
    'P020': [
        {
            date: '2024-08-08',
            time: '14:30',
            testType: 'Diabetes Management Panel with Eye Health Monitoring',
            orderedBy: 'Dr. Siti Aminah & Dr. Ahmad Rahman',
            results: {
                hba1c: { value: 7.8, unit: '%', range: '<7.0', status: 'high' },
                glucose: { value: 165, unit: 'mg/dL', range: '70-100', status: 'high' },
                creatinine: { value: 0.9, unit: 'mg/dL', range: '0.7-1.3', status: 'normal' },
                microalbumin: { value: 18, unit: 'mg/g creatinine', range: '<30', status: 'normal' },
                totalCholesterol: { value: 185, unit: 'mg/dL', range: '<200', status: 'normal' },
                ldlCholesterol: { value: 110, unit: 'mg/dL', range: '<100', status: 'borderline' }
            }
        },
        {
            date: '2024-07-10',
            time: '09:15',
            testType: 'Initial Diabetes & Macular Edema Assessment Panel',
            orderedBy: 'Dr. Ahmad Rahman',
            results: {
                hba1c: { value: 8.2, unit: '%', range: '<7.0', status: 'high' },
                glucose: { value: 180, unit: 'mg/dL', range: '70-100', status: 'high' },
                creatinine: { value: 0.8, unit: 'mg/dL', range: '0.7-1.3', status: 'normal' },
                wbc: { value: 6.5, unit: 'K/µL', range: '4.5-11.0', status: 'normal' },
                crp: { value: 1.8, unit: 'mg/L', range: '<3.0', status: 'normal' },
                crt_od: { value: 450, unit: 'μm', range: '200-300', status: 'high' },
                crt_os: { value: 450, unit: 'μm', range: '200-300', status: 'high' }
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
        id: "P020", 
        name: "Nurul Asyikin", 
        room: "205B", 
        age: 59, 
        condition: "Diabetes Type 2 with Diabetic Macular Edema", 
        status: "serious",
        vitals: { bp: "135/85", hr: "78", temp: "36.9", o2sat: "98%" },
        vitalHistory: [
            { date: "2024-08-08", bp: "135/85", hr: "78", temp: "36.9", o2sat: "98%", weight: "58.2", bmi: "22.9", glucose: "165", hba1c: "7.8%" },
            { date: "2024-07-10", bp: "130/82", hr: "76", temp: "36.8", o2sat: "99%", weight: "58.8", bmi: "23.2", glucose: "180", hba1c: "8.2%" }
        ],
        insights: "59-year-old with Type 2 diabetes mellitus (diagnosed 2 years ago) complicated by diabetic macular edema affecting both eyes. HbA1c improving from 8.2% to 7.8% with current regimen but still above target. Central retinal thickness reduced from 450μm to 320μm following anti-VEGF therapy. Shared care between endocrinology (diabetes management) and ophthalmology (macular edema treatment). Patient shows good understanding of both conditions and importance of glycemic control for retinal health.",
        clinicalNotes: [
            {
                date: "2024-02-15",
                visit: 5,
                chiefComplaint: "Routine diabetes follow-up, reports occasional dizziness after meals",
                assessment: "Type 2 diabetes mellitus, well-controlled. HbA1c improved to 7.2%. Patient reports some post-prandial hypoglycemic symptoms.",
                plan: "Continue metformin 500mg BID. Advised on proper meal timing and blood sugar monitoring. Ordered HbA1c and lipid panel for next visit.",
                doctor: "Dr. Siti Aminah"
            },
            {
                date: "2023-11-10",
                visit: 4,
                chiefComplaint: "Diabetes follow-up, checking medication effectiveness",
                assessment: "Type 2 diabetes mellitus responding well to metformin. Blood pressure slightly elevated but improving.",
                plan: "Continue current metformin dosage. Encouraged weight loss through diet modification. Blood pressure monitoring.",
                doctor: "Dr. Siti Aminah"
            },
            {
                date: "2023-08-22",
                visit: 3,
                chiefComplaint: "Follow-up diabetes management, fatigue complaints",
                assessment: "Type 2 diabetes, HbA1c still elevated at 7.8% but improving from initial diagnosis. Patient showing good compliance.",
                plan: "Increase metformin to 500mg BID. Nutritionist referral for meal planning. Exercise program recommendation.",
                doctor: "Dr. Siti Aminah"
            },
            {
                date: "2023-05-18",
                visit: 2,
                chiefComplaint: "Diabetes medication side effects, stomach upset",
                assessment: "Newly diagnosed Type 2 diabetes. Patient experiencing mild GI upset from metformin, likely due to rapid initiation.",
                plan: "Reduce metformin to 250mg daily, gradual increase as tolerated. Diet counseling provided. Blood sugar monitoring education.",
                doctor: "Dr. Siti Aminah"
            },
            {
                date: "2022-08-15",
                visit: 1,
                chiefComplaint: "Frequent urination, increased thirst, fatigue for 2 months",
                assessment: "New diagnosis Type 2 diabetes mellitus. HbA1c 8.1%, fasting glucose 195 mg/dL. Overweight (BMI 26.0).",
                plan: "Started metformin 250mg daily. Diabetes education provided. Lifestyle modifications discussed. Follow-up in 3 months.",
                doctor: "Dr. Siti Aminah"
            }
        ],
        treatmentPlans: [
            {
                date: "2024-08-08",
                title: "Diabetes Management - Hypoglycemia Prevention",
                status: "active",
                medications: [
                    { name: "Metformin", dosage: "500mg", frequency: "Once daily with breakfast", indication: "Type 2 diabetes management", notes: "Reduced from BID to prevent hypoglycemic episodes" }
                ],
                lifestyle: [
                    "Regular meal timing - avoid skipping meals",
                    "Check blood glucose when experiencing symptoms",
                    "Carry glucose tablets for emergency treatment",
                    "Continue daily 30-minute walks",
                    "Weight management - target BMI 23-24"
                ],
                monitoring: [
                    "Self-monitor blood glucose when symptomatic",
                    "HbA1c every 6 months",
                    "Annual eye exam",
                    "Annual foot exam",
                    "Lipid panel annually"
                ],
                nextReview: "2024-11-08"
            },
            {
                date: "2024-02-15",
                title: "Diabetes Management - Optimization",
                status: "completed",
                medications: [
                    { name: "Metformin", dosage: "500mg", frequency: "Twice daily", indication: "Type 2 diabetes management", notes: "Well tolerated, good glucose control" }
                ],
                lifestyle: [
                    "Low glycemic index diet",
                    "Regular exercise - walking 30 minutes daily",
                    "Weight loss goal: 5kg over 6 months",
                    "Diabetes education reinforcement"
                ],
                monitoring: [
                    "HbA1c monitoring every 3-6 months",
                    "Home blood glucose monitoring as needed",
                    "Blood pressure checks"
                ],
                nextReview: "2024-08-15"
            }
        ],
        referrals: [
            {
                date: "2022-08-01",
                fromDoctor: "Dr. Ahmad Rahman (Family Medicine)",
                toDoctor: "Dr. Siti Aminah (Internal Medicine)",
                reason: "New diagnosis Type 2 diabetes mellitus - specialist management",
                urgency: "routine",
                status: "completed",
                notes: "34-year-old female with recent diagnosis of Type 2 DM. HbA1c 8.1%, fasting glucose 195 mg/dL. Requires diabetes education and initiation of treatment. Patient motivated for lifestyle changes.",
                followUp: "Patient successfully transitioned to specialist care. Excellent compliance with treatment plan."
            },
            {
                date: "2023-05-20",
                fromDoctor: "Dr. Siti Aminah",
                toDoctor: "Ms. Sarah Lee (Clinical Dietitian)",
                reason: "Diabetes nutrition counseling and meal planning",
                urgency: "routine",
                status: "completed",
                notes: "Patient needs comprehensive nutritional assessment and diabetes meal planning. Currently on metformin 250mg daily.",
                followUp: "Patient attended 3 sessions, demonstrated good understanding of carbohydrate counting and portion control."
            }
        ],
        timeline: [
            { type: "consultation", action: "Diabetes Follow-up Visit #6 - Blood Test Results", time: "Today", date: "August 8, 2024", icon: "fas fa-user-md", status: "completed", details: "Patient reports recent episodes of feeling shaky and dizzy when blood sugar drops. HbA1c improved to 6.8%. Discussed hypoglycemia management and meal timing." },
            { type: "lab", action: "HbA1c and Lipid Panel Results Reviewed", time: "Today", date: "August 8, 2024", icon: "fas fa-vial", status: "completed", details: "HbA1c: 6.8% (improved from 7.2%), glucose: 142 mg/dL. Lipid profile within normal limits. Kidney function normal." },
            { type: "medication", action: "Metformin Dosage Adjustment", time: "Today", date: "August 8, 2024", icon: "fas fa-pills", status: "completed", details: "Reduced metformin to 500mg in morning only to prevent hypoglycemic episodes. Patient advised to take with breakfast." },
            { type: "education", action: "Hypoglycemia Management Education", time: "Today", date: "August 8, 2024", icon: "fas fa-graduation-cap", status: "completed", details: "Taught signs/symptoms of hypoglycemia, when to check blood sugar, and how to treat low blood sugar episodes." },
            { type: "lab", action: "Blood Tests Ordered", time: "6 months ago", date: "February 15, 2024", icon: "fas fa-vial", status: "completed", details: "HbA1c and basic metabolic panel ordered due to patient reporting dizziness episodes after meals." },
            { type: "consultation", action: "Routine Diabetes Follow-up Visit #5", time: "6 months ago", date: "February 15, 2024", icon: "fas fa-user-md", status: "completed", details: "Patient doing well on metformin 500mg BID. Some post-meal dizziness reported. Weight loss of 1.3kg noted." },
            { type: "referral", action: "Nutrition Counseling Completed", time: "1 year ago", date: "May 20, 2023", icon: "fas fa-apple-alt", status: "completed", details: "Completed 3 sessions with clinical dietitian. Patient demonstrated excellent understanding of carbohydrate counting and portion control." },
            { type: "medication", action: "Metformin Optimization", time: "1.5 years ago", date: "November 10, 2023", icon: "fas fa-pills", status: "completed", details: "Increased metformin to 500mg BID due to suboptimal glucose control. Patient tolerating well." },
            { type: "education", action: "Diabetes Self-Management Education", time: "2 years ago", date: "August 22, 2022", icon: "fas fa-graduation-cap", status: "completed", details: "Completed diabetes education program. Patient learned blood glucose monitoring, medication management, and lifestyle modifications." },
            { type: "diagnosis", action: "Initial Diabetes Diagnosis", time: "2 years ago", date: "August 15, 2022", icon: "fas fa-diagnoses", status: "completed", details: "New diagnosis Type 2 diabetes mellitus. Referred from family medicine for specialist management and treatment initiation." }
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
    },
    // Ophthalmology patients for Dr. Ahmad
    { 
        id: "P011", 
        name: "Ahmed Hassan", 
        room: "205B", 
        age: 65, 
        condition: "Acute angle-closure glaucoma", 
        status: "critical",
        vitals: { bp: "160/95", hr: "100", temp: "99.1", o2sat: "96" },
        insights: "Acute angle-closure glaucoma with severe IOP elevation in both eyes. Patient reports severe eye pain, nausea, and seeing halos around lights. Requires immediate laser peripheral iridotomy to prevent permanent vision loss.",
        timeline: [
            { type: "emergency", action: "Emergency ophthalmology consultation", time: "2 hours ago", date: "March 14, 2024", icon: "fas fa-eye", status: "completed", details: "Patient presented with severe bilateral eye pain and vision loss." },
            { type: "diagnostic", action: "IOP measurement", time: "1.5 hours ago", date: "March 14, 2024", icon: "fas fa-compress", status: "completed", details: "Intraocular pressure: OD 45mmHg, OS 42mmHg (Critical elevation)" },
            { type: "medication", action: "Anti-glaucoma drops started", time: "1 hour ago", date: "March 14, 2024", icon: "fas fa-eye-dropper", status: "ongoing", details: "Pilocarpine 2% Q15min, Timolol 0.5% BID, Acetazolamide IV" },
            { type: "surgery", action: "Laser peripheral iridotomy scheduled", time: "scheduled", date: "March 14, 2024", icon: "fas fa-laser", status: "pending", details: "Urgent LPI procedure scheduled within 2 hours to restore aqueous drainage." }
        ]
    },
    { 
        id: "P012", 
        name: "Linda Chen", 
        room: "208A", 
        age: 58, 
        condition: "Retinal detachment", 
        status: "critical",
        vitals: { bp: "135/85", hr: "78", temp: "98.4", o2sat: "98" },
        insights: "Macula-off retinal detachment in right eye. Vision significantly compromised. Requires urgent vitrectomy and retinal reattachment surgery to prevent permanent vision loss.",
        timeline: [
            { type: "emergency", action: "Urgent ophthalmology referral", time: "4 hours ago", date: "March 14, 2024", icon: "fas fa-eye", status: "completed", details: "Patient reported sudden vision loss and flashing lights in right eye." },
            { type: "diagnostic", action: "Dilated fundus examination", time: "3 hours ago", date: "March 14, 2024", icon: "fas fa-search", status: "completed", details: "Large superior retinal detachment involving macula confirmed." },
            { type: "imaging", action: "OCT scan performed", time: "2 hours ago", date: "March 14, 2024", icon: "fas fa-camera", status: "completed", details: "OCT confirms macular detachment with subretinal fluid." },
            { type: "surgery", action: "Vitrectomy scheduled", time: "scheduled", date: "March 14, 2024", icon: "fas fa-scalpel", status: "pending", details: "Emergency vitrectomy with gas tamponade scheduled for today." }
        ]
    },
    { 
        id: "P013", 
        name: "Omar Malik", 
        room: "210C", 
        age: 72, 
        condition: "Corneal perforation", 
        status: "serious",
        vitals: { bp: "145/90", hr: "82", temp: "98.8", o2sat: "97" },
        insights: "Traumatic corneal perforation with iris prolapse. High risk of endophthalmitis. Requires immediate corneal repair and prophylactic antibiotic therapy.",
        timeline: [
            { type: "emergency", action: "Eye trauma admission", time: "6 hours ago", date: "March 14, 2024", icon: "fas fa-ambulance", status: "completed", details: "Patient sustained penetrating eye injury from metal fragment." },
            { type: "diagnostic", action: "Slit lamp examination", time: "5 hours ago", date: "March 14, 2024", icon: "fas fa-eye", status: "completed", details: "3mm corneal laceration with iris tissue prolapse identified." },
            { type: "medication", action: "Prophylactic antibiotics", time: "4 hours ago", date: "March 14, 2024", icon: "fas fa-pills", status: "ongoing", details: "Topical and systemic antibiotics started to prevent infection." },
            { type: "surgery", action: "Corneal repair scheduled", time: "scheduled", date: "March 14, 2024", icon: "fas fa-band-aid", status: "pending", details: "Primary corneal repair with iris repositioning planned." }
        ]
    }
];

// Patient Information Tabs Component
function PatientInfoTabs({ patient, onNewClinicalNote, user }) {
    const [activeTab, setActiveTab] = useState('summary');
    const [patientUpdates, setPatientUpdates] = useState([]);
    const [selectedTrend, setSelectedTrend] = useState(null);

    const tabs = [
        { id: 'summary', label: 'Summary', icon: '📋' },
        { id: 'vitals', label: 'Vital Signs', icon: '❤️' },
        { id: 'treatment', label: 'Treatment Plan', icon: '💊' },
        { id: 'clinical', label: 'Clinical Notes', icon: '📄' },
        { id: 'imaging', label: 'Imaging & Labs', icon: '🧪' },
        { id: 'timeline', label: 'Timeline', icon: '📅' },
        { id: 'log', label: 'Log', icon: '📈' },
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
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-2 bg-card text-xs">
                {activeTab === 'summary' && (
                    <div className="space-y-2">
                        {/* Doctor-specific content first */}
                        <div className="bg-card border rounded p-2">
                            <div className="font-bold text-primary mb-2">
                                AI Summary
                            </div>
                            <div className="text-foreground text-xs leading-relaxed">
                                {user?.specialty === 'Ophthalmologist' 
                                    ? (patient?.id === 'P020' 
                                        ? 'Follow-up for diabetic macular edema in 59-year-old with Type 2 diabetes. Central retinal thickness improved to 320μm OU (down from 450μm) following anti-VEGF therapy. Visual acuity improved from 20/40 to 20/30 OU. Hard exudates resolving bilaterally. Patient demonstrates excellent understanding of diabetes-macular edema relationship. Continue monthly ranibizumab injections and coordinate diabetes care with Dr. Siti. Next injection in 4 weeks.'
                                        : patient.insights)
                                    : (patient?.id === 'P020' 
                                        ? 'Diabetes Type 2 well-controlled with current regimen. Patient demonstrates good understanding of dietary modifications and medication compliance. Recent HbA1c shows improvement. Monitor for diabetic complications including regular ophthalmological follow-up with Dr. Ahmad. Continue current diabetes management plan with lifestyle modifications.'
                                        : patient.insights)
                                }
                            </div>
                        </div>

                        {/* Primary Diagnosis */}
                        <div className="bg-card border rounded p-2">
                            <div className="font-bold text-primary mb-2">Primary Diagnosis</div>
                            <div className="text-foreground text-xs leading-relaxed">
                                <div className="font-medium mb-1">{patient.condition}</div>
                                <div>{patient.insights}</div>
                            </div>
                        </div>

                        {/* Doctor-specific clinical information */}
                        {user?.specialty !== 'Ophthalmologist' && patient?.id === 'P020' && (
                            <div className="bg-card border rounded p-2">
                                <div className="font-bold text-primary mb-2">Diabetes Management</div>
                                <div className="space-y-1 text-xs">
                                    <div className="flex justify-between items-center">
                                        <span>• HbA1c Target: &lt;7.0%</span>
                                        <span className="text-green-600 font-medium">Current: 6.8%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>• Blood Glucose Monitoring</span>
                                        <span className="text-blue-600 font-medium">BID</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>• Diet adherence</span>
                                        <span className="text-green-600 font-medium">Excellent</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>• Exercise routine</span>
                                        <span className="text-blue-600 font-medium">30min/day</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Ophthalmology-Specific Sections */}
                        {user?.specialty === 'Ophthalmologist' && (
                            <>
                                {/* Eye Examination */}
                                <div className="bg-card border rounded p-2">
                                    <div className="font-bold text-primary mb-2">Eye Examination Findings</div>
                                    {patient?.id === 'P020' ? (
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="p-2 rounded bg-card border">
                                                <div className="font-medium">Right Eye (OD)</div>
                                                <div className="text-sm">• VA: 20/30 (improved)</div>
                                                <div className="text-sm">• CRT: 320μm (reduced)</div>
                                                <div className="text-sm">• Macula: Mild edema, improving</div>
                                                <div className="text-sm">• Hard exudates: Resolving</div>
                                            </div>
                                            <div className="p-2 rounded bg-card border">
                                                <div className="font-medium">Left Eye (OS)</div>
                                                <div className="text-sm">• VA: 20/30 (improved)</div>
                                                <div className="text-sm">• CRT: 320μm (reduced)</div>
                                                <div className="text-sm">• Macula: Mild edema, improving</div>
                                                <div className="text-sm">• Hard exudates: Resolving</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="p-2 rounded bg-card border">
                                                <div className="font-medium">Right Eye (OD)</div>
                                                <div className="text-sm">• VA: 20/200</div>
                                                <div className="text-sm">• IOP: 45mmHg ↑</div>
                                                <div className="text-sm">• Pupil: Mid-dilated, non-reactive</div>
                                                <div className="text-sm">• Cornea: Edematous</div>
                                            </div>
                                            <div className="p-2 rounded bg-card border">
                                                <div className="font-medium">Left Eye (OS)</div>
                                                <div className="text-sm">• VA: 20/400</div>
                                                <div className="text-sm">• IOP: 42mmHg ↑</div>
                                                <div className="text-sm">• Pupil: Mid-dilated, sluggish</div>
                                                <div className="text-sm">• Cornea: Mild edema</div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Ophthalmic Medications */}
                                <div className="bg-card border rounded p-2">
                                    <div className="font-bold text-primary mb-2">Current Ophthalmic Medications</div>
                                    {patient?.id === 'P020' ? (
                                        <div className="space-y-1 text-xs">
                                            <div className="flex justify-between items-center">
                                                <span>• Ranibizumab intravitreal injection</span>
                                                <span className="text-blue-600 font-medium">Monthly</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>• Artificial tears (preservative-free)</span>
                                                <span className="text-green-600 font-medium">QID/PRN</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-1 text-xs">
                                            <div className="flex justify-between items-center">
                                                <span>• Pilocarpine 2% drops</span>
                                                <span className="text-green-600 font-medium">Q15min x 4</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>• Timolol 0.5%</span>
                                                <span className="text-blue-600 font-medium">BID</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>• Acetazolamide 500mg</span>
                                                <span className="text-purple-600 font-medium">IV STAT</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>• Mannitol 20%</span>
                                                <span className="text-red-600 font-medium">IV 1.5g/kg</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Treatment Plan */}
                                <div className="bg-card border rounded p-2">
                                    <div className="font-bold text-primary mb-2">Treatment Plan</div>
                                    {patient?.id === 'P020' ? (
                                        <div className="space-y-1 text-xs">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                <span className="font-medium">Continue:</span>
                                                <span>Monthly ranibizumab injections for macular edema</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                <span className="font-medium">Diabetes:</span>
                                                <span>Coordinate with Dr. Siti for optimal glucose control</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                                <span className="font-medium">Monitoring:</span>
                                                <span>OCT scans monthly; visual acuity at each visit</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                                <span className="font-medium">Follow-up:</span>
                                                <span>Next injection in 4 weeks</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-1 text-xs">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                                <span className="font-medium">URGENT:</span>
                                                <span>Laser peripheral iridotomy within 2 hours</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                                <span className="font-medium">Monitor:</span>
                                                <span>IOP every 30 minutes post-treatment</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                <span className="font-medium">Follow-up:</span>
                                                <span>Schedule bilateral prophylactic LPI</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* General content at bottom */}
                        {/* Critical Status Alert */}
                        {patient.status === 'critical' && (
                            <div className="bg-card border rounded p-2">
                                <div className="flex items-center gap-2 text-red-800">
                                    <span className="font-bold">CRITICAL PATIENT</span>
                                </div>
                                <div className="text-red-700 text-xs mt-1">
                                    {user?.specialty === 'Ophthalmologist' 
                                        ? 'Immediate ophthalmological intervention required'
                                        : 'Requires immediate attention and continuous monitoring'
                                    }
                                </div>
                            </div>
                        )}

                        {/* Current Vital Signs */}
                        <div className="bg-card border rounded p-2">
                            <div className="font-bold text-primary mb-2">Current Vital Signs</div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="p-2 rounded bg-card border">
                                    <div className="font-medium">Blood Pressure</div>
                                    <div className="text-lg font-bold text-foreground">
                                        {patient.vitals.bp}
                                    </div>
                                    <div className="text-muted-foreground">
                                        {patient.status === 'critical' ? 'HYPERTENSIVE' : 'mmHg'}
                                    </div>
                                </div>
                                <div className="p-2 rounded bg-card border">
                                    <div className="font-medium">Heart Rate</div>
                                    <div className="text-lg font-bold text-foreground">
                                        {patient.vitals.hr}
                                    </div>
                                    <div className="text-muted-foreground">
                                        {patient.status === 'critical' ? 'TACHYCARDIC' : 'bpm'}
                                    </div>
                                </div>
                                <div className="p-2 rounded bg-card border">
                                    <div className="font-medium">Temperature</div>
                                    <div className="text-lg font-bold text-foreground">
                                        {patient.vitals.temp}°C
                                    </div>
                                    <div className="text-muted-foreground">
                                        {patient.status === 'critical' ? 'FEBRILE' : 'Normal'}
                                    </div>
                                </div>
                                <div className="p-2 rounded bg-card border">
                                    <div className="font-medium">O2 Saturation</div>
                                    <div className="text-lg font-bold text-foreground">
                                        {patient.vitals.o2sat}%
                                    </div>
                                    <div className="text-muted-foreground">
                                        {patient.status === 'critical' ? 'HYPOXIC' : 'Good'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Critical Lab Values */}
                        {mockBloodTestData[patient?.id] && (
                            <div className="bg-card border rounded p-2">
                                <div className="font-bold text-primary mb-2">Critical Lab Values (Latest)</div>
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    {Object.entries(mockBloodTestData[patient.id][0].results)
                                        .filter(([key, result]) => result.status === 'high' || result.status === 'low')
                                        .slice(0, 6)
                                        .map(([key, result]) => (
                                        <div key={key} className="p-1 bg-card rounded border">
                                            <div className="font-medium">{key.toUpperCase()}</div>
                                            <div className={`font-bold text-foreground`}>
                                                {result.value} {result.unit}
                                            </div>
                                            <div className="text-muted-foreground">
                                                {result.status === 'high' ? '↑ HIGH' : '↓ LOW'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="text-muted-foreground text-xs mt-2 font-medium">
                                    {Object.entries(mockBloodTestData[patient.id][0].results).filter(([key, result]) => result.status !== 'normal').length} abnormal values require attention
                                </div>
                            </div>
                        )}

                        {/* Two-column layout for Current Medication and Active Treatment */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* Current Medication */}
                            <div className="bg-card border rounded p-2">
                                <div className="font-bold text-primary mb-2">Current Medication</div>
                                <div className="space-y-1 text-xs">
                                    {patient.id === 'P020' ? (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                <span><strong>Metformin 500mg</strong> - Once daily with breakfast</span>
                                            </div>
                                            <div className="text-muted-foreground text-xs">
                                                <strong>Recent change:</strong> Reduced from BID to prevent hypoglycemic episodes
                                            </div>
                                        </>
                                    ) : patient.id === 'P020' ? (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-primary rounded-full"></span>
                                                <span><strong>Tobramycin 0.3% eye drops</strong> - 1-2 drops q4h OU (continue 5 days, then taper)</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-secondary rounded-full"></span>
                                                <span><strong>Artificial tears</strong> - QID and PRN for comfort</span>
                                            </div>
                                        </>
                                    ) : patient.status === 'critical' ? (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-destructive rounded-full"></span>
                                                <span><strong>Ceftriaxone 1g IV</strong> - Daily at 08:00</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-muted rounded-full"></span>
                                                <span><strong>Morphine 2-4mg IV</strong> - PRN for pain</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                <span><strong>Standard medications</strong> - As prescribed</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Active Treatment */}
                            <div className="bg-card border rounded p-2">
                                <div className="font-bold text-primary mb-2">Active Treatment</div>
                                <div className="space-y-1 text-xs">
                                    {patient.id === 'P020' ? (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-primary rounded-full"></span>
                                                <span><strong>Diabetes management</strong> - Routine follow-up</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-secondary rounded-full"></span>
                                                <span><strong>Hypoglycemia education</strong> - Completed today</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-accent rounded-full"></span>
                                                <span><strong>Lifestyle counseling</strong> - Ongoing</span>
                                            </div>
                                        </>
                                    ) : patient.id === 'P020' ? (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-primary rounded-full"></span>
                                                <span><strong>Conjunctivitis follow-up</strong> - Continue antibiotics; taper after 5 days</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-secondary rounded-full"></span>
                                                <span><strong>Visual acuity monitoring</strong> - Intermittent blurring noted, improving</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-accent rounded-full"></span>
                                                <span><strong>Hygiene measures</strong> - Hand hygiene, no contact lenses</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-muted rounded-full"></span>
                                                <span><strong>Follow-up</strong> - Review in 1 week</span>
                                            </div>
                                        </>
                                    ) : patient.status === 'critical' ? (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-destructive rounded-full"></span>
                                                <span><strong>Antibiotic therapy</strong> - Day 2 of treatment</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-primary rounded-full"></span>
                                                <span><strong>Continuous monitoring</strong> - Hourly vitals</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-muted rounded-full"></span>
                                                <span><strong>Pain management</strong> - Active protocol</span>
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
                        </div>

                        {/* Recent Critical Events */}
                        <div className="border rounded p-2">
                            <div className="font-bold text-primary mb-2">Recent Critical Events</div>
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
                                            <span className="text-muted-foreground">•</span>
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

                    </div>
                )}

                {activeTab === 'treatment' && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-foreground">Treatment Plans</h3>
                            <Badge variant="outline" className="text-xs">
                                {patient.treatmentPlans?.filter(plan => plan.status === 'active').length || 0} Active
                            </Badge>
                        </div>
                        
                        {patient.treatmentPlans?.map((plan, index) => (
                            <Card key={index} className={`${plan.status === 'active' ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                                <CardHeader className="py-2">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm">{plan.title}</CardTitle>
                                        <Badge variant={plan.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                                            {plan.status}
                                        </Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground">{plan.date}</div>
                                </CardHeader>
                                <CardContent className="py-2">
                                    <div className="space-y-3">
                                        {/* Active Medications Section */}
                                        <div>
                                            <h4 className="font-semibold text-xs mb-2">Active Medications</h4>
                                            <div className="space-y-2">
                                                <div className="bg-card border rounded p-2">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <div>
                                                            <div className="font-medium text-xs">Ceftriaxone 1g IV</div>
                                                            <div className="text-xs text-muted-foreground">Antibiotic - Daily at 08:00</div>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-green-500 text-xs font-medium">Active</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">Started: 3 days ago • Next due: 08:00 tomorrow</div>
                                                </div>
                                                <div className="bg-card border rounded p-2">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <div>
                                                            <div className="font-medium text-xs">Morphine 2mg IV</div>
                                                            <div className="text-xs text-muted-foreground">Pain relief - PRN (as needed)</div>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-blue-500 text-xs font-medium">PRN</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">Last given: 4 hours ago • Pain score: 5/10</div>
                                                </div>
                                                <div className="bg-card border rounded p-2">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <div>
                                                            <div className="font-medium text-xs">Lisinopril 10mg PO</div>
                                                            <div className="text-xs text-muted-foreground">ACE Inhibitor - BID (twice daily)</div>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-green-500 text-xs font-medium">Active</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">08:00 & 20:00 • Last given: 08:00 today</div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {plan.medications && (
                                            <div>
                                                <h4 className="font-semibold text-xs mb-1">Additional Medications</h4>
                                                {plan.medications.map((med, medIndex) => (
                                                    <div key={medIndex} className="bg-white p-2 rounded border">
                                                        <div className="font-medium text-xs">{med.name} {med.dosage}</div>
                                                        <div className="text-xs text-muted-foreground">{med.frequency} - {med.indication}</div>
                                                        {med.notes && <div className="text-xs text-blue-600 mt-1">Note: {med.notes}</div>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        
                                        {plan.lifestyle && (
                                            <div>
                                                <h4 className="font-semibold text-xs mb-1">Lifestyle Modifications</h4>
                                                <ul className="list-disc list-inside space-y-1">
                                                    {plan.lifestyle.map((item, itemIndex) => (
                                                        <li key={itemIndex} className="text-xs text-muted-foreground">{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        
                                        {plan.monitoring && (
                                            <div>
                                                <h4 className="font-semibold text-xs mb-1">Monitoring Plan</h4>
                                                <ul className="list-disc list-inside space-y-1">
                                                    {plan.monitoring.map((item, itemIndex) => (
                                                        <li key={itemIndex} className="text-xs text-muted-foreground">{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        
                                        {plan.nextReview && plan.status === 'active' && (
                            <div className="bg-muted p-2 rounded">
                                <div className="text-xs font-semibold text-foreground">Next Review: {plan.nextReview}</div>
                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )) || (
                            <div className="text-center text-muted-foreground py-4">No treatment plans available</div>
                        )}
                    </div>
                )}

                {activeTab === 'referrals' && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-foreground">Referrals</h3>
                            <Badge variant="outline" className="text-xs">
                                {patient.referrals?.length || 0} Total
                            </Badge>
                        </div>
                        
                        {patient.referrals?.map((referral, index) => (
                            <Card key={index} className="border-border">
                                <CardHeader className="py-2">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm">{referral.reason}</CardTitle>
                                        <Badge variant={referral.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                                            {referral.status}
                                        </Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground">{referral.date}</div>
                                </CardHeader>
                                <CardContent className="py-2">
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <div className="text-xs font-semibold">From:</div>
                                                <div className="text-xs text-muted-foreground">{referral.fromDoctor}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs font-semibold">To:</div>
                                                <div className="text-xs text-muted-foreground">{referral.toDoctor}</div>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <div className="text-xs font-semibold">Referral Notes:</div>
                                            <div className="text-xs text-muted-foreground">{referral.notes}</div>
                                        </div>
                                        
                                        {referral.followUp && (
                                            <div className="bg-green-50 p-2 rounded border border-green-200">
                                                <div className="text-xs font-semibold text-green-800">Follow-up:</div>
                                                <div className="text-xs text-green-700">{referral.followUp}</div>
                                            </div>
                                        )}
                                        
                                        <div className="flex items-center gap-2">
                                            <Badge variant={referral.urgency === 'urgent' ? 'destructive' : 'secondary'} className="text-xs">
                                                {referral.urgency}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )) || (
                            <div className="text-center text-muted-foreground py-4">No referrals available</div>
                        )}
                    </div>
                )}

                {activeTab === 'vitals' && (
                    <div className="space-y-1">
                        {/* Current Vital Signs */}
                        <div className="bg-card border rounded p-2">
                            <div className="font-bold text-primary mb-2">Current Vital Signs</div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="p-2 rounded bg-card border">
                                    <div className="font-medium">Blood Pressure</div>
                                    <div className="text-lg font-bold text-foreground">
                                        {patient.vitals.bp}
                            </div>
                                    <div className="text-muted-foreground">
                                        {patient.status === 'critical' ? 'HYPERTENSIVE' : 'mmHg'}
                            </div>
                            </div>
                                <div className="p-2 rounded bg-card border">
                                    <div className="font-medium">Heart Rate</div>
                                    <div className="text-lg font-bold text-foreground">
                                        {patient.vitals.hr}
                                    </div>
                                    <div className="text-muted-foreground">bpm</div>
                                </div>
                                <div className="p-2 rounded bg-card border">
                                    <div className="font-medium">Temperature</div>
                                    <div className="text-lg font-bold text-foreground">
                                        {patient.vitals.temp}
                                    </div>
                                    <div className="text-muted-foreground">°F</div>
                                </div>
                                <div className="p-2 rounded bg-card border">
                                    <div className="font-medium">O2 Saturation</div>
                                    <div className="text-lg font-bold text-foreground">
                                        {patient.vitals.o2sat}
                                    </div>
                                    <div className="text-muted-foreground">%</div>
                                </div>
                            </div>
                        </div>

                        {/* Vitals Notes */}
                        <div className="py-2 border-b bg-muted/50 rounded px-3">
                            <div className="text-xs text-muted-foreground">
                                <strong>Notes:</strong> Blood pressure trending down with treatment. Heart rate stabilizing. Temperature still elevated but improving.
                            </div>
                        </div>

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Left Column: Vital Signs Trends */}
                            <div className="bg-card border rounded p-3">
                                <div className="font-bold text-primary mb-2">Vital Signs Trends (Last 6 Months)</div>
                            <div className="space-y-3">
                                {/* Blood Pressure Chart */}
                                <div className="bg-red-50 border border-red-200 rounded p-2">
                                    <div className="text-xs font-medium text-red-800 mb-2">Blood Pressure (mmHg)</div>
                                    <div className="h-20">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={[
                                                { time: '6m ago', systolic: 155, diastolic: 95 },
                                                { time: '4m ago', systolic: 145, diastolic: 88 },
                                                { time: '3m ago', systolic: 142, diastolic: 85 },
                                                { time: '2m ago', systolic: 138, diastolic: 82 },
                                                { time: 'Current', systolic: parseInt(patient.vitals.bp.split('/')[0]), diastolic: parseInt(patient.vitals.bp.split('/')[1]) }
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
                                        <div className="text-xs text-red-700 mt-1">Current: {patient.vitals.bp} • Trend: ↘ Improving over months</div>
                                </div>

                                {/* Heart Rate Chart */}
                                <div className="bg-blue-50 border border-blue-200 rounded p-2">
                                    <div className="text-xs font-medium text-blue-800 mb-2">Heart Rate (bpm)</div>
                                    <div className="h-20">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={[
                                                { time: '6m ago', hr: 85 },
                                                { time: '4m ago', hr: 82 },
                                                { time: '3m ago', hr: 80 },
                                                { time: '2m ago', hr: 79 },
                                                { time: 'Current', hr: parseInt(patient.vitals.hr) }
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
                                        <div className="text-xs text-blue-700 mt-1">Current: {patient.vitals.hr} bpm • Trend: ↘ Stable over months</div>
                                </div>

                                {/* Temperature Chart */}
                                <div className="bg-green-50 border border-green-200 rounded p-2">
                                    <div className="text-xs font-medium text-green-800 mb-2">Temperature (°F)</div>
                                    <div className="h-20">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={[
                                                { time: '6m ago', temp: 98.4 },
                                                { time: '4m ago', temp: 98.2 },
                                                { time: '3m ago', temp: 98.5 },
                                                { time: '2m ago', temp: 98.3 },
                                                { time: 'Current', temp: parseFloat(patient.vitals.temp) }
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
                                        <div className="text-xs text-green-700 mt-1">Current: {patient.vitals.temp}°F • Trend: → Normal range</div>
                                </div>

                                {/* Oxygen Saturation Chart */}
                                <div className="bg-purple-50 border border-purple-200 rounded p-2">
                                    <div className="text-xs font-medium text-purple-800 mb-2">Oxygen Saturation (%)</div>
                                    <div className="h-20">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={[
                                                { time: '6m ago', o2: 97 },
                                                { time: '4m ago', o2: 98 },
                                                { time: '3m ago', o2: 97 },
                                                { time: '2m ago', o2: 98 },
                                                { time: 'Current', o2: parseInt(patient.vitals.o2sat) }
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
                                        <div className="text-xs text-purple-700 mt-1">Current: {patient.vitals.o2sat}% • Trend: → Stable</div>
                                </div>
                            </div>
                        </div>

                            {/* Right Column: Vital Signs History */}
                            <div className="bg-card border rounded p-3">
                                <div className="font-bold text-primary mb-2">Vital Signs History</div>
                                <div className="space-y-1">
                                    {/* Latest Vital Signs Updates */}
                        {patientUpdates.filter(update => update.vitalSigns?.trim()).length > 0 && (
                                        <div className="mb-3">
                                            <div className="font-semibold mb-1 text-sm">Latest Updates:</div>
                                <div className="space-y-0.5">
                                    {patientUpdates
                                        .filter(update => update.vitalSigns?.trim())
                                                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                                                    .slice(0, 3)
                                        .map((update, index) => (
                                                    <div key={index} className={`${index === 0 ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'} border rounded p-2`}>
                                            <div className="flex items-center justify-between mb-1">
                                                            <span className={`font-medium text-xs ${index === 0 ? 'text-green-800' : 'text-blue-800'}`}>
                                                    {new Date(update.timestamp).toLocaleString()}
                                                </span>
                                                            <span className={`text-xs font-medium ${index === 0 ? 'text-green-700 bg-green-100' : 'text-blue-700 bg-blue-100'} px-2 py-1 rounded`}>
                                                                {index === 0 ? 'LATEST' : 'Recent'}
                                                            </span>
                                            </div>
                                                        <div className="text-xs text-gray-700 bg-white p-2 rounded font-medium">
                                                {update.vitalSigns}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                                    {/* Outpatient Visit History Table */}
                                    <div>
                            <div className="space-y-0.5">
                                            <div className="grid grid-cols-5 gap-2 font-semibold py-0.5 border-b text-xs">
                                                <span>Visit</span>
                                    <span>BP</span>
                                    <span>HR</span>
                                    <span>Temp</span>
                                    <span>O2</span>
                                </div>
                                            <div className="grid grid-cols-5 gap-2 py-0.5 text-xs">
                                    <span>Current</span>
                                    <span>{patient.vitals.bp}</span>
                                    <span>{patient.vitals.hr}</span>
                                    <span>{patient.vitals.temp}</span>
                                    <span>{patient.vitals.o2sat}</span>
                                </div>
                                            <div className="grid grid-cols-5 gap-2 py-0.5 text-xs">
                                                <span>2m ago</span>
                                                <span>138/82</span>
                                                <span>79</span>
                                                <span>98.3</span>
                                                <span>98</span>
                                </div>
                                            <div className="grid grid-cols-5 gap-2 py-0.5 text-xs">
                                                <span>3m ago</span>
                                                <span>142/85</span>
                                                <span>80</span>
                                                <span>98.5</span>
                                                <span>97</span>
                                </div>
                                            <div className="grid grid-cols-5 gap-2 py-0.5 text-xs">
                                                <span>4m ago</span>
                                                <span>145/88</span>
                                                <span>82</span>
                                                <span>98.2</span>
                                                <span>98</span>
                                </div>
                                            <div className="grid grid-cols-5 gap-2 py-0.5 text-xs">
                                                <span>6m ago</span>
                                                <span>155/95</span>
                                                <span>85</span>
                                                <span>98.4</span>
                                                <span>97</span>
                            </div>
                        </div>
                        </div>
                                </div>
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
                                        <div className="flex items-start gap-2 py-1 border-b rounded px-2">
                                            <span className="text-destructive w-16 flex-shrink-0 text-xs font-medium">
                                                {new Date(update.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-xs">Vital Signs Updated</span>
                                                </div>
                                                <div className="text-muted-foreground text-xs">{update.vitalSigns.substring(0, 80)}...</div>
                                                <div className="text-destructive text-xs">New vital signs recorded</div>
                                            </div>
                                        </div>
                                    )}
                                    {update.treatmentPlan?.trim() && (
                                        <div className="flex items-start gap-2 py-1 border-b rounded px-2">
                                            <span className="text-green-700 w-16 flex-shrink-0 text-xs font-medium">
                                                {new Date(update.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-xs">Treatment Plan Updated</span>
                                                </div>
                                                <div className="text-muted-foreground text-xs">{update.treatmentPlan.substring(0, 80)}...</div>
                                                <div className="text-green-700 text-xs">Plan modifications recorded</div>
                                            </div>
                                        </div>
                                    )}
                                    {(update.clinicalNote?.subjective?.trim() || 
                                      update.clinicalNote?.history?.trim() || 
                                      update.clinicalNote?.objective?.trim() || 
                                      update.clinicalNote?.assessment?.trim()) && (
                                        <div className="flex items-start gap-2 py-1 border-b rounded px-2">
                                            <span className="text-primary w-16 flex-shrink-0 text-xs font-medium">
                                                {new Date(update.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-xs">Clinical Note Added</span>
                                                </div>
                                                <div className="text-muted-foreground text-xs">
                                                    {(update.clinicalNote.subjective || update.clinicalNote.history || 
                                                      update.clinicalNote.objective || update.clinicalNote.assessment)?.substring(0, 80)}...
                                                </div>
                                                <div className="text-primary text-xs">SOAP documentation updated</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )).reverse()}
                            {/* Conditional Log Entries based on patient */}
                            {patient?.id === 'P020' ? (
                                <>
                                    <div className="flex items-start gap-2 py-1 border-b rounded px-2">
                                        <span className="text-primary w-16 flex-shrink-0 text-xs font-medium">9:15 AM</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-xs">Clinical Note Added</span>
                                            </div>
                                            <div className="text-muted-foreground text-xs">Dr. Siti documented diabetes follow-up visit #6 with hypoglycemia education</div>
                                            <div className="text-primary text-xs">Status: Completed</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 py-1 border-b rounded px-2">
                                        <span className="text-secondary-foreground w-16 flex-shrink-0 text-xs font-medium">9:00 AM</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-xs">Lab Results Reviewed</span>
                                            </div>
                                            <div className="text-muted-foreground text-xs">HbA1c: 6.8% (improved), glucose: 142 mg/dL - Dr. Siti Aminah</div>
                                            <div className="text-green-700 text-xs">Good diabetes control achieved</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 py-1 border-b rounded px-2">
                                        <span className="text-green-700 w-16 flex-shrink-0 text-xs font-medium">8:45 AM</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-xs">Medication Adjusted</span>
                                            </div>
                                            <div className="text-muted-foreground text-xs">Metformin reduced to 500mg once daily - Dr. Siti Aminah</div>
                                            <div className="text-green-700 text-xs">To prevent hypoglycemic episodes</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 py-1 border-b rounded px-2">
                                        <span className="text-destructive w-16 flex-shrink-0 text-xs font-medium">8:30 AM</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-xs">Vital Signs Updated</span>
                                            </div>
                                            <div className="text-muted-foreground text-xs">BP: 125/78, HR: 68, Weight: 68.2kg, BMI: 24.1 - Nurse Lim</div>
                                            <div className="text-green-700 text-xs">All parameters normal</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 py-1 border-b rounded px-2">
                                        <span className="text-amber-700 w-16 flex-shrink-0 text-xs font-medium">8:15 AM</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-xs">Patient Education</span>
                                            </div>
                                            <div className="text-muted-foreground text-xs">Hypoglycemia management education provided - Dr. Siti Aminah</div>
                                            <div className="text-amber-700 text-xs">Patient demonstrated understanding</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 py-1 border-b rounded px-2">
                                        <span className="text-muted-foreground w-16 flex-shrink-0 text-xs font-medium">8:00 AM</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-xs">Patient Check-in</span>
                                            </div>
                                            <div className="text-muted-foreground text-xs">Outpatient diabetes follow-up appointment - Reception</div>
                                            <div className="text-muted-foreground text-xs">Patient arrived on time</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 py-1 border-b border-gray-100 bg-indigo-50 rounded px-2">
                                        <span className="text-indigo-600 w-16 flex-shrink-0 text-xs font-medium">Feb 15</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-xs">Follow-up Scheduled</span>
                                            </div>
                                            <div className="text-gray-600 text-xs">Next diabetes appointment scheduled for November 8, 2024</div>
                                            <div className="text-indigo-600 text-xs">6-month follow-up interval</div>
                                        </div>
                                    </div>
                                </>
                            ) : patient?.id === 'P020' ? (
                                <>
                                    <div className="flex items-start gap-2 py-1 border-b border-gray-100 bg-blue-50 rounded px-2">
                                        <span className="text-blue-600 w-16 flex-shrink-0 text-xs font-medium">2:45 PM</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-xs">Clinical Note Added</span>
                                            </div>
                                            <div className="text-gray-600 text-xs">Dr. Ahmad documented conjunctivitis follow-up with treatment response</div>
                                            <div className="text-blue-600 text-xs">Status: Completed</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 py-1 border-b border-gray-100 bg-purple-50 rounded px-2">
                                        <span className="text-purple-600 w-16 flex-shrink-0 text-xs font-medium">2:30 PM</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-xs">Culture Results Reviewed</span>
                                            </div>
                                            <div className="text-gray-600 text-xs">S. epidermidis still sensitive to tobramycin - Dr. Ahmad Rahman</div>
                                            <div className="text-green-600 text-xs">Bacterial load reduced</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 py-1 border-b border-gray-100 bg-green-50 rounded px-2">
                                        <span className="text-green-600 w-16 flex-shrink-0 text-xs font-medium">2:15 PM</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-xs">Medication Continued</span>
                                            </div>
                                            <div className="text-gray-600 text-xs">Tobramycin drops continued q4h for 5 more days - Dr. Ahmad Rahman</div>
                                            <div className="text-green-600 text-xs">Good treatment response noted</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 py-1 border-b border-gray-100 bg-orange-50 rounded px-2">
                                        <span className="text-orange-600 w-16 flex-shrink-0 text-xs font-medium">2:00 PM</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-orange-600" />
                                                <span className="font-medium text-xs">Visual Acuity Tested</span>
                                            </div>
                                            <div className="text-gray-600 text-xs">VA improved to 20/25 both eyes, mild residual inflammation - Nurse Sarah</div>
                                            <div className="text-green-600 text-xs">Significant improvement noted</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 py-1 border-b border-gray-100 bg-yellow-50 rounded px-2">
                                        <span className="text-yellow-600 w-16 flex-shrink-0 text-xs font-medium">1:45 PM</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-yellow-600" />
                                                <span className="font-medium text-xs">Eye Hygiene Education</span>
                                            </div>
                                            <div className="text-gray-600 text-xs">Reinforced hand hygiene and contact lens care - Dr. Ahmad Rahman</div>
                                            <div className="text-yellow-600 text-xs">Patient demonstrates good understanding</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 py-1 border-b border-gray-100 bg-gray-50 rounded px-2">
                                        <span className="text-gray-600 w-16 flex-shrink-0 text-xs font-medium">1:30 PM</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-600" />
                                                <span className="font-medium text-xs">Patient Check-in</span>
                                            </div>
                                            <div className="text-gray-600 text-xs">Follow-up conjunctivitis appointment - Reception</div>
                                            <div className="text-gray-600 text-xs">Patient reports improved symptoms</div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-start gap-2 py-1 border-b border-gray-100 bg-blue-50 rounded px-2">
                                        <span className="text-blue-600 w-16 flex-shrink-0 text-xs font-medium">2:30 PM</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-blue-600" />
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
                                                <span className="text-red-600" />
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
                                                <span className="text-green-600" />
                                                <span className="font-medium text-xs">Medication Administered</span>
                                            </div>
                                            <div className="text-gray-600 text-xs">Ceftriaxone 1g IV - Antibiotic therapy (Nurse Johnson)</div>
                                            <div className="text-green-600 text-xs">Completed successfully</div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Log Management */}
                        <div className="py-1 border-t mt-2">
                            <div className="font-semibold mb-1">View Options:</div>
                            <div className="flex gap-1">
                                <Button size="sm" className="text-xs px-2 py-1 h-6">🔍 Filter</Button>
                                <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6">📅Date Range</Button>
                                <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6"><span className="mr-1" />By User</Button>
                                <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6">📥 Export</Button>
                            </div>
                        </div>
                    </div>
                )}




                {activeTab === 'clinical' && (
                    <div className="space-y-4">
                        {/* My Clinical Notes */}
                        <div>
                            <div className="font-bold text-primary mb-3">My Clinical Notes</div>
                            {patientUpdates.length > 0 ? (
                                <div className="space-y-3">
                                    {patientUpdates
                                        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Latest first
                                        .map((update, index) => (
                                        <div key={index} className="bg-card border rounded p-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="font-medium text-sm text-primary">
                                                    {new Date(update.timestamp).toLocaleString()}
                                            </div>
                                                    <Badge variant="outline" className="text-xs">
                                                        Outpatient
                                                    </Badge>
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        className="text-xs px-2 py-1 h-6"
                                                        onClick={() => alert('Edit note functionality - coming soon!')}
                                                    >
                                                        ✏️ Edit
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        className="text-xs px-2 py-1 h-6 text-destructive border-destructive/20 hover:bg-destructive/10"
                                                        onClick={() => {
                                                            if (confirm('Are you sure you want to delete this note?')) {
                                                                alert('Delete note functionality - coming soon!')
                                                            }
                                                        }}
                                                    >
                                                        🗑️ Delete
                                                    </Button>
                                                </div>
                                            </div>
                                            
                                            <div className="text-xs space-y-2">
                                            {update.clinicalNote?.subjective?.trim() && (
                                                    <div>
                                                        <strong className="text-foreground">Subjective:</strong>
                                                        <div className="text-muted-foreground mt-1">{update.clinicalNote.subjective}</div>
                                                </div>
                                            )}
                                            {update.clinicalNote?.history?.trim() && (
                                                    <div>
                                                        <strong className="text-foreground">History:</strong>
                                                        <div className="text-muted-foreground mt-1">{update.clinicalNote.history}</div>
                                                </div>
                                            )}
                                            {update.vitalSigns?.trim() && (
                                                    <div>
                                                        <strong className="text-foreground">Vital Signs:</strong>
                                                        <div className="text-muted-foreground mt-1">{update.vitalSigns}</div>
                                                </div>
                                            )}
                                            {update.clinicalNote?.objective?.trim() && (
                                                    <div>
                                                        <strong className="text-foreground">Objective:</strong>
                                                        <div className="text-muted-foreground mt-1">{update.clinicalNote.objective}</div>
                                                </div>
                                            )}
                                            {update.clinicalNote?.assessment?.trim() && (
                                                    <div>
                                                        <strong className="text-foreground">Assessment:</strong>
                                                        <div className="text-muted-foreground mt-1">{update.clinicalNote.assessment}</div>
                                                </div>
                                            )}
                                            {update.treatmentPlan?.trim() && (
                                                    <div>
                                                        <strong className="text-foreground">Plan:</strong>
                                                        <div className="text-muted-foreground mt-1">{update.treatmentPlan}</div>
                                                </div>
                                            )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-muted/50 border border-dashed rounded p-4 text-center">
                                    <div className="text-muted-foreground text-sm">No clinical notes yet</div>
                                                        <Button 
                                        onClick={onNewClinicalNote}
                                                            size="sm" 
                                        className="text-xs px-3 py-1 mt-2"
                                    >
                                        ➕ Add First Clinical Note
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>

                        {/* Other Doctors Notes */}
                        <div>
                            <div className="font-bold text-primary mb-3">Other Doctors Notes</div>
                            {patient?.id === 'P020' ? (
                                <div className="space-y-3">
                                    {/* Dr. Ahmad Rahman - Latest */}
                                    <div className="bg-card border rounded p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="font-medium text-sm text-primary">
                                                Dr. Ahmad Rahman (Ophthalmologist) - Aug 8, 2024 14:30
                                        </div>
                                            <Badge variant="outline" className="text-xs">
                                                Outpatient
                                            </Badge>
                                                    </div>
                                        <div className="text-xs text-muted-foreground">
                                            Follow-up for diabetic macular edema. Patient reports improved vision in both eyes since last anti-VEGF injection. OCT shows reduced central macular thickness (450μm to 380μm bilaterally). Plan: Continue monthly anti-VEGF injections, monitor blood glucose control closely with primary care.
                                            </div>
                                        </div>

                                    {/* Dr. Siti Aminah */}
                                    <div className="bg-card border rounded p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="font-medium text-sm text-primary">
                                                Dr. Siti Aminah (Internal Medicine) - Aug 7, 2024 09:15
                                                    </div>
                                            <Badge variant="outline" className="text-xs">
                                                Inpatient
                                            </Badge>
                                            </div>
                                        <div className="text-xs text-muted-foreground">
                                            Diabetes Type 2 management review. HbA1c improved to 7.8% from 8.2% (July). Patient reports better adherence to medication and diet modifications. BP well controlled. Reduced Metformin to 500mg daily due to GI upset. Continue current regimen, follow-up in 3 months for HbA1c recheck.
                                        </div>
                                    </div>

                                    {/* Dr. Ahmad Rahman - Earlier */}
                                    <div className="bg-card border rounded p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="font-medium text-sm text-primary">
                                                Dr. Ahmad Rahman (Ophthalmologist) - July 10, 2024 09:15
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                Outpatient
                                            </Badge>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Initial assessment for diabetic macular edema. Bilateral central macular thickening noted on OCT (450μm OU). Visual acuity 20/40 OD, 20/50 OS. Initiated anti-VEGF therapy with bevacizumab. Plan: Monthly injections × 3, then reassess. Coordinate with internal medicine for optimal diabetes control.
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="bg-card border rounded p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="font-medium text-sm text-primary">
                                                Dr. Johnson - Today 08:30
                                        </div>
                                            <Badge variant="outline" className="text-xs">
                                                Inpatient
                                            </Badge>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Patient continues to show signs of improvement. Pain levels decreased from 8/10 to 5/10. Wound site appears clean and healing properly.
                                        </div>
                                    </div>

                                    <div className="bg-card border rounded p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="font-medium text-sm text-primary">
                                                Nurse Martinez - Yesterday 14:00
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                Inpatient
                                            </Badge>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Vitals stable. Patient ambulating independently. Diet tolerance good. No complaints of nausea or vomiting.
                                        </div>
                                    </div>

                                    <div className="bg-card border rounded p-3">
                                        <div className="font-medium text-sm text-primary mb-2">
                                            Dr. Smith - Yesterday 09:15
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Post-operative check. Surgical site healing well. Recommend continuing current antibiotic regimen. Consider PT consultation.
                                        </div>
                                    </div>
                                </div>
                                )}
                            </div>

                        {/* Add New Note Button */}
                        {patientUpdates.length > 0 && (
                            <div className="pt-2">
                                <Button 
                                    onClick={onNewClinicalNote}
                                    size="sm"
                                    className="text-xs px-3 py-1"
                                >
                                    ➕ Add New Clinical Note
                                </Button>
                        </div>
                        )}
                    </div>
                )}

                {activeTab === 'imaging' && (
                    <div className="space-y-4">
                        {/* Latest Blood Test Results */}
                        <div className="bg-card border rounded p-3">
                            <div className="font-bold text-primary mb-2 flex items-center justify-between">
                                <span>Latest Blood Test Results ({mockBloodTestData[patient?.id]?.[0]?.date} {mockBloodTestData[patient?.id]?.[0]?.time})</span>
                                <span className="text-xs text-muted-foreground">{mockBloodTestData[patient?.id]?.[0]?.testType}</span>
                            </div>
                            <div className="space-y-0.5">
                                <div className="grid grid-cols-5 gap-2 text-xs font-medium border-b pb-1 text-muted-foreground">
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
                                        <span className="text-muted-foreground">{result.range}</span>
                                        <span className={`font-medium ${
                                            result.status === 'high' ? 'text-destructive' : 
                                            result.status === 'low' ? 'text-destructive' : 
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
                                            📈Compare
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>


                        {/* Complete Blood Test History */}
                        <div className="bg-card border rounded p-3">
                            <div className="font-bold text-primary mb-2">Complete Blood Test History</div>
                            <div className="space-y-2">
                                {mockBloodTestData[patient?.id]?.map((test, index) => (
                                    <div key={index} className="bg-muted/30 border border-muted rounded p-2 flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-xs">{test.testType}</div>
                                            <div className="text-xs text-muted-foreground">{test.date} {test.time} - {test.orderedBy}</div>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button variant="outline" size="sm" className="text-xs px-1 py-0.5 h-5">View</Button>
                                            <Button variant="outline" size="sm" className="text-xs px-1 py-0.5 h-5">Report</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Patient-Specific Imaging Studies */}
                        {patient?.id === 'P020' ? (
                            <div className="bg-card border rounded p-3">
                                <div className="font-bold text-primary mb-2">Imaging Studies</div>
                                <div className="space-y-2">
                                    <div className="bg-muted/30 border border-muted rounded p-2 flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-xs">Diabetic Retinopathy Screening</div>
                                            <div className="text-xs text-muted-foreground">2024-02-10 - Dr. Lim (Ophthalmology)</div>
                                            <div className="text-xs text-green-600">Result: No diabetic retinopathy detected</div>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button variant="outline" size="sm" className="text-xs px-1 py-0.5 h-5">View</Button>
                                            <Button variant="outline" size="sm" className="text-xs px-1 py-0.5 h-5">Report</Button>
                                        </div>
                                    </div>
                                    <div className="bg-muted/30 border border-muted rounded p-2 flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-xs">Electrocardiogram (ECG)</div>
                                            <div className="text-xs text-muted-foreground">2023-08-25 - Dr. Siti Aminah</div>
                                            <div className="text-xs text-green-600">Result: Normal sinus rhythm, no abnormalities</div>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button variant="outline" size="sm" className="text-xs px-1 py-0.5 h-5">View</Button>
                                            <Button variant="outline" size="sm" className="text-xs px-1 py-0.5 h-5">Report</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-card border rounded p-3">
                                <div className="font-bold text-primary mb-2">Imaging Studies</div>
                                <div className="space-y-2">
                                    <div className="bg-muted/30 border border-muted rounded p-2 flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-xs">Anterior Segment Photography</div>
                                            <div className="text-xs text-muted-foreground">2024-08-08 - Dr. Ahmad Rahman</div>
                                            <div className="text-xs text-green-600">Result: Reduced conjunctival injection, minimal discharge</div>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button variant="outline" size="sm" className="text-xs px-1 py-0.5 h-5">View</Button>
                                            <Button variant="outline" size="sm" className="text-xs px-1 py-0.5 h-5">Report</Button>
                                        </div>
                                    </div>
                                    <div className="bg-muted/30 border border-muted rounded p-2 flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-xs">Initial Conjunctival Photography</div>
                                            <div className="text-xs text-muted-foreground">2024-07-10 - Dr. Ahmad Rahman</div>
                                            <div className="text-xs text-orange-600">Result: Bilateral purulent discharge, severe injection</div>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button variant="outline" size="sm" className="text-xs px-1 py-0.5 h-5">View</Button>
                                            <Button variant="outline" size="sm" className="text-xs px-1 py-0.5 h-5">Report</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Default Imaging Studies for non-P020 patients */}
                        {patient?.id !== 'P020' && (
                            <div className="bg-card border rounded p-3">
                                <div className="font-bold text-primary mb-2">Imaging Studies</div>
                                <div className="space-y-2">
                                    <div className="bg-muted/30 border border-muted rounded p-2 flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-xs">CT Abdomen/Pelvis with Contrast</div>
                                            <div className="text-xs text-muted-foreground">Today 06:30 - Dr. Radiologist</div>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button variant="outline" size="sm" className="text-xs px-1 py-0.5 h-5">View</Button>
                                            <Button variant="outline" size="sm" className="text-xs px-1 py-0.5 h-5">Report</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pending Orders */}
                        {patient?.id === 'P020' ? (
                            <div className="bg-card border rounded p-3">
                                <div className="font-bold text-primary mb-2">Pending Orders</div>
                                <div className="space-y-0.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs">👁️Annual Retinopathy Screening</span>
                                        <span className="text-orange-600 text-xs">Due Feb 2025</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs">❤️HbA1c Follow-up</span>
                                        <span className="text-green-600 text-xs">Due Nov 2024</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs"><span className="mr-1" />Diabetic Foot Exam</span>
                                        <span className="text-green-600 text-xs">Due Nov 2024</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-card border rounded p-3">
                                <div className="font-bold text-primary mb-2">Pending Orders</div>
                                <div className="space-y-0.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs">👁️Follow-up Culture if No Improvement</span>
                                        <span className="text-orange-600 text-xs">If needed in 3 days</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs">📷Visual Acuity Recheck</span>
                                        <span className="text-green-600 text-xs">Next visit Aug 15</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs">🧪Contact Lens Fitting Post-Treatment</span>
                                        <span className="text-green-600 text-xs">After treatment completion</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Default Pending Orders for non-P020 patients */}
                        {patient?.id !== 'P020' && (
                            <div className="bg-card border rounded p-3">
                                <div className="font-bold text-primary mb-2">Pending Orders</div>
                                <div className="space-y-0.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs">📈Complete Blood Count</span>
                                        <span className="text-orange-600 text-xs">Pending</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs">🧪Blood Culture x2</span>
                                        <span className="text-blue-600 text-xs">In Progress</span>
                                    </div>
                                </div>
                            </div>
                        )}


                    </div>
                )}

                {activeTab === 'referrals' && (
                    <div className="space-y-1">
                        {/* Active Referrals */}
                        <div className="py-1 border-b">
                            <div className="font-semibold mb-1">Active Referrals:</div>
                            <div className="space-y-0.5">
                                <div className="border border-border rounded p-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-xs">Cardiology Consultation</span>
                                        <span className="text-primary text-xs font-medium">Urgent</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground mb-1">Dr. Martinez - Requested today for cardiac evaluation</div>
                                    <div className="text-xs text-muted-foreground">Status: Appointment scheduled for tomorrow 10:00 AM</div>
                                    <div className="text-xs text-primary mt-1">📞Contact: (555) 123-4567</div>
                                </div>
                                <div className="border border-border rounded p-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-xs">Physical Therapy</span>
                                        <span className="text-green-700 text-xs font-medium">Routine</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground mb-1">Post-surgical mobility assessment and treatment plan</div>
                                    <div className="text-xs text-muted-foreground">Status: Initial eval completed - ongoing sessions</div>
                                    <div className="text-xs text-green-700 mt-1">📅Next: March 16, 2024 at 2:00 PM</div>
                                </div>
                                <div className="border border-border rounded p-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-xs">Infectious Disease Consultation</span>
                                        <span className="text-secondary-foreground text-xs font-medium">Pending</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground mb-1">Dr. Kim - For antibiotic resistance evaluation</div>
                                    <div className="text-xs text-muted-foreground">Status: Referral sent, awaiting response</div>
                                    <div className="text-xs text-secondary-foreground mt-1">⏳ Expected response: 24-48 hours</div>
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
                                    <span className="text-green-700 font-medium">Completed</span>
                                </div>
                                <div className="grid grid-cols-4 gap-1 text-xs py-0.5">
                                    <span>Mar 8</span>
                                    <span>Anesthesia</span>
                                    <span>Dr. Lee</span>
                                    <span className="text-green-700 font-medium">Completed</span>
                                </div>
                                <div className="grid grid-cols-4 gap-1 text-xs py-0.5">
                                    <span>Mar 5</span>
                                    <span>Radiology</span>
                                    <span>Dr. Chen</span>
                                    <span className="text-green-700 font-medium">Completed</span>
                                </div>
                            </div>
                        </div>


                    </div>
                )}

                {activeTab === 'discharge' && (
                    <div className="space-y-3">
                                {/* Discharge Planning for inpatients */}
                        {patient?.id !== 'P020' && (
                                <div className="py-1 border-b">
                                    <div className="font-semibold mb-1">Discharge Planning:</div>
                                    <div className="border border-border rounded p-2">
                                        <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                                            <div>
                                                <span className="font-medium">Est. Discharge:</span>
                                                <div className="text-primary font-medium">March 18, 2024</div>
                                                <div className="text-muted-foreground">(3 days)</div>
                                            </div>
                                            <div>
                                                <span className="font-medium">Discharge To:</span>
                                                <div className="text-primary">Home</div>
                                                <div className="text-muted-foreground">Family support</div>
                                            </div>
                                            <div>
                                                <span className="font-medium">Follow-up:</span>
                                                <div className="text-primary">Clinic</div>
                                                <div className="text-muted-foreground">1 week</div>
                                            </div>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            <strong>Discharge Planner:</strong> Sarah Williams, RN • <strong>Contact:</strong> (555) 987-6543
                                        </div>
                                    </div>
                                </div>
                        )}

                        {/* Discharge Criteria */}
                        <div className="py-1 border-b">
                            <div className="font-semibold mb-1">Discharge Criteria Progress:</div>
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-2 p-1 rounded">
                                    <span className="text-green-700 font-bold">✓</span>
                                    <span className="text-xs flex-1">Pain controlled with oral medications</span>
                                    <span className="text-green-700 text-xs font-medium">Met</span>
                                </div>
                                <div className="flex items-center gap-2 p-1 rounded">
                                    <span className="text-green-700 font-bold">✓</span>
                                    <span className="text-xs flex-1">Tolerating regular diet</span>
                                    <span className="text-green-700 text-xs font-medium">Met</span>
                                </div>
                                <div className="flex items-center gap-2 p-1 rounded">
                                    <span className="text-amber-700 font-bold">◐</span>
                                    <span className="text-xs flex-1">Ambulating independently (&gt;50 feet)</span>
                                    <span className="text-amber-700 text-xs font-medium">Partial</span>
                                </div>
                                <div className="flex items-center gap-2 p-1 rounded">
                                    <span className="text-destructive font-bold">○</span>
                                    <span className="text-xs flex-1">Normal WBC count (&lt;11,000)</span>
                                    <span className="text-destructive text-xs font-medium">Not Met</span>
                                </div>
                                <div className="flex items-center gap-2 p-1 rounded">
                                    <span className="text-amber-700 font-bold">◐</span>
                                    <span className="text-xs flex-1">Wound healing appropriately</span>
                                    <span className="text-amber-700 text-xs font-medium">Improving</span>
                                </div>
                            </div>
                        </div>

                        {/* Discharge Preparations */}
                        <div className="py-1 border-b">
                            <div className="font-semibold mb-1">Discharge Preparations:</div>
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                    <span className="text-green-700">✓</span>
                                    <span className="text-xs">Discharge medications reconciled</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-green-700">✓</span>
                                    <span className="text-xs">Patient education materials provided</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-amber-700">◐</span>
                                    <span className="text-xs">Home care arrangements pending</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-destructive">○</span>
                                    <span className="text-xs">Transportation arranged</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-green-700">✓</span>
                                    <span className="text-xs">Follow-up appointments scheduled</span>
                                </div>
                            </div>
                        </div>

                        {/* Discharge Summary Status */}
                        <div className="py-1 border-b">
                            <div className="font-semibold mb-1">Documentation:</div>
                            <div className="border border-border rounded p-2">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-xs">Discharge Summary</span>
                                    <span className="text-amber-700 text-xs font-medium">In Progress</span>
                                </div>
                                <div className="text-xs text-muted-foreground mb-1">Last updated: Today 2:30 PM by Dr. Smith</div>
                                <div className="text-xs text-amber-700">⚠️Pending final review and signatures</div>
                            </div>
                        </div>

                        {/* Discharge Management */}
                        <div className="py-1">
                            <div className="font-semibold mb-1">Manage Discharge:</div>
                            <div className="flex gap-1">
                                <Button size="sm" className="text-xs px-2 py-1 h-6">📋Complete Summary</Button>
                                <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6">✏️Edit Plan</Button>
                                <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6">📅Reschedule</Button>
                                <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6">🏠Home Care</Button>
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
            router.push('/');
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
        router.push('/');
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
            <Header
                showBackButton={true}
                onBack={() => router.push('/dashboard')}
                onLogout={handleLogout}
                onProfile={() => alert('Profile page - feature coming soon!')}
                userName={user.name}
                userEmail={user.email}
                notificationCount={3}
            />

            {/* Patient Overview Row - Updated */}
            <div className="flex-shrink-0 px-3 py-1 bg-card border-b">
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                        {currentPatient ? (
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
                        ) : (
                            <div className="text-muted-foreground">Loading patient...</div>
                        )}
                    </div>
                    <div>
                        <Button 
                            onClick={startNewClinicalNote}
                            size="sm" 
                            className="text-xs px-3 py-1 h-7"
                        >
                            📄New Input
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
                                        <span className="text-xs" />
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
                                        <span className="text-xs" />
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
                    {currentPatient ? (
                    <PatientInfoTabs patient={currentPatient} onNewClinicalNote={startNewClinicalNote} user={user} />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="text-lg font-semibold text-muted-foreground">Loading patient information...</div>
                            </div>
                        </div>
                    )}
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