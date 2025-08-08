/**
 * Serviço para gerenciar o envio/submit da escala
 */
class SubmitEscalaService {
    constructor() {
        this.init();
    }

    init() {
        // Configura o botão de salvar escala
        document.querySelector('[data-action="salvar-escala"]')?.addEventListener('click', () => {
            this.confirmarESalvarEscala();
        });
    }

    /**
     * Abre modal de confirmação e salva escala
     */
    async confirmarESalvarEscala() {
        try {
            // Detecta se estamos no modo edição
            const hasEditPath = window.location.pathname.includes('/editar') || window.location.pathname.includes('escalas/editar');
            const hasIdParam = new URLSearchParams(window.location.search).has('id');
            const hasEscalaCarregada = window.EscalaEditarService && window.EscalaEditarService.escalaCarregada;
            
            // Verifica também se o botão foi alterado para "Salvar" (indicativo de modo edição)
            const submitButton = document.querySelector('[data-action="salvar-escala"]');
            const buttonTextIsSalvar = submitButton && submitButton.textContent.trim().includes('Salvar');
            
            const isEditMode = (hasEditPath && hasIdParam) || hasEscalaCarregada || buttonTextIsSalvar;
            
            if (isEditMode) {
                // Modo edição - salvar diretamente sem modal
                const submitButton = document.querySelector('[data-action="salvar-escala"]');
                const originalText = submitButton.innerHTML;
                
                try {
                    // Adiciona loading no botão
                    submitButton.disabled = true;
                    submitButton.innerHTML = `
                        <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        <span>Salvando...</span>
                    `;

                    const estado = window.escalaManagerService.getEstadoAtual();
                    const resultado = await this.salvarEscala(estado);
                    
                    if (resultado.code === 200) {
                        this.exibirNotificacaoSucesso(resultado, true); // true indica modo edição
                    }
                    
                } catch (error) {
                    console.error('Erro ao salvar:', error);
                    alert('Erro ao salvar escala. Tente novamente.');
                } finally {
                    // Restaurar estado original do botão
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalText;
                }
                return;
            }
            
            // Modo criação - usar modal
            const response = await fetch(`${window.APP_CONFIG.baseUrl}/src/pages/escalas/build-escala/components/salvar-escala-modal.php`);
            const html = await response.text();
            
            const modalDiv = document.createElement('div');
            modalDiv.innerHTML = html;
            document.body.appendChild(modalDiv);

            const fecharModal = () => modalDiv.remove();
            modalDiv.querySelectorAll('.fechar-modal-salvar').forEach(btn => 
                btn.addEventListener('click', fecharModal)
            );

            // Evento de confirmação
            const btnConfirmar = modalDiv.querySelector('#btn-confirmar-salvar');
            if (!btnConfirmar) {
                console.error('Botão confirmar não encontrado no modal');
                return;
            }
            btnConfirmar.onclick = async () => {
                try {
                    // Adiciona loading no botão
                    btnConfirmar.disabled = true;
                    btnConfirmar.innerHTML = `
                        <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        <span>Salvando...</span>
                    `;

                    const estado = window.escalaManagerService.getEstadoAtual();
                    const resultado = await this.salvarEscala(estado);

                    // Fecha o modal e exibe notificação
                    fecharModal();
                    this.exibirNotificacaoSucesso(resultado, false); // false indica modo criação

                } catch (error) {
                    console.error('Erro ao salvar:', error);
                    alert('Erro ao salvar escala. Tente novamente.');
                    btnConfirmar.disabled = false;
                    btnConfirmar.innerHTML = '<span>Confirmar</span>';
                }
            };

        } catch (error) {
            console.error('Erro ao abrir modal:', error);
        }
    }

    /**
     * Salva a escala na API
     */
    async salvarEscala(estado) {
        try {
            // Detecta se estamos no modo edição
        const hasEditPath = window.location.pathname.includes('/editar') || window.location.pathname.includes('escalas/editar');
        const hasIdParam = new URLSearchParams(window.location.search).has('id');
        const hasEscalaCarregada = window.EscalaEditarService && window.EscalaEditarService.escalaCarregada;
        
        // Verifica também se o botão foi alterado para "Salvar" (indicativo de modo edição)
        const submitButton = document.querySelector('[data-action="salvar-escala"]');
        const buttonTextIsSalvar = submitButton && submitButton.textContent.trim().includes('Salvar');
        
        const isEditMode = (hasEditPath && hasIdParam) || hasEscalaCarregada || buttonTextIsSalvar;
            const escalaId = isEditMode ? new URLSearchParams(window.location.search).get('id') : null;

            if (isEditMode && escalaId) {
                // Modo edição - atualizar escala existente
                if (!window.EscalaEditarService) {
                    throw new Error('Serviço de edição não encontrado');
                }
                return await window.EscalaEditarService.atualizar(escalaId, estado);
            } else {
                // Modo criação - criar nova escala
                const response = await fetch(`${window.APP_CONFIG.baseUrl}/src/services/api/escalas/create.php`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'ministerio-id': window.USER.ministerio_atual,
                        'organizacao-id': window.USER.organizacao_id || '1'
                    },
                    body: JSON.stringify({
                        ...estado,
                        ministerio_id: window.USER.ministerio_atual,
                        organizacao_id: window.USER.organizacao_id || '1'
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Erro ao salvar escala: ${errorData.error || response.statusText}`);
                }

                return await response.json();
            }
        } catch (error) {
            console.error('Erro ao salvar escala:', error);
            throw error;
        }
    }

    /**
     * Exibe notificação de sucesso com botões de ação
     */
    exibirNotificacaoSucesso(resultado, isEditMode = false) {
        // Remove notificações existentes
        const existingNotification = document.querySelector('.notification-sucesso-escala');
        if (existingNotification) {
            this.removerNotificacao(existingNotification);
        }

        // Criar notificação
        const notification = document.createElement('div');
        notification.className = 'notification-sucesso-escala fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 border border-green-200 dark:border-green-700 rounded-lg shadow-lg p-4 z-50 max-w-lg opacity-0 translate-y-4 transition-all duration-300 ease-out';
        
        const escalaId = resultado.data?.escala_id || resultado.data?.id;
        const prefixo = resultado.data?.prefixo;
        const slug = resultado.data?.slug;
        
        notification.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="flex-shrink-0">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <div class="flex-1">
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
                        ${isEditMode ? 'Escala atualizada com sucesso!' : 'Escala criada com sucesso!'}
                    </h3>
                    <div class="flex gap-2 flex-wrap">
                        ${prefixo && slug ? `
                            <button type="button" id="notif-ver-escala" class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md flex items-center gap-1">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                                </svg>
                                Ver Escala
                            </button>
                            <button type="button" id="notif-copiar-link" class="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-md flex items-center gap-1">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                                </svg>
                                Copiar URL
                            </button>
                        ` : ''}
                        <button type="button" id="notif-voltar-lista" class="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white text-xs rounded-md flex items-center gap-1">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                            </svg>
                            Voltar à Listagem
                        </button>
                    </div>
                </div>
                <button type="button" id="notif-fechar" class="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animação de entrada
        setTimeout(() => {
            notification.classList.remove('opacity-0', 'translate-y-4');
            notification.classList.add('opacity-100', 'translate-y-0');
        }, 10);
        
        // Configurar eventos dos botões
        this.configurarBotoesNotificacao(notification, resultado, escalaId, prefixo, slug);
        
        // Auto-remover após 8 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                this.removerNotificacao(notification);
            }
        }, 8000);
    }

    /**
     * Remove notificação com animação
     */
    removerNotificacao(notification) {
        notification.classList.remove('opacity-100', 'translate-y-0');
        notification.classList.add('opacity-0', 'translate-y-4');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }

    /**
     * Configura os eventos dos botões da notificação
     */
    configurarBotoesNotificacao(notification, resultado, escalaId, prefixo, slug) {
        // Botão fechar
        const btnFechar = notification.querySelector('#notif-fechar');
        if (btnFechar) {
            btnFechar.onclick = () => this.removerNotificacao(notification);
        }
        
        // Botão ver escala
        const btnVerEscala = notification.querySelector('#notif-ver-escala');
        if (btnVerEscala && prefixo && slug) {
            const linkEscala = `https://escalas.basechurch.com.br/ver?ec=${prefixo}-${slug}`;
            btnVerEscala.onclick = () => {
                window.open(linkEscala, '_blank');
            };
        }
        
        // Botão copiar link
        const btnCopiarLink = notification.querySelector('#notif-copiar-link');
        if (btnCopiarLink && prefixo && slug) {
            const linkEscala = `https://escalas.basechurch.com.br/ver?ec=${prefixo}-${slug}`;
            btnCopiarLink.onclick = () => {
                navigator.clipboard.writeText(linkEscala).then(() => {
                    const originalHTML = btnCopiarLink.innerHTML;
                    btnCopiarLink.innerHTML = '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';
                    btnCopiarLink.classList.remove('bg-blue-500', 'hover:bg-blue-600');
                    btnCopiarLink.classList.add('bg-green-500', 'hover:bg-green-600');
                    
                    setTimeout(() => {
                        btnCopiarLink.innerHTML = originalHTML;
                        btnCopiarLink.classList.remove('bg-green-500', 'hover:bg-green-600');
                        btnCopiarLink.classList.add('bg-blue-500', 'hover:bg-blue-600');
                    }, 2000);
                }).catch(() => {
                    alert('Erro ao copiar o link');
                });
            };
        }
        
        // Botão voltar à listagem (não abre nova aba)
        const btnVoltarLista = notification.querySelector('#notif-voltar-lista');
        if (btnVoltarLista) {
            btnVoltarLista.onclick = () => {
                window.location.href = `${window.APP_CONFIG.baseUrl}/escalas`;
            };
        }
    }

    /**
     * Configura os botões de ação no modal de sucesso
     */
    configurarBotoesAcaoModal(modalDiv, resultado) {
        const escalaData = resultado.data || resultado;
        const escalaId = escalaData?.escala_id || escalaData?.id;
        const prefixo = escalaData?.prefixo;
        const slug = escalaData?.slug;
        
        // Botão Link da Escala
        const btnLinkEscala = modalDiv.querySelector('#btn-link-escala');
        const btnCopiarLink = modalDiv.querySelector('#btn-copiar-link');
        
        if (btnLinkEscala && prefixo && slug) {
            const linkEscala = `https://escalas.basechurch.com.br/ver?ec=${prefixo}-${slug}`;
            
            // Botão para abrir o link
            btnLinkEscala.onclick = () => {
                window.open(linkEscala, '_blank');
            };
            
            // Botão para copiar o link
            if (btnCopiarLink) {
                btnCopiarLink.onclick = () => {
                    navigator.clipboard.writeText(linkEscala).then(() => {
                        // Feedback visual temporário
                        const originalHTML = btnCopiarLink.innerHTML;
                        btnCopiarLink.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';
                        btnCopiarLink.classList.remove('bg-blue-500', 'hover:bg-blue-600');
                        btnCopiarLink.classList.add('bg-green-500', 'hover:bg-green-600');
                        
                        setTimeout(() => {
                            btnCopiarLink.innerHTML = originalHTML;
                            btnCopiarLink.classList.remove('bg-green-500', 'hover:bg-green-600');
                            btnCopiarLink.classList.add('bg-blue-500', 'hover:bg-blue-600');
                        }, 2000);
                    }).catch(() => {
                        alert('Erro ao copiar o link');
                    });
                };
            }
        } else if (btnLinkEscala) {
            // Se não tiver prefixo/slug, desabilita o botão
            btnLinkEscala.disabled = true;
            btnLinkEscala.textContent = 'Link não disponível';
            btnLinkEscala.classList.add('opacity-50', 'cursor-not-allowed');
            if (btnCopiarLink) {
                btnCopiarLink.disabled = true;
            }
        }
        
        // Botão Continuar Editando
        const btnContinuarEditando = modalDiv.querySelector('#btn-continuar-editando');
        if (btnContinuarEditando && escalaId) {
            btnContinuarEditando.onclick = () => {
                window.location.href = `${window.URL_BASE}/escalas/editar?id=${escalaId}`;
            };
        }
    }
}

window.submitEscalaService = new SubmitEscalaService();
