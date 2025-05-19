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
            const eventoDataInput = document.querySelector(`.evento-datepicker[id^="evento-data-input-${item.evento?.id}"]`);
            const eventoData = eventoDataInput?.value || null;

            // Recupera eventos combinados do DOM (mini-cards)
            let eventosCombinados = [];
            const seletorId = eventoDataInput?.id?.split('-').slice(-1)[0];
            if (seletorId) {
                const miniCards = document.querySelector(`.mini-cards-eventos-combinados[data-seletor-id="${seletorId}"]`);
                if (miniCards && miniCards.dataset.eventosCombinados) {
                    eventosCombinados = miniCards.dataset.eventosCombinados
                        .split(',')
                        .map(id => parseInt(id, 10))
                        .filter(id => Number.isInteger(id) && !isNaN(id));
                }
            }

            const conjuntos = (window.escalaService.getConjuntosDoItem(item.id) || []).map(conjunto => ({
                atividade: conjunto.atividade ? { ...conjunto.atividade } : null,
                voluntario: conjunto.voluntario ? { ...conjunto.voluntario } : null
            }));

            return {
                ...item,
                data_evento: eventoData,
                conjuntos,
                eventos_combinados: eventosCombinados
            };
        });
        return {
            cabecalho,
            itens
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.escalaManagerService = new EscalaManagerService();
});
