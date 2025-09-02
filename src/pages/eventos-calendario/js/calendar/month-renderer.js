class MonthRenderer {
    constructor(calendar) {
        this.calendar = calendar;
    }

    renderCalendarGrid() {
        const grid = document.getElementById('calendar-grid');
        if (!grid) return;
        
        grid.innerHTML = '';

        const year = this.calendar.currentDate.getFullYear();
        const month = this.calendar.currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const dayElement = this.createDayElement(date, month);
            grid.appendChild(dayElement);
        }
    }

    createDayElement(date, currentMonth) {
        const dayDiv = document.createElement('div');
        const dateStr = this.calendar.formatDateKey(date);
        const isCurrentMonth = date.getMonth() === currentMonth;
        const isToday = this.calendar.isToday(date);

        dayDiv.className = `
            relative min-h-[120px] p-2 border border-gray-100 dark:border-gray-600
            ${isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}
            ${isToday ? 'ring-2 ring-primary-500' : ''}
            hover:bg-gray-50 dark:hover:bg-gray-700
            calendar-day rounded-lg
        `.trim();

        dayDiv.dataset.date = dateStr;

        const dayHeader = document.createElement('div');
        dayHeader.className = 'flex items-center justify-between mb-2';

        const dayNumber = document.createElement('div');
        dayNumber.className = `
            flex items-center justify-center w-6 h-6 text-sm font-bold rounded-full
            ${isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400'}
            ${isToday ? 'bg-primary-600 text-white' : ''}
        `.trim();
        dayNumber.textContent = date.getDate();

        const eventCount = this.calendar.getEventCountForDate(dateStr);
        const eventIndicator = document.createElement('div');
        if (eventCount > 0) {
            eventIndicator.className = `
                flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full
                bg-blue-500 text-white
            `.trim();
            eventIndicator.textContent = eventCount > 9 ? '9+' : eventCount;
        }

        dayHeader.appendChild(dayNumber);
        if (eventCount > 0) dayHeader.appendChild(eventIndicator);

        const eventsContainer = document.createElement('div');
        eventsContainer.className = 'space-y-1 min-h-[80px] overflow-y-auto drop-zone';
        eventsContainer.dataset.date = dateStr;

        this.calendar.renderEventosNoDia(eventsContainer, dateStr);

        dayDiv.appendChild(dayHeader);
        dayDiv.appendChild(eventsContainer);

        return dayDiv;
    }
}

window.MonthRenderer = MonthRenderer;
