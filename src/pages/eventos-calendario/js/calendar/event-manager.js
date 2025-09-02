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
    }

    createEventoCard(evento, dateStr) {
        const card = document.createElement('div');
        
        card.className = `
            bg-white dark:bg-gray-700 rounded-lg border p-2 text-xs group
            hover:shadow-md transition-all cursor-grab evento-card
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
        removeBtn.className = 'opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all text-sm font-bold';
        removeBtn.innerHTML = '×';
        removeBtn.onclick = (e) => {
            e.stopPropagation();
            this.calendar.removerEventoDoCalendario(evento.id, dateStr);
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
        console.log('adicionarEventoAoCalendario chamado:', { eventoId: evento.id, dateStr });
        
        if (!this.calendar.eventosAgendados.has(dateStr)) {
            this.calendar.eventosAgendados.set(dateStr, []);
        }
        
        const eventosNaData = this.calendar.eventosAgendados.get(dateStr);
        
        // REMOVER verificação de duplicata para permitir movimentação
        // A verificação será feita no DragDropManager antes de chamar este método
        
        eventosNaData.push({ ...evento });
        console.log('Evento adicionado aos dados:', { dateStr, totalEventos: eventosNaData.length });
        
        // Re-renderizar IMEDIATAMENTE com base na vista atual
        if (this.calendar.currentView === 'week') {
            // No modo semana, forçar refresh completo
            this.calendar.refreshWeekEvents();
        } else {
            // No modo mês, renderizar apenas a data específica
            this.renderEventosNaData(dateStr);
        }
        
        this.salvarEventosDoDia(dateStr);
        return true;
    }

    removerEventoDoCalendario(eventoId, dateStr) {
        console.log('removerEventoDoCalendario chamado:', { eventoId, dateStr });
        
        if (this.calendar.eventosAgendados.has(dateStr)) {
            const eventosNaData = this.calendar.eventosAgendados.get(dateStr);
            const index = eventosNaData.findIndex(e => e.id == eventoId);
            
            if (index > -1) {
                eventosNaData.splice(index, 1);
                console.log('Evento removido dos dados:', { dateStr, totalEventos: eventosNaData.length });
                
                // Re-renderizar com base na vista atual
                if (this.calendar.currentView === 'week') {
                    // No modo semana, forçar refresh completo
                    this.calendar.refreshWeekEvents();
                } else {
                    // No modo mês, renderizar apenas a data específica
                    this.renderEventosNaData(dateStr);
                }
                
                this.salvarEventosDoDia(dateStr);
                return true;
            }
        }
        console.log('Evento não encontrado para remoção:', { eventoId, dateStr });
        return false;
    }

    renderEventosNaData(dateStr) {
        const dropZone = document.querySelector(`.drop-zone[data-date="${dateStr}"]`);
        console.log('renderEventosNaData:', { dateStr, dropZoneFound: !!dropZone, currentView: this.calendar.currentView });
        
        if (dropZone) {
            // Limpar container antes de re-renderizar
            dropZone.innerHTML = '';
            this.renderEventosNoDia(dropZone, dateStr);
            console.log('✓ Eventos renderizados para', dateStr);
        } else {
            console.error('✗ Drop zone não encontrada para', dateStr);
            
            // Se não encontrou drop zone na vista semanal, forçar re-renderização completa
            if (this.calendar.currentView === 'week') {
                console.log('Drop zone não encontrada - re-renderizando vista semanal...');
                setTimeout(() => {
                    this.calendar.refreshWeekEvents();
                }, 10);
            }
        }
    }

    async salvarEventosDoDia(dateStr) {
        try {
            const eventosNaData = this.calendar.eventosAgendados.get(dateStr) || [];
            const eventoIds = eventosNaData.map(evento => evento.id);
            
            const date = new Date(dateStr);
            const mes = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const organizacaoId = window.USER?.organizacao_id || 1;
            
            const api = new EventosCalendarioAPI();
            await api.salvarEventosDoDia(mes, organizacaoId, dateStr, eventoIds);
            
        } catch (error) {
            console.error('Erro ao salvar eventos do dia:', error);
        }
    }
}

window.EventManager = EventManager;
