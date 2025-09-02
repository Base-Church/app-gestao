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
            onStart: () => {
                document.querySelectorAll('.drop-zone').forEach(zone => {
                    zone.classList.add('border-2', 'border-blue-300', 'bg-blue-50', 'dark:bg-blue-900/20');
                });
            },
            onEnd: () => {
                document.querySelectorAll('.drop-zone').forEach(zone => {
                    zone.classList.remove('border-2', 'border-blue-300', 'bg-blue-50', 'dark:bg-blue-900/20');
                });
            }
        });
    }

    setupDropZones() {
        const observer = new MutationObserver(() => {
            this.updateDropZones();
        });

        const calendarGrid = document.getElementById('calendar-grid');
        const weekDays = document.getElementById('week-days');

        if (calendarGrid) observer.observe(calendarGrid, { childList: true });
        if (weekDays) observer.observe(weekDays, { childList: true });

        this.updateDropZones();
    }

    updateDropZones() {
        const dropZones = document.querySelectorAll('.drop-zone');
        
        dropZones.forEach(zone => {
            if (zone.sortableInstance) {
                zone.sortableInstance.destroy();
            }
            
            zone.sortableInstance = Sortable.create(zone, {
                group: 'eventos',
                animation: 150,
                onAdd: (evt) => {
                    const element = evt.item;
                    const eventoId = element.dataset.eventoId;
                    const fromDate = element.dataset.fromDate;
                    const targetDate = zone.dataset.date;
                    
                    console.log('OnAdd triggered:', { 
                        eventoId, 
                        fromDate, 
                        targetDate, 
                        fromId: evt.from.id,
                        toId: evt.to.dataset.date,
                        isFromEventosContainer: evt.from.id === 'eventos-container'
                    });
                    
                    const evento = window.app.getEventoById(eventoId);
                    if (!evento) {
                        console.error('Evento não encontrado:', eventoId);
                        element.remove();
                        return;
                    }
                    
                    // SEMPRE remover o elemento primeiro para evitar duplicatas
                    element.remove();
                    
                    // Vindo da lista de eventos (fromId será 'eventos-container')
                    if (evt.from.id === 'eventos-container') {
                        console.log('✓ Novo evento da lista');
                        
                        // Verificar se já existe antes de adicionar
                        const eventosNaData = this.calendar.eventosAgendados.get(targetDate) || [];
                        if (!eventosNaData.some(e => e.id === evento.id)) {
                            this.calendar.adicionarEventoAoCalendario(evento, targetDate);
                        } else {
                            console.log('Evento já existe na data de destino');
                        }
                        
                        // Forçar atualização da vista
                        this.forceViewRefresh();
                        return;
                    }
                    
                    // Movendo entre datas (fromDate exists e é diferente)
                    if (fromDate && fromDate !== targetDate) {
                        console.log('✓ Movendo entre datas:', fromDate, '→', targetDate);
                        
                        // Verificar se já existe na data de destino antes de mover
                        const eventosDestino = this.calendar.eventosAgendados.get(targetDate) || [];
                        if (!eventosDestino.some(e => e.id === evento.id)) {
                            this.calendar.removerEventoDoCalendario(eventoId, fromDate);
                            this.calendar.adicionarEventoAoCalendario(evento, targetDate);
                        } else {
                            console.log('Evento já existe na data de destino - apenas removendo da origem');
                            this.calendar.removerEventoDoCalendario(eventoId, fromDate);
                        }
                        
                        // Forçar atualização da vista
                        this.forceViewRefresh();
                        return;
                    }
                    
                    console.log('✗ Movimento ignorado - mesma data ou inválido');
                }
            });
        });
    }

    // Método para forçar atualização da vista após operações de drag-drop
    forceViewRefresh() {
        setTimeout(() => {
            if (this.calendar.currentView === 'week') {
                console.log('Forçando refresh da vista semanal');
                this.calendar.refreshWeekEvents();
            } else {
                console.log('Forçando refresh da vista mensal');
                this.calendar.renderCalendarGrid();
            }
        }, 50); // Pequeno delay para garantir que os dados foram atualizados
    }
}

window.DragDropManager = DragDropManager;
