export class MusicLayout {
    constructor() {
        this.repertorios = null;
        this.repertoriosMapped = {};
    }

    async render(escalaData) {
        try {
            // Log apenas dos dados essenciais da API
            console.log('=== Dados da Escala ===', {
                id: escalaData.escala.id,
                eventos: escalaData.data.eventos
            });
            
            const response = await RepertorioService.getByEscala(escalaData.escala.id);
            console.log('=== Repertórios Encontrados ===', response.original.data);
            
            // O resto do código permanece igual, mas sem console.logs
            escalaData.data.eventos.forEach(evento => {
                const container = document.querySelector(`[data-escala-item-id="${evento.escala_item_id}"]`);
                if (!container) {
                    return;
                }

                const temRepertorio = response.mapped[evento.escala_item_id];

                container.querySelector('.absolute.top-2.right-2')?.remove();

                const iconContainer = document.createElement('div');
                iconContainer.className = 'absolute top-2 right-2';
                iconContainer.innerHTML = this.createMusicIcon(!!temRepertorio);

                iconContainer.querySelector('.music-icon')?.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handleMusicClick({
                        escala_id: escalaData.escala.id,
                        escala_item_id: evento.escala_item_id,
                        evento_id: evento.evento_id,
                        repertorio: temRepertorio
                    });
                });

                container.appendChild(iconContainer);
            });

        } catch (error) {
            console.error('Erro ao renderizar:', error);
        }
    }

    createMusicIcon(hasRepertorio) {
        return `
            <button class="music-icon p-1.5 rounded-lg ${hasRepertorio ? 'text-primary-600 bg-primary-50' : 'text-gray-400 hover:text-primary-600 hover:bg-primary-50'} transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                </svg>
            </button>
        `;
    }

    handleMusicClick(data) {
        console.log('Dados para o modal:', data);
        const modal = new RepertorioModal({
            escala: { id: data.escala_id },
            evento: {
                escala_item_id: data.escala_item_id,
                evento_id: data.evento_id
            },
            repertorio: data.repertorio
        });
        modal.show();
    }
}
