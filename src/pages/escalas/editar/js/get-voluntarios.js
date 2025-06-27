let loadingVoluntarios = false;
let voluntariosSelecionados = [];

async function carregarVoluntarios(atividadeContainer) {
    if (loadingVoluntarios) return;
    
    try {
        // Mostrar loading primeiro
        const loadingDiv = document.getElementById('loading-voluntarios');
        if (loadingDiv) {
            loadingDiv.classList.remove('hidden');
        }

        loadingVoluntarios = true;

        // Encontrar o container do evento pai - agora procurando pelo elemento pai mais próximo que contém a data
        const eventoContainer = atividadeContainer.closest('.dynamic-field').parentElement.closest('.dynamic-field');
        let dataEvento = null;
        let currentElement = atividadeContainer;

        // Procurar recursivamente pelos containers pais até encontrar a data do evento
        while (currentElement && !dataEvento) {
            const dateInput = currentElement.querySelector('input[name="data_evento[]"]');
            if (dateInput && dateInput.value) {
                dataEvento = dateInput.value;
                break;
            }
            currentElement = currentElement.parentElement;
            if (currentElement) {
                currentElement = currentElement.closest('.dynamic-field');
            }
        }

        const atividadeId = atividadeContainer.querySelector('input[name="atividade_id[]"]')?.value;
        
        if (!dataEvento) {
            throw new Error('Data do evento não encontrada');
        }

        if (!atividadeId) {
            throw new Error('ID da atividade não encontrado');
        }

        // Buscar ID do evento - Nova implementação mais específica
        const eventoId = eventoContainer?.querySelector('.evento-selector input[name="evento_id[]"]')?.value;

        console.log('Debug - Busca de evento:', {
            atividadeContainer,
            eventoContainer,
            eventoIdInput: eventoContainer?.querySelector('.evento-selector input[name="evento_id[]"]'),
            eventoId,
            html: eventoContainer?.innerHTML
        });

        if (!eventoId) {
            throw new Error('ID do evento não encontrado');
        }

        // Forçar definição de MINISTERIO_ATUAL se não estiver definido
        if (!window.USER.ministerio_atual) {
            const ministerioSelect = document.querySelector('select[name="ministerio_id"]');
            if (ministerioSelect) {
                window.USER.ministerio_atual = ministerioSelect.value;
            }
        }

        const params = new URLSearchParams();
        params.append('organizacao_id', window.USER.organizacao_id);
        params.append('ministerio_id', window.USER.ministerio_atual);
        params.append('data', dataEvento);  
        params.append('data_evento', dataEvento);
        params.append('atividade_id', atividadeId);
        params.append('evento_id', eventoId); // Novo parâmetro
        params.append('page', '1');
        params.append('limit', '100');

        const apiUrl = `${window.APP_CONFIG.baseUrl}/src/services/api/voluntarios/get-sugestoes.php?${params}`;
      
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        // Capturar detalhes do erro para 400 Bad Request
        if (!response.ok) {
            const errorText = await response.text();
            // console.error('Detalhes do erro 400:', {
            //     status: response.status,
            //     statusText: response.statusText,
            //     errorText: errorText
            // });
            throw new Error(`Erro HTTP! status: ${response.status}, detalhes: ${errorText}`);
        }
        
        const resultado = await response.json();
        // console.log('Resultado da API:', resultado);

        if (resultado.code === 200) {
            // Adicionar informações de indicadores
            const indicadores = resultado.data.atividades || [];
            renderizarVoluntarios(resultado.data.todos, resultado.data.sugestoes, indicadores, atividadeContainer);
        } else {
            throw new Error(resultado.message || 'Erro ao carregar voluntários');
        }
    } catch (error) {
        console.error('Erro ao carregar voluntários:', error);
        const offcanvas = document.getElementById('voluntariosOffcanvas');
        const contentContainer = offcanvas?.querySelector('.space-y-3');
        if (contentContainer) {
            contentContainer.innerHTML = `
                <div class="text-center text-red-500 p-4">
                    <p>Erro ao carregar voluntários: ${error.message}</p>
                </div>
            `;
        }
    } finally {
        loadingVoluntarios = false;
        const loadingDiv = document.getElementById('loading-voluntarios');
        if (loadingDiv) {
            loadingDiv.classList.add('hidden');
        }
    }
}

function renderizarVoluntarios(todosVoluntarios, sugestoes, indicadores, atividadeContainer) {
    const offcanvas = document.getElementById('voluntariosOffcanvas');
    const contentContainer = offcanvas.querySelector('.space-y-3');
    if (!contentContainer) return;

    contentContainer.innerHTML = ''; // Limpar conteúdo anterior

    // Capturar o ID da atividade atual
    const atividadeId = atividadeContainer.querySelector('input[name="atividade_id[]"]')?.value;

    // Renderizar sugestões
    if (sugestoes && sugestoes.length > 0) {
        const tituloSugestoes = document.createElement('h3');
        tituloSugestoes.classList.add('text-lg', 'font-semibold', 'mb-3', 'text-primary-600', 'dark:text-primary-400');
        tituloSugestoes.textContent = 'Sugestões';
        contentContainer.appendChild(tituloSugestoes);

        sugestoes.forEach(voluntario => {
            const voluntarioCard = criarCardVoluntario(voluntario, true, atividadeId, atividadeContainer);
            contentContainer.appendChild(voluntarioCard);
        });
    }

    // Renderizar todos os voluntários
    if (todosVoluntarios && todosVoluntarios.length > 0) {
        const tituloTodos = document.createElement('h3');
        tituloTodos.classList.add('text-lg', 'font-semibold', 'mb-3', 'mt-4', 'text-gray-700', 'dark:text-gray-300');
        tituloTodos.textContent = 'Todos os Voluntários';
        contentContainer.appendChild(tituloTodos);

        todosVoluntarios.forEach(voluntario => {
            const voluntarioCard = criarCardVoluntario(voluntario, false, atividadeId, atividadeContainer);
            contentContainer.appendChild(voluntarioCard);
        });
    }

    // Se não houver voluntários
    if ((!sugestoes || sugestoes.length === 0) && (!todosVoluntarios || todosVoluntarios.length === 0)) {
        contentContainer.innerHTML = `
            <div class="text-center text-gray-500 dark:text-gray-400 p-4">
                <p>Nenhum voluntário disponível</p>
            </div>
        `;
    }

    // Adicionar evento de busca
    const searchInput = document.getElementById('voluntarios-search');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const termoPesquisa = searchInput.value.toLowerCase();
            const cards = contentContainer.querySelectorAll('div[class*="bg-white"]');
            
            cards.forEach(card => {
                const nome = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const ministerio = card.querySelector('p')?.textContent.toLowerCase() || '';
                
                if (nome.includes(termoPesquisa) || ministerio.includes(termoPesquisa)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

function criarCardVoluntario(voluntario, isSugestao, atividadeId, atividadeContainer) {
    const card = document.createElement('div');
    card.classList.add(
        'bg-white', 'dark:bg-gray-700', 
        'shadow-sm', 'rounded-lg', 'p-3', 'mb-2',
        'flex', 'items-center', 'space-x-3',
        'cursor-pointer', 'hover:bg-gray-50', 'dark:hover:bg-gray-600',
        'transition-colors', 'duration-300',
        'group'
    );

    // Foto
    const foto = document.createElement('img');
    foto.classList.add('w-12', 'h-12', 'rounded-full', 'object-cover', 'border-2', 'border-transparent', 'group-hover:border-primary-300');
    foto.src = voluntario.foto || `${window.APP_CONFIG.baseUrl}/assets/img/placeholder.jpg`;
    foto.alt = voluntario.nome;
    foto.onerror = () => {
        foto.src = `${window.APP_CONFIG.baseUrl}/assets/img/placeholder.jpg`;
    };

    // Informações do voluntário
    const infoContainer = document.createElement('div');
    infoContainer.classList.add('flex-1', 'min-w-0');

    // Nome do voluntário
    const nome = document.createElement('h3');
    nome.classList.add('text-sm', 'font-medium', 'text-gray-900', 'dark:text-white', 'truncate');
    nome.textContent = voluntario.nome;

    // Status de disponibilidade (atualizado para incluir ja_escalado)
    const statusText = document.createElement('p');
    statusText.classList.add('text-xs');
    
    // Definir classes e texto baseado no status
    switch(voluntario.status) {
        case 'disponivel':
            statusText.classList.add('text-green-600', 'dark:text-green-400');
            statusText.textContent = 'Disponível';
            break;
        case 'indisponivel':
            statusText.classList.add('text-red-600', 'dark:text-red-400');
            statusText.textContent = 'Indisponível';
            break;
        case 'nao_preencheu':
            statusText.classList.add('text-yellow-600', 'dark:text-yellow-400');
            statusText.textContent = 'Não preencheu';
            break;
        case 'ja_escalado':
            statusText.classList.add('text-blue-600', 'dark:text-blue-400');
            statusText.textContent = 'Indisponível, já escalado.';
            break;
        default:
            statusText.classList.add('text-gray-600', 'dark:text-gray-400');
            statusText.textContent = 'Status desconhecido';
    }

    // Indicadores de atividades
    const indicadoresContainer = document.createElement('div');
    indicadoresContainer.classList.add('flex', 'space-x-1', 'mt-1');

    if (voluntario.atividades && voluntario.atividades.length > 0) {
        voluntario.atividades.forEach(ativ => {
            const indicador = document.createElement('div');
            indicador.classList.add('w-4', 'h-2', 'rounded');
            indicador.style.backgroundColor = ativ.cor_indicador || '#cccccc';
            indicadoresContainer.appendChild(indicador);
        });
    }

    // Input hidden para o ID do voluntário
    const nomeInput = document.createElement('input');
    nomeInput.type = 'hidden';
    nomeInput.name = 'voluntario_id[]';
    nomeInput.value = voluntario.id;

    // Montar estrutura do card
    infoContainer.appendChild(nome);
    infoContainer.appendChild(statusText); // Status logo após o nome
    infoContainer.appendChild(indicadoresContainer);
    infoContainer.appendChild(nomeInput);

    // Montar card
    card.appendChild(foto);
    card.appendChild(infoContainer);

    // Evento de clique para selecionar
    card.addEventListener('click', () => {
        // Atualizar botão de seleção de voluntário
        const seletorVoluntario = atividadeContainer.querySelector('.voluntario-selector .voluntario-toggle-btn');
        if (seletorVoluntario) {
            // Definir classes de status para o botão
            let statusClass = '';
            switch(voluntario.status) {
                case 'disponivel':
                    statusClass = 'text-green-600 dark:text-green-400';
                    break;
                case 'indisponivel':
                    statusClass = 'text-red-600 dark:text-red-400';
                    break;
                case 'nao_preencheu':
                    statusClass = 'text-yellow-600 dark:text-yellow-400';
                    break;
                case 'ja_escalado':
                    statusClass = 'text-blue-600 dark:text-blue-400';
                    break;
                default:
                    statusClass = 'text-gray-600 dark:text-gray-400';
            }

            seletorVoluntario.innerHTML = `
                <img src="${foto.src}" class="w-12 h-12 rounded-full object-cover">
                <div class="flex-1 text-left">
                    <span class="text-gray-900 dark:text-white">${voluntario.nome}</span>
                    <div class="text-xs mt-1 ${statusClass}">
                        ${voluntario.statusLabel || statusText.textContent}
                    </div>
                </div>
                <input type="hidden" name="voluntario_id[]" value="${voluntario.id}">
            `;
        }

        // Fechar offcanvas
        const offcanvas = document.getElementById('voluntariosOffcanvas');
        if (offcanvas) {
            offcanvas.classList.remove('translate-x-0');
            offcanvas.classList.add('translate-x-full');
        }
    });

    return card;
}

// Remover o event listener do DOMContentLoaded no final do arquivo
// E substituir por uma função que será chamada quando uma nova atividade for criada

function initializeVoluntarioSelector(atividadeElement) {
    const atividadeSelector = atividadeElement.querySelector('.atividade-selector .cursor-pointer');
    if (atividadeSelector) {
        atividadeSelector.addEventListener('click', () => {
            setTimeout(() => {
                const atividadeContainer = atividadeSelector.closest('.dynamic-field');
                if (atividadeContainer) {
                    carregarVoluntarios(atividadeContainer);
                }
            }, 500);
        });
    }
}

// Exportar a função para uso global
window.initializeVoluntarioSelector = initializeVoluntarioSelector;
window.carregarVoluntarios = carregarVoluntarios;
