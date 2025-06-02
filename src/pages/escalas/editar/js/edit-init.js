function getImageUrl(tipo, foto) {
    if (!foto) return `${URL_BASE}/assets/img/placeholder.jpg`;
    
    // Se a foto já for uma URL completa (começa com http/https)
    if (foto.startsWith('http')) {
        return foto;
    }
    
    // Caso contrário, construir URL baseada no tipo
    switch (tipo) {
        case 'evento':
            return `${URL_BASE}/assets/img/eventos/${foto}`;
        case 'atividade':
            return `${URL_BASE}/assets/img/atividades/${foto}`;
        default:
            return `${URL_BASE}/assets/img/placeholder.jpg`;
    }
}

function getTurno(hora) {
    const horaNumerica = parseInt(hora.split(':')[0]);
    if (horaNumerica >= 0 && horaNumerica < 6) return 'Madrugada';
    if (horaNumerica >= 6 && horaNumerica < 12) return 'Manhã';
    if (horaNumerica >= 12 && horaNumerica < 18) return 'Tarde';
    return 'Noite';
}

function formatarHora(hora) {
    return hora.split(':').slice(0, 2).join(':');
}

document.addEventListener('DOMContentLoaded', async () => {
    // Adicionar indicador de carregamento
    const loadingIndicator = document.createElement('div');
    loadingIndicator.innerHTML = `
        <div id="loading-edit" class="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg flex items-center space-x-3 z-50">
            <div class="animate-spin rounded-full h-5 w-5 border-2 border-primary-500 border-t-transparent"></div>
            <span class="text-sm text-gray-600 dark:text-gray-300">Carregando dados da escala...</span>
        </div>
    `;
    document.body.appendChild(loadingIndicator);

    // Pegar ID da URL de forma mais robusta
    const urlParams = new URLSearchParams(window.location.search);
    let escalaId = urlParams.get('id');
    
    // Tentar extrair ID de outras formas possíveis da URL
    if (!escalaId) {
        // Caso a URL esteja como ?=id106
        const match = window.location.search.match(/[?&]=id(\d+)/);
        if (match) {
            escalaId = match[1];
        }
    }

    if (!escalaId) {
        alert('ID da escala não fornecido');
        window.location.href = `${URL_BASE}/src/pages/escalas/`;
        return;
    }

    try {
        const resultado = await EscalaEditService.buscarEscala(escalaId);
        
        if (resultado.code === 200) {
            const { escala, eventos } = resultado.data;

            // Definir MINISTERIO_ATUAL com o valor da escala
            window.MINISTERIO_ATUAL = escala.ministerio_id;

            // Preencher dados do cabeçalho
            document.querySelector('input[type="text"]').value = escala.nome;
            
            // Garantir que o select correto (Tipo) receba o valor correto
            // Busca pelo label "Tipo" e seleciona o select correspondente
            const tipoLabel = Array.from(document.querySelectorAll('label')).find(label => label.textContent.trim().toLowerCase() === 'tipo');
            let tipoSelect = null;
            if (tipoLabel) {
                // O select está no mesmo grid, logo após o label
                tipoSelect = tipoLabel.parentElement.querySelector('select');
            }
            // Fallback: se não encontrar pelo label, pega o primeiro select do formulário
            if (!tipoSelect) {
                tipoSelect = document.querySelector('form select');
            }
            // Verificar se o valor existe nas opções antes de atribuir
            if (tipoSelect) {
                const tipoOptions = Array.from(tipoSelect.options).map(opt => opt.value);
                if (tipoOptions.includes(escala.tipo)) {
                    tipoSelect.value = escala.tipo;
                } else {
                    // Opcional: Adicionar o valor como nova opção
                    const newOption = new Option(escala.tipo, escala.tipo);
                    tipoSelect.add(newOption);
                    tipoSelect.value = escala.tipo;
                }
            } else {
                console.warn('Campo select de tipo não encontrado.');
            }

            document.querySelectorAll('input[type="date"]')[0].value = escala.data_inicio.split('T')[0];
            document.querySelectorAll('input[type="date"]')[1].value = escala.data_fim.split('T')[0];

            // Para cada evento
            for (const evento of eventos) {
                // Simular clique no botão de adicionar evento
                document.getElementById('btn-adicionar-evento').click();

                // Aguardar a criação do evento no DOM
                await new Promise(resolve => setTimeout(resolve, 300));

                // Encontrar o container do último evento adicionado
                const eventosContainer = document.getElementById('eventos-container');
                const eventosElements = eventosContainer.querySelectorAll('.dynamic-field');
                const ultimoEvento = eventosElements[eventosElements.length - 1];

                if (ultimoEvento) {
                    const eventoSelector = ultimoEvento.querySelector('.evento-selector .cursor-pointer');
                    if (eventoSelector) {
                        const turno = getTurno(evento.hora);
                        const horaFormatada = formatarHora(evento.hora);
                        
                        // Atualizar seletor do evento
                        eventoSelector.innerHTML = `
                            <div class="flex items-center space-x-3">
                                <img src="${getImageUrl('evento', evento.evento_foto)}" class="w-12 h-12 rounded-full object-cover">
                                <div>
                                    <span class="text-gray-900 dark:text-white">${evento.evento_nome}</span>
                                    <p class="text-xs text-gray-500">${evento.dia_semana} - ${horaFormatada} • <span class="text-primary-600">${turno}</span></p>
                                    <input type="hidden" name="evento_id[]" value="${evento.evento_id}">
                                </div>
                            </div>
                        `;

                        // Atualizar resumo da sanfona imediatamente
                        const summaryText = ultimoEvento.querySelector('.evento-summary .text-gray-700');
                        if (summaryText) {
                            summaryText.textContent = `${evento.evento_nome} • ${evento.dia_semana} - ${horaFormatada}`;
                            
                            // Adicionar tag de turno
                            const turnoTag = document.createElement('span');
                            turnoTag.className = 'text-xs font-medium text-primary-600 ml-2';
                            turnoTag.textContent = turno;
                            summaryText.appendChild(turnoTag);
                        }

                        // Configurar toggle da sanfona
                        const toggleBtn = ultimoEvento.querySelector('.toggle-evento');
                        const eventoContent = ultimoEvento.querySelector('.evento-content');
                        if (toggleBtn && eventoContent) {
                            toggleBtn.addEventListener('click', () => {
                                eventoContent.classList.toggle('hidden');
                                const icon = toggleBtn.querySelector('svg');
                                if (icon) {
                                    icon.classList.toggle('rotate-180');
                                }
                            });
                        }

                        // Observar mudanças nas atividades para atualizar contagem
                        const atividadesContainer = ultimoEvento.querySelector('.atividades-container');
                        if (atividadesContainer) {
                            const observer = new MutationObserver(() => {
                                const count = atividadesContainer.querySelectorAll('.dynamic-field').length;
                                const countElement = ultimoEvento.querySelector('.atividades-count');
                                if (countElement) {
                                    countElement.textContent = count;
                                }
                            });
                            
                            observer.observe(atividadesContainer, {
                                childList: true,
                                subtree: true
                            });
                        }

                        // Garantir que o conteúdo comece visível
                        if (eventoContent) {
                            eventoContent.classList.remove('hidden');
                        }
                    }

                    // Atualizar o resumo da sanfona
                    const summaryText = ultimoEvento.querySelector('.evento-summary .text-gray-700');
                    if (summaryText) {
                        summaryText.textContent = `${evento.evento_nome} (${evento.dia_semana} - ${evento.hora})`;
                    }
                    
                    // Garantir que o toggle da sanfona funcione
                    const toggleBtn = ultimoEvento.querySelector('.toggle-evento');
                    if (toggleBtn) {
                        toggleBtn.addEventListener('click', () => {
                            const content = ultimoEvento.querySelector('.evento-content');
                            const icon = toggleBtn.querySelector('svg');
                            if (content && icon) {
                                content.classList.toggle('hidden');
                                icon.classList.toggle('rotate-180');
                            }
                        });
                    }

                    // Preencher data do evento
                    const dataEvento = ultimoEvento.querySelector('input[name="data_evento[]"]');
                    if (dataEvento) {
                        dataEvento.value = evento.data_evento ? evento.data_evento.split('T')[0] : ''; // Ajuste para aceitar eventos sem data
                    }

                    // Para cada atividade do evento
                    for (const atividade of evento.atividades) {
                        // Simular clique no botão de adicionar atividade deste evento específico
                        const btnAdicionarAtividade = ultimoEvento.querySelector('.btn-adicionar-atividade');
                        if (btnAdicionarAtividade) {
                            btnAdicionarAtividade.click();

                            // Aguardar a criação da atividade no DOM
                            await new Promise(resolve => setTimeout(resolve, 300));

                            // Encontrar a última atividade adicionada neste evento específico
                            const atividadesContainer = ultimoEvento.querySelector('.atividades-container');
                            const atividadesElements = atividadesContainer.querySelectorAll('.dynamic-field');
                            const ultimaAtividade = atividadesElements[atividadesElements.length - 1];

                            if (ultimaAtividade) {
                                // Preencher dados da atividade
                                const atividadeSelector = ultimaAtividade.querySelector('.atividade-selector .cursor-pointer');
                                if (atividadeSelector) {
                                    atividadeSelector.innerHTML = `
                                        <div class="flex items-center space-x-3">
                                            <img src="${getImageUrl('atividade', atividade.atividade_foto)}" class="w-12 h-12 rounded-full object-cover">
                                            <span class="text-gray-900 dark:text-white">${atividade.atividade_nome}</span>
                                            <input type="hidden" name="atividade_id[]" value="${atividade.atividade_id}">
                                        </div>
                                    `;
                                }

                                // Preencher dados do voluntário
                                const voluntarioSelector = ultimaAtividade.querySelector('.voluntario-selector .voluntario-toggle-btn');
                                if (voluntarioSelector) {
                                    voluntarioSelector.innerHTML = `
                                        <img 
                                            src="${atividade.voluntario_foto || `${URL_BASE}/assets/img/placeholder.jpg`}" 
                                            class="w-12 h-12 rounded-full object-cover"
                                            onerror="this.onerror=null; this.src='${URL_BASE}/assets/img/placeholder.jpg';"
                                            alt="${atividade.voluntario_nome}"
                                        >
                                        <div class="flex-1 text-left">
                                            <span class="text-gray-900 dark:text-white">${atividade.voluntario_nome}</span>
                                        </div>
                                        <input type="hidden" name="voluntario_id[]" value="${atividade.voluntario_id}">
                                    `;
                                }
                            }
                        }
                    }
                }
            }

            // Remover indicador de carregamento com animação
            const loadingEdit = document.getElementById('loading-edit');
            if (loadingEdit) {
                loadingEdit.classList.add('animate-fade-out');
                setTimeout(() => loadingEdit.remove(), 500);
            }

            // Notificar conclusão do carregamento
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    toast: true,
                    position: 'bottom-end',
                    icon: 'success',
                    title: 'Dados carregados com sucesso!',
                    showConfirmButton: false,
                    timer: 3000
                });
            } else {
                const loadingMessage = document.createElement('div');
                loadingMessage.innerHTML = `
                    <div id="success-message" class="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg">
                        Dados carregados com sucesso!
                    </div>
                `;
                document.body.appendChild(loadingMessage);
                setTimeout(() => {
                    const message = document.getElementById('success-message');
                    if (message) message.remove();
                }, 3000);
            }
        }
    } catch (error) {
        console.error('Erro ao carregar escala:', error);
        alert('Erro ao carregar dados da escala');
    }

    // Adicionar evento de submit do formulário
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
                submitText.textContent = 'Atualizando...';
                submitSpinner.classList.remove('hidden');
                
                const dadosEscala = {
                    nome: form.querySelector('input[type="text"]').value,
                    tipo: form.querySelector('select').value,
                    data_inicio: form.querySelectorAll('input[type="date"]')[0].value,
                    data_fim: form.querySelectorAll('input[type="date"]')[1].value,
                    ministerio_id: parseInt(MINISTERIO_ATUAL),
                    organizacao_id: parseInt(ORGANIZACAO_ID),
                    eventos: []
                };

                // Validações básicas
                if (!dadosEscala.nome || !dadosEscala.tipo || !dadosEscala.data_inicio || !dadosEscala.data_fim) {
                    throw new Error('Preencha todos os campos obrigatórios');
                }

                // Capturar eventos
                const eventosContainer = document.getElementById('eventos-container');
                if (eventosContainer) {
                    const eventoElements = eventosContainer.querySelectorAll(':scope > .dynamic-field');
                    
                    dadosEscala.eventos = Array.from(eventoElements).map(eventoElement => {
                        // Dados do evento
                        const eventoId = eventoElement.querySelector('.evento-selector input[name="evento_id[]"]')?.value;
                        const dataEvento = eventoElement.querySelector('input[name="data_evento[]"]')?.value;

                        if (!eventoId || !dataEvento) {
                            throw new Error('Preencha todos os campos do evento');
                        }

                        // Capturar atividades do evento
                        const atividadesContainer = eventoElement.querySelector('#atividades-lista-container');
                        const atividades = Array.from(atividadesContainer?.querySelectorAll('.dynamic-field') || [])
                            .map(atividadeElement => {
                                const atividadeId = atividadeElement.querySelector('.atividade-selector input[name="atividade_id[]"]')?.value;
                                const voluntarioId = atividadeElement.querySelector('.voluntario-selector input[name="voluntario_id[]"]')?.value;

                                if (!atividadeId || !voluntarioId) {
                                    throw new Error('Preencha todos os campos da atividade');
                                }

                                return {
                                    atividade_id: parseInt(atividadeId),
                                    voluntario_id: parseInt(voluntarioId)
                                };
                            });

                        return {
                            evento_id: parseInt(eventoId),
                            data_evento: dataEvento,
                            atividades
                        };
                    });
                }

                // Atualizar escala
                const resultado = await EscalaEditService.atualizar(escalaId, dadosEscala);
                
                if (resultado.code === 200) {
                    alert('Escala atualizada com sucesso!');
                    window.location.href = `${URL_BASE}/src/pages/escalas/`;
                }

            } catch (error) {
                console.error('Erro ao atualizar escala:', error);
                alert(error.message || 'Erro ao atualizar escala');
            } finally {
                // Restaurar estado original do botão
                submitButton.disabled = false;
                submitText.textContent = 'Salvar Escala';
                submitSpinner.classList.add('hidden');
            }
        });
    }
});
