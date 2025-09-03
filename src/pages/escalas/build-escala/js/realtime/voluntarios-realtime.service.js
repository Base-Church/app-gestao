/**
 * Serviço SIMPLIFICADO para rastrear seleções de voluntários em tempo real
 * 
 * LÓGICA:
 * - Fonte e Recebedores: todos veem dados de todos, mas dados só existem enquanto a sessão está ativa
 * - Dados são limpos quando: recarrega página, faz POST/PUT 
 * - Na listagem: mostra quem está selecionando
 * - No voluntário: altera status para "Selecionando no momento"
 */
class VoluntariosRealtimeService {
    constructor() {
        // Estruturas simples - apenas na memória, sem persistência
        this.mySelections = new Set(); // IDs dos voluntários que EU estou selecionando
        this.allSelections = new Map(); // {voluntarioId => [{user, timestamp}]} - quem está selecionando cada voluntário
        
        this.init();
    }

    init() {
        this.setupClickInterception();
        this.setupPageCleanup();
        this.setupUIObserver();
        
        // Aguarda inicialização do Ably e conecta ao canal de presença
        this.waitForAblyAndConnect();
    }

    /**
     * Aguarda o Ably estar disponível e conecta
     */
    waitForAblyAndConnect() {
        const checkAbly = () => {
            if (window.ablyService && window.ablyService.isConnected) {
                this.subscribeToPresence();
                return;
            }
            setTimeout(checkAbly, 500);
        };
        checkAbly();
    }

    /**
     * Se inscreve no canal de presença do Ably
     */
    subscribeToPresence() {
        if (window.ablyService && window.ablyService.channel) {
            // Listener específico para dados de voluntários
            window.ablyService.channel.subscribe('voluntario-presence', (message) => {
                this.handlePresenceData(message.data);
            });
        }
    }

    /**
     * Observa mudanças na UI para aplicar status realtime
     */
    setupUIObserver() {
        // Observer para detectar quando novos voluntários são carregados na listagem
        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            
            mutations.forEach(mutation => {
                // Detecta novos voluntários adicionados
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        if (node.matches && node.matches('[data-voluntario-id]')) {
                            shouldUpdate = true;
                        } else if (node.querySelector && node.querySelector('[data-voluntario-id]')) {
                            shouldUpdate = true;
                        }
                    }
                });
            });
            
            if (shouldUpdate) {
                // Pequeno delay para garantir que o DOM foi totalmente atualizado
                setTimeout(() => {
                    this.updateVoluntarioStatus();
                }, 100);
            }
        });

        // Observa mudanças no documento inteiro
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Observer específico para modais/sidebars de voluntários
        const sidebarObserver = new MutationObserver(() => {
            setTimeout(() => {
                this.updateVoluntarioStatus();
            }, 200);
        });

        // Observa quando sidebars são criados
        const checkForSidebar = () => {
            const sidebar = document.querySelector('.voluntarios-sidebar, .sidebar-voluntarios, [id*="sidebar"], [class*="sidebar"]');
            if (sidebar && !sidebar.hasAttribute('data-observer-set')) {
                sidebar.setAttribute('data-observer-set', 'true');
                sidebarObserver.observe(sidebar, {
                    childList: true,
                    subtree: true
                });
            }
        };

        // Verifica periodicamente por novos sidebars
        setInterval(checkForSidebar, 1000);
    }

    /**
     * Intercepta cliques em voluntários para detectar seleções
     */
    setupClickInterception() {
        document.addEventListener('click', (e) => {
            // Detecta seleção de voluntário
            const voluntarioCard = e.target.closest('.voluntario-card, [data-voluntario-id]');
            if (voluntarioCard && e.target.closest('.selecionar-voluntario')) {
                const voluntarioId = voluntarioCard.dataset.voluntarioId;
                const voluntarioNome = voluntarioCard.querySelector('h4')?.textContent || 'Voluntário';
                
                if (voluntarioId) {
                    this.notifyVoluntarioSelection(voluntarioId, voluntarioNome);
                }
            }

            // Detecta remoção de voluntário (vários tipos de botões)
            if (e.target.closest('.btn-remover-voluntario, .btn-remover-conjunto, [data-action*="remover"]')) {
                setTimeout(() => this.checkForRemovals(), 100); // Delay para DOM ser atualizado
            }
        });
    }

    /**
     * Verifica se algum voluntário foi removido do DOM
     */
    checkForRemovals() {
        const currentlyInDOM = new Set();
        
        // Busca todos os voluntários atualmente no DOM
        document.querySelectorAll('[data-voluntario-id]').forEach(el => {
            const id = el.dataset.voluntarioId;
            if (id) currentlyInDOM.add(id);
        });

        // Verifica se algum dos meus selecionados não está mais no DOM
        this.mySelections.forEach(voluntarioId => {
            if (!currentlyInDOM.has(voluntarioId)) {
                console.log('Voluntário removido do DOM:', voluntarioId);
                this.notifyVoluntarioRemoval(voluntarioId);
            }
        });
    }

    /**
     * Notifica que selecionei um voluntário
     */
    notifyVoluntarioSelection(voluntarioId, voluntarioNome) {
        // Adiciona à minha lista
        this.mySelections.add(voluntarioId);
        
        // Busca dados adicionais do voluntário no DOM
        const voluntarioCard = document.querySelector(`[data-voluntario-id="${voluntarioId}"]`);
        const atividadeInfo = this.extractAtividadeInfo(voluntarioCard);
        
        // Dados para envio
        const selectionData = {
            action: 'voluntario_selecting',
            voluntario: { id: voluntarioId, nome: voluntarioNome },
            atividade: atividadeInfo,
            user: window.USER,
            timestamp: Date.now()
        };
        
        // Notifica via Ably no canal específico
        if (window.ablyService && window.ablyService.channel) {
            window.ablyService.channel.publish('voluntario-presence', selectionData);
        }

        this.updateOffCanvas();
        this.updateVoluntarioStatus();
    }

    /**
     * Notifica que removi um voluntário
     */
    notifyVoluntarioRemoval(voluntarioId) {
        // Remove da minha lista
        this.mySelections.delete(voluntarioId);
        
        // Notifica via Ably no canal específico
        if (window.ablyService && window.ablyService.channel) {
            window.ablyService.channel.publish('voluntario-presence', {
                action: 'voluntario_removed',
                voluntario: { id: voluntarioId },
                user: window.USER,
                timestamp: Date.now()
            });
        }

        this.updateOffCanvas();
        this.updateVoluntarioStatus();
    }

    /**
     * Extrai informações da atividade do contexto
     */
    extractAtividadeInfo(voluntarioCard) {
        if (!voluntarioCard) return { nome: 'Atividade' };
        
        // Tenta encontrar informações da atividade no contexto
        const itemContainer = voluntarioCard.closest('[id^="item-"]');
        const conjuntoContainer = voluntarioCard.closest('[data-conjunto-idx]');
        
        if (conjuntoContainer) {
            const conjuntoIdx = conjuntoContainer.dataset.conjuntoIdx;
            const atividadeEl = conjuntoContainer.parentElement?.querySelector('.espaco-atividades h4');
            if (atividadeEl) {
                return { 
                    nome: atividadeEl.textContent.trim(),
                    idx: conjuntoIdx
                };
            }
        }
        
        // Fallback
        return { nome: 'Atividade' };
    }

    /**
     * Processa dados de presença recebidos via Ably
     */
    handlePresenceData(data) {
        if (!data || !data.action || !data.voluntario) {
            return;
        }
        
        const voluntarioId = data.voluntario.id;
        const user = data.user;
        
        // Ignora próprios dados
        if (user && user.id === window.USER.id) {
            return;
        }

        switch (data.action) {
            case 'voluntario_selecting':
                this.handleRemoteSelection(voluntarioId, user, data.timestamp, data.voluntario, data.atividade);
                break;
            case 'voluntario_removed':
                this.handleRemoteRemoval(voluntarioId, user);
                break;
        }

        this.updateOffCanvas();
        this.updateVoluntarioStatus();
    }

    /**
     * Processa seleção de outro usuário
     */
    handleRemoteSelection(voluntarioId, user, timestamp, voluntario, atividade) {
        if (!this.allSelections.has(voluntarioId)) {
            this.allSelections.set(voluntarioId, []);
        }
        
        const selections = this.allSelections.get(voluntarioId);
        
        // Remove seleção antiga do mesmo usuário
        const index = selections.findIndex(s => s.user.id === user.id);
        if (index >= 0) {
            selections.splice(index, 1);
        }
        
        // Adiciona nova seleção com dados completos
        selections.push({ 
            user, 
            timestamp,
            voluntario: voluntario || { id: voluntarioId, nome: 'Voluntário' },
            atividade: atividade || { nome: 'Atividade' }
        });
    }

    /**
     * Processa remoção de outro usuário
     */
    handleRemoteRemoval(voluntarioId, user) {
        if (this.allSelections.has(voluntarioId)) {
            const selections = this.allSelections.get(voluntarioId);
            const index = selections.findIndex(s => s.user.id === user.id);
            if (index >= 0) {
                selections.splice(index, 1);
                
                // Remove entrada se não há mais seleções
                if (selections.length === 0) {
                    this.allSelections.delete(voluntarioId);
                }
            }
        }
    }

    /**
     * Atualiza status dos voluntários na interface
     */
    updateVoluntarioStatus() {
        // Atualiza todos os cards de voluntário
        document.querySelectorAll('[data-voluntario-id]').forEach(card => {
            const voluntarioId = card.dataset.voluntarioId;
            const originalStatus = card.dataset.originalStatus;
            
            // Busca diferentes tipos de elementos de status
            let statusEl = card.querySelector('.status-voluntario, .voluntario-status');
            
            // Se não existe elemento de status específico, procura outros
            if (!statusEl) {
                statusEl = card.querySelector('.text-xs:not(.nome-voluntario):not(.atividade-nome)');
            }
            
            // Se ainda não achou, cria um elemento de status
            if (!statusEl) {
                const infoContainer = card.querySelector('.voluntario-info, .card-body, .p-4');
                if (infoContainer) {
                    statusEl = document.createElement('div');
                    statusEl.className = 'text-xs status-voluntario mt-1';
                    infoContainer.appendChild(statusEl);
                }
            }
            
            // Verifica se alguém está selecionando (incluindo eu mesmo)
            const isBeingSelected = this.allSelections.has(voluntarioId) || this.mySelections.has(voluntarioId);
            
            if (isBeingSelected && statusEl) {
                const selections = this.allSelections.get(voluntarioId) || [];
                const mySelection = this.mySelections.has(voluntarioId);
                
                if (mySelection || selections.length > 0) {
                    statusEl.textContent = 'Selecionado no momento';
                    statusEl.className = 'text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded status-voluntario animate-pulse';
                }
            } else if (statusEl) {
                // Restaura status original se não está mais sendo selecionado
                if (statusEl.textContent.includes('Selecionado no momento')) {
                    if (statusEl.classList.contains('status-voluntario') && statusEl.classList.contains('mt-1')) {
                        // Remove elemento criado dinamicamente
                        statusEl.remove();
                    } else if (originalStatus) {
                        // Restaura o status original
                        statusEl.textContent = originalStatus;
                        // Restaura as classes originais baseadas no status
                        const statusMap = {
                            'Disponível': 'bg-green-100 text-green-800 border-green-300',
                            'Indisponível': 'bg-red-100 text-red-700 border-red-300',
                            'Não preencheu': 'bg-yellow-100 text-yellow-800 border-yellow-300',
                            'Já escalado': 'bg-blue-100 text-blue-800 border-blue-300'
                        };
                        const originalClass = statusMap[originalStatus] || 'bg-gray-100 text-gray-700 border-gray-300';
                        statusEl.className = `inline-block px-2 py-0.5 rounded border text-xs font-semibold ${originalClass}`;
                    } else {
                        // Se não tem status original, remove o texto
                        statusEl.textContent = '';
                    }
                }
            }
        });
    }

    /**
     * Atualiza lista no off-canvas global
     */
    updateOffCanvas() {
        if (window.globalOffCanvas) {
            // Cria Map para as seleções (como esperado pelo OffCanvas)
            const selectingMap = new Map();
            
            // Adiciona seleções de outros usuários
            this.allSelections.forEach((selections, voluntarioId) => {
                selections.forEach((selection, index) => {
                    const key = `${selection.user.id}-${voluntarioId}-${index}`;
                    selectingMap.set(key, {
                        user: selection.user,
                        voluntario: selection.voluntario || { id: voluntarioId, nome: 'Voluntário' },
                        atividade: selection.atividade || { nome: 'Atividade' },
                        timestamp: selection.timestamp
                    });
                });
            });
            
            // Inclui minhas próprias seleções com mais detalhes
            this.mySelections.forEach(voluntarioId => {
                const key = `${window.USER.id}-${voluntarioId}-mine`;
                const voluntarioCard = document.querySelector(`[data-voluntario-id="${voluntarioId}"]`);
                const voluntarioNome = voluntarioCard?.querySelector('h4')?.textContent || 'Voluntário';
                const atividadeInfo = this.extractAtividadeInfo(voluntarioCard);
                
                selectingMap.set(key, {
                    user: window.USER,
                    voluntario: { id: voluntarioId, nome: voluntarioNome },
                    atividade: atividadeInfo,
                    timestamp: Date.now()
                });
            });
            
            window.globalOffCanvas.updateSelectingList(selectingMap);
        }
    }

    /**
     * Filtra voluntários disponíveis (marca os que estão sendo selecionados)
     */
    filterAvailableVoluntarios(voluntarios) {
        return voluntarios.map(voluntario => {
            // Verifica se alguém está selecionando (incluindo eu mesmo)
            const isBeingSelected = this.allSelections.has(voluntario.id) || this.mySelections.has(voluntario.id);
            
            if (isBeingSelected) {
                return {
                    ...voluntario,
                    originalStatusLabel: voluntario.statusLabel, // Preserva o status original
                    statusLabel: 'Selecionado no momento',
                    isBeingSelected: true
                };
            }
            return voluntario;
        });
    }

    /**
     * Limpa TODAS as minhas seleções (quando recarrego ou faço POST/PUT)
     */
    clearMySelections() {
        // Notifica remoção de cada uma das minhas seleções
        this.mySelections.forEach(voluntarioId => {
            if (window.ablyService && window.ablyService.channel) {
                window.ablyService.channel.publish('voluntario-presence', {
                    action: 'voluntario_removed',
                    voluntario: { id: voluntarioId },
                    user: window.USER,
                    timestamp: Date.now()
                });
            }
        });
        
        // Limpa estruturas locais
        this.mySelections.clear();
        
        this.updateOffCanvas();
    }

    /**
     * Reconecta e resincroniza após reload da página
     */
    resyncAfterReload() {
        // Limpa dados antigos
        this.mySelections.clear();
        this.allSelections.clear();
        
        // Aguarda conexão Ably e se reconecta
        this.waitForAblyAndConnect();
        
        // Força atualização da UI após reconexão
        setTimeout(() => {
            this.updateVoluntarioStatus();
            this.updateOffCanvas();
        }, 2000);
    }

    /**
     * Configura limpeza automática
     */
    setupPageCleanup() {
        // Limpa ao sair da página
        window.addEventListener('beforeunload', () => {
            this.clearMySelections();
        });

        // Limpa ao carregar página (remove dados antigos)
        window.addEventListener('load', () => {
            this.mySelections.clear();
            this.allSelections.clear();
        });
    }
}

// Inicializa o serviço globalmente
window.voluntariosRealtimeService = new VoluntariosRealtimeService();

// Debug functions
window.debugClearMySelections = function() {
    if (window.voluntariosRealtimeService) {
        window.voluntariosRealtimeService.clearMySelections();
        console.log('My selections cleared');
    }
};

window.debugSelectVoluntario = function(voluntarioId, nome) {
    if (window.voluntariosRealtimeService) {
        window.voluntariosRealtimeService.notifyVoluntarioSelection(voluntarioId, nome || 'Teste');
        console.log('Debug: voluntário selecionado', voluntarioId);
    }
};

window.debugShowSelections = function() {
    if (window.voluntariosRealtimeService) {
        console.log('Minhas seleções:', Array.from(window.voluntariosRealtimeService.mySelections));
        console.log('Todas as seleções:', window.voluntariosRealtimeService.allSelections);
    }
};

// Limpeza automática de seleções antigas a cada minuto
setInterval(() => {
    if (window.voluntariosRealtimeService) {
        const now = Date.now();
        const maxAge = 5 * 60 * 1000; // 5 minutos
        
        window.voluntariosRealtimeService.allSelections.forEach((selections, voluntarioId) => {
            const validSelections = selections.filter(s => (now - s.timestamp) < maxAge);
            
            if (validSelections.length === 0) {
                window.voluntariosRealtimeService.allSelections.delete(voluntarioId);
            } else if (validSelections.length !== selections.length) {
                window.voluntariosRealtimeService.allSelections.set(voluntarioId, validSelections);
            }
        });
        
        window.voluntariosRealtimeService.updateOffCanvas();
        window.voluntariosRealtimeService.updateVoluntarioStatus();
    }
}, 60000);
