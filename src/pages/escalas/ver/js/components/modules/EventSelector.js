export class EventSelector {
    constructor(escalaData, onEventSelect) {
      
        
        
        this.eventos = escalaData?.data?.eventos || escalaData?.eventos || [];
        
      
        this.onEventSelect = onEventSelect;
        this.selectedEventId = null;
    }

    createUI() {
        return `
            <div id="eventos-step" class="flex-1 overflow-y-auto p-4 hidden">
                <div class="grid gap-4 grid-cols-1">
                    ${this.renderEvents()}
                </div>
            </div>
        `;
    }

    renderEvents() {
        
        
     
        
        if (!Array.isArray(this.eventos) || this.eventos.length === 0) {
            return `
                <div class="text-center py-4 text-gray-500 dark:text-gray-400">
                    Nenhum evento disponível
                </div>
            `;
        }

        return this.eventos.map(evento => {
            const {
                escala_item_id,  // Agora usando escala_item_id
                evento_nome,
                data_evento,
                hora,
                evento_foto
            } = evento;

            // Formatando a data corretamente
            const dataFormatada = this.formatDateTime(data_evento, hora);
            const isSelected = this.selectedEventId === escala_item_id.toString();

            return `
                <div class="p-4 border rounded-lg cursor-pointer event-card group transition-all duration-200
                     ${isSelected ? 'bg-zinc-900 dark:bg-white border-zinc-900 dark:border-white' : 'hover:bg-gray-50 dark:hover:bg-zinc-800/50'}"
                     data-event-id="${evento.evento_id}"
                     data-escala-item-id="${escala_item_id}"> <!-- Adicionado data-escala-item-id -->
                    <div class="flex items-center gap-4">
                        <div class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            ${evento_foto ? `
                                <img src="${window.ENV.URL_BASE}/assets/img/eventos/${evento_foto}" 
                                     alt="${evento_nome}"
                                     class="w-full h-full object-cover">
                            ` : `
                                <div class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-zinc-800 
                                     ${isSelected ? '!bg-zinc-800 dark:!bg-zinc-100' : ''}">
                                    <svg class="w-8 h-8 ${isSelected ? 'text-white dark:text-zinc-900' : 'text-gray-400'}" 
                                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                    </svg>
                                </div>
                            `}
                        </div>
                        <div class="flex-1">
                            <h4 class="font-medium ${isSelected ? 'text-white dark:text-zinc-900' : 'text-gray-900 dark:text-white'}">${evento_nome}</h4>
                            <p class="text-sm ${isSelected ? 'text-gray-300 dark:text-zinc-600' : 'text-gray-500 dark:text-gray-400'}">
                                ${dataFormatada}
                            </p>
                        </div>
                        <div class="flex-shrink-0 w-6 h-6 rounded-full transition-colors
                             ${isSelected ? 'bg-white dark:bg-zinc-900' : 'border-2 border-zinc-300 dark:border-zinc-600'}">
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    formatDateTime(data, hora) {
        try {
            // Garantindo que a data está no formato correto
            const [ano, mes, dia] = data.split('T')[0].split('-');
            const dateStr = `${ano}-${mes}-${dia} ${hora}`;
            const date = new Date(dateStr);

            return new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        } catch (e) {
            return `${data} ${hora}`; // Fallback para formato original
        }
    }

    validate() {
        if (this.selectedEventId) {
            this.onEventSelect(this.selectedEventId);
            return true;
        }
        return false;
    }

    bindEvents(container) {
        const eventCards = container.querySelectorAll('.event-card');
        
        eventCards.forEach(card => {
            card.addEventListener('click', () => {
                const eventId = card.dataset.eventId;
                const escalaItemId = card.dataset.escalaItemId;

                // Remove seleção anterior
                eventCards.forEach(c => {
                    c.classList.remove('bg-zinc-900', 'dark:bg-white', 'border-zinc-900', 'dark:border-white');
                    c.classList.add('hover:bg-gray-50', 'dark:hover:bg-zinc-800/50');
                    
                    // Remove classes de texto selecionado
                    const title = c.querySelector('h4');
                    const subtitle = c.querySelector('p');
                    if (title) {
                        title.classList.remove('text-white', 'dark:text-zinc-900');
                        title.classList.add('text-gray-900', 'dark:text-white');
                    }
                    if (subtitle) {
                        subtitle.classList.remove('text-gray-300', 'dark:text-zinc-600');
                        subtitle.classList.add('text-gray-500', 'dark:text-gray-400');
                    }
                });

                // Aplica nova seleção
                card.classList.remove('hover:bg-gray-50', 'dark:hover:bg-zinc-800/50');
                card.classList.add('bg-zinc-900', 'dark:bg-white', 'border-zinc-900', 'dark:border-white');
                
                // Aplica classes de texto selecionado
                const title = card.querySelector('h4');
                const subtitle = card.querySelector('p');
                if (title) {
                    title.classList.remove('text-gray-900', 'dark:text-white');
                    title.classList.add('text-white', 'dark:text-zinc-900');
                }
                if (subtitle) {
                    subtitle.classList.remove('text-gray-500', 'dark:text-gray-400');
                    subtitle.classList.add('text-gray-300', 'dark:text-zinc-600');
                }
                
                this.selectedEventId = eventId;
                this.selectedEscalaItemId = escalaItemId; // Armazenando escala_item_id
            });
        });
    }

    // Novo método para obter o escala_item_id
    getSelectedEscalaItemId() {
        return this.selectedEscalaItemId;
    }
}
