// Demo data
const demoUser = {
    studentNumber: "202312345",
    password: "student123",
    pin: "1234",
    name: "John Doe",
    faculty: "Information and Communication Technology",
    course: "Diploma in Information Technology",
    year: "1st Year"
};

// Sample timetable data
const sampleTimetable = {
    "Monday": [
        { time: "08:00-10:00", subject: "Programming 1", venue: "IT Building 101", lecturer: "Dr. Smith" },
        { time: "10:00-12:00", subject: "Mathematics 1", venue: "Science Building 201", lecturer: "Prof. Johnson" }
    ],
    "Tuesday": [
        { time: "09:00-11:00", subject: "Database Systems", venue: "IT Building 102", lecturer: "Ms. Williams" }
    ],
    "Wednesday": [
        { time: "08:00-12:00", subject: "Web Development", venue: "IT Lab 3", lecturer: "Mr. Brown" }
    ],
    "Thursday": [
        { time: "10:00-12:00", subject: "Networking", venue: "IT Building 103", lecturer: "Dr. Davis" }
    ],
    "Friday": [
        { time: "14:00-16:00", subject: "Project Session", venue: "Project Lab 1", lecturer: "All Lecturers" }
    ]
};

// Campus buildings data
const campusBuildings = [
    { name: "IT Building", code: "IT", description: "Information Technology Faculty" },
    { name: "Science Building", code: "SCI", description: "Science Laboratories" },
    { name: "Library", code: "LIB", description: "Main Campus Library" },
    { name: "Administration", code: "ADMIN", description: "Student Administration" },
    { name: "Auditorium", code: "AUD", description: "Main Auditorium" },
    { name: "Student Center", code: "SC", description: "Student Activities Center" },
    { name: "Cafeteria", code: "CAFE", description: "Main Cafeteria" },
    { name: "Sports Complex", code: "SPORT", description: "Sports Facilities" }
];

// Language greetings
const greetings = [
    "Dumela!",
    "Wamkelekile!",
    "Welkom!",
    "Siyakwamukela!",
    "Re a go amogela!"
];

class CampusPalApp {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupGreetingAnimation();
    }

    setupEventListeners() {
        // Login form
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // OTP input handling
        this.setupOTPInputs();

        // Forgot password
        document.getElementById('forgotPassword')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showForgotPassword();
        });

        // Sign up link
        document.getElementById('signUpLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showSignUp();
        });

        // Navigation links - use event delegation
        document.addEventListener('click', (e) => {
            if (e.target.closest('#navHome')) {
                e.preventDefault();
                this.loadPage('home');
            } else if (e.target.closest('#navTimetable')) {
                e.preventDefault();
                this.loadPage('timetable');
            } else if (e.target.closest('#navStudentCard')) {
                e.preventDefault();
                this.loadPage('studentcard');
            } else if (e.target.closest('#navCampusMap')) {
                e.preventDefault();
                this.loadPage('campusmap');
            } else if (e.target.closest('#navProfile')) {
                e.preventDefault();
                this.loadPage('profile');
            } else if (e.target.closest('#navLogout')) {
                e.preventDefault();
                this.handleLogout();
            }
        });

        // Mobile menu
        document.querySelector('.mobile-menu-btn')?.addEventListener('click', () => {
            document.querySelector('.nav-menu').classList.toggle('active');
        });
    }

    setupOTPInputs() {
        const otpInputs = document.querySelectorAll('.otp-input');
        
        otpInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                const value = e.target.value;
                
                if (value.length === 1) {
                    input.classList.add('filled');
                    // Move to next input
                    if (index < otpInputs.length - 1) {
                        otpInputs[index + 1].focus();
                    }
                } else {
                    input.classList.remove('filled');
                }
            });
            
            input.addEventListener('keydown', (e) => {
                // Handle backspace
                if (e.key === 'Backspace' && !input.value && index > 0) {
                    otpInputs[index - 1].focus();
                }
                
                // Only allow numbers
                if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter'].includes(e.key)) {
                    e.preventDefault();
                }
            });
            
            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const pasteData = e.clipboardData.getData('text');
                if (/^\d{4}$/.test(pasteData)) {
                    pasteData.split('').forEach((digit, i) => {
                        if (otpInputs[i]) {
                            otpInputs[i].value = digit;
                            otpInputs[i].classList.add('filled');
                        }
                    });
                    otpInputs[3].focus();
                }
            });
        });
    }

    getOTPValue() {
        const otpInputs = document.querySelectorAll('.otp-input');
        return Array.from(otpInputs).map(input => input.value).join('');
    }

    handleLogin() {
        const studentNumber = document.getElementById('studentNumber').value;
        const password = document.getElementById('password').value;
        const pin = this.getOTPValue();

        // Demo authentication
        if (studentNumber === demoUser.studentNumber && 
            password === demoUser.password && 
            pin === demoUser.pin) {
            
            this.currentUser = { ...demoUser };
            this.showApp();
            this.loadPage('home');
        } else {
            alert('Invalid credentials. Please use demo credentials provided.');
        }
    }

    showApp() {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('appContainer').style.display = 'block';
    }

    loadPage(page) {
        const mainContent = document.getElementById('mainContent');
        
        switch(page) {
            case 'home':
                mainContent.innerHTML = this.getHomePage();
                break;
            case 'timetable':
                mainContent.innerHTML = this.getTimetablePage();
                this.setupTimetableEvents();
                break;
            case 'studentcard':
                mainContent.innerHTML = this.getStudentCardPage();
                this.setupStudentCardEvents();
                break;
            case 'campusmap':
                mainContent.innerHTML = this.getCampusMapPage();
                this.setupCampusMapEvents();
                break;
            case 'profile':
                mainContent.innerHTML = this.getProfilePage();
                break;
        }

        // Update active nav
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.classList.remove('active');
            if (link.id === `nav${page.charAt(0).toUpperCase() + page.slice(1)}`) {
                link.classList.add('active');
            }
        });

        // Close mobile menu
        document.querySelector('.nav-menu').classList.remove('active');
    }

    getHomePage() {
        return `
            <div class="home-container">
                <div class="welcome-message">
                    <h1>Campus Pal</h1>
                    <div class="language-greeting">
                        ${greetings.map((greeting, index) => 
                            `<div class="greeting-slide" style="animation-delay: ${index * 4}s">
                                ${greeting}
                            </div>`
                        ).join('')}
                    </div>
                    <h2>Hello, ${this.currentUser?.name || 'Student'}!</h2>
                    <p>${this.currentUser?.course} | ${this.currentUser?.year}</p>
                </div>

                <div class="app-info">
                    <h3><i class="fas fa-info-circle"></i> How Campus Pal Works</h3>
                    <div class="info-grid">
                        <div class="info-card">
                            <i class="fas fa-calendar-alt"></i>
                            <h4>Timetable</h4>
                            <p>View your daily/weekly schedule with navigation to classrooms</p>
                        </div>
                        <div class="info-card">
                            <i class="fas fa-id-card"></i>
                            <h4>Student Card</h4>
                            <p>Register and track your student card application online</p>
                        </div>
                        <div class="info-card">
                            <i class="fas fa-map-marked-alt"></i>
                            <h4>Campus Map</h4>
                            <p>Interactive map of Soshanguve South Campus with building search</p>
                        </div>
                        <div class="info-card">
                            <i class="fas fa-compass"></i>
                            <h4>Navigation</h4>
                            <p>Step-by-step directions to your classrooms and campus facilities</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getTimetablePage() {
        let timetableHTML = '';
        for (const [day, classes] of Object.entries(sampleTimetable)) {
            timetableHTML += `
                <div class="day-schedule">
                    <h3 class="day-header"><i class="fas fa-calendar-day"></i> ${day}</h3>
                    ${classes.map(cls => `
                        <div class="class-card" data-venue="${cls.venue}">
                            <div class="class-time"><i class="fas fa-clock"></i> ${cls.time}</div>
                            <div class="class-subject"><i class="fas fa-book"></i> ${cls.subject}</div>
                            <div class="class-venue"><i class="fas fa-map-marker-alt"></i> Venue: ${cls.venue}</div>
                            <div class="class-lecturer"><i class="fas fa-user-tie"></i> Lecturer: ${cls.lecturer}</div>
                            <button class="btn-navigate">
                                <i class="fas fa-directions"></i> Navigate to Class
                            </button>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        return `
            <div class="timetable-container">
                <div class="timetable-header">
                    <h2><i class="fas fa-calendar-alt"></i> My Timetable</h2>
                    <div class="timetable-nav">
                        <button class="btn-view active" data-view="week"><i class="fas fa-calendar-week"></i> Week View</button>
                        <button class="btn-view" data-view="day"><i class="fas fa-calendar-day"></i> Day View</button>
                    </div>
                </div>
                <div class="timetable-view" id="timetableView">
                    ${timetableHTML}
                </div>
            </div>
            <div class="navigation-modal" id="navigationModal">
                <div class="navigation-content">
                    <div id="navigationSteps">
                        Loading directions...
                    </div>
                    <button class="btn-close-modal">
                        <i class="fas fa-times"></i> Close Navigation
                    </button>
                </div>
            </div>
        `;
    }

    setupTimetableEvents() {
        // Navigation buttons
        document.querySelectorAll('.btn-navigate').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const venue = btn.closest('.class-card').dataset.venue;
                this.showNavigation(venue);
            });
        });

        // Close modal
        document.querySelector('.btn-close-modal')?.addEventListener('click', () => {
            document.getElementById('navigationModal').style.display = 'none';
        });

        // View toggles
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                // Implement view toggle logic
                alert(`${view.charAt(0).toUpperCase() + view.slice(1)} view selected`);
            });
        });
    }

    showNavigation(venue) {
        const steps = [
            "Exit the main student center",
            "Walk straight towards the IT Faculty building",
            "Turn left at the library building",
            `Continue straight until you reach ${venue}`,
            "Your classroom is on the ground floor"
        ];

        document.getElementById('navigationSteps').innerHTML = `
            <div class="navigation-header">
                <h3><i class="fas fa-map-marked-alt"></i> Navigation to ${venue}</h3>
                <p>Follow the route shown on the map below</p>
            </div>
            
            <div class="campus-map">
                <div class="map-marker start-marker" title="Your Location"></div>
                <div class="map-path" style="top: 32px; left: 32px; height: 150px; transform: rotate(45deg);"></div>
                <div class="map-marker end-marker" title="${venue}"></div>
                <div style="position: absolute; top: 10px; left: 40px; font-size: 12px; color: var(--tut-blue); font-weight: bold;">START</div>
                <div style="position: absolute; bottom: 10px; right: 50px; font-size: 12px; color: var(--tut-red); font-weight: bold;">${venue}</div>
            </div>
            
            <div class="navigation-steps">
                <h4 style="color: var(--tut-blue); margin-bottom: 15px;"><i class="fas fa-route"></i> Step-by-step directions:</h4>
                <ol>
                    ${steps.map((step, index) => `<li><strong>Step ${index + 1}:</strong> ${step}</li>`).join('')}
                </ol>
            </div>
            
            <div class="navigation-info">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <i class="fas fa-clock"></i> <strong>Estimated time:</strong> 5-7 minutes
                    </div>
                    <div>
                        <i class="fas fa-route"></i> <strong>Distance:</strong> ~300m
                    </div>
                </div>
            </div>
        `;

        document.getElementById('navigationModal').style.display = 'flex';
    }

    getStudentCardPage() {
        return `
            <div class="student-card-container">
                <h2><i class="fas fa-id-card"></i> Student Card Registration</h2>
                <p>Complete the form below to apply for your TUT student card</p>
                
                <form class="registration-form" id="studentCardForm">
                    <div class="form-row">
                        <div class="input-group">
                            <label>Full Name</label>
                            <input type="text" value="${this.currentUser?.name}" readonly>
                        </div>
                        <div class="input-group">
                            <label>Student Number</label>
                            <input type="text" value="${this.currentUser?.studentNumber}" readonly>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="input-group">
                            <label>ID Number</label>
                            <input type="text" id="idNumber" placeholder="Enter your ID number" required>
                        </div>
                        <div class="input-group">
                            <label>Date of Birth</label>
                            <input type="date" id="dob" required>
                        </div>
                    </div>

                    <div class="input-group">
                        <label>Proof of Registration</label>
                        <input type="file" id="proofRegistration" accept=".pdf,.jpg,.png" required>
                    </div>

                    <div class="input-group">
                        <label>ID Document</label>
                        <input type="file" id="idDocument" accept=".pdf,.jpg,.png" required>
                    </div>

                    <div class="upload-section" id="photoUpload">
                        <i class="fas fa-camera fa-3x"></i>
                        <h4>Student Photo</h4>
                        <p>Upload or take a passport photo</p>
                        <div class="upload-options">
                            <button type="button" class="btn-upload" id="uploadPhoto">
                                <i class="fas fa-upload"></i> Upload Photo
                            </button>
                            <button type="button" class="btn-upload" id="takePhoto">
                                <i class="fas fa-camera"></i> Take Photo
                            </button>
                        </div>
                        <input type="file" id="photoInput" accept="image/*" style="display: none;">
                        <img id="photoPreview" class="preview-image" alt="Photo Preview">
                    </div>

                    <div class="input-group">
                        <label>Delivery Method</label>
                        <select id="deliveryMethod" required>
                            <option value="">Select option</option>
                            <option value="collect">Collect at Campus</option>
                            <option value="courier">Courier Delivery</option>
                        </select>
                    </div>

                    <button type="submit" class="btn-login">
                        <i class="fas fa-paper-plane"></i> Submit Application
                    </button>
                </form>

                <div id="applicationStatus" style="margin-top: 30px; padding: 20px; background: var(--light-gray); border-radius: 10px; display: none;">
                    <h3>Application Status</h3>
                    <div id="statusContent"></div>
                </div>
            </div>
        `;
    }

    setupStudentCardEvents() {
        // Photo upload
        document.getElementById('uploadPhoto')?.addEventListener('click', () => {
            document.getElementById('photoInput').click();
        });

        // Take photo (simulated)
        document.getElementById('takePhoto')?.addEventListener('click', () => {
            alert('Camera functionality would be active on mobile devices. For now, please upload a photo.');
        });

        // Photo preview
        document.getElementById('photoInput')?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const preview = document.getElementById('photoPreview');
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });

        // Form submission
        document.getElementById('studentCardForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitStudentCardApplication();
        });

        // Drag and drop
        const uploadSection = document.getElementById('photoUpload');
        if (uploadSection) {
            uploadSection.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadSection.classList.add('drag-over');
            });

            uploadSection.addEventListener('dragleave', () => {
                uploadSection.classList.remove('drag-over');
            });

            uploadSection.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadSection.classList.remove('drag-over');
                
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith('image/')) {
                    const input = document.getElementById('photoInput');
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    input.files = dataTransfer.files;
                    input.dispatchEvent(new Event('change'));
                }
            });
        }
    }

    submitStudentCardApplication() {
        // Simulate submission
        document.getElementById('applicationStatus').style.display = 'block';
        document.getElementById('statusContent').innerHTML = `
            <div class="status-success">
                <i class="fas fa-check-circle" style="font-size: 1.5rem; margin-right: 10px;"></i>
                <strong>Application Submitted Successfully!</strong>
            </div>
            <div class="status-details">
                <h4><i class="fas fa-info-circle"></i> Application Details:</h4>
                <p><strong>Reference Number:</strong> TUTCARD-${Date.now()}</p>
                <p><strong>Status:</strong> <span style="color: #FF9800; font-weight: bold;">Under Review</span></p>
                <p><strong>Estimated Processing Time:</strong> 5-7 working days</p>
                <p><strong>Collection Point:</strong> Student Administration Building, Room 101</p>
                <p><strong>Submitted Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            <div style="text-align: center;">
                <button id="trackApplication">
                    <i class="fas fa-search"></i> Track Application Status
                </button>
            </div>
        `;

        // Scroll to status
        document.getElementById('applicationStatus').scrollIntoView({ behavior: 'smooth' });

        // Track button
        document.getElementById('trackApplication')?.addEventListener('click', () => {
            alert('Tracking feature would show real-time updates in a production version.');
        });
    }

    getCampusMapPage() {
        return `
            <div class="map-container">
                <div class="map-header">
                    <h2><i class="fas fa-map-marked-alt"></i> Soshanguve South Campus Map</h2>
                    <p>Interactive campus map with building search and navigation</p>
                </div>
                
                <div class="map-search">
                    <div class="search-input-group">
                        <i class="fas fa-search"></i>
                        <input type="text" id="searchBuilding" placeholder="Search for buildings (e.g., IT Building, Library, Administration)">
                    </div>
                </div>

                <div class="map-display">
                    <div class="campus-map-view">
                        <img src="https://via.placeholder.com/800x600/E8E8E8/0033A0?text=SOSHANGUVE+SOUTH+CAMPUS+MAP" alt="Soshanguve South Campus Map" class="campus-map-image">
                        <div class="map-overlay">
                            ${campusBuildings.map((building, index) => `
                                <div class="building-marker" 
                                     data-building="${building.code}" 
                                     style="top: ${20 + (index * 80)}px; left: ${50 + (index % 3) * 200}px;"
                                     title="${building.name}">
                                    <i class="fas fa-map-pin"></i>
                                    <span>${building.code}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="buildings-section">
                    <h3><i class="fas fa-building"></i> Campus Buildings</h3>
                    <div class="building-list" id="buildingList">
                        ${campusBuildings.map(building => `
                            <div class="building-item" data-building="${building.code}" data-name="${building.name.toLowerCase()}">
                                <div class="building-icon">
                                    <i class="fas fa-building"></i>
                                </div>
                                <div class="building-info">
                                    <h4>${building.name}</h4>
                                    <p class="building-code">${building.code}</p>
                                    <p class="building-desc">${building.description}</p>
                                </div>
                                <div class="building-actions">
                                    <button class="btn-locate" data-building="${building.code}">
                                        <i class="fas fa-map-marker-alt"></i> Locate
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div id="buildingDetails" class="building-details-modal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>Building Details</h3>
                            <button class="btn-close" id="closeBuildingDetails">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div id="detailsContent"></div>
                    </div>
                </div>
            </div>
        `;
    }

    setupCampusMapEvents() {
        // Search functionality
        document.getElementById('searchBuilding')?.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const items = document.querySelectorAll('.building-item');
            const markers = document.querySelectorAll('.building-marker');
            
            items.forEach(item => {
                const name = item.dataset.name;
                const code = item.dataset.building.toLowerCase();
                const isVisible = name.includes(searchTerm) || code.includes(searchTerm);
                item.style.display = isVisible ? 'flex' : 'none';
            });
            
            markers.forEach(marker => {
                const building = campusBuildings.find(b => b.code === marker.dataset.building);
                const isVisible = building && (building.name.toLowerCase().includes(searchTerm) || building.code.toLowerCase().includes(searchTerm));
                marker.style.display = isVisible ? 'block' : 'none';
            });
        });

        // Building selection from list
        document.querySelectorAll('.building-item').forEach(item => {
            item.addEventListener('click', () => {
                const buildingCode = item.dataset.building;
                this.showBuildingDetails(buildingCode);
            });
        });
        
        // Building marker clicks
        document.querySelectorAll('.building-marker').forEach(marker => {
            marker.addEventListener('click', () => {
                const buildingCode = marker.dataset.building;
                this.showBuildingDetails(buildingCode);
            });
        });
        
        // Locate buttons
        document.querySelectorAll('.btn-locate').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const buildingCode = btn.dataset.building;
                const marker = document.querySelector(`[data-building="${buildingCode}"]`);
                if (marker) {
                    marker.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    marker.style.animation = 'pulse 2s ease-in-out 3';
                }
            });
        });
        
        // Close modal
        document.getElementById('closeBuildingDetails')?.addEventListener('click', () => {
            document.getElementById('buildingDetails').style.display = 'none';
        });
    }
    
    showBuildingDetails(buildingCode) {
        const building = campusBuildings.find(b => b.code === buildingCode);
        
        if (building) {
            document.getElementById('buildingDetails').style.display = 'flex';
            document.getElementById('detailsContent').innerHTML = `
                <div class="building-detail-card">
                    <div class="building-header">
                        <i class="fas fa-building fa-3x"></i>
                        <div>
                            <h4>${building.name}</h4>
                            <p class="building-code-large">${building.code}</p>
                        </div>
                    </div>
                    <div class="building-info-grid">
                        <div class="info-item">
                            <i class="fas fa-info-circle"></i>
                            <div>
                                <strong>Description:</strong>
                                <p>${building.description}</p>
                            </div>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <div>
                                <strong>Location:</strong>
                                <p>${this.getBuildingLocation(building.code)}</p>
                            </div>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-clock"></i>
                            <div>
                                <strong>Opening Hours:</strong>
                                <p>07:00 - 18:00 (Mon-Fri)</p>
                            </div>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-phone"></i>
                            <div>
                                <strong>Contact:</strong>
                                <p>+27 12 382 5000</p>
                            </div>
                        </div>
                    </div>
                    <div class="building-actions-modal">
                        <button class="btn-navigate-building">
                            <i class="fas fa-directions"></i> Get Directions
                        </button>
                    </div>
                </div>
            `;

            // Navigate button
            document.querySelector('.btn-navigate-building')?.addEventListener('click', () => {
                document.getElementById('buildingDetails').style.display = 'none';
                this.showNavigation(building.name);
            });
        }
    }

    getBuildingLocation(code) {
        const locations = {
            'IT': 'North Campus, near the Main Gate',
            'SCI': 'Science Precinct, Building 2',
            'LIB': 'Central Campus, next to Student Center',
            'ADMIN': 'Main Administration Block',
            'AUD': 'East Wing, near Sports Complex',
            'SC': 'Central Campus Hub',
            'CAFE': 'Student Center, Ground Floor',
            'SPORT': 'East Campus'
        };
        return locations[code] || 'Main Campus Area';
    }

    getProfilePage() {
        return `
            <div class="profile-container">
                <div class="profile-header">
                    <div class="profile-avatar">
                        ${this.currentUser?.name.charAt(0)}
                    </div>
                    <div class="profile-info">
                        <h2>${this.currentUser?.name}</h2>
                        <p>${this.currentUser?.studentNumber}</p>
                        <p>${this.currentUser?.course}</p>
                        <p>${this.currentUser?.faculty}</p>
                    </div>
                </div>

                <div class="profile-details">
                    <h3><i class="fas fa-user-circle"></i> Personal Information</h3>
                    <div class="info-grid" style="margin-top: 20px;">
                        <div class="info-card">
                            <i class="fas fa-graduation-cap"></i>
                            <h4>Academic Status</h4>
                            <p>${this.currentUser?.year}</p>
                            <p>Registered: Semester 1, 2024</p>
                        </div>
                        <div class="info-card">
                            <i class="fas fa-building"></i>
                            <h4>Campus</h4>
                            <p>Soshanguve South Campus</p>
                            <p>ICT Faculty</p>
                        </div>
                        <div class="info-card">
                            <i class="fas fa-envelope"></i>
                            <h4>Contact</h4>
                            <p>Email: ${this.currentUser?.studentNumber}@tut4life.ac.za</p>
                            <p>Phone: +27 12 382 5000</p>
                        </div>
                        <div class="info-card">
                            <i class="fas fa-cog"></i>
                            <h4>Settings</h4>
                            <button class="btn-settings" style="padding: 8px 15px; margin: 5px; background: var(--tut-blue); color: white; border: none; border-radius: 5px; cursor: pointer;">
                                Notification Settings
                            </button>
                            <button class="btn-settings" style="padding: 8px 15px; margin: 5px; background: var(--primary-yellow); border: none; border-radius: 5px; cursor: pointer;">
                                Update Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    showForgotPassword() {
        const email = prompt("Enter your student email address:");
        if (email) {
            alert(`Password reset link has been sent to ${email}\n\n(In production, this would send an actual reset email)`);
        }
    }

    showSignUp() {
        alert("Student registration is typically done through the official TUT student portal. This demo focuses on existing student functionality.");
    }

    handleLogout() {
        this.currentUser = null;
        document.getElementById('loginPage').style.display = 'block';
        document.getElementById('appContainer').style.display = 'none';
        
        // Reset form
        document.getElementById('loginForm').reset();
    }

    setupGreetingAnimation() {
        // Animation is handled by CSS
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CampusPalApp();
});