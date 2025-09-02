class DragDropManager {
    constructor(calendar, api) {
        this.calendar = calendar;
        this.api = api;
        this.init();
    }

    init() {
        this.setupEventosListDrag();
        this.setupDropZones();
    }

    setupEventosListDrag() {
        const eventosContainer = document.getElementById('eventos-container');
        if (!eventosContainer) return;

        Sortable.create(eventosContainer, {
            group: {
                name: 'eventos',
                pull: 'clone',
                put: false
            },
            sort: false,
            onStart: (evt) => {
                document.querySelectorAll('.drop-zone').forEach(zone => {
                    zone.classList.add('border-2', 'border-blue-300', 'bg-blue-50');
                });
            },
            onEnd: (evt) => {
                document.querySelectorAll('.drop-zone').forEach(zone => {
                    zone.classList.remove('border-2', 'border-blue-300', 'bg-blue-50');
                });
            }
        });
    }

    setupDropZones() {
        // Observer para detectar mudanças no DOM
        const observer = new MutationObserver(() => {
            this.updateDropZones();
        });

        const calendarGrid = document.getElementById('calendar-grid');
        const weekDays = document.getElementById('week-days');

        if (calendarGrid) {
            observer.observe(calendarGrid, { childList: true });
        }
        
        if (weekDays) {
            observer.observe(weekDays, { childList: true });
        }

        this.updateDropZones();
    }

    updateDropZones() {
        const dropZones = document.querySelectorAll('.drop-zone');
        
        dropZones.forEach(zone => {
            // Remove configurações antigas se existirem
            if (zone.sortableInstance) {
                zone.sortableInstance.destroy();
                zone.sortableInstance = null;
            }
            
            // Configura drag and drop
            zone.sortableInstance = Sortable.create(zone, {
                group: {
                    name: 'eventos',
                    pull: true,
                    put: true
                },
                sort: true,
                animation: 150,
                onAdd: (evt) => {
                    const element = evt.item;
                    const eventoId = element.dataset.eventoId;
                    const fromDate = element.dataset.fromDate;
                    const targetDate = zone.dataset.date;
                    
                    // Se está vindo da lista de eventos (novo evento)
                    if (evt.from.id === 'eventos-container') {
                        element.remove();
                        const evento = window.app.getEventoById(eventoId);
                        if (evento && targetDate) {
                            this.calendar.adicionarEventoAoCalendario(evento, targetDate);
                        }
                    }
                    // Se está movendo entre datas do calendário
                    else if (fromDate && fromDate !== targetDate) {
                        // Remove da data original
                        this.calendar.removerEventoDoCalendario(eventoId, fromDate);
                        
                        // Adiciona na nova data
                        const evento = window.app.getEventoById(eventoId);
                        if (evento && targetDate) {
                            this.calendar.adicionarEventoAoCalendario(evento, targetDate);
                        }
                        
                        element.remove();
                    }
                    
                    // Atualização extra para modo semana
                    if (this.calendar.currentView === 'week') {
                        setTimeout(() => {
                            this.updateDropZones();
                        }, 100);
                    }
                }
            });
        });
    }
}

window.DragDropManager = DragDropManager;
