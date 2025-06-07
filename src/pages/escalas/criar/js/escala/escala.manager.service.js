class EscalaManagerService {
    constructor() {
        this.estado = {
            cabecalho: {
                nome: '',
                tipo: '',
                dataInicio: '',
                dataTermino: ''
            },
            itens: []
        };
        
        this.init();
    }

    init() {
        this.monitorarCamposCabecalho();
        this.observarItensAdicionados();
    }

    monitorarCamposCabecalho() {
        // Monitora mudanças no nome da escala
        const inputNome = document.getElementById('nome-escala');
        inputNome?.addEventListener('input', (e) => {
            this.estado.cabecalho.nome = e.target.value;
        });

        // Monitora mudanças no tipo de escala
        const selectTipo = document.getElementById('tipo-escala');
        selectTipo?.addEventListener('change', (e) => {
            this.estado.cabecalho.tipo = e.target.value;
        });

        // Monitora mudanças nas datas
        const inputDataInicio = document.getElementById('data-inicio');
        const inputDataTermino = document.getElementById('data-termino');

        inputDataInicio?.addEventListener('change', (e) => {
            this.estado.cabecalho.dataInicio = e.target.value;

        });

        inputDataTermino?.addEventListener('change', (e) => {
            this.estado.cabecalho.dataTermino = e.target.value;
        });
    }

    observarItensAdicionados() {
        const observer = new MutationObserver(() => {
            // Atualiza o estado com os itens do itemService
            this.estado.itens = window.itemService.getItens();
        });

        const itensContainer = document.getElementById('itens-container');
        if (itensContainer) {
            observer.observe(itensContainer, { childList: true });
        }
    }

    /**
     * Retorna o estado atual da escala (sem lógica de captura de data do evento)
     */
    getEstadoAtual() {
        const cabecalho = { ...this.estado.cabecalho };
        const itens = (window.itemService.getItens() || []).map(item => {
            // Buscar a data do evento usando o seletor correto
            const eventoId = item.evento?.id;
            const eventoDataInput = document.querySelector(`.evento-datepicker[id^="evento-data-input-${eventoId}"]`);
            const eventoData = eventoDataInput?.value || null;

            // Corrigir a busca dos eventos combinados
            let eventosCombinados = [];
            if (eventoDataInput) {
                // Primeiro tenta encontrar pelo seletorId do input
                const seletorId = eventoDataInput.id.split('-').pop();
                console.log('Debug - Buscando miniCards pelo seletorId:', seletorId);
                
                const miniCards = document.querySelector(`.mini-cards-eventos-combinados[data-seletor-id="seletor-eventos-${seletorId}"]`);
                console.log('Debug - MiniCards encontrado (nova busca):', miniCards?.dataset);

                if (miniCards?.dataset.eventosCombinados) {
                    eventosCombinados = miniCards.dataset.eventosCombinados
                        .split(',')
                        .map(id => parseInt(id))
                        .filter(id => !isNaN(id));
                    console.log('Debug - Eventos combinados encontrados:', eventosCombinados);
                }
            }

            return {
                ...item,
                data_evento: eventoData,
                conjuntos: window.escalaService.getConjuntosDoItem(item.id) || [],
                eventos_combinados: eventosCombinados
            };
        });
        
        console.log('Debug - Estado final gerado:', { cabecalho, itens });
        return { cabecalho, itens };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.escalaManagerService = new EscalaManagerService();
});

function getImageUrl(item, tipo = 'evento') {
    const placeholder = `${window.APP_CONFIG.baseUrl}/assets/img/placeholder.jpg`;
    
    if (!item || !item.foto) return placeholder;
    
    if (item.foto.startsWith('http')) return item.foto;
    
    try {
        if (tipo === 'evento') {
            return `${window.APP_CONFIG.baseUrl}/assets/img/eventos/${item.foto}`;
        } else {
            return item.foto;
        }
    } catch (error) {
        console.warn('Erro ao montar URL da imagem:', error);
        return placeholder;
    }
}
