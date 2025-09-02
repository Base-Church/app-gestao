class EventManager {
    constructor(calendar) {
        this.calendar = calendar;
    }

    renderEventosNoDia(container, dateStr) {
        const eventosNoDia = this.calendar.eventosAgendados.get(dateStr) || [];
        container.innerHTML = '';

        const maxVisible = this.calendar.currentView === 'week' ? 10 : 3;
        const visibleEventos = eventosNoDia.slice(0, maxVisible);
        const hiddenCount = eventosNoDia.length - maxVisible;

        visibleEventos.forEach(evento => {
            const card = this.createEventoCard(evento, dateStr);
            container.appendChild(card);
        });

        if (hiddenCount > 0) {
            const moreIndicator = document.createElement('div');
            moreIndicator.className = 'text-xs text-gray-500 text-center py-1 bg-gray-100 dark:bg-gray-700 rounded';
            moreIndicator.textContent = `+${hiddenCount} mais`;
            container.appendChild(moreIndicator);
        }

        // Adicionar espaçamento vazio no final para modo semana
        if (this.calendar.currentView === 'week') {
            const spacer = document.createElement('div');
            spacer.className = 'h-8'; // 2rem de altura
            container.appendChild(spacer);
        }
    }

    createEventoCard(evento, dateStr) {
        const card = document.createElement('div');
        const isWeekView = this.calendar.currentView === 'week';
        
        card.className = `
            bg-white dark:bg-gray-700 rounded-lg border p-2 text-xs group
            hover:shadow-md transition-all cursor-grab
            ${evento.tipo === 'culto' ? 'border-l-4 border-l-purple-500' : 'border-l-4 border-l-blue-500'}
        `.trim();

        card.dataset.eventoId = evento.id;
        card.dataset.fromDate = dateStr;
        card.draggable = true;

        const header = document.createElement('div');
        header.className = 'flex items-center justify-between mb-1';

        const tipo = document.createElement('span');
        tipo.className = `
            inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium
            ${evento.tipo === 'culto' 
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' 
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
            }
        `.trim();
        tipo.textContent = evento.tipo === 'culto' ? 'C' : 'E';

        const removeBtn = document.createElement('button');
        removeBtn.className = 'opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all';
        removeBtn.innerHTML = '×';
        removeBtn.onclick = (e) => {
            e.stopPropagation();
            this.removerEventoDoCalendario(evento._id || evento.id, dateStr);
        };

        header.appendChild(tipo);
        header.appendChild(removeBtn);

        const nome = document.createElement('div');
        nome.className = 'truncate font-semibold text-gray-900 dark:text-white';
        nome.textContent = evento.nome;

        const hora = document.createElement('div');
        hora.className = 'text-xs text-gray-500 dark:text-gray-400';
        hora.textContent = evento.hora?.substring(0, 5) || '';

        card.appendChild(header);
        card.appendChild(nome);
        if (evento.hora) card.appendChild(hora);

        return card;
    }

    adicionarEventoAoCalendario(evento, dateStr) {
        if (!this.calendar.eventosAgendados.has(dateStr)) {
            this.calendar.eventosAgendados.set(dateStr, []);
        }
        
        const eventosNaData = this.calendar.eventosAgendados.get(dateStr);
        const eventoCopia = { 
            ...evento, 
            _id: `${evento.id}-${Date.now()}`
        };
        eventosNaData.push(eventoCopia);
        
        // Buscar e atualizar o container de eventos
        const dropZone = document.querySelector(`.drop-zone[data-date="${dateStr}"]`);
        if (dropZone) {
            this.renderEventosNoDia(dropZone, dateStr);
            
            // Forçar re-renderização específica para modo semana
            if (this.calendar.currentView === 'week') {
                setTimeout(() => {
                    this.calendar.renderWeekView();
                    setTimeout(() => {
                        if (window.app && window.app.dragDrop) {
                            window.app.dragDrop.updateDropZones();
                        }
                    }, 50);
                }, 10);
            }
        } else {
            // Forçar re-renderização do calendário
            setTimeout(() => {
                this.calendar.render();
            }, 50);
        }
        
        return true;
    }

    removerEventoDoCalendario(eventoId, dateStr) {
        if (this.calendar.eventosAgendados.has(dateStr)) {
            const eventosNaData = this.calendar.eventosAgendados.get(dateStr);
            const index = eventosNaData.findIndex(e => e.id == eventoId || e._id == eventoId);
            if (index > -1) {
                eventosNaData.splice(index, 1);
                
                const dropZone = document.querySelector(`.drop-zone[data-date="${dateStr}"]`);
                if (dropZone) {
                    this.renderEventosNoDia(dropZone, dateStr);
                    
                    // Forçar re-renderização específica para modo semana
                    if (this.calendar.currentView === 'week') {
                        setTimeout(() => {
                            this.calendar.renderWeekView();
                            setTimeout(() => {
                                if (window.app && window.app.dragDrop) {
                                    window.app.dragDrop.updateDropZones();
                                }
                            }, 50);
                        }, 10);
                    }
                } else {
                    // Forçar re-renderização do calendário
                    setTimeout(() => {
                        this.calendar.render();
                    }, 50);
                }
                return true;
            }
        }
        return false;
    }

    carregarEventosAgendados(eventos) {
        this.calendar.eventosAgendados.clear();
        
        eventos.forEach(evento => {
            if (evento.valido) {
                const dataEvento = new Date(evento.valido);
                const dateStr = this.calendar.formatDateKey(dataEvento);
                
                if (!this.calendar.eventosAgendados.has(dateStr)) {
                    this.calendar.eventosAgendados.set(dateStr, []);
                }
                
                this.calendar.eventosAgendados.get(dateStr).push(evento);
            }
        });

        this.calendar.render();
    }
}

window.EventManager = EventManager;
