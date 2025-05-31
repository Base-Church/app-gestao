/**
 * Serviço para carregar e popular a escala para edição
 */
class EscalaEditarService {
    constructor() {
        this.init();
    }

    init() {
        const escalaId = this.getEscalaIdFromUrl();
        if (escalaId) {
            this.carregarEscala(escalaId);
        }
    }

    getEscalaIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    async carregarEscala(escalaId) {
        try {
            // Monta a URL conforme o endpoint espera: /get.php/239?organizacao_id=1
            const url = `${window.URL_BASE}/src/services/api/escalas/get.php/${escalaId}?organizacao_id=${window.ORGANIZACAO_ID}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Erro ao buscar escala');
            const result = await response.json();
            if (result?.data?.escala) {
                this.popularCampos(result.data);
            }
        } catch (error) {
            alert('Erro ao carregar escala para edição');
            console.error(error);
        }
    }

    async popularCampos(data) {
        // Preenche cabeçalho
        const escala = data.escala;
        document.getElementById('nome-escala').value = escala.nome || '';
        document.getElementById('tipo-escala').value = escala.tipo || '';
        document.getElementById('data-inicio').value = escala.data_inicio?.slice(0,10) || '';
        document.getElementById('data-termino').value = escala.data_fim?.slice(0,10) || '';

        // Atualiza estado do escalaManagerService
        if (window.escalaManagerService) {
            window.escalaManagerService.estado.cabecalho = {
                nome: escala.nome || '',
                tipo: escala.tipo || '',
                dataInicio: escala.data_inicio?.slice(0,10) || '',
                dataTermino: escala.data_fim?.slice(0,10) || ''
            };
        }

        // Aguarda serviços necessários estarem disponíveis
        await this.aguardarServicosDisponiveis();

        // Limpa itens existentes
        const itensContainer = document.getElementById('itens-container');
        if (itensContainer) itensContainer.innerHTML = '';

        // Processa cada evento da escala
        for (const eventoData of data.eventos) {
            // 1. Cria o item via fluxo padrão
            await window.itemManagerService.adicionarNovoItem();

            // 2. Pega o último item criado
            const itens = window.itemService.getItens();
            const novoItem = itens[itens.length - 1];
            if (!novoItem) continue;
            const itemId = novoItem.id;

            // 3. Atualiza o evento do item
            novoItem.evento = {
                id: eventoData.evento_id,
                nome: eventoData.evento_nome,
                dia_semana: eventoData.dia_semana,
                hora: eventoData.hora,
                foto: eventoData.evento_foto
            };

            // 4. Atualiza a data do evento no input
            const seletorId = `eventos-seletor-container-${itemId}`;
            const container = document.getElementById(seletorId);
            if (container) {
                container.innerHTML = window.eventosComponentesService.criarCardEventoDetalhado(
                    novoItem.evento,
                    seletorId
                );
                if (eventoData.data_evento) {
                    const dataInput = container.querySelector('.evento-datepicker');
                    if (dataInput) {
                        dataInput.value = eventoData.data_evento.slice(0,10);
                    }
                }
            }

            // 5. Adiciona os conjuntos (atividade + voluntário)
            const conjuntos = window.escalaService.getConjuntosDoItem(itemId);
            if (conjuntos) conjuntos.length = 0;
            if (eventoData.atividades?.length) {
                for (const atv of eventoData.atividades) {
                    window.escalaService.adicionarConjuntoAoItem(itemId, {
                        atividade: {
                            id: atv.atividade_id,
                            nome: atv.atividade_nome,
                            img: atv.atividade_foto
                                ? `${window.URL_BASE}/assets/img/atividades/${atv.atividade_foto}`
                                : `${window.URL_BASE}/assets/img/placeholder.jpg`
                        },
                        voluntario: atv.voluntario_id ? {
                            id: atv.voluntario_id,
                            nome: atv.voluntario_nome,
                            img: atv.voluntario_foto || `${window.URL_BASE}/assets/img/placeholder.jpg`
                        } : null
                    });
                }
            }

            // 6. Renderiza os conjuntos na UI
            window.itemManagerService.renderizarConjuntos(itemId, seletorId);

            // 7. Habilita o select de modelos
            const selectModelo = document.querySelector(`#${itemId} .select-modelo`);
            if (selectModelo) selectModelo.disabled = false;
        }
    }

    async aguardarServicosDisponiveis() {
        const maxTentativas = 10;
        const intervalo = 100;
        
        for (let i = 0; i < maxTentativas; i++) {
            if (window.itemService && 
                window.itemManagerService && 
                window.escalaService && 
                window.eventosService) {
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, intervalo));
        }
        throw new Error('Serviços necessários não estão disponíveis');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.escalaEditarService = new EscalaEditarService();
});
