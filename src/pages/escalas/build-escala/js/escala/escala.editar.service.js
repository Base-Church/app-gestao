/**
 * Serviço para carregar e popular a escala para edição
 */
class EscalaEditarService {
    constructor() {
        this.escalaCarregada = false;
        // Construtor vazio - inicialização será feita via método estático
    }

    static async inicializar() {
        const service = new EscalaEditarService();
        const escalaId = service.getEscalaIdFromUrl();
        if (escalaId) {
            await service.carregarEscala(escalaId);
        }
        return service;
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
            // Usa o endpoint get-by-id.php que é específico para buscar uma escala
            const url = `${window.APP_CONFIG.baseUrl}/src/services/api/escalas/get-by-id.php?escala_id=${escalaId}&organizacao_id=${window.USER.organizacao_id}&ministerio_id=${window.USER.ministerio_atual}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ao buscar escala: ${response.status} - ${errorText}`);
            }
            const result = await response.json();
            console.log('Dados da escala carregados:', result);
            
            // Verifica diferentes formatos de resposta
            let escala, eventos;
            if (result.code === 200 && result.data) {
                escala = result.data.escala;
                eventos = result.data.eventos;
            } else if (result.data && result.data.escala) {
                escala = result.data.escala;
                eventos = result.data.eventos;
            } else if (result.escala) {
                escala = result.escala;
                eventos = result.eventos;
            } else {
                throw new Error('Formato de resposta não reconhecido');
            }
            
            if (escala) {
                this.popularCampos({ escala, eventos });
            } else {
                throw new Error('Dados da escala não encontrados');
            }
        } catch (error) {
            console.error('Erro ao carregar escala:', error);
            alert(`Erro ao carregar escala para edição: ${error.message}`);
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
        
        // Limpa estado dos itens
        if (window.itemService && window.itemService.getItens) {
            const itens = window.itemService.getItens();
            itens.length = 0;
        }

        // Verifica se há eventos para processar
        if (!data.eventos || !Array.isArray(data.eventos)) {
            console.warn('Nenhum evento encontrado na escala');
            return;
        }

        // Processa cada evento da escala
        for (const eventoData of data.eventos) {
            try {
                // 1. Cria um ID único para o item
                const itemId = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                
                // 2. Adiciona o item ao itemService primeiro
                const novoItem = {
                    id: itemId,
                    evento: {
                        id: eventoData.evento_id,
                        nome: eventoData.evento_nome,
                        dia_semana: eventoData.dia_semana,
                        hora: eventoData.hora,
                        foto: eventoData.evento_foto
                    }
                };
                window.itemService.adicionarItem(novoItem);
                
                // 3. Cria o HTML do item no DOM
                const itensContainer = document.getElementById('itens-container');
                if (itensContainer && window.itemComponentesService) {
                    const html = window.itemComponentesService.criarItemCard(itemId);
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = html;
                    const itemElement = tempDiv.firstElementChild;
                    itensContainer.appendChild(itemElement);
                    
                    // Aguarda um pouco para o DOM ser atualizado
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                // 4. Simula a seleção do evento para ativar todo o fluxo
                const seletorId = `eventos-seletor-container-${itemId}`;
                // Cria um seletor temporário para simular a seleção
                const seletorTempId = `seletor-eventos-temp-${Date.now()}`;
                
                const container = document.getElementById(seletorId);
                if (container && window.eventosComponentesService) {
                    // Cria apenas o container de detalhes com o card do evento
                    container.innerHTML = `
                        <div id="detalhes-evento-${seletorTempId}">
                            ${window.eventosComponentesService.criarCardEventoDetalhado(novoItem.evento, seletorTempId)}
                        </div>
                    `;
                    
                    // Define a data do evento
                    if (eventoData.data_evento) {
                        const dataInput = container.querySelector('.evento-datepicker');
                        if (dataInput) {
                            // Converte de YYYY-MM-DD para DD/MM/YYYY
                            const dataISO = eventoData.data_evento.slice(0,10);
                            const [ano, mes, dia] = dataISO.split('-');
                            dataInput.value = `${dia}/${mes}/${ano}`;
                        }
                    } else {
                        // Se não tem data_evento, ainda assim processa o evento
                        console.log('Evento sem data específica:', eventoData.evento_nome);
                    }
                    
                    // Configura os botões que já existem no card
                    setTimeout(() => {
                        const btnTrocar = container.querySelector('.btn-trocar-evento');
                        if (btnTrocar) {
                            btnTrocar.onclick = (e) => {
                                e.stopPropagation();
                                // Abre o seletor de eventos normalmente
                                window.eventosService.abrirSeletorEventos(
                                    seletorId,
                                    (eventoSelecionado, seletorIdNovo) => {
                                        // Atualiza o evento do item
                                        novoItem.evento = eventoSelecionado;
                                        // Renderiza conjuntos
                                        if (window.itemManagerService && window.itemManagerService.renderizarConjuntos) {
                                            window.itemManagerService.renderizarConjuntos(itemId, seletorIdNovo);
                                        }
                                    }
                                );
                            };
                        }
                        
                        // Configura o botão combinar eventos se existir
                        const btnCombinar = container.querySelector('.btn-combinar-eventos');
                        if (btnCombinar && window.eventosService && window.eventosService.combinarEventos) {
                            btnCombinar.onclick = (e) => {
                                e.stopPropagation();
                                window.eventosService.combinarEventos(seletorTempId, novoItem.evento.id);
                            };
                        }
                    }, 50);
                }

                // 5. Limpa conjuntos existentes e adiciona os novos
                const conjuntos = window.escalaService.getConjuntosDoItem(itemId);
                if (conjuntos) conjuntos.length = 0;
                
                if (eventoData.atividades && eventoData.atividades.length > 0) {
                    for (const atv of eventoData.atividades) {
                        const conjunto = {
                            atividade: {
                                id: atv.atividade_id,
                                nome: atv.atividade_nome,
                                descricao: atv.atividade_descricao || '',
                                img: atv.atividade_foto
                                    ? `${window.APP_CONFIG.baseUrl}/assets/img/atividades/${atv.atividade_foto}`
                                    : `${window.APP_CONFIG.baseUrl}/assets/img/placeholder.jpg`
                            },
                            voluntario: atv.voluntario_id ? {
                                id: atv.voluntario_id,
                                nome: atv.voluntario_nome,
                                img: atv.voluntario_foto 
                                    ? (atv.voluntario_foto.startsWith('http') 
                                        ? atv.voluntario_foto 
                                        : `${window.APP_CONFIG.baseUrl}/assets/img/voluntarios/${atv.voluntario_foto}`)
                                    : `${window.APP_CONFIG.baseUrl}/assets/img/placeholder.jpg`
                            } : null
                        };
                        
                        window.escalaService.adicionarConjuntoAoItem(itemId, conjunto);
                    }
                }

                // 6. Adiciona o item ao escalaService para gerenciar conjuntos
                window.escalaService.adicionarItem(novoItem);
                
                // 7. Renderiza os conjuntos na UI
                if (window.itemManagerService && window.itemManagerService.renderizarConjuntos) {
                    // Aguarda um pouco para garantir que o DOM foi atualizado
                    setTimeout(() => {
                        window.itemManagerService.renderizarConjuntos(itemId, seletorTempId);
                    }, 100);
                }

                // 8. Configura o select de modelos
                const itemElement = document.getElementById(itemId);
                if (itemElement) {
                    const selectModelo = itemElement.querySelector('.select-modelo');
                    if (selectModelo && window.modelosService) {
                        // Popula o select de modelos
                        try {
                            const modelos = await window.modelosService.buscarModelos(window.USER.ministerio_atual);
                            modelos.forEach(modelo => {
                                const opt = document.createElement('option');
                                opt.value = modelo.id;
                                opt.textContent = modelo.nome;
                                selectModelo.appendChild(opt);
                            });
                            
                            // Habilita o select após carregar os dados
                            selectModelo.disabled = false;
                            
                            // Configura o evento de mudança do modelo
                            selectModelo.addEventListener('change', async (e) => {
                                const modeloId = e.target.value;
                                if (!modeloId) return;
                                const modelo = await window.modelosService.getModeloById(modeloId);
                                if (!modelo || !modelo.atividades) return;
                                // Limpa conjuntos existentes
                                window.escalaService.getConjuntosDoItem(itemId).length = 0;
                                // Para cada atividade, adiciona um conjunto
                                for (const atividadeId of modelo.atividades) {
                                    const atividade = await window.modelosService.buscarAtividadePorId(atividadeId);
                                    window.escalaService.adicionarConjuntoAoItem(itemId, { atividade, voluntario: null });
                                }
                                // Atualiza UI
                                if (window.itemManagerService && window.itemManagerService.renderizarConjuntos) {
                                    // Aguarda um pouco para garantir que os conjuntos foram adicionados
                                    setTimeout(() => {
                                        window.itemManagerService.renderizarConjuntos(itemId, seletorTempId);
                                    }, 50);
                                }
                            });
                        } catch (error) {
                            console.error('Erro ao carregar modelos:', error);
                        }
                    }
                    
                    // Configura botão de remover item
                    const btnRemover = itemElement.querySelector('.btn-remover-item');
                    if (btnRemover) {
                        btnRemover.addEventListener('click', () => {
                            window.itemService.removerItem(itemId);
                            itemElement.remove();
                        });
                    }
                }
                
            } catch (error) {
                console.error('Erro ao processar evento:', eventoData, error);
            }
        }
        
        // Atualiza o botão para "Salvar" no modo edição
        const botaoSalvar = document.querySelector('[data-action="salvar-escala"]');
        if (botaoSalvar) {
            botaoSalvar.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Salvar
            `;
        }
        
        this.escalaCarregada = true;
        console.log('Escala carregada com sucesso para edição');
    }

    async atualizar(escalaId, estado) {
        try {
            const payload = {
                id: escalaId,
                nome: estado.cabecalho.nome,
                tipo: estado.cabecalho.tipo,
                data_inicio: estado.cabecalho.dataInicio,
                data_fim: estado.cabecalho.dataTermino,
                eventos: estado.itens || []
            };

            console.log('Payload para atualização:', payload);

            const response = await fetch(`${window.APP_CONFIG.baseUrl}/src/services/api/escalas/put-v2.php`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'MINISTERIO-ID': window.USER.ministerio_atual,
                    'ORGANIZACAO-ID': window.USER.organizacao_id
                },
                body: JSON.stringify(payload)
            });

            const rawResponse = await response.text();
            console.log('Resposta bruta da API:', rawResponse);

            let result;
            try {
                result = JSON.parse(rawResponse);
            } catch (parseError) {
                console.error('Erro ao fazer parse da resposta:', parseError);
                throw new Error(`Resposta inválida da API: ${rawResponse}`);
            }

            if (!response.ok) {
                throw new Error(`Erro HTTP ${response.status}: ${result.error || response.statusText}`);
            }

            return result;
        } catch (error) {
            console.error('Erro ao atualizar escala:', error);
            throw error;
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

// Disponibiliza a classe globalmente
window.EscalaEditarService = EscalaEditarService;
