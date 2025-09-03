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
        
        // Obter cor baseada na primeira letra do nome
        const borderColor = this.getColorByFirstLetter(evento.nome);
        
        card.className = `
            bg-white dark:bg-gray-700 rounded-lg border p-2 text-xs group
            hover:shadow-md transition-all cursor-grab evento-card
            border-l-4 ${borderColor}
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

    getColorByFirstLetter(nome) {
        if (!nome) return 'border-l-gray-500';
        
        const firstLetter = nome.charAt(0).toUpperCase();
        
        const colorMap = {
            'A': 'border-l-red-500',
            'B': 'border-l-blue-500', 
            'C': 'border-l-green-500',
            'D': 'border-l-yellow-500',
            'E': 'border-l-purple-500',
            'F': 'border-l-pink-500',
            'G': 'border-l-indigo-500',
            'H': 'border-l-orange-500',
            'I': 'border-l-teal-500',
            'J': 'border-l-cyan-500',
            'K': 'border-l-lime-500',
            'L': 'border-l-emerald-500',
            'M': 'border-l-rose-500',
            'N': 'border-l-violet-500',
            'O': 'border-l-amber-500',
            'P': 'border-l-sky-500',
            'Q': 'border-l-slate-500',
            'R': 'border-l-red-600',
            'S': 'border-l-blue-600',
            'T': 'border-l-green-600',
            'U': 'border-l-yellow-600',
            'V': 'border-l-purple-600',
            'W': 'border-l-pink-600',
            'X': 'border-l-indigo-600',
            'Y': 'border-l-orange-600',
            'Z': 'border-l-teal-600'
        };
        
        return colorMap[firstLetter] || 'border-l-gray-500';
    }

    adicionarEventoAoCalendario(evento, dateStr) {
        if (!this.calendar.eventosAgendados.has(dateStr)) {
            this.calendar.eventosAgendados.set(dateStr, []);
        }
        
        const eventosNaData = this.calendar.eventosAgendados.get(dateStr);
        eventosNaData.push({ ...evento });
        
        this.salvarEventosDoDia(dateStr);
        
        // Simplesmente re-renderizar a vista atual
        if (this.calendar.currentView === 'week') {
            this.calendar.renderWeekView();
        } else {
            this.calendar.renderCalendarGrid();
        }
        
        return true;
    }

    removerEventoDoCalendario(eventoId, dateStr) {
        if (this.calendar.eventosAgendados.has(dateStr)) {
            const eventosNaData = this.calendar.eventosAgendados.get(dateStr);
            const index = eventosNaData.findIndex(e => e.id == eventoId);
            
            if (index > -1) {
                eventosNaData.splice(index, 1);
                this.salvarEventosDoDia(dateStr);
                
                // Simplesmente re-renderizar a vista atual
                if (this.calendar.currentView === 'week') {
                    this.calendar.renderWeekView();
                } else {
                    this.calendar.renderCalendarGrid();
                }
                
                return true;
            }
        }
        
        return false;
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
        }
    }
}

window.EventManager = EventManager;
