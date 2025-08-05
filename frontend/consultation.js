// Mock patients data (same as other files)
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

// Consultation Controller
class ConsultationController {
    constructor() {
        this.currentPatient = null;
        this.isRecording = false;
        this.isPaused = false;
        this.recordingStartTime = null;
        this.totalRecordingTime = 0;
        this.currentRecordingTime = 0;
        this.timerInterval = null;
        this.recordings = []; // Array to store multiple recordings
        this.currentRecordingNumber = 1;
        this.init();
    }

    init() {
        this.loadPatientData();
        this.setupEventListeners();
        this.setupConsultationDate();
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

        this.renderPatientInfo();
    }

    renderPatientInfo() {
        const patient = this.currentPatient;
        
        // Update patient info
        document.getElementById('patientName').textContent = patient.name;
        document.getElementById('patientInfo').textContent = `Age ${patient.age} • Room ${patient.room} • ID: ${patient.id}`;
        
        // Update avatar based on status
        const avatar = document.getElementById('patientAvatar');
        const avatarIcon = patient.status === 'critical' ? 'fas fa-exclamation-triangle' : 'fas fa-user';
        const avatarColor = patient.status === 'critical' ? 'bg-gray-800' : 'bg-gray-600';
        avatar.className = `w-16 h-16 ${avatarColor} rounded-xl flex items-center justify-center text-white text-xl`;
        avatar.innerHTML = `<i class="${avatarIcon}"></i>`;
    }

    setupConsultationDate() {
        const now = new Date();
        const dateStr = now.toLocaleDateString() + ' - ' + now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        document.getElementById('consultationDate').textContent = dateStr;
    }

    setupEventListeners() {
        // Recording controls
        const recordBtn = document.getElementById('recordBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const stopBtn = document.getElementById('stopBtn');
        const generateSummaryBtn = document.getElementById('generateSummaryBtn');

        // Summary controls
        const acceptSummaryBtn = document.getElementById('acceptSummaryBtn');
        const editSummaryBtn = document.getElementById('editSummaryBtn');
        const regenerateSummaryBtn = document.getElementById('regenerateSummaryBtn');

        // Save controls
        const saveDraftBtn = document.getElementById('saveDraftBtn');
        const completeConsultationBtn = document.getElementById('completeConsultationBtn');

        // Event listeners
        recordBtn?.addEventListener('click', () => this.startRecording());
        pauseBtn?.addEventListener('click', () => this.pauseRecording());
        stopBtn?.addEventListener('click', () => this.stopRecording());
        generateSummaryBtn?.addEventListener('click', () => this.generateSummary());

        acceptSummaryBtn?.addEventListener('click', () => this.acceptSummary());
        editSummaryBtn?.addEventListener('click', () => this.editSummary());
        regenerateSummaryBtn?.addEventListener('click', () => this.regenerateSummary());

        saveDraftBtn?.addEventListener('click', () => this.saveDraft());
        completeConsultationBtn?.addEventListener('click', () => this.completeConsultation());
    }

    startRecording() {
        this.isRecording = true;
        this.isPaused = false;
        this.recordingStartTime = Date.now() - (this.currentRecordingTime * 1000);
        
        // Update UI
        const recordBtn = document.getElementById('recordBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const stopBtn = document.getElementById('stopBtn');
        const recordingStatus = document.getElementById('recordingStatus');
        const recordingTimer = document.getElementById('recordingTimer');
        const recordingInstructions = document.getElementById('recordingInstructions');
        
        recordBtn.classList.add('hidden');
        pauseBtn.classList.remove('hidden');
        stopBtn.classList.remove('hidden');
        
        recordingStatus.innerHTML = '<div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div><span>Recording...</span>';
        recordingTimer.classList.remove('hidden');
        recordingInstructions.textContent = 'Recording in progress - you can pause or stop';
        
        // Update current recording number
        document.getElementById('currentRecordingNumber').textContent = this.currentRecordingNumber;
        
        // Start timer
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
            this.currentRecordingTime = elapsed;
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            document.getElementById('timerDisplay').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);

        console.log(`Started recording ${this.currentRecordingNumber} for patient:`, this.currentPatient.name);
    }

    pauseRecording() {
        this.isPaused = true;
        
        // Update UI
        const pauseBtn = document.getElementById('pauseBtn');
        const recordingStatus = document.getElementById('recordingStatus');
        const recordingInstructions = document.getElementById('recordingInstructions');
        
        pauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        pauseBtn.onclick = () => this.resumeRecording();
        
        recordingStatus.innerHTML = '<div class="w-2 h-2 bg-yellow-500 rounded-full"></div><span>Paused</span>';
        recordingInstructions.textContent = 'Recording paused - click play to resume';
        
        // Stop timer
        clearInterval(this.timerInterval);

        console.log('Recording paused');
    }

    resumeRecording() {
        this.isPaused = false;
        this.recordingStartTime = Date.now() - (this.currentRecordingTime * 1000);
        
        // Update UI
        const pauseBtn = document.getElementById('pauseBtn');
        const recordingStatus = document.getElementById('recordingStatus');
        const recordingInstructions = document.getElementById('recordingInstructions');
        
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        pauseBtn.onclick = () => this.pauseRecording();
        
        recordingStatus.innerHTML = '<div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div><span>Recording...</span>';
        recordingInstructions.textContent = 'Recording resumed - you can pause or stop';
        
        // Restart timer
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
            this.currentRecordingTime = elapsed;
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            document.getElementById('timerDisplay').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);

        console.log('Recording resumed');
    }

    stopRecording() {
        this.isRecording = false;
        this.isPaused = false;
        
        // Store the current recording
        const recordingData = {
            id: this.currentRecordingNumber,
            duration: this.currentRecordingTime,
            timestamp: new Date(),
            title: `Recording ${this.currentRecordingNumber}`
        };
        
        this.recordings.push(recordingData);
        this.totalRecordingTime += this.currentRecordingTime;
        
        // Reset for next recording
        this.currentRecordingTime = 0;
        this.currentRecordingNumber++;
        
        // Update UI
        const recordBtn = document.getElementById('recordBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const stopBtn = document.getElementById('stopBtn');
        const recordingStatus = document.getElementById('recordingStatus');
        const recordingTimer = document.getElementById('recordingTimer');
        const recordingInstructions = document.getElementById('recordingInstructions');
        
        recordBtn.classList.remove('hidden');
        pauseBtn.classList.add('hidden');
        stopBtn.classList.add('hidden');
        
        recordingStatus.innerHTML = '<div class="w-2 h-2 bg-green-500 rounded-full"></div><span>Ready to record</span>';
        recordingTimer.classList.add('hidden');
        recordingInstructions.textContent = 'Click to start another recording';
        
        // Reset pause button
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        pauseBtn.onclick = () => this.pauseRecording();
        
        // Clear timer
        clearInterval(this.timerInterval);
        
        // Update recordings list and show summary button
        this.updateRecordingsList();
        this.showSummaryActions();

        console.log('Recording stopped. Total recordings:', this.recordings.length);
    }

    updateRecordingsList() {
        const recordingsList = document.getElementById('recordingsList');
        
        const recordingsHTML = this.recordings.map(recording => {
            const minutes = Math.floor(recording.duration / 60);
            const seconds = recording.duration % 60;
            const durationStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            return `
                <div class="bg-gray-50 rounded-lg p-4 flex items-center justify-between" data-recording-id="${recording.id}">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center text-white">
                            <i class="fas fa-microphone"></i>
                        </div>
                        <div>
                            <h4 class="font-medium text-gray-800">${recording.title}</h4>
                            <p class="text-sm text-gray-600">${durationStr} • ${recording.timestamp.toLocaleTimeString()}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <button class="play-recording w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors" data-recording-id="${recording.id}">
                            <i class="fas fa-play text-xs"></i>
                        </button>
                        <button class="delete-recording w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors" data-recording-id="${recording.id}">
                            <i class="fas fa-trash text-xs"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        recordingsList.innerHTML = recordingsHTML;
        
        // Add event listeners for play and delete buttons
        this.setupRecordingListeners();
    }

    setupRecordingListeners() {
        // Play recording buttons
        document.querySelectorAll('.play-recording').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const recordingId = parseInt(e.target.closest('.play-recording').dataset.recordingId);
                this.playRecording(recordingId);
            });
        });
        
        // Delete recording buttons
        document.querySelectorAll('.delete-recording').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const recordingId = parseInt(e.target.closest('.delete-recording').dataset.recordingId);
                this.deleteRecording(recordingId);
            });
        });
    }

    playRecording(recordingId) {
        const recording = this.recordings.find(r => r.id === recordingId);
        if (!recording) return;
        
        const playBtn = document.querySelector(`[data-recording-id="${recordingId}"].play-recording`);
        
        if (playBtn.innerHTML.includes('fa-play')) {
            // Start playing
            playBtn.innerHTML = '<i class="fas fa-pause text-xs"></i>';
            console.log(`Playing recording ${recordingId}`);
            
            // Simulate playback duration
            setTimeout(() => {
                playBtn.innerHTML = '<i class="fas fa-play text-xs"></i>';
            }, recording.duration * 1000);
        } else {
            // Stop playing
            playBtn.innerHTML = '<i class="fas fa-play text-xs"></i>';
            console.log(`Stopped playing recording ${recordingId}`);
        }
    }

    deleteRecording(recordingId) {
        if (confirm('Are you sure you want to delete this recording?')) {
            // Remove from recordings array
            this.recordings = this.recordings.filter(r => r.id !== recordingId);
            
            // Recalculate total time
            this.totalRecordingTime = this.recordings.reduce((total, r) => total + r.duration, 0);
            
            // Update UI
            this.updateRecordingsList();
            this.updateSummaryActionsCount();
            
            // Hide summary actions if no recordings
            if (this.recordings.length === 0) {
                document.getElementById('summaryActions').classList.add('hidden');
            }
            
            console.log(`Deleted recording ${recordingId}. Remaining recordings:`, this.recordings.length);
        }
    }

    showSummaryActions() {
        const summaryActions = document.getElementById('summaryActions');
        summaryActions.classList.remove('hidden');
        this.updateSummaryActionsCount();
    }

    updateSummaryActionsCount() {
        document.getElementById('totalRecordingsCount').textContent = this.recordings.length;
    }

    generateSummary() {
        if (this.recordings.length === 0) {
            alert('No recordings available to generate summary');
            return;
        }
        
        const generateBtn = document.getElementById('generateSummaryBtn');
        const aiSummarySection = document.getElementById('aiSummarySection');
        const aiSummaryContent = document.getElementById('aiSummaryContent');
        
        // Show loading state
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Analyzing All Recordings...';
        generateBtn.disabled = true;
        
        // Simulate AI processing all recordings
        setTimeout(() => {
            const summary = this.createMockSummaryFromAllRecordings();
            aiSummaryContent.innerHTML = summary;
            aiSummarySection.classList.remove('hidden');
            
            // Reset button
            generateBtn.innerHTML = '<i class="fas fa-magic mr-2"></i>Generate Summary from All Recordings';
            generateBtn.disabled = false;
            
            // Auto-populate form fields
            this.populateFormFromSummary();
            
        }, 4000); // Longer processing time for multiple recordings
    }

    createMockSummaryFromAllRecordings() {
        const patient = this.currentPatient;
        const totalMinutes = Math.floor(this.totalRecordingTime / 60);
        const totalSeconds = this.totalRecordingTime % 60;
        const totalDuration = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
        
        // Generate summary for each recording
        const recordingSummaries = this.recordings.map((recording, index) => {
            const recordingMinutes = Math.floor(recording.duration / 60);
            const recordingSeconds = recording.duration % 60;
            const recordingDuration = `${recordingMinutes}:${recordingSeconds.toString().padStart(2, '0')}`;
            
            return `
                <div class="border border-gray-200 rounded-lg p-4 mb-4">
                    <div class="flex items-center justify-between mb-3">
                        <h4 class="font-medium text-gray-800">Recording ${recording.id} Summary</h4>
                        <div class="flex items-center gap-2 text-sm text-gray-500">
                            <i class="fas fa-clock"></i>
                            <span>${recordingDuration}</span>
                            <span>•</span>
                            <span>${recording.timestamp.toLocaleTimeString()}</span>
                        </div>
                    </div>
                    
                    <div class="space-y-3">
                        <div>
                            <h5 class="font-medium text-gray-700 mb-1">Patient Communication:</h5>
                            <p class="text-gray-600">${this.generateRecordingContent(recording, 'communication', patient)}</p>
                        </div>
                        
                        <div>
                            <h5 class="font-medium text-gray-700 mb-1">Clinical Observations:</h5>
                            <p class="text-gray-600">${this.generateRecordingContent(recording, 'observations', patient)}</p>
                        </div>
                        
                        <div>
                            <h5 class="font-medium text-gray-700 mb-1">Key Discussion Points:</h5>
                            <p class="text-gray-600">${this.generateRecordingContent(recording, 'discussion', patient)}</p>
                        </div>
                        
                        ${recording.id === 1 ? `
                        <div>
                            <h5 class="font-medium text-gray-700 mb-1">Initial Assessment:</h5>
                            <p class="text-gray-600">${this.generateRecordingContent(recording, 'assessment', patient)}</p>
                        </div>
                        ` : ''}
                        
                        ${recording.id > 1 ? `
                        <div>
                            <h5 class="font-medium text-gray-700 mb-1">Follow-up Notes:</h5>
                            <p class="text-gray-600">${this.generateRecordingContent(recording, 'followup', patient)}</p>
                        </div>
                        ` : ''}
                        
                        ${recording.duration > 180 ? `
                        <div>
                            <h5 class="font-medium text-gray-700 mb-1">Detailed Examination:</h5>
                            <p class="text-gray-600">${this.generateRecordingContent(recording, 'examination', patient)}</p>
                        </div>
                        ` : ''}
                        
                        <div>
                            <h5 class="font-medium text-gray-700 mb-1">Action Items:</h5>
                            <p class="text-gray-600">${this.generateRecordingContent(recording, 'actions', patient)}</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        return `
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div class="flex items-center gap-2 mb-2">
                    <i class="fas fa-info-circle text-blue-600"></i>
                    <h4 class="font-medium text-blue-800">AI Comprehensive Analysis</h4>
                </div>
                <p class="text-blue-700 text-sm">Analyzed ${this.recordings.length} recording(s) with total consultation duration of ${totalDuration}</p>
                <p class="text-blue-600 text-sm mt-1">Each recording has been individually processed and categorized by content type</p>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 class="font-medium text-gray-800 mb-3">Overall Consultation Summary</h4>
                <p class="text-gray-600 mb-3">
                    Patient ${patient.name} underwent comprehensive consultation consisting of ${this.recordings.length} recorded sessions. 
                    ${patient.status === 'critical' ? 'This is a critical case requiring immediate attention and thorough documentation.' : 'Patient consultation proceeded systematically with detailed assessment.'}
                </p>
                <p class="text-gray-600">
                    Key findings across all sessions indicate ${patient.condition.toLowerCase()} with ${patient.status === 'critical' ? 'concerning progression requiring immediate intervention' : 'stable presentation managed according to standard protocols'}. 
                    Complete session-by-session analysis follows below.
                </p>
            </div>
            
            <div class="space-y-4">
                <h4 class="font-medium text-gray-800 text-lg">Session-by-Session Analysis</h4>
                ${recordingSummaries}
            </div>
            
            <div class="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                <h4 class="font-medium text-green-800 mb-2">Comprehensive Consultation Conclusion</h4>
                <p class="text-green-700 text-sm">
                    Based on analysis of all ${this.recordings.length} recording sessions, patient ${patient.name} presents with ${patient.condition.toLowerCase()}. 
                    ${patient.status === 'critical' ? 'Immediate follow-up and intervention recommended.' : 'Continue current management plan with scheduled follow-up.'}
                    Total consultation time: ${totalDuration}. All sessions have been documented and analyzed for comprehensive care continuity.
                </p>
            </div>
        `;
    }

    generateRecordingContent(recording, type, patient) {
        const contentTemplates = {
            communication: [
                `Patient expressed concerns about ${patient.condition.toLowerCase()}. Clear communication established regarding symptoms and treatment expectations.`,
                `Detailed discussion with patient about current symptoms, pain levels, and impact on daily activities.`,
                `Patient provided comprehensive history and responded well to questioning about symptom progression.`,
                `Effective patient communication regarding treatment options and next steps in care plan.`
            ],
            observations: [
                `Clinical observation reveals ${patient.status === 'critical' ? 'concerning signs requiring immediate attention' : 'stable patient presentation with normal affect'}.`,
                `Patient appears ${patient.status === 'critical' ? 'in moderate distress with visible discomfort' : 'comfortable and cooperative during examination'}.`,
                `Vital signs and general appearance ${patient.status === 'critical' ? 'show abnormal parameters' : 'within expected ranges for age and condition'}.`,
                `Physical presentation consistent with reported ${patient.condition.toLowerCase()} diagnosis.`
            ],
            discussion: [
                `In-depth discussion regarding ${patient.condition} management options and patient preferences for treatment approach.`,
                `Detailed review of patient's medical history, current medications, and potential treatment modifications.`,
                `Comprehensive discussion of diagnosis, prognosis, and patient education regarding condition management.`,
                `Interactive dialogue about patient concerns, questions, and collaborative care planning.`
            ],
            assessment: [
                `Initial clinical assessment indicates ${patient.condition} in ${patient.age}-year-old patient with ${patient.status} clinical status.`,
                `Comprehensive evaluation reveals findings consistent with ${patient.condition.toLowerCase()} diagnosis.`,
                `Clinical assessment confirms ${patient.status === 'critical' ? 'urgent need for intervention' : 'stable condition with good response to current treatment'}.`,
                `Systematic assessment approach yielding clear diagnostic impression and treatment direction.`
            ],
            followup: [
                `Follow-up assessment shows ${patient.status === 'critical' ? 'continued concern requiring escalated care' : 'positive response to initial interventions'}.`,
                `Subsequent evaluation demonstrates ${patient.status === 'critical' ? 'need for immediate additional measures' : 'stable progression as expected'}.`,
                `Re-evaluation confirms ${patient.status === 'critical' ? 'critical status with ongoing monitoring needs' : 'satisfactory clinical progress'}.`,
                `Continued assessment reinforces initial diagnostic impression with appropriate care modifications.`
            ],
            examination: [
                `Thorough physical examination conducted with systematic approach to all major organ systems.`,
                `Comprehensive examination reveals findings ${patient.status === 'critical' ? 'requiring immediate intervention' : 'consistent with stable clinical condition'}.`,
                `Detailed physical assessment confirms clinical suspicions and guides treatment decision-making.`,
                `Complete examination protocol followed with attention to ${patient.condition.toLowerCase()}-specific findings.`
            ],
            actions: [
                `${patient.status === 'critical' ? 'Immediate intervention initiated, specialist consultation requested, close monitoring implemented' : 'Continue current treatment plan, schedule routine follow-up, patient education provided'}.`,
                `Action plan includes ${patient.status === 'critical' ? 'urgent diagnostic studies, treatment escalation, family notification' : 'medication review, lifestyle counseling, preventive care measures'}.`,
                `Next steps involve ${patient.status === 'critical' ? 'immediate care coordination and intensive monitoring' : 'scheduled follow-up and ongoing management optimization'}.`,
                `Care plan implementation with ${patient.status === 'critical' ? 'priority status and expedited interventions' : 'standard protocol adherence and routine monitoring'}.`
            ]
        };
        
        const templates = contentTemplates[type];
        const randomIndex = Math.floor(Math.random() * templates.length);
        return templates[randomIndex];
    }

    populateFormFromSummary() {
        const patient = this.currentPatient;
        
        document.getElementById('chiefComplaint').value = `${patient.condition} - Based on comprehensive analysis of all consultation recordings, patient presents with primary concern requiring medical attention.`;
        
        document.getElementById('historyPresent').value = `Throughout the consultation sessions, patient ${patient.name} described ${patient.condition.toLowerCase()} with detailed symptom progression. Multiple recordings captured different aspects of the patient's experience, providing comprehensive clinical picture. Symptoms have been ${patient.status === 'critical' ? 'progressively worsening' : 'relatively stable'} over the consultation period.`;
        
        document.getElementById('physicalExam').value = `Comprehensive examination documented across multiple recording sessions. ${patient.status === 'critical' ? 'Patient shows signs of distress with concerning vital parameters.' : 'Patient appears comfortable with stable vital signs.'} Physical findings consistent with presenting condition and patient history.`;
        
        document.getElementById('assessment').value = `Comprehensive assessment based on ${this.recordings.length} consultation recordings: ${patient.condition} in ${patient.age}-year-old patient. Current clinical status: ${patient.status}. ${patient.status === 'critical' ? 'Requires immediate intervention and close monitoring.' : 'Stable condition with favorable prognosis based on all consultation data.'}`;
        
        document.getElementById('plan').value = `Based on comprehensive consultation analysis: ${patient.status === 'critical' ? 'Immediate intervention required, continuous monitoring, specialized care consultation, family notification as appropriate.' : 'Continue current management plan, scheduled follow-up care, patient education reinforcement, routine monitoring as indicated.'}`;
    }

    acceptSummary() {
        alert(`Summary from ${this.recordings.length} recordings accepted and saved to patient record`);
        console.log('Summary accepted for patient:', this.currentPatient.name);
    }

    editSummary() {
        // Make summary content editable
        const summaryContent = document.getElementById('aiSummaryContent');
        const textareas = summaryContent.querySelectorAll('p');
        
        textareas.forEach(p => {
            const textarea = document.createElement('textarea');
            textarea.value = p.textContent;
            textarea.className = 'w-full border border-gray-300 rounded px-2 py-1 text-gray-600';
            textarea.rows = 2;
            p.parentNode.replaceChild(textarea, p);
        });
        
        document.getElementById('editSummaryBtn').innerHTML = '<i class="fas fa-save mr-2"></i>Save Changes';
    }

    regenerateSummary() {
        this.generateSummary();
    }

    saveDraft() {
        const formData = this.collectFormData();
        console.log('Saving draft consultation:', formData);
        alert('Consultation saved as draft');
    }

    completeConsultation() {
        const formData = this.collectFormData();
        console.log('Completing consultation:', formData);
        alert(`Consultation completed for ${this.currentPatient.name} with ${this.recordings.length} recordings`);
        
        // In a real app, this would save to database and navigate back
        setTimeout(() => {
            window.location.href = `patient-details.html?id=${this.currentPatient.id}`;
        }, 1000);
    }

    collectFormData() {
        return {
            patientId: this.currentPatient.id,
            patientName: this.currentPatient.name,
            date: new Date().toISOString(),
            chiefComplaint: document.getElementById('chiefComplaint').value,
            historyPresent: document.getElementById('historyPresent').value,
            physicalExam: document.getElementById('physicalExam').value,
            assessment: document.getElementById('assessment').value,
            plan: document.getElementById('plan').value,
            recordings: this.recordings,
            totalRecordingTime: this.totalRecordingTime,
            recordingsCount: this.recordings.length
        };
    }

    showError(message) {
        document.getElementById('patientName').textContent = 'Error';
        document.getElementById('patientInfo').textContent = message;
        
        const mainContent = document.querySelector('main');
        mainContent.innerHTML += `
            <div class="bg-red-50 border border-red-200 rounded-lg p-6 mt-8">
                <div class="flex items-center gap-3">
                    <i class="fas fa-exclamation-triangle text-red-500 text-xl"></i>
                    <div>
                        <h3 class="font-semibold text-red-800">Error Loading Patient</h3>
                        <p class="text-red-600">${message}</p>
                        <button onclick="goBack()" class="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                            <i class="fas fa-arrow-left mr-2"></i>Back to Patient Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

// Navigation functions
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        // Get patient ID and go back to patient details
        const urlParams = new URLSearchParams(window.location.search);
        const patientId = urlParams.get('id');
        if (patientId) {
            window.location.href = `patient-details.html?id=${patientId}`;
        } else {
            window.location.href = 'index.html';
        }
    }
}

// Add some CSS for the pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
        100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }
    .pulse {
        animation: pulse 2s infinite;
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ConsultationController();
});