// Calendar functionality
let currentDate = new Date();
let selectedDate = null;
let selectedTime = null;

// Available time slots for each day of the week (COM horários da noite)
const timeSlots = {
    // Monday to Friday: 7h-22h
    1: ['07:00', '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'],
    2: ['07:00', '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'],
    3: ['07:00', '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'],
    4: ['07:00', '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'],
    5: ['07:00', '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'],
    // Saturday: 7h-18h
    6: ['07:00', '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
    // Sunday: Apenas emergências
    0: []
};

// Booked appointments (simulate some booked slots)
const bookedSlots = {
    '2025-01-02': ['09:00', '14:00'],
    '2025-01-03': ['10:00', '15:00'],
    '2025-01-06': ['08:00', '16:00'],
    '2025-01-07': ['11:00', '13:00']
};

const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

function initCalendar() {
    updateCalendarDisplay();
}

function updateCalendarDisplay() {
    const monthElement = document.getElementById('currentMonth');
    const daysElement = document.getElementById('calendarDays');
    
    monthElement.textContent = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    
    // Clear previous days
    daysElement.innerHTML = '';
    
    // Get first day of month and number of days
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Generate calendar days
    for (let i = 0; i < 42; i++) {
        const day = new Date(startDate);
        day.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day.getDate();
        
        // Check if day is in current month
        if (day.getMonth() !== currentDate.getMonth()) {
            dayElement.classList.add('other-month');
        }
        
        // Check if day is in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (day < today) {
            dayElement.classList.add('past-day');
        } else {
            // Check if day has available slots
            const dayOfWeek = day.getDay();
            const availableSlots = timeSlots[dayOfWeek] || [];
            const dateStr = formatDate(day);
            const booked = bookedSlots[dateStr] || [];
            const hasAvailableSlots = availableSlots.some(slot => !booked.includes(slot));
            
            if (dayOfWeek === 0) {
                // Sunday - Emergency only
                dayElement.classList.add('emergency-only');
                dayElement.title = 'Domingo: Apenas emergências';
                dayElement.addEventListener('click', () => showEmergencyMessage());
            } else if (hasAvailableSlots) {
                dayElement.classList.add('available');
                dayElement.addEventListener('click', () => selectDate(day));
            } else {
                dayElement.classList.add('fully-booked');
                dayElement.title = 'Totalmente ocupado';
            }
        }
        
        // Highlight selected date
        if (selectedDate && day.toDateString() === selectedDate.toDateString()) {
            dayElement.classList.add('selected');
        }
        
        daysElement.appendChild(dayElement);
    }
}

function showEmergencyMessage() {
    if (confirm('Domingo é apenas para emergências. Deseja ir para o formulário de emergência?')) {
        window.location.href = 'orcamento.html';
    }
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendarDisplay();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendarDisplay();
}

function selectDate(date) {
    const dayOfWeek = date.getDay();
    
    // Don't allow selection of Sunday (emergency only)
    if (dayOfWeek === 0) {
        showEmergencyMessage();
        return;
    }
    
    selectedDate = date;
    selectedTime = null;
    updateCalendarDisplay();
    showTimeSlots(date);
}

function showTimeSlots(date) {
    const timeSlotsElement = document.getElementById('timeSlots');
    const timeSlotsGrid = document.getElementById('timeSlotsGrid');
    const selectedDateElement = document.getElementById('selectedDate');
    
    const dayOfWeek = date.getDay();
    const availableSlots = timeSlots[dayOfWeek] || [];
    const dateStr = formatDate(date);
    const booked = bookedSlots[dateStr] || [];
    
    selectedDateElement.textContent = formatDateBR(date);
    timeSlotsGrid.innerHTML = '';
    
    // Group time slots by period
    const periods = {
        manha: availableSlots.filter(time => {
            const hour = parseInt(time.split(':')[0]);
            return hour >= 7 && hour <= 11;
        }),
        tarde: availableSlots.filter(time => {
            const hour = parseInt(time.split(':')[0]);
            return hour >= 13 && hour <= 17;
        }),
        noite: availableSlots.filter(time => {
            const hour = parseInt(time.split(':')[0]);
            return hour >= 18 && hour <= 21;
        })
    };
    
    // Create sections for each period
    Object.entries(periods).forEach(([period, slots]) => {
        if (slots.length > 0) {
            const periodNames = {
                manha: '🌅 Manhã (7h-11h)',
                tarde: '☀️ Tarde (13h-17h)',
                noite: '🌙 Noite (18h-21h)'
            };
            
            const periodHeader = document.createElement('div');
            periodHeader.style.cssText = 'grid-column: 1 / -1; font-weight: 600; color: #374151; margin: 16px 0 8px 0; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb;';
            periodHeader.textContent = periodNames[period];
            timeSlotsGrid.appendChild(periodHeader);
            
            slots.forEach(time => {
                const timeSlot = document.createElement('div');
                timeSlot.className = 'time-slot';
                timeSlot.textContent = time;
                
                if (booked.includes(time)) {
                    timeSlot.classList.add('booked');
                    timeSlot.title = 'Horário ocupado';
                } else {
                    timeSlot.classList.add('available');
                    timeSlot.addEventListener('click', () => selectTime(time));
                }
                
                if (selectedTime === time) {
                    timeSlot.classList.add('selected');
                }
                
                timeSlotsGrid.appendChild(timeSlot);
            });
        }
    });
    
    timeSlotsElement.style.display = 'block';
    updateAppointmentSummary();
}

function selectTime(time) {
    selectedTime = time;
    
    // Update time slot selection
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
        if (slot.textContent === time) {
            slot.classList.add('selected');
        }
    });
    
    updateAppointmentSummary();
}

function updateAppointmentSummary() {
    const summaryElement = document.getElementById('appointmentSummary');
    const detailsElement = document.getElementById('appointmentDetails');
    
    if (selectedDate && selectedTime) {
        const dayOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][selectedDate.getDay()];
        const hour = parseInt(selectedTime.split(':')[0]);
        
        let periodIcon = '🕐';
        let periodText = '';
        
        if (hour >= 7 && hour <= 11) {
            periodIcon = '🌅';
            periodText = 'Manhã';
        } else if (hour >= 13 && hour <= 17) {
            periodIcon = '☀️';
            periodText = 'Tarde';
        } else if (hour >= 18 && hour <= 21) {
            periodIcon = '🌙';
            periodText = 'Noite';
        }
        
        detailsElement.innerHTML = `
            <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                    <span style="font-size: 20px;">📅</span>
                    <strong style="color: #166534;">Data:</strong>
                </div>
                <p style="color: #166534; margin: 0; font-weight: 500;">
                    ${dayOfWeek}, ${formatDateBR(selectedDate)}
                </p>
            </div>
            <div style="background: #eff6ff; border-radius: 12px; padding: 20px;">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                    <span style="font-size: 20px;">${periodIcon}</span>
                    <strong style="color: #1d4ed8;">Horário:</strong>
                </div>
                <p style="color: #1d4ed8; margin: 0; font-weight: 500; font-size: 18px;">
                    ${selectedTime} - ${periodText}
                </p>
            </div>
        `;
        
        summaryElement.style.display = 'block';
    } else {
        summaryElement.style.display = 'none';
    }
}

function confirmAppointment() {
    if (!selectedDate || !selectedTime) {
        alert('Por favor, selecione uma data e horário.');
        return;
    }
    
    const dayOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][selectedDate.getDay()];
    const dateStr = formatDateBR(selectedDate);
    const hour = parseInt(selectedTime.split(':')[0]);
    
    let periodText = '';
    if (hour >= 7 && hour <= 11) {
        periodText = ' (Manhã)';
    } else if (hour >= 13 && hour <= 17) {
        periodText = ' (Tarde)';
    } else if (hour >= 18 && hour <= 21) {
        periodText = ' (Noite)';
    }
    
    // Store selected appointment data
    sessionStorage.setItem('selectedAppointment', JSON.stringify({
        date: dateStr,
        dayOfWeek: dayOfWeek,
        time: selectedTime,
        period: periodText
    }));
    
    // Redirect to budget form
    window.location.href = 'orcamento.html';
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function formatDateBR(date) {
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Initialize calendar when page loads
document.addEventListener('DOMContentLoaded', function() {
    initCalendar();
});