/**
 * Serviço para gerenciar apenas eventos na criação de escalas
 */
class EventosService {
    constructor() {
        this.eventosDisponiveis = [];
        this.eventoSelecionadoId = null;
        this.eventosAdicionados = [];
        this.configurarEventos();
    }

    async configurarEventos() {
        const btnAdicionar = document.getElementById('btn-adicionar-evento');
        if (!btnAdicionar) return;

        btnAdicionar.addEventListener('click', async () => {
            try {
                if (this.eventosDisponiveis.length === 0) {
                    const eventos = await window.apiService.buscarEventos();
                    this.eventosDisponiveis = eventos || [];
                }
                this.adicionarSeletorEventos();
            } catch (error) {
                console.error('Erro ao carregar eventos:', error);
            }
        });
    }

    adicionarSeletorEventos() {
        const eventosContainer = document.getElementById('eventos-container');
        if (!eventosContainer) return;

        const seletorId = `seletor-eventos-${Date.now()}`;
        const html = window.eventosComponentesService.criarSeletorEventos(
            this.eventosDisponiveis,
            seletorId
        );

        const btnAdicionar = document.getElementById('btn-adicionar-evento');
        btnAdicionar.insertAdjacentHTML('beforebegin', html);
        this.configurarEventosLista(seletorId);
    }

    /**
     * Configura eventos de clique para um seletor específico
     */
    configurarEventosLista(seletorId) {
        const listaEventos = document.getElementById(`lista-eventos-${seletorId}`);
        if (!listaEventos) return;

        const itensEvento = listaEventos.querySelectorAll('.evento-item');
        itensEvento.forEach(item => {
            item.addEventListener('click', () => {
                // Remove seleção atual
                itensEvento.forEach(i => i.classList.remove('bg-primary-50', 'dark:bg-primary-900/20', 'border-l-4', 'border-primary-500'));
                
                // Adiciona estilo de seleção
                item.classList.add('bg-primary-50', 'dark:bg-primary-900/20', 'border-l-4', 'border-primary-500');
                
                // Mostra detalhes do evento
                const eventoId = parseInt(item.dataset.eventoId);
                this.mostrarDetalhesEvento(eventoId, seletorId);
            });
        });

        // Seleciona o primeiro evento por padrão
        if (itensEvento.length > 0) {
            const primeiroItem = itensEvento[0];
            primeiroItem.click();
        }
    }

    /**
     * Mostra os detalhes de um evento selecionado
     */
    mostrarDetalhesEvento(eventoId, seletorId) {
        const detalhesContainer = document.getElementById(`detalhes-evento-${seletorId}`);
        if (!detalhesContainer) return;
        
        const evento = this.eventosDisponiveis.find(ev => ev.id === eventoId);
        if (!evento) return;
        
        this.eventoSelecionadoId = eventoId;
        
        detalhesContainer.innerHTML = `${window.eventosComponentesService.criarCardEventoDetalhado(evento)}`;
    }

    /**
     * Adiciona o evento selecionado ao container
     */
    adicionarEventoSelecionado() {
        const evento = this.eventosDisponiveis.find(ev => ev.id === this.eventoSelecionadoId);
        if (!evento) return;

        const eventoEscalaId = `evento-escala-${Date.now()}`;
        this.eventosAdicionados.push({
            id: eventoEscalaId,
            dados: evento
        });

        const btnAdicionar = document.getElementById('btn-adicionar-evento');
        btnAdicionar.insertAdjacentHTML('beforebegin', this.criarEventoNaEscala(evento, eventoEscalaId));
    }

    criarEventoNaEscala(evento, eventoEscalaId) {
        const imagemPath = evento.foto 
            ? `${window.URL_BASE}/assets/img/eventos/${evento.foto}`
            : `${window.URL_BASE}/assets/img/placeholder.jpg`;
            
        return `
        <div id="${eventoEscalaId}" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-4">
            <div class="p-4 bg-gradient-to-r from-primary-600 to-primary-700">
                <div class="flex items-center">
                    <div class="w-12 h-12 bg-white/20 rounded-full overflow-hidden flex-shrink-0">
                        <img src="${imagemPath}" alt="${evento.nome}" class="w-full h-full object-cover">
                    </div>
                    <div class="ml-3">
                        <div class="flex justify-between items-center w-full">
                            <h3 class="text-lg font-semibold text-white">${evento.nome}</h3>
                            <button type="button" 
                                    onclick="window.eventosService.removerEvento('${eventoEscalaId}')" 
                                    class="text-white/80 hover:text-white ml-4">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                        <p class="text-sm text-white/80">${evento.dia_semana || ''} · ${evento.hora ? evento.hora.substring(0, 5) : ''}</p>
                    </div>
                </div>
            </div>
        </div>`;
    }

    /**
     * Remove um evento da escala
     */
    removerEvento(eventoEscalaId) {
        const elemento = document.getElementById(eventoEscalaId);
        if (elemento) {
            elemento.remove();
            this.eventosAdicionados = this.eventosAdicionados.filter(e => e.id !== eventoEscalaId);
        }
    }

    /**
     * Remove o seletor de eventos completo
     */
    removerSeletorEventos(seletorId) {
        const seletor = document.getElementById(seletorId);
        if (seletor) {
            seletor.remove();
        }
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    window.eventosService = new EventosService();
});
