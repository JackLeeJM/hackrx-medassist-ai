// Mock patients data (same as dashboard)
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
        activities: [
            { action: "Emergency admission", time: "6 hours ago", icon: "fas fa-ambulance" },
            { action: "EKG performed", time: "5 hours ago", icon: "fas fa-heartbeat" },
            { action: "Lab results reviewed", time: "3 hours ago", icon: "fas fa-vial" }
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
        activities: [
            { action: "Follow-up consultation", time: "1 hour ago", icon: "fas fa-user-md" },
            { action: "Vitals check", time: "3 hours ago", icon: "fas fa-thermometer" },
            { action: "Medication review", time: "5 hours ago", icon: "fas fa-pills" }
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
        activities: [
            { action: "Initial assessment", time: "30 minutes ago", icon: "fas fa-clipboard" },
            { action: "Medical history taken", time: "45 minutes ago", icon: "fas fa-notes-medical" },
            { action: "Admission processing", time: "1 hour ago", icon: "fas fa-hospital" }
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
        activities: [
            { action: "Routine examination", time: "2 hours ago", icon: "fas fa-stethoscope" },
            { action: "Blood work completed", time: "3 hours ago", icon: "fas fa-vial" },
            { action: "Check-in", time: "4 hours ago", icon: "fas fa-check-circle" }
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
        activities: [
            { action: "Glucose monitoring", time: "1 hour ago", icon: "fas fa-tint" },
            { action: "Medication adjustment", time: "4 hours ago", icon: "fas fa-pills" },
            { action: "Dietary consultation", time: "1 day ago", icon: "fas fa-apple-alt" }
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
        activities: [
            { action: "BP monitoring", time: "2 hours ago", icon: "fas fa-heartbeat" },
            { action: "Medication review", time: "6 hours ago", icon: "fas fa-prescription" },
            { action: "Patient education", time: "1 day ago", icon: "fas fa-graduation-cap" }
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
        activities: [
            { action: "Cardiac monitoring", time: "Ongoing", icon: "fas fa-heart" },
            { action: "Enzyme levels checked", time: "2 hours ago", icon: "fas fa-vial" },
            { action: "Arrhythmia episode", time: "4 hours ago", icon: "fas fa-exclamation-triangle" }
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
        activities: [
            { action: "Wound inspection", time: "1 hour ago", icon: "fas fa-bandage" },
            { action: "Pain assessment", time: "3 hours ago", icon: "fas fa-thermometer" },
            { action: "Physical therapy", time: "6 hours ago", icon: "fas fa-dumbbell" }
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
        activities: [
            { action: "Emergency admission", time: "3 hours ago", icon: "fas fa-ambulance" },
            { action: "CT scan completed", time: "2 hours ago", icon: "fas fa-x-ray" },
            { action: "Surgical consult", time: "1 hour ago", icon: "fas fa-user-md" }
        ]
    }
];

// Patient Details Page Controller
class PatientDetailsController {
    constructor() {
        this.currentPatient = null;
        this.init();
    }

    init() {
        this.loadPatientData();
        this.setupEventListeners();
        this.setupChatInterface();
    }

    loadPatientData() {
        // Get patient ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const patientId = urlParams.get('id');
        
        if (!patientId) {
            this.showError('No patient ID provided');
            return;
        }

        // Find patient in mock data
        this.currentPatient = mockPatients.find(p => p.id === patientId);
        
        if (!this.currentPatient) {
            this.showError(`Patient with ID ${patientId} not found`);
            return;
        }

        this.renderPatientData();
    }

    renderPatientData() {
        const patient = this.currentPatient;
        
        // Update patient header
        document.getElementById('patientName').textContent = patient.name;
        document.getElementById('patientAge').innerHTML = `<i class="fas fa-birthday-cake"></i><span>Age ${patient.age}</span>`;
        document.getElementById('patientRoom').innerHTML = `<i class="fas fa-bed"></i><span>Room ${patient.room}</span>`;
        document.getElementById('patientId').innerHTML = `<i class="fas fa-id-card"></i><span>ID: ${patient.id}</span>`;
        
        // Update chat with patient name
        const patientNameInChat = document.getElementById('patientNameInChat');
        if (patientNameInChat) {
            patientNameInChat.textContent = patient.name + "'s";
        }
        
        // Update avatar based on status
        const avatar = document.getElementById('patientAvatar');
        const avatarIcon = patient.status === 'critical' ? 'fas fa-exclamation-triangle' : 'fas fa-user';
        const avatarColor = patient.status === 'critical' ? 'bg-gray-800' : 'bg-gray-600';
        avatar.className = `w-20 h-20 ${avatarColor} rounded-xl flex items-center justify-center text-white text-2xl`;
        avatar.innerHTML = `<i class="${avatarIcon}"></i>`;
        
        // Update condition
        const conditionDiv = document.getElementById('patientCondition');
        const statusColor = patient.status === 'critical' ? 'border-gray-400 bg-gray-200' : 'border-gray-300 bg-gray-100';
        conditionDiv.innerHTML = `
            <div class="border ${statusColor} rounded-lg p-4">
                <h4 class="font-medium text-gray-800 mb-2">Primary Diagnosis</h4>
                <p class="text-gray-600">${patient.condition}</p>
                <div class="mt-3 flex items-center gap-2">
                    <div class="w-3 h-3 ${patient.status === 'critical' ? 'bg-gray-700' : 'bg-gray-500'} rounded-full"></div>
                    <span class="text-sm font-medium text-gray-700">${patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}</span>
                </div>
            </div>
        `;
        
        // Update AI insights
        document.getElementById('aiInsights').innerHTML = `<p>${patient.insights}</p>`;
        
        // Update vitals
        const vitalsDiv = document.getElementById('patientVitals');
        vitalsDiv.innerHTML = `
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-gray-600">Blood Pressure</span>
                <span class="font-medium">${patient.vitals.bp}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-gray-600">Heart Rate</span>
                <span class="font-medium">${patient.vitals.hr} bpm</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-gray-600">Temperature</span>
                <span class="font-medium">${patient.vitals.temp} °F</span>
            </div>
            <div class="flex justify-between items-center py-2">
                <span class="text-gray-600">Oxygen Sat</span>
                <span class="font-medium">${patient.vitals.o2sat}%</span>
            </div>
        `;
        
        // Update patient timeline
        const timelineDiv = document.getElementById('patientTimeline');
        const timelineHTML = this.generateTimelineHTML(patient.timeline);
        timelineDiv.innerHTML = timelineHTML;
        
        // Update status
        const statusDiv = document.getElementById('patientStatus');
        const statusIndicatorColor = patient.status === 'critical' ? 'bg-gray-700' : 'bg-gray-500';
        statusDiv.innerHTML = `
            <div class="flex items-center gap-2 mb-2">
                <div class="w-3 h-3 ${statusIndicatorColor} rounded-full"></div>
                <span class="text-gray-600">${patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}</span>
            </div>
            <div class="text-sm text-gray-500">
                Last updated: ${new Date().toLocaleTimeString()}
            </div>
        `;
    }

    setupEventListeners() {
        // New Consultation button
        const newConsultationBtn = document.getElementById('newConsultationBtn');
        console.log('New Consultation Button:', newConsultationBtn); // Debug log
        if (newConsultationBtn) {
            newConsultationBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('New Consultation button clicked!'); // Debug log
                this.startNewConsultation();
            });
        } else {
            console.error('New Consultation button not found!');
        }

        // Quick action buttons (excluding the consultation button)
        const actionButtons = document.querySelectorAll('.bg-gray-800:not(#newConsultationBtn)');
        console.log('Other action buttons found:', actionButtons.length); // Debug log
        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const text = e.target.textContent.trim();
                this.handleQuickAction(text);
            });
        });
    }

    startNewConsultation() {
        console.log('startNewConsultation called, current patient:', this.currentPatient); // Debug log
        if (this.currentPatient) {
            console.log(`Starting new consultation for ${this.currentPatient.name}`);
            const consultationUrl = `consultation.html?id=${this.currentPatient.id}`;
            console.log('Navigating to:', consultationUrl); // Debug log
            window.location.href = consultationUrl;
        } else {
            console.error('Patient data not available');
            alert('Patient data not available');
        }
    }

    handleQuickAction(action) {
        console.log(`Quick action: ${action} for patient ${this.currentPatient?.name}`);
        
        const actionMap = {
            'AI Chat': `Opening AI Chat for ${this.currentPatient?.name}...`,
            'Voice Record': `Starting voice recording for ${this.currentPatient?.name}...`,
            'Generate Summary': `Generating medical summary for ${this.currentPatient?.name}...`,
            'Update Treatment': `Opening treatment update for ${this.currentPatient?.name}...`,
            'Share with Team': `Sharing patient data for ${this.currentPatient?.name}...`
        };
        
        const message = actionMap[action] || `Performing action: ${action}`;
        alert(message);
    }

    showError(message) {
        document.getElementById('patientName').textContent = 'Error';
        document.getElementById('patientAge').innerHTML = '<span class="text-red-500">Patient not found</span>';
        document.getElementById('patientRoom').innerHTML = '';
        document.getElementById('patientId').innerHTML = '';
        
        const mainContent = document.querySelector('main');
        mainContent.innerHTML += `
            <div class="bg-red-50 border border-red-200 rounded-lg p-6 mt-8">
                <div class="flex items-center gap-3">
                    <i class="fas fa-exclamation-triangle text-red-500 text-xl"></i>
                    <div>
                        <h3 class="font-semibold text-red-800">Error Loading Patient</h3>
                        <p class="text-red-600">${message}</p>
                        <button onclick="goBack()" class="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                            <i class="fas fa-arrow-left mr-2"></i>Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    generateTimelineHTML(timeline) {
        if (!timeline || timeline.length === 0) {
            return `
                <div class="relative">
                    <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    <div class="flex items-start gap-4">
                        <div class="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm relative z-10">
                            <i class="fas fa-info-circle text-xs"></i>
                        </div>
                        <div class="flex-1 pb-4">
                            <p class="text-gray-500">No timeline data available</p>
                        </div>
                    </div>
                </div>
            `;
        }

        const timelineItems = timeline.map((item, index) => {
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

            const iconColor = statusColors[item.status] || 'bg-gray-600';
            const isLast = index === timeline.length - 1;

            return `
                <div class="relative">
                    <div class="flex items-start gap-4">
                        <div class="w-8 h-8 ${iconColor} rounded-full flex items-center justify-center text-white text-sm relative z-10 shadow-sm">
                            <i class="${item.icon} text-xs"></i>
                        </div>
                        <div class="flex-1 ${isLast ? '' : 'pb-6'}">
                            <div class="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-300 hover:border-gray-400 transition-colors">
                                <div class="flex items-start justify-between mb-2">
                                    <h4 class="text-gray-800 font-medium">${item.action}</h4>
                                    <div class="flex items-center gap-2">
                                        <span class="text-xs px-2 py-1 rounded-full ${iconColor} text-white">
                                            ${statusLabels[item.status]}
                                        </span>
                                    </div>
                                </div>
                                <p class="text-gray-600 text-sm mb-2">${item.details}</p>
                                <div class="flex items-center gap-4 text-xs text-gray-500">
                                    <span><i class="fas fa-calendar mr-1"></i>${item.date}</span>
                                    <span><i class="fas fa-clock mr-1"></i>${item.time}</span>
                                    <span class="capitalize"><i class="fas fa-tag mr-1"></i>${item.type}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="relative">
                <!-- Timeline line -->
                <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                <!-- Timeline items -->
                <div class="space-y-0">
                    ${timelineItems}
                </div>
            </div>
        `;
    }

    setupChatInterface() {
        const chatInput = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendChatBtn');
        const voiceBtn = document.getElementById('voiceInputBtn');
        const quickQuestions = document.querySelectorAll('.quick-question');

        if (!chatInput || !sendBtn) return;

        // Send message function
        const sendMessage = () => {
            const message = chatInput.value.trim();
            if (!message) return;

            this.addUserMessage(message);
            chatInput.value = '';
            
            // Simulate AI response
            setTimeout(() => {
                this.addAIResponse(message);
            }, 1000);
        };

        // Event listeners
        sendBtn.addEventListener('click', sendMessage);
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // Voice input button
        voiceBtn.addEventListener('click', () => {
            this.handleVoiceInput();
        });

        // Quick questions
        quickQuestions.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const question = e.target.dataset.question;
                chatInput.value = question;
                sendMessage();
            });
        });

        // Auto-focus chat input
        chatInput.focus();
    }

    addUserMessage(message) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex items-start gap-3 mb-4 justify-end';
        
        messageDiv.innerHTML = `
            <div class="flex-1 text-right">
                <div class="bg-gray-800 text-white rounded-lg p-3 shadow-sm inline-block">
                    <p>${message}</p>
                </div>
                <span class="text-xs text-gray-500 mt-1 block">Just now</span>
            </div>
            <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm">
                <i class="fas fa-user"></i>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    addAIResponse(userMessage) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex items-start gap-3 mb-4';
        
        // Generate contextual AI response based on patient data and question
        const response = this.generateAIResponse(userMessage);
        
        messageDiv.innerHTML = `
            <div class="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white text-sm">
                <i class="fas fa-robot"></i>
            </div>
            <div class="flex-1">
                <div class="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                    <p class="text-gray-800">${response}</p>
                </div>
                <span class="text-xs text-gray-500 mt-1 block">Just now</span>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    generateAIResponse(userMessage) {
        if (!this.currentPatient) return "I don't have access to patient data at the moment.";
        
        const patient = this.currentPatient;
        const message = userMessage.toLowerCase();
        
        // Context-aware responses based on patient data
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
        
        // Default response with patient context
        return `I understand you're asking about ${patient.name}. Based on their current status (${patient.status}) and condition (${patient.condition}), I can provide detailed insights. Could you be more specific about what aspect of their care you'd like to discuss?`;
    }

    handleVoiceInput() {
        const voiceBtn = document.getElementById('voiceInputBtn');
        const chatInput = document.getElementById('chatInput');
        
        // Mock voice input functionality
        voiceBtn.innerHTML = '<i class="fas fa-stop text-red-500"></i>';
        chatInput.placeholder = 'Listening...';
        
        setTimeout(() => {
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            chatInput.placeholder = 'Ask me anything about this patient\'s condition, history, or treatment...';
            chatInput.value = "What's the current status of this patient?";
            chatInput.focus();
        }, 2000);
    }
}


// Navigation functions
function goBack() {
    // Check if there's history to go back to
    if (window.history.length > 1) {
        window.history.back();
    } else {
        // Fallback to dashboard
        window.location.href = 'index.html';
    }
}

// Test function for consultation button
function testConsultationClick() {
    console.log('testConsultationClick called!');
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('id');
    console.log('Current patient ID from URL:', patientId);
    
    if (patientId) {
        const consultationUrl = `consultation.html?id=${patientId}`;
        console.log('Navigating to:', consultationUrl);
        window.location.href = consultationUrl;
    } else {
        alert('No patient ID found in URL');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PatientDetailsController();
});