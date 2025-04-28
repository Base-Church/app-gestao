document.addEventListener('DOMContentLoaded', () => {
    

    // Função para abrir/fechar offcanvas de voluntários
    function toggleVoluntariosOffcanvas(atividadeElement) {
        const voluntariosOffcanvas = document.getElementById('voluntariosOffcanvas');
        if (voluntariosOffcanvas) {
            voluntariosOffcanvas.classList.remove('translate-x-full');
            voluntariosOffcanvas.classList.add('translate-x-0');

            // Se estiver abrindo o offcanvas, carregar voluntários
            // console.log('Chamando carregarVoluntarios para o container:', atividadeElement);
            carregarVoluntarios(atividadeElement);
        }
    }

    // Adicionar função global para fechar o offcanvas
    window.toggleVoluntariosOffcanvas = function() {
        const voluntariosOffcanvas = document.getElementById('voluntariosOffcanvas');
        if (voluntariosOffcanvas) {
            voluntariosOffcanvas.classList.remove('translate-x-0');
            voluntariosOffcanvas.classList.add('translate-x-full');
        }
    }

    // Inicializar gerenciador de eventos
    const eventosManager = new DynamicFieldsManager({
        containerSelector: '#eventos-container',
        addButtonSelector: '#btn-adicionar-evento',
        templateSelector: '#evento-template',
        onInitField: async (eventoElement, eventoUniqueId) => {
            console.log('📋 Inicializando evento:', eventoUniqueId);
            
            // Carregar modelos primeiro
            try {
                console.group('🔄 Carregando Modelos');
                // Garantir que temos o ministerio_id
                const ministerio_id = window.USER?.ministerio_atual || 
                                    localStorage.getItem('ministerio_atual');
                
                if (!ministerio_id) {
                    throw new Error('Ministério não definido');
                }

                const modelos = await carregarModelos(ministerio_id);
                console.log('✅ Modelos carregados:', modelos);
                
                // Mover seletor para o header do evento
                const headerActions = eventoElement.querySelector('.dynamic-field-header');
                adicionarSeletorModelo(eventoElement, headerActions);
                
                console.groupEnd();
            } catch (error) {
                console.error('❌ Erro ao carregar modelos:', error);
            }

            // Inicializar estado do collapse
            const toggleBtn = eventoElement.querySelector('.toggle-evento');
            const eventoContent = eventoElement.querySelector('.evento-content');
            const eventoSummary = eventoElement.querySelector('.evento-summary');
            
            // Função para atualizar o resumo
            const atualizarResumo = () => {
                const eventoSeletor = eventoElement.querySelector('.evento-selector');
                const eventoNome = eventoSeletor.querySelector('.text-gray-900')?.textContent || 'Nenhum evento selecionado';
                const eventoDiaHora = eventoSeletor.querySelector('.text-xs')?.textContent;
                const atividadesCount = eventoElement.querySelectorAll('.atividades-container .dynamic-field').length;
                
                // Atualizar texto do resumo
                const summaryText = eventoElement.querySelector('.evento-summary .text-gray-700');
                if (summaryText) {
                    summaryText.textContent = eventoDiaHora ? `${eventoNome} (${eventoDiaHora})` : eventoNome;
                }
                
                // Atualizar contagem de voluntários
                const countElement = eventoElement.querySelector('.atividades-count');
                if (countElement) countElement.textContent = atividadesCount;

                // Salvar estado expandido/colapsado
                const content = eventoElement.querySelector('.evento-content');
                const isExpanded = !content.classList.contains('hidden');
                eventoElement.setAttribute('data-expanded', isExpanded);
            };

            // Toggle collapse
            toggleBtn.addEventListener('click', () => {
                eventoContent.classList.toggle('hidden');
                toggleBtn.querySelector('svg').classList.toggle('rotate-180');
                atualizarResumo();
            });

            // Remover colapsar por padrão - sanfona fica aberta
            // eventoContent.classList.add('hidden');

            // console.log('Inicializando campo de evento:', { eventoElement, eventoUniqueId });

            // Adicionar listener para o seletor de evento
            const eventoSelector = eventoElement.querySelector('.evento-selector .cursor-pointer');
            if (eventoSelector) {
                eventoSelector.addEventListener('click', (event) => {
                    // console.log('Evento selector clicado:', event);
                    const floatingSelection = eventoSelector.nextElementSibling;
                    
                    if (floatingSelection && floatingSelection.classList.contains('floating-selection')) {
                        floatingSelection.classList.toggle('hidden');
                        
                        if (!floatingSelection.classList.contains('hidden')) {
                            // console.log('Chamando carregarEventos para o container:', eventoElement);
                            carregarEventos(eventoElement);
                        }
                    }
                });
                
                // Observar mudanças no nome do evento
                const observer = new MutationObserver(() => atualizarResumo());
                observer.observe(eventoSelector, {
                    subtree: true,
                    childList: true,
                    characterData: true,
                    attributes: true
                });
            }

            // Inicializar gerenciador de atividades para cada evento
            const atividadesContainer = eventoElement.querySelector('.atividades-container');
            const btnAdicionarAtividade = eventoElement.querySelector('.btn-adicionar-atividade');

            if (atividadesContainer && btnAdicionarAtividade) {
                const atividadesManager = new DynamicFieldsManager({
                    containerSelector: atividadesContainer.querySelector('#atividades-lista-container'),
                    addButtonSelector: btnAdicionarAtividade,
                    templateSelector: '#atividade-template',
                    onInitField: (atividadeElement, atividadeUniqueId) => {
                        // console.log('Inicializando campo de atividade:', { atividadeElement, atividadeUniqueId });

                        // Adicionar ID único ao elemento
                        atividadeElement.setAttribute('data-atividade-id', atividadeUniqueId);

                        // Adicionar listener para o seletor de atividade
                        const atividadeSelector = atividadeElement.querySelector('.atividade-selector .cursor-pointer');
                        if (atividadeSelector) {
                            atividadeSelector.addEventListener('click', (event) => {
                                // console.log('Atividade selector clicado:', event);
                                const floatingSelection = atividadeSelector.nextElementSibling;
                                
                                if (floatingSelection && floatingSelection.classList.contains('floating-selection')) {
                                    floatingSelection.classList.toggle('hidden');
                                    
                                    if (!floatingSelection.classList.contains('hidden')) {
                                        // console.log('Chamando carregarAtividades para o container:', atividadeElement);
                                        carregarAtividades(atividadeElement);
                                    }
                                }
                            });
                        }

                        // Adicionar listener para o seletor de voluntários
                        const voluntarioToggleBtn = atividadeElement.querySelector('.voluntario-toggle-btn');
                        if (voluntarioToggleBtn) {
                            voluntarioToggleBtn.addEventListener('click', (event) => {
                                event.stopPropagation();
                                
                                const atividadeId = atividadeElement.querySelector('input[name="atividade_id[]"]')?.value;
                                if (!atividadeId) {
                                    alert('Por favor, selecione uma atividade primeiro');
                                    return;
                                }
                                
                                toggleVoluntariosOffcanvas(atividadeElement);
                            });
                        }
                    }
                });
            }

            // Observar mudanças nas atividades para atualizar o resumo
            const observer = new MutationObserver(() => atualizarResumo());
            observer.observe(eventoElement.querySelector('.atividades-container'), {
                childList: true,
                subtree: true
            });

            // Adicionar listener para mudanças na data
            const dataEventoInput = eventoElement.querySelector('input[name="data_evento[]"]');
            if (dataEventoInput) {
                dataEventoInput.addEventListener('change', atualizarResumo);
            }
        },
        onRemoveField: (fieldElement) => {
            // Confirmação antes de remover
            if (confirm('Tem certeza que deseja remover este evento e todas as suas atividades?')) {
                return true;
            }
            return false;
        }
    });

    // Evento de submissão do formulário
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            // Referências aos elementos do botão
            const submitButton = form.querySelector('button[type="submit"]');
            const submitText = submitButton.querySelector('span');
            const submitSpinner = submitButton.querySelector('#spinner-submit');
            
            try {
                // Desabilitar botão e mostrar spinner
                submitButton.disabled = true;
                submitText.textContent = 'Salvando...';
                submitSpinner.classList.remove('hidden');
                
                const dadosEscala = {
                    nome: form.querySelector('input[type="text"]').value,
                    tipo: form.querySelector('select').value,
                    data_inicio: form.querySelectorAll('input[type="date"]')[0].value,
                    data_fim: form.querySelectorAll('input[type="date"]')[1].value,
                    eventos: []
                };

                // Validações básicas
                if (!dadosEscala.nome || !dadosEscala.tipo || !dadosEscala.data_inicio || !dadosEscala.data_fim) {
                    throw new Error('Preencha todos os campos obrigatórios');
                }

                // Capturar eventos - apenas os containers de eventos principais
                const eventosContainer = document.getElementById('eventos-container');
                if (eventosContainer) {
                    // Pegar apenas os containers de eventos (filhos diretos)
                    const eventoElements = eventosContainer.querySelectorAll(':scope > .dynamic-field');
                    
                    dadosEscala.eventos = Array.from(eventoElements).map(eventoElement => {
                        // Pegar dados do evento
                        const eventoId = eventoElement.querySelector('.evento-selector input[name="evento_id[]"]')?.value;
                        const dataEvento = eventoElement.querySelector('input[name="data_evento[]"]')?.value;

                        if (!eventoId || !dataEvento) {
                            throw new Error('Preencha todos os campos do evento');
                        }

                        // Pegar atividades dentro deste evento específico
                        const atividadesContainer = eventoElement.querySelector('#atividades-lista-container');
                        const atividades = Array.from(atividadesContainer?.querySelectorAll('.dynamic-field') || [])
                            .map(atividadeElement => {
                                const atividadeId = atividadeElement.querySelector('.atividade-selector input[name="atividade_id[]"]')?.value;
                                const voluntarioId = atividadeElement.querySelector('.voluntario-selector input[name="voluntario_id[]"]')?.value;

                                if (!atividadeId || !voluntarioId) {
                                    throw new Error('Preencha todos os campos da atividade');
                                }

                                return {
                                    id: atividadeId,
                                    voluntario_id: voluntarioId
                                };
                            });

                        return {
                            id: eventoId,
                            data: dataEvento,
                            atividades
                        };
                    });
                }

             
                const resultado = await EscalaService.criar(dadosEscala);
                
                if (resultado.code === 200) {
                    alert('Escala criada com sucesso!');
                    window.location.href = `${URL_BASE}/escalas`;
                }

            } catch (error) {
                console.error('Erro detalhado:', error);
                alert(error.message || 'Erro ao criar escala');
            } finally {
                // Restaurar estado original do botão
                submitButton.disabled = false;
                submitText.textContent = 'Salvar Escala';
                submitSpinner.classList.add('hidden');
            }
        });
    }

    // Toggle de seletores de eventos e atividades
    document.addEventListener('click', (event) => {
        const eventoSelector = event.target.closest('.evento-selector .cursor-pointer');
        const atividadeSelector = event.target.closest('.atividade-selector .cursor-pointer');
        const voluntarioSelector = event.target.closest('.voluntario-selector button');

        if (eventoSelector) {
            const floatingSelection = eventoSelector.nextElementSibling;
            if (floatingSelection) {
                floatingSelection.classList.toggle('hidden');
            }
        }

        if (atividadeSelector) {
            const floatingSelection = atividadeSelector.nextElementSibling;
            if (floatingSelection) {
                floatingSelection.classList.toggle('hidden');
            }
        }

        if (voluntarioSelector) {
            const voluntariosOffcanvas = document.getElementById('voluntariosOffcanvas');
            if (voluntariosOffcanvas) {
                voluntariosOffcanvas.classList.toggle('translate-x-full');
            }
        }
    });
});

// ...existing code...

async function initializeEvento(eventoElement) {
    // ...existing code...
    
    // Carregar modelos e adicionar seletor
    try {
        await carregarModelos(window.USER.ministerio_atual);
        adicionarSeletorModelo(eventoElement);
    } catch (error) {
        console.error('Erro ao carregar modelos:', error);
    }
    
    // ...existing code...
}

// ...existing code...