// calendar.ui.js
// Responsável por inicializar e customizar o calendário (FullCalendar) e lidar com interações de UI

window.initCalendar = function(containerId, onDayClick) {
    const calendarEl = document.getElementById(containerId);
    const calendar = new window.FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'pt-br',
        height: 'auto',
        selectable: true,
        dateClick: function(info) {
            if (typeof onDayClick === 'function') onDayClick(info.dateStr);
        },
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: ''
        },
        dayMaxEventRows: 2,
        eventDisplay: 'block',
        // O design pode ser customizado aqui
        dayCellClassNames: function(arg) {
            return ['hover:bg-primary-50', 'cursor-pointer', 'transition'];
        }
    });
    calendar.render();
    return calendar;
}

window.setCalendarEvents = function(calendar, events) {
    calendar.removeAllEvents();
    events.forEach(ev => calendar.addEvent(ev));
} 