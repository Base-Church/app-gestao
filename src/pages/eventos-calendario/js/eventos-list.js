class EventosList {
    constructor(app) {
        this.app = app;
        this.eventos = [];
        this.eventosFiltrados = [];
    }

    setEventos(eventos) {
        this.eventos = eventos;
        this.filterEventos();
    }

    filterEventos(searchTerm = '', tipoFilter = '') {
        let filtrados = [...this.eventos];

        if (searchTerm) {
            filtrados = filtrados.filter(evento => 
                evento.nome.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (tipoFilter) {
            filtrados = filtrados.filter(evento => evento.tipo === tipoFilter);
        }

        this.eventosFiltrados = filtrados;
        this.render();
    }

    render() {
        const container = document.getElementById('eventos-container');
        const emptyState = document.getElementById('eventos-empty');
        
        if (this.eventosFiltrados.length === 0) {
            container.classList.add('hidden');
            emptyState.classList.remove('hidden');
            return;
        }

        container.classList.remove('hidden');
        emptyState.classList.add('hidden');
        container.innerHTML = '';

        this.eventosFiltrados.forEach(evento => {
            const card = this.createEventoCard(evento);
            container.appendChild(card);
        });
    }

    createEventoCard(evento) {
        const card = document.createElement('div');
        
        // Obter cor baseada na primeira letra do nome
        const borderColor = this.getColorByFirstLetter(evento.nome);
        
        card.className = `
            bg-white dark:bg-gray-700 rounded-lg border p-2 cursor-grab 
            hover:shadow-md transition-all text-xs
            border-l-4 ${borderColor}
        `.trim();
        
        card.dataset.eventoId = evento.id;
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

        const visibilidade = document.createElement('span');
        visibilidade.className = `
            inline-flex items-center px-1 py-0.5 rounded text-xs font-medium
            ${evento.visibilidade === 'publico' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
            }
        `.trim();
        visibilidade.textContent = evento.visibilidade === 'publico' ? 'P' : 'I';

        header.appendChild(tipo);
        header.appendChild(visibilidade);

        const nome = document.createElement('div');
        nome.className = 'truncate font-semibold text-gray-900 dark:text-white text-xs mt-1';
        nome.textContent = evento.nome;

        const diaSemana = this.formatDiaSemana(evento.dia_semana);
        const hora = evento.hora ? evento.hora.substring(0, 5) : '';
        
        const tempo = document.createElement('div');
        tempo.className = 'text-xs text-gray-500 dark:text-gray-400 mt-1';
        tempo.textContent = `${diaSemana}${hora ? ` ${hora}` : ''}`;

        card.appendChild(header);
        card.appendChild(nome);
        card.appendChild(tempo);

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

    formatDiaSemana(dia) {
        const dias = {
            'domingo': 'Dom', 'segunda': 'Seg', 'terca': 'Ter',
            'quarta': 'Qua', 'quinta': 'Qui', 'sexta': 'Sex', 'sabado': 'Sáb'
        };
        return dias[dia] || dia;
    }

    getEventoById(id) {
        return this.eventos.find(e => e.id == id);
    }
}

window.EventosList = EventosList;
