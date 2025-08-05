// Mock data for dashboard
const mockPatients = [
    { id: "P001", name: "Maria Rodriguez", room: "302", age: 67, condition: "Post-op complications", status: "critical" },
    { id: "P002", name: "James Wilson", room: "418", age: 45, condition: "Chest pain", status: "critical" },
    { id: "P003", name: "Emma Thompson", room: "205", age: 34, condition: "Follow-up", status: "stable" },
    { id: "P004", name: "Michael Chen", room: "301", age: 52, condition: "New patient", status: "stable" },
    { id: "P005", name: "Lisa Parker", room: "156", age: 28, condition: "Routine checkup", status: "stable" },
    { id: "P006", name: "David Brown", room: "223", age: 61, condition: "Diabetes management", status: "stable" },
    { id: "P007", name: "Sarah Johnson", room: "334", age: 39, condition: "Hypertension", status: "stable" },
    { id: "P008", name: "Robert Davis", room: "412", age: 55, condition: "Cardiac monitoring", status: "critical" },
    { id: "P009", name: "Jennifer Miller", room: "289", age: 42, condition: "Post-surgery", status: "stable" },
    { id: "P010", name: "William Garcia", room: "367", age: 33, condition: "Emergency admission", status: "critical" }
];

const mockData = {
    doctor: {
        name: "Dr. Sarah Johnson",
        timeSaved: "2h 15m"
    },
    stats: {
        totalPatients: 24,
        newAdmissions: 3,
        pendingDischarge: 5,
        tasksAutomated: 87
    },
    criticalPatients: [
        {
            id: 1,
            name: "Maria Rodriguez",
            room: "302",
            age: 67,
            condition: "Post-op complications",
            vitals: {
                bp: "180/110",
                hr: "125",
                alerts: ["BP", "HR"]
            }
        },
        {
            id: 2,
            name: "James Wilson",
            room: "418",
            age: 45,
            condition: "Chest pain, elevated troponin",
            vitals: {
                troponin: "5.2",
                hr: "88",
                alerts: ["Troponin"]
            }
        }
    ],
    schedule: [
        {
            time: "9:00 AM",
            patient: "Lisa Parker",
            type: "Routine checkup",
            status: "completed"
        },
        {
            time: "10:30 AM",
            patient: "Emma Thompson",
            type: "Follow-up consultation",
            status: "upcoming"
        },
        {
            time: "11:15 AM",
            patient: "Michael Chen",
            type: "New patient consultation",
            status: "upcoming"
        }
    ],
    recentActivity: [
        {
            type: "recording",
            action: "Recording summary generated",
            patient: "Maria Rodriguez",
            time: "15 minutes ago",
            icon: "fas fa-microphone"
        },
        {
            type: "chat",
            action: "AI Chat query",
            patient: "James Wilson's lab results",
            time: "32 minutes ago",
            icon: "fas fa-comments"
        },
        {
            type: "data",
            action: "Patient data synthesized",
            patient: "Emma Thompson",
            time: "1 hour ago",
            icon: "fas fa-database"
        }
    ]
};

// Dashboard functionality
class MedAssistDashboard {
    constructor() {
        this.init();
    }

    init() {
        this.updateTimeSaved();
        this.setupEventListeners();
        this.updateNotifications();
        this.animateStats();
        this.setupRefreshInterval();
        this.setupPatientSearch();
    }

    updateTimeSaved() {
        const timeSavedElement = document.querySelector('.time-saved span');
        if (timeSavedElement) {
            timeSavedElement.textContent = `${mockData.doctor.timeSaved} saved today`;
        }
    }

    setupEventListeners() {
        // Notification button
        const notificationBtn = document.querySelector('.notifications-btn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', this.showNotifications.bind(this));
        }

        // View patient buttons
        const viewPatientBtns = document.querySelectorAll('.view-patient-btn');
        viewPatientBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const patientCard = e.target.closest('.patient-card');
                const patientName = patientCard.querySelector('h4').textContent;
                this.viewPatient(patientName);
            });
        });

        // AI Prep buttons
        const prepBtns = document.querySelectorAll('.prep-btn');
        prepBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const scheduleItem = e.target.closest('.schedule-item');
                const patientName = scheduleItem.querySelector('h4').textContent;
                this.preparePatientVisit(patientName);
            });
        });


        // View all activity
        const viewAllBtn = document.querySelector('.view-all-btn');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', this.showAllActivity.bind(this));
        }
    }

    showNotifications() {
        // Mock notification system
        const notifications = [
            "New lab results available for Maria Rodriguez",
            "Discharge summary pending for Room 205",
            "System maintenance scheduled for tonight"
        ];
        
        alert(`Notifications:\n${notifications.join('\n')}`);
    }

    viewPatient(patientName) {
        // Mock patient view navigation
        console.log(`Navigating to patient: ${patientName}`);
        alert(`Opening detailed view for ${patientName}`);
        // In a real app, this would navigate to patient details page
    }

    preparePatientVisit(patientName) {
        // Mock AI preparation
        console.log(`Preparing AI summary for: ${patientName}`);
        const btn = event.target;
        const originalText = btn.textContent;
        
        btn.textContent = 'Preparing...';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.textContent = '✓ Ready';
            btn.style.background = '#27ae60';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                btn.style.background = '';
            }, 2000);
        }, 1500);
    }


    showAllActivity() {
        console.log('Showing all recent activity');
        alert('Opening complete activity history...');
        // In a real app, this would show a detailed activity log
    }

    updateNotifications() {
        // Mock notification count update
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            // Simulate changing notification count
            setInterval(() => {
                const count = Math.floor(Math.random() * 5) + 1;
                badge.textContent = count;
            }, 30000); // Update every 30 seconds
        }
    }

    animateStats() {
        // Animate stat numbers on page load
        const statCards = document.querySelectorAll('.stat-card h3');
        statCards.forEach(stat => {
            const finalValue = stat.textContent;
            const isPercentage = finalValue.includes('%');
            const numValue = parseInt(finalValue);
            
            if (!isNaN(numValue)) {
                let currentValue = 0;
                const increment = Math.ceil(numValue / 20);
                
                const counter = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= numValue) {
                        currentValue = numValue;
                        clearInterval(counter);
                    }
                    stat.textContent = isPercentage ? `${currentValue}%` : currentValue;
                }, 50);
            }
        });
    }

    setupRefreshInterval() {
        // Simulate real-time updates
        setInterval(() => {
            this.updateCriticalPatientVitals();
            this.updateRecentActivity();
        }, 60000); // Update every minute
    }

    updateCriticalPatientVitals() {
        // Mock vital signs updates
        const vitalElements = document.querySelectorAll('.vital-alert, .vital-normal');
        vitalElements.forEach(vital => {
            // Add subtle pulse animation for alerts
            if (vital.classList.contains('vital-alert')) {
                vital.style.animation = 'pulse 1s ease-in-out';
                setTimeout(() => {
                    vital.style.animation = '';
                }, 1000);
            }
        });
    }

    updateRecentActivity() {
        // Mock new activity addition
        const activityList = document.querySelector('.activity-list');
        if (activityList && Math.random() > 0.7) { // 30% chance of new activity
            const newActivity = this.createActivityItem({
                type: "data",
                action: "Data sync completed",
                patient: "System update",
                time: "Just now",
                icon: "fas fa-sync"
            });
            
            activityList.insertBefore(newActivity, activityList.firstChild);
            
            // Remove oldest activity to maintain list length
            if (activityList.children.length > 5) {
                activityList.removeChild(activityList.lastChild);
            }
        }
    }

    createActivityItem(activity) {
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <div class="activity-icon ${activity.type}">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <p><strong>${activity.action}</strong> for ${activity.patient}</p>
                <span class="activity-time">${activity.time}</span>
            </div>
        `;
        return item;
    }

    setupPatientSearch() {
        const searchInput = document.getElementById('patientSearch');
        const searchDropdown = document.getElementById('searchDropdown');
        const searchButton = document.querySelector('.bg-gray-800');

        if (!searchInput || !searchDropdown) return;

        // Show dropdown on focus
        searchInput.addEventListener('focus', () => {
            this.showAllPatients();
        });

        // Handle input changes
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query.length === 0) {
                this.showAllPatients();
            } else {
                this.filterPatients(query);
            }
        });

        // Hide dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
                searchDropdown.classList.add('hidden');
            }
        });

        // Search button functionality
        if (searchButton) {
            searchButton.addEventListener('click', () => {
                const query = searchInput.value.trim();
                if (query) {
                    this.searchPatients(query);
                }
            });
        }

        // Handle Enter key
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    this.searchPatients(query);
                }
            }
        });
    }

    showAllPatients() {
        const searchDropdown = document.getElementById('searchDropdown');
        if (!searchDropdown) return;

        const patientsHTML = mockPatients.map(patient => 
            this.createPatientDropdownItem(patient)
        ).join('');

        searchDropdown.innerHTML = `
            <div class="p-2">
                <div class="text-xs text-gray-500 px-3 py-2 font-medium">ALL PATIENTS (${mockPatients.length})</div>
                ${patientsHTML}
            </div>
        `;

        searchDropdown.classList.remove('hidden');
    }

    filterPatients(query) {
        const searchDropdown = document.getElementById('searchDropdown');
        if (!searchDropdown) return;

        const filteredPatients = mockPatients.filter(patient => 
            patient.name.toLowerCase().includes(query) ||
            patient.room.toLowerCase().includes(query) ||
            patient.id.toLowerCase().includes(query) ||
            patient.condition.toLowerCase().includes(query)
        );

        const patientsHTML = filteredPatients.map(patient => 
            this.createPatientDropdownItem(patient)
        ).join('');

        if (filteredPatients.length === 0) {
            searchDropdown.innerHTML = `
                <div class="p-2">
                    <div class="text-center py-8 text-gray-500">
                        <i class="fas fa-search text-2xl mb-2"></i>
                        <p>No patients found matching "${query}"</p>
                    </div>
                </div>
            `;
        } else {
            searchDropdown.innerHTML = `
                <div class="p-2">
                    <div class="text-xs text-gray-500 px-3 py-2 font-medium">FOUND ${filteredPatients.length} PATIENT${filteredPatients.length !== 1 ? 'S' : ''}</div>
                    ${patientsHTML}
                </div>
            `;
        }

        searchDropdown.classList.remove('hidden');
    }

    createPatientDropdownItem(patient) {
        const statusColor = patient.status === 'critical' ? 'bg-gray-800' : 'bg-gray-500';
        const statusIcon = patient.status === 'critical' ? 'fas fa-exclamation-triangle' : 'fas fa-user';

        return `
            <div class="patient-dropdown-item flex items-center gap-3 px-3 py-3 hover:bg-gray-50 rounded-lg cursor-pointer border-b border-gray-100 last:border-b-0" 
                 data-patient-id="${patient.id}" 
                 data-patient-name="${patient.name}">
                <div class="w-10 h-10 ${statusColor} rounded-lg flex items-center justify-center text-white">
                    <i class="${statusIcon}"></i>
                </div>
                <div class="flex-1">
                    <div class="flex items-center justify-between">
                        <h4 class="font-medium text-gray-800">${patient.name}</h4>
                        <span class="text-sm text-gray-500">Room ${patient.room}</span>
                    </div>
                    <div class="flex items-center justify-between mt-1">
                        <p class="text-sm text-gray-600">${patient.condition}</p>
                        <span class="text-xs text-gray-500">Age ${patient.age} • ID: ${patient.id}</span>
                    </div>
                </div>
                <div class="text-gray-400">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </div>
        `;
    }

    searchPatients(query) {
        console.log(`Searching for: ${query}`);
        const searchDropdown = document.getElementById('searchDropdown');
        
        // Simulate search loading
        if (searchDropdown) {
            searchDropdown.innerHTML = `
                <div class="p-2">
                    <div class="text-center py-8 text-gray-500">
                        <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
                        <p>Searching patients...</p>
                    </div>
                </div>
            `;
            searchDropdown.classList.remove('hidden');
        }

        // Simulate API delay and show results
        setTimeout(() => {
            this.filterPatients(query);
        }, 800);
    }
}

// Patient selection handler
document.addEventListener('click', (e) => {
    const patientItem = e.target.closest('.patient-dropdown-item');
    if (patientItem) {
        const patientId = patientItem.dataset.patientId;
        const patientName = patientItem.dataset.patientName;
        
        // Update search input
        const searchInput = document.getElementById('patientSearch');
        if (searchInput) {
            searchInput.value = patientName;
        }
        
        // Hide dropdown
        const searchDropdown = document.getElementById('searchDropdown');
        if (searchDropdown) {
            searchDropdown.classList.add('hidden');
        }
        
        // Navigate to patient details page
        console.log(`Selected patient: ${patientName} (ID: ${patientId})`);
        window.location.href = `patient-details.html?id=${patientId}`;
    }
});

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MedAssistDashboard();
});

// Add CSS animation for pulse effect
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);