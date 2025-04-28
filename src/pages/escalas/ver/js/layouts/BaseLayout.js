export class BaseLayout {
    static render(data) {
        throw new Error('render method must be implemented');
    }

    static isEventPast(eventDate, eventHour) {
        const now = new Date();
        const eventDateTime = new Date(eventDate);
        const [hours, minutes] = eventHour.split(':');
        
        eventDateTime.setHours(parseInt(hours), parseInt(minutes), 0);
        return eventDateTime < now;
    }

    static getCountdown(eventDate, eventHour) {
        const now = new Date();
        const eventDateTime = new Date(eventDate);
        const [hours, minutes] = eventHour.split(':');
        
        eventDateTime.setHours(parseInt(hours), parseInt(minutes), 0);
        const diff = eventDateTime - now;

        if (diff <= 0) return 'Já realizado';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const remainingHours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 0) {
            return `em ${days}d ${remainingHours}h`;
        }
        return `em ${remainingHours}h`;
    }

    static getStatusTag(eventDate, eventHour) {
        const isPast = this.isEventPast(eventDate, eventHour);
        return isPast ? 
            `<span class="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400">
                Já realizado
            </span>` :
            `<span class="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                ${this.getCountdown(eventDate, eventHour)}
            </span>`;
    }

    static filterFutureEvents(eventos) {
        // Remover esta função ou modificá-la para retornar todos os eventos
        return eventos;
    }

    static sortEventosByDate(eventos) {
        return eventos.slice().sort((a, b) => new Date(a.data_evento) - new Date(b.data_evento));
    }

    static initializeGlobalFunctions(eventos) {
        // Define as funções globalmente
        window.toggleVoluntarios = function(button) {
            const eventoId = button.dataset.eventoId;
            const voluntariosDiv = document.getElementById('voluntarios-' + eventoId);
            const isHidden = voluntariosDiv.classList.contains('hidden');
            
            voluntariosDiv.classList.toggle('hidden');
            button.textContent = isHidden ? 'Ocultar voluntários' : 'Ver voluntários';
        };

        window.togglePastEvents = function(button) {
            const pastEventsDiv = document.getElementById('past-events');
            const isHidden = pastEventsDiv.classList.contains('hidden');
            const buttonText = button.querySelector('span');
            const icon = button.querySelector('svg');
            
            pastEventsDiv.classList.toggle('hidden');
            icon.style.transform = isHidden ? 'rotate(180deg)' : '';
            buttonText.innerHTML = isHidden ? 
                `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/></svg>Ocultar eventos anteriores (${eventos.length})` : 
                `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>Mostrar eventos anteriores (${eventos.length})`;
        };
    }

    static renderEventos(eventos) {
        if (!eventos?.length) {
            return `
                <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                    Não há eventos para exibir
                </div>
            `;
        }

        // Separar e ordenar eventos
        const futureEvents = eventos.filter(evento => !this.isEventPast(evento.data_evento, evento.hora));
        const pastEvents = eventos.filter(evento => this.isEventPast(evento.data_evento, evento.hora));

        // Ordenar cada grupo de eventos por data
        futureEvents.sort((a, b) => new Date(a.data_evento) - new Date(b.data_evento));
        pastEvents.sort((a, b) => new Date(b.data_evento) - new Date(a.data_evento)); // Ordem inversa para eventos passados

        return `
            <div class="space-y-6">
                <!-- Eventos Futuros -->
                <div class="space-y-6">
                    ${futureEvents.map(evento => this.renderEvento(evento, false)).join('')}
                </div>
                
                <!-- Divisória e Eventos Passados -->
                ${pastEvents.length > 0 ? `
                    <div class="relative py-6">
                        <div class="absolute inset-0 flex items-center" aria-hidden="true">
                            <div class="w-full border-t border-gray-200 dark:border-zinc-800"></div>
                        </div>
                        <div class="relative flex justify-center">
                            <span class="bg-white dark:bg-black px-3 text-base font-semibold text-gray-500 dark:text-gray-400">
                                Eventos já realizados
                            </span>
                        </div>
                    </div>
                    <div class="space-y-6">
                        ${pastEvents.map(evento => this.renderEvento(evento, true)).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    static renderFutureEvents(eventos) {
        return eventos.map(evento => this.renderEvento(evento, false)).join('');
    }

    static renderPastEvents(eventos) {
        return eventos.map(evento => this.renderEvento(evento, true)).join('');
    }

    static renderEvento(evento, isPast) {
        // Mova a lógica de renderização do evento individual para este método
        // ...existing evento rendering code...
    }
}
