// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('. page');
const menuToggle = document.querySelector('.menu-toggle');
const navLinksContainer = document.querySelector('.nav-links');
const roomsGrid = document.querySelector('.rooms-grid');
const roomSelect = document.getElementById('room');
const timeSlots = document. getElementById('time-slots');
const calendarDays = document.querySelector('.calendar-days');
const currentMonthElement = document.getElementById('current-month');
const prevMonthButton = document.getElementById('prev-month');
const nextMonthButton = document.getElementById('next-month');
const reservationForm = document.getElementById('reservation-form');
const confirmationModal = document.getElementById('confirmation-modal');
const modalClose = document.querySelector('.modal-close');
const closeModalButton = document.getElementById('close-modal');
const submitText = document.getElementById('submit-text');
const loadingSpinner = document.getElementById('loading-spinner');

// Data
const rooms = [
    {
        id: 1,
        name: 'Sala Individual 1',
        capacity: 1,
        description: 'Sala individual ideal para estudos concentrados e leituras.  Ambiente silencioso com iluminação ajustável.',
        features: ['Silenciosa', 'Mesa ampla', 'Iluminação ajustável'],
        image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc? ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
        id: 2,
        name: 'Sala Individual 2',
        capacity: 1,
        description: 'Espaço reservado para estudos individuais com total privacidade. Equipada com tomadas USB e cadeira ergonômica.',
        features: ['Silenciosa', 'Tomadas USB', 'Cadeira ergonômica'],
        image: 'https://images.unsplash.com/photo-1519974719765-e6559eac2575?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
        id:  3,
        name: 'Sala de Grupo Pequeno',
        capacity: 4,
        description: 'Sala para pequenos grupos realizarem trabalhos e discussões.  Equipada com quadro branco e TV com conexão HDMI.',
        features: ['Quadro branco', 'TV com HDMI', 'Mesa redonda'],
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
        id: 4,
        name: 'Sala de Grupo Médio',
        capacity: 8,
        description: 'Espaço ideal para grupos médios realizarem reuniões e trabalhos em equipe. Conta com projetor e mesas modulares.',
        features: ['Projetor', 'Quadro branco', 'Mesas modulares'],
        image:  'https://images.unsplash.com/photo-1517502884422-41eaead166d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
        id:  5,
        name: 'Sala Multimídia',
        capacity: 6,
        description: 'Sala equipada com recursos multimídia para apresentações e videoconferências. Projetor 4K e sistema de som de alta qualidade.',
        features: ['Projetor 4K', 'Sistema de som', 'Webcam HD'],
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
        id:  6,
        name: 'Sala de Estudo Silenciosa',
        capacity: 12,
        description: 'Sala ampla para estudos individuais em ambiente compartilhado e silencioso. Baias individuais com iluminação natural.',
        features: ['Silêncio absoluto', 'Baias individuais', 'Iluminação natural'],
        image:  'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    }
];

// Simulated unavailable time slots (random generation)
const unavailableTimeSlots = {};

// Current date and selected date
const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectedDate = null;
let selectedTimeSlot = null;

// Initialize the application
function init() {
    setupNavigation();
    generateRoomCards();
    populateRoomSelect();
    generateTimeSlots();
    generateCalendar();
    setupFormValidation();
    setupModal();
    generateUnavailableTimeSlots();
}

// Setup navigation
function setupNavigation() {
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = link.getAttribute('data-page');
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Show target page with transition
            changePage(targetPage);
            
            // Close mobile menu if open
            navLinksContainer.classList.remove('active');
        });
    });
    
    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
    });
    
    // Navigation from other elements (buttons with data-page)
    document.addEventListener('click', (e) => {
        if (e.target.hasAttribute('data-page') && !e.target.classList.contains('nav-link')) {
            e.preventDefault();
            const targetPage = e.target.getAttribute('data-page');
            
            // Update active link
            navLinks. forEach(l => {
                l.classList.remove('active');
                if (l.getAttribute('data-page') === targetPage) {
                    l.classList.add('active');
                }
            });
            
            // Show target page with transition
            changePage(targetPage);
        }
    });
}

// Change page with transition
function changePage(targetPage) {
    // Hide current active page
    const currentPage = document.querySelector('.page. active');
    if (currentPage) {
        currentPage.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => {
            currentPage.classList.remove('active');
            currentPage.style.animation = '';
            
            // Show target page
            const newPage = document.getElementById(targetPage);
            if (newPage) {
                newPage.classList.add('active');
                newPage.style.animation = 'fadeIn 0.5s forwards';
            }
        }, 300);
    }
}

// Generate room cards
function generateRoomCards() {
    roomsGrid.innerHTML = '';
    
    rooms.forEach((room, index) => {
        const roomCard = document.createElement('div');
        roomCard.className = 'room-card';
        roomCard.style.opacity = '0';
        roomCard.style.transform = 'translateY(30px)';
        
        roomCard.innerHTML = `
            <div class="room-image" style="background-image: url('${room.image}')">
                <div class="room-capacity">
                    <i class="fas fa-users"></i> ${room.capacity}
                </div>
            </div>
            <div class="room-details">
                <h3>${room.name}</h3>
                <p>${room.description}</p>
                <div class="room-features">
                    ${room.features.map(feature => `
                        <div class="room-feature">
                            <i class="fas fa-check"></i>
                            <span>${feature}</span>
                        </div>
                    `).join('')}
                </div>
                <button class="btn room-reserve-btn" data-page="reservation" data-room="${room.id}">Reservar</button>
            </div>
        `;
        
        roomsGrid.appendChild(roomCard);
        
        // Add animation on load
        setTimeout(() => {
            roomCard.style.opacity = '1';
            roomCard. style.transform = 'translateY(0)';
        }, 100 * index);
    });
    
    // Add event listeners to reservation buttons
    document.querySelectorAll('.room-reserve-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const roomId = button.getAttribute('data-room');
            
            // Set the room in the select
            setTimeout(() => {
                roomSelect. value = roomId;
                
                // Highlight the room select
                roomSelect.style.borderColor = 'var(--accent)';
                setTimeout(() => {
                    roomSelect.style.borderColor = '';
                }, 1000);
            }, 500);
        });
    });
}

// Populate room select
function populateRoomSelect() {
    // Clear existing options except the first one
    roomSelect.innerHTML = '<option value="">Selecione uma sala</option>';
    
    rooms.forEach(room => {
        const option = document.createElement('option');
        option.value = room.id;
        option.textContent = `${room.name} (Capacidade: ${room.capacity})`;
        roomSelect.appendChild(option);
    });
    
    // Add change event to show room details
    roomSelect.addEventListener('change', () => {
        const selectedRoomId = roomSelect.value;
        if (selectedRoomId) {
            document.getElementById('room-error').classList.remove('active');
        }
    });
}

// Generate time slots
function generateTimeSlots() {
    timeSlots.innerHTML = '';
    
    const startHour = 8;
    const endHour = 20;
    
    for (let hour = startHour; hour < endHour; hour++) {
        const timeSlot = document. createElement('div');
        timeSlot.className = 'time-slot';
        timeSlot. setAttribute('data-time', `${hour}:00`);
        timeSlot.textContent = `${hour}:00`;
        
        timeSlot.addEventListener('click', () => {
            if (! timeSlot.classList.contains('unavailable')) {
                // Add ripple effect
                const rect = timeSlot.getBoundingClientRect();
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                ripple.style.left = '50%';
                ripple. style.top = '50%';
                ripple.style.width = '10px';
                ripple.style.height = '10px';
                timeSlot.appendChild(ripple);
                
                // Remove ripple after animation
                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple. remove();
                    }
                }, 600);
                
                document.querySelectorAll('.time-slot').forEach(slot => {
                    slot.classList.remove('selected');
                });
                timeSlot.classList.add('selected');
                selectedTimeSlot = `${hour}:00`;
                document.getElementById('time-error').classList.remove('active');
            }
        });
        
        timeSlots.appendChild(timeSlot);
    }
}

// Generate calendar
function generateCalendar() {
    updateCalendarHeader();
    
    // Clear previous days (keep day names)
    const dayNames = calendarDays.querySelectorAll('. calendar-day-name');
    calendarDays.innerHTML = '';
    dayNames.forEach(dayName => calendarDays.appendChild(dayName));
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    // Add days from previous month
    const firstDayOfWeek = firstDay.getDay();
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = prevMonthLastDay - i;
        calendarDays.appendChild(day);
    }
    
    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        day.textContent = i;
        
        const currentDate = new Date(currentYear, currentMonth, i);
        
        // Mark today
        if (currentDate. getDate() === today.getDate() && 
            currentDate.getMonth() === today.getMonth() && 
            currentDate.getFullYear() === today.getFullYear()) {
            day.classList.add('today');
        }
        
        // Disable past dates
        if (currentDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
            day.classList.add('unavailable');
        } else {
            day.addEventListener('click', () => {
                // Add ripple effect
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                ripple.style.left = '50%';
                ripple.style. top = '50%';
                ripple.style.width = '10px';
                ripple. style.height = '10px';
                day.appendChild(ripple);
                
                // Remove ripple after animation
                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple.remove();
                    }
                }, 600);
                
                document.querySelectorAll('.calendar-day').forEach(d => {
                    d.classList.remove('selected');
                });
                day.classList.add('selected');
                selectedDate = new Date(currentYear, currentMonth, i);
                document.getElementById('date').valueAsDate = selectedDate;
                document.getElementById('date-error').classList.remove('active');
                
                // Update time slots availability
                updateTimeSlotsAvailability();
            });
        }
        
        calendarDays.appendChild(day);
    }
    
    // Add days from next month
    const totalCells = 42; // 6 rows × 7 days
    const cellsUsed = firstDayOfWeek + lastDay.getDate();
    const remainingDays = totalCells - cellsUsed;
    
    for (let i = 1; i <= remainingDays; i++) {
        const day = document. createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = i;
        calendarDays.appendChild(day);
    }
}

// Setup calendar navigation
function setupCalendarNavigation() {
    prevMonthButton.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar();
    });
    
    nextMonthButton. addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar();
    });
}

// Update calendar header
function updateCalendarHeader() {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    currentMonthElement.textContent = `${months[currentMonth]} ${currentYear}`;
}

// Generate random unavailable time slots
function generateUnavailableTimeSlots() {
    const startDate = new Date();
    
    for (let i = 0; i < 30; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        const dateString = formatDate(currentDate);
        unavailableTimeSlots[dateString] = [];
        
        // Generate 2-4 random unavailable time slots per day
        const unavailableCount = Math.floor(Math.random() * 3) + 2;
        
        for (let j = 0; j < unavailableCount; j++) {
            const hour = Math.floor(Math.random() * 12) + 8; // 8: 00 - 19:00
            const timeSlot = `${hour}:00`;
            
            if (! unavailableTimeSlots[dateString].includes(timeSlot)) {
                unavailableTimeSlots[dateString].push(timeSlot);
            }
        }
    }
}

// Update time slots availability based on selected date
function updateTimeSlotsAvailability() {
    if (!selectedDate) return;
    
    const dateString = formatDate(selectedDate);
    const unavailableSlots = unavailableTimeSlots[dateString] || [];
    
    document. querySelectorAll('.time-slot').forEach(slot => {
        const timeSlot = slot.getAttribute('data-time');
        
        slot.classList.remove('unavailable');
        slot.classList.remove('selected');
        
        if (unavailableSlots.includes(timeSlot)) {
            slot.classList.add('unavailable');
        }
    });
    
    selectedTimeSlot = null;
}

// Format date to YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

// Format date to DD/MM/YYYY
function formatDateBR(date) {
    const year = date.getFullYear();
    const month = String(date. getMonth() + 1).padStart(2, '0');
    const day = String(date. getDate()).padStart(2, '0');
    
    return `${day}/${month}/${year}`;
}

// Setup form validation
function setupFormValidation() {
    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        
        // Validate name
        const nameInput = document.getElementById('name');
        const nameError = document.getElementById('name-error');
        
        if (! nameInput.value.trim() || nameInput.value.trim().length < 5) {
            nameError.classList.add('active');
            nameInput.style.borderColor = 'var(--error)';
            isValid = false;
        } else {
            nameError.classList. remove('active');
            nameInput.style.borderColor = '';
        }
        
        // Validate matricula
        const matriculaInput = document.getElementById('matricula');
        const matriculaError = document.getElementById('matricula-error');
        
        if (!matriculaInput.value.trim() || !/^\d{5,10}$/.test(matriculaInput.value. trim())) {
            matriculaError.classList.add('active');
            matriculaInput. style.borderColor = 'var(--error)';
            isValid = false;
        } else {
            matriculaError. classList.remove('active');
            matriculaInput.style.borderColor = '';
        }
        
        // Validate room
        const roomInput = document.getElementById('room');
        const roomError = document.getElementById('room-error');
        
        if (!roomInput.value) {
            roomError.classList. add('active');
            roomInput.style.borderColor = 'var(--error)';
            isValid = false;
        } else {
            roomError.classList.remove('active');
            roomInput.style.borderColor = '';
        }
        
        // Validate date
        const dateInput = document.getElementById('date');
        const dateError = document.getElementById('date-error');
        
        if (!dateInput.value) {
            dateError.classList. add('active');
            dateInput.style.borderColor = 'var(--error)';
            isValid = false;
        } else {
            const selectedDate = new Date(dateInput.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                dateError.textContent = 'A data selecionada não pode ser no passado. ';
                dateError.classList. add('active');
                dateInput.style.borderColor = 'var(--error)';
                isValid = false;
            } else {
                dateError.classList.remove('active');
                dateInput.style.borderColor = '';
            }
        }
        
        // Validate time slot
        const timeError = document.getElementById('time-error');
        
        if (!selectedTimeSlot) {
            timeError.classList. add('active');
            isValid = false;
        } else {
            timeError.classList.remove('active');
        }
        
        // If valid, show confirmation
        if (isValid) {
            // Show loading spinner
            submitText.style.display = 'none';
            loadingSpinner.style.display = 'inline-block';
            
            // Simulate server request
            setTimeout(() => {
                submitText.style.display = 'inline-block';
                loadingSpinner.style.display = 'none';
                showConfirmation();
            }, 1500);
        }
    });
    
    // Date input change event
    document.getElementById('date').addEventListener('change', (e) => {
        const selectedDateFromInput = new Date(e.target.value);
        
        if (selectedDateFromInput) {
            currentMonth = selectedDateFromInput.getMonth();
            currentYear = selectedDateFromInput.getFullYear();
            selectedDate = selectedDateFromInput;
            
            generateCalendar();
            
            // Find and select the day in the calendar
            setTimeout(() => {
                document.querySelectorAll('.calendar-day').forEach(day => {
                    if (! day.classList.contains('other-month') && 
                        parseInt(day.textContent) === selectedDateFromInput.getDate()) {
                        day.classList.add('selected');
                    }
                });
            }, 100);
            
            // Update time slots availability
            updateTimeSlotsAvailability();
        }
    });
}

// Show confirmation modal
function showConfirmation() {
    // Get form values
    const name = document.getElementById('name').value;
    const matricula = document. getElementById('matricula').value;
    const roomId = document.getElementById('room').value;
    const date = new Date(document.getElementById('date').value);
    
    // Get room name
    const room = rooms.find(r => r.id == roomId);
    
    // Update confirmation details
    document.getElementById('confirm-name').textContent = name;
    document.getElementById('confirm-matricula').textContent = matricula;
    document.getElementById('confirm-room').textContent = room. name;
    document.getElementById('confirm-date').textContent = formatDateBR(date);
    document.getElementById('confirm-time').textContent = selectedTimeSlot;
    
    // Show modal
    confirmationModal.classList.add('active');
    
    // Add this time slot to unavailable slots
    const dateString = formatDate(date);
    
    if (! unavailableTimeSlots[dateString]) {
        unavailableTimeSlots[dateString] = [];
    }
    
    unavailableTimeSlots[dateString].push(selectedTimeSlot);
    
    // Reset form
    reservationForm.reset();
    selectedDate = null;
    selectedTimeSlot = null;
    
    // Reset time slots
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList. remove('selected');
    });
    
    // Reset calendar
    document.querySelectorAll('.calendar-day').forEach(day => {
        day.classList.remove('selected');
    });
}

// Setup modal
function setupModal() {
    modalClose.addEventListener('click', () => {
        confirmationModal.classList. remove('active');
    });
    
    closeModalButton.addEventListener('click', () => {
        confirmationModal.classList.remove('active');
    });
    
    // Close modal when clicking outside
    confirmationModal.addEventListener('click', (e) => {
        if (e.target === confirmationModal) {
            confirmationModal.classList.remove('active');
        }
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    init();
    setupCalendarNavigation();
});