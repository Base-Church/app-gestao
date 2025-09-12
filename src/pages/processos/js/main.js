import { ProcessosAPI } from './api.js';
import { UI } from './ui.js';

// Import SortableJS
// SortableJS será carregado via CDN, usar global Sortable

const baseUrl = window.APP_CONFIG.baseUrl;
if (!baseUrl) console.warn('Base URL não encontrada');
const api = new ProcessosAPI(baseUrl);
const ui = new UI();

let ministerio_id = window.USER?.ministerio_atual;
let organizacao_id = window.USER?.organizacao_id;

async function carregarProcessos() {
    try {
        ui.processosContainer.innerHTML = `
            <div class="flex items-center justify-center py-12">
                <div class="text-center">
                    <svg class="animate-spin w-8 h-8 text-primary-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p class="text-gray-600 dark:text-gray-400">Carregando processos...</p>
                </div>
            </div>
        `;
        
        const processosResp = await api.listarProcessos(ministerio_id);
        
        // Verifica se a resposta tem a estrutura esperada
        if (!processosResp || processosResp.code !== 200) {
            throw new Error(processosResp?.message || 'Erro ao carregar processos');
        }
        
        const processos = processosResp.data || [];
        const etapasPorProcesso = {};
        
        // Carrega etapas para cada processo
        for (const processo of processos) {
            try {
                const etapasResp = await api.listarEtapas(processo.id, ministerio_id);
                if (etapasResp && etapasResp.code === 200) {
                    // Ordena as etapas pela propriedade 'orden' (1 = primeiro)
                    const etapasOrdenadas = (etapasResp.data || []).sort((a, b) => a.orden - b.orden);
                    etapasPorProcesso[processo.id] = etapasOrdenadas;
                } else {
                    etapasPorProcesso[processo.id] = [];
                }
            } catch (etapasErr) {
                console.warn(`Erro ao carregar etapas do processo ${processo.id}:`, etapasErr);
                etapasPorProcesso[processo.id] = [];
            }
        }
        
        // Renderiza processos
        if (processos.length === 0) {
            ui.processosContainer.innerHTML = `
                <div class="text-center py-12">
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 max-w-md mx-auto">
                        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Nenhum processo encontrado</h3>
                        <p class="text-gray-600 dark:text-gray-400 mb-4">Comece criando seu primeiro processo</p>
                        <button onclick="document.getElementById('btnNovoProcesso').click()" class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            Criar Processo
                        </button>
                    </div>
                </div>
            `;
        } else {
            ui.renderProcessos(processos, etapasPorProcesso);
            setupEtapasSortable(processos);
        }
    } catch (err) {
        console.error('Erro ao carregar processos:', err);
        ui.processosContainer.innerHTML = `
            <div class="text-center py-12">
                <div class="bg-red-50 dark:bg-red-900 rounded-xl border border-red-200 dark:border-red-800 p-8 max-w-md mx-auto">
                    <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 class="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">Erro ao carregar processos</h3>
                    <p class="text-red-700 dark:text-red-200 mb-4">${err.message}</p>
                    <button onclick="carregarProcessos()" class="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                        Tentar Novamente
                    </button>
                </div>
            </div>
        `;
    }
}

function setupEtapasSortable(processos) {
    processos.forEach(processo => {
        const container = document.getElementById(`etapasContainer-${processo.id}`);
        if (container) {
            // Remove sortable anterior se existir
            if (container.sortableInstance) {
                container.sortableInstance.destroy();
            }
            
            // Cria novo sortable com configurações melhoradas
            container.sortableInstance = Sortable.create(container, {
                animation: 300,
                easing: "cubic-bezier(1, 0, 0, 1)",
                direction: 'horizontal',
                ghostClass: 'sortable-ghost',
                chosenClass: 'sortable-chosen',
                dragClass: 'sortable-drag',
                forceFallback: false,
                fallbackClass: 'sortable-fallback',
                fallbackOnBody: true,
                swapThreshold: 0.65,
                
                // Filtros para elementos que não devem ser arrastáveis
                filter: '.btnDeleteEtapa',
                preventOnFilter: true,
                
                // Callbacks
                onStart: function (evt) {
                    evt.item.style.transform = 'rotate(5deg)';
                    evt.item.style.zIndex = '1000';
                    container.classList.add('dragging-active');
                },
                
                onMove: function(evt, originalEvent) {
                    return evt.to === container;
                },
                
                onChange: function(evt) {
                    // Atualiza números visuais em tempo real
                    const items = container.querySelectorAll('.draggableEtapa');
                    items.forEach((item, index) => {
                        const numeroOrdem = item.querySelector('.absolute.-top-2.-left-2');
                        if (numeroOrdem) {
                            numeroOrdem.textContent = index + 1;
                        }
                        // Atualiza o data-orden também
                        item.dataset.orden = index + 1;
                    });
                },
                
                onEnd: async function (evt) {
                    evt.item.style.transform = '';
                    evt.item.style.zIndex = '';
                    container.classList.remove('dragging-active');
                    
                    // Se a posição mudou, atualiza no backend
                    if (evt.oldIndex !== evt.newIndex) {
                        try {
                            // Coleta dados das etapas reordenadas (baseado na nova posição visual)
                            const etapas = Array.from(container.querySelectorAll('.draggableEtapa')).map((el, idx) => ({
                                id: el.dataset.id,
                                nome: el.dataset.nome,
                                orden: idx + 1,  // Nova ordem baseada na posição (1, 2, 3...)
                                ministerio_id: ministerio_id  // Adiciona o ministerio_id necessário
                            }));
                            
                            // Envia para o backend via AJAX
                            await api.reordenarEtapas(etapas);
                            
                            // Mostra feedback de sucesso discreto
                            showNotification('Ordem atualizada', 'success');
                            
                        } catch (error) {
                            console.error('Erro ao reordenar etapas:', error);
                            showNotification('Erro ao salvar ordem', 'error');
                            
                            // Reverte apenas se houver erro
                            await carregarProcessos();
                        }
                    }
                }
            });
        }
    });
}

// Modal Novo Processo
const btnNovoProcesso = document.getElementById('btnNovoProcesso');
const modalNovoProcesso = document.getElementById('modalNovoProcesso');
const btnCancelarProcesso = document.getElementById('btnCancelarProcesso');
const btnCancelarProcesso2 = document.getElementById('btnCancelarProcesso2');
const formNovoProcesso = document.getElementById('formNovoProcesso');

// Event listeners para o modal
btnNovoProcesso.addEventListener('click', () => {
    ui.showModalNovoProcesso(true);
    document.getElementById('nomeProcesso').focus();
});

btnCancelarProcesso.addEventListener('click', () => ui.showModalNovoProcesso(false));
btnCancelarProcesso2.addEventListener('click', () => ui.showModalNovoProcesso(false));

// Fechar modal ao clicar fora
modalNovoProcesso.addEventListener('click', (e) => {
    if (e.target === modalNovoProcesso) {
        ui.showModalNovoProcesso(false);
    }
});

// Fechar modal com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalNovoProcesso.classList.contains('hidden')) {
        ui.showModalNovoProcesso(false);
    }
});

formNovoProcesso.addEventListener('submit', async e => {
    e.preventDefault();
    const nome = document.getElementById('nomeProcesso').value.trim();
    const errorMsg = document.getElementById('processoErrorMsg');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Reset error state
    errorMsg.classList.add('hidden');
    errorMsg.textContent = '';
    
    // Validação local
    if (!nome) {
        errorMsg.textContent = 'O nome do processo é obrigatório';
        errorMsg.classList.remove('hidden');
        return;
    }
    
    // Loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <svg class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Criando...
    `;
    
    try {
        await api.criarProcesso({ 
            nome, 
            ministerio_id, 
            organizacao_id 
        });
        
        ui.showModalNovoProcesso(false);
        formNovoProcesso.reset();
        
        // Adiciona o novo processo visualmente sem reload
        try {
            const processosResp = await api.listarProcessos(ministerio_id);
            if (processosResp && processosResp.code === 200) {
                const novoProcesso = processosResp.data.find(p => p.nome === nome);
                if (novoProcesso) {
                    // Adiciona o card do novo processo
                    const novoProcessoHTML = ui.renderProcessoCard(novoProcesso, []);
                    ui.processosContainer.insertAdjacentHTML('beforeend', novoProcessoHTML);
                    
                    // Anima entrada
                    const novoCard = ui.processosContainer.lastElementChild;
                    novoCard.style.transform = 'scale(0.95)';
                    novoCard.style.opacity = '0';
                    setTimeout(() => {
                        novoCard.style.transform = 'scale(1)';
                        novoCard.style.opacity = '1';
                    }, 100);
                    
                    // Configura sortable para o novo processo
                    setupEtapasSortable([novoProcesso]);
                }
            }
        } catch (err) {
            console.warn('Erro ao adicionar processo visualmente, fazendo reload:', err);
            await carregarProcessos();
        }
        
        showNotification(`Processo "${nome}" criado`, 'success');
        
    } catch (err) {
        errorMsg.textContent = err.message || 'Erro ao criar processo';
        errorMsg.classList.remove('hidden');
    } finally {
        // Restore button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
});

// Função auxiliar para notificações discretas
function showNotification(message, type = 'info', duration = 2000) {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full`;
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                ${type === 'success' ? 
                    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>' :
                    type === 'error' ? 
                    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>' :
                    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>'
                }
            </svg>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Anima entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove após duração
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, duration);
}

// Delegação para adicionar/excluir etapas/processos
ui.processosContainer.addEventListener('click', async e => {
    if (e.target.classList.contains('btnDeleteProcesso')) {
        const id = e.target.dataset.processoId;
        if (confirm('Excluir este processo?')) {
            try {
                await api.deletarProcesso(id);
                // Remove visualmente o card do processo
                const processoCard = e.target.closest('.bg-white');
                if (processoCard) {
                    processoCard.style.transform = 'scale(0.95)';
                    processoCard.style.opacity = '0';
                    setTimeout(() => {
                        processoCard.remove();
                        showNotification('Processo excluído', 'success');
                    }, 300);
                }
            } catch (err) {
                showNotification('Erro ao excluir processo', 'error');
            }
        }
    }
    
    if (e.target.classList.contains('btnAddEtapa')) {
        const processo_id = e.target.dataset.processoId;
        const nome = prompt('Nome da nova etapa:');
        if (nome && nome.trim()) {
            try {
                // Busca etapas atuais para calcular orden
                const etapasContainer = document.getElementById(`etapasContainer-${processo_id}`);
                const etapasCount = etapasContainer ? etapasContainer.querySelectorAll('.draggableEtapa').length : 0;
                const orden = etapasCount + 1; // Nova etapa vai para o final
                
                const novaEtapa = await api.criarEtapa({ 
                    nome: nome.trim(), 
                    ministerio_id, 
                    processo_id, 
                    orden 
                });
                
                // Adiciona a nova etapa visualmente
                if (etapasContainer && novaEtapa.data) {
                    const etapaData = {
                        id: novaEtapa.data.id || Date.now(), // fallback para ID
                        nome: nome.trim(),
                        orden: orden
                    };
                    
                    // Remove mensagem de "nenhuma etapa" se existir
                    const emptyMessage = etapasContainer.querySelector('.text-center');
                    if (emptyMessage) {
                        emptyMessage.remove();
                    }
                    
                    // Adiciona nova etapa
                    const novaEtapaHTML = ui.renderEtapaCard(etapaData);
                    etapasContainer.insertAdjacentHTML('beforeend', novaEtapaHTML);
                    
                    // Anima entrada da nova etapa
                    const novaEtapaEl = etapasContainer.lastElementChild;
                    novaEtapaEl.style.transform = 'scale(0.8)';
                    novaEtapaEl.style.opacity = '0';
                    setTimeout(() => {
                        novaEtapaEl.style.transform = 'scale(1)';
                        novaEtapaEl.style.opacity = '1';
                    }, 100);
                    
                    showNotification('Etapa adicionada', 'success');
                    
                    // Reinicializa sortable para incluir a nova etapa
                    const processo = { id: processo_id };
                    setupEtapasSortable([processo]);
                }
            } catch (err) {
                showNotification('Erro ao criar etapa', 'error');
            }
        }
    }
    
    if (e.target.classList.contains('btnDeleteEtapa')) {
        const id = e.target.dataset.etapaId;
        if (confirm('Excluir esta etapa?')) {
            try {
                await api.deletarEtapa(id);
                
                // Remove visualmente a etapa
                const etapaCard = e.target.closest('.draggableEtapa');
                if (etapaCard) {
                    etapaCard.style.transform = 'scale(0.8)';
                    etapaCard.style.opacity = '0';
                    setTimeout(async () => {
                        etapaCard.remove();
                        showNotification('Etapa excluída', 'success');
                        
                        // Reordena as etapas restantes visualmente (renumera a partir de 1)
                        const container = etapaCard.parentElement;
                        if (container) {
                            const etapasRestantes = container.querySelectorAll('.draggableEtapa');
                            
                            // Atualiza ordem visual
                            etapasRestantes.forEach((etapa, index) => {
                                const numeroOrdem = etapa.querySelector('.absolute.-top-2.-left-2');
                                if (numeroOrdem) {
                                    numeroOrdem.textContent = index + 1;  // 1, 2, 3...
                                }
                                etapa.dataset.orden = index + 1;  // Atualiza data-attribute
                            });
                            
                            // Envia reordenação para o backend se ainda há etapas
                            if (etapasRestantes.length > 0) {
                                try {
                                    const etapasParaReordenar = Array.from(etapasRestantes).map((el, idx) => ({
                                        id: el.dataset.id,
                                        nome: el.dataset.nome,
                                        orden: idx + 1,
                                        ministerio_id: ministerio_id  // Adiciona o ministerio_id necessário
                                    }));
                                    await api.reordenarEtapas(etapasParaReordenar);
                                } catch (reorderErr) {
                                    console.warn('Erro ao reordenar após exclusão:', reorderErr);
                                }
                            }
                            
                            // Se não restam etapas, mostra mensagem vazia
                            if (etapasRestantes.length === 0) {
                                container.innerHTML = `
                                    <div class="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
                                        <div class="text-center">
                                            <svg class="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                            </svg>
                                            <p>Nenhuma etapa cadastrada</p>
                                            <p class="text-xs mt-1">Clique em "Nova Etapa" para começar</p>
                                        </div>
                                    </div>
                                `;
                            }
                        }
                    }, 300);
                }
            } catch (err) {
                showNotification('Erro ao excluir etapa', 'error');
            }
        }
    }
});

carregarProcessos();
