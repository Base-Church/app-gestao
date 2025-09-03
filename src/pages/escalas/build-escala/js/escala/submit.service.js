/**
 * Serviço para gerenciar o envio/submit da escala
 */
class SubmitEscalaService {
    constructor() {
        this.init();
    }

    init() {
        // Configura o botão baseado na URL
        this.configurarBotao();
        
        // Adiciona event listener e armazena referência do botão
        this.botao = document.querySelector('[data-action="salvar-escala"]');
        if (this.botao) {
            this.botao.addEventListener('click', () => {
                this.handleClick();
            });
        }
    }

    configurarBotao() {
        const botao = document.querySelector('[data-action="salvar-escala"]');
        if (!botao) return;

        const isEditMode = this.isEditMode();
        
        if (isEditMode) {
            // Modo edição - botão "Salvar"
            botao.innerHTML = `
                Salvar
            `;
        } else {
            // Modo criação - botão "Criar escala"
            botao.innerHTML = `
                Criar escala
            `;
        }
    }

    isEditMode() {
        const urlParams = new URLSearchParams(window.location.search);
        const escalaId = urlParams.get('id');
        const isEditPath = window.location.pathname.includes('/editar');
        return isEditPath && escalaId;
    }

    async handleClick() {
        const isEditMode = this.isEditMode();
        
        if (isEditMode) {
            // Modo edição - salvar diretamente
            const botao = this.botao;
            const textoOriginal = botao.innerHTML;
            
            // Mostrar loading
            botao.disabled = true;
            botao.innerHTML = `
                <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                Salvando...
            `;
            
            try {
                await this.salvarEscala();
            } finally {
                // Restaurar botão
                botao.disabled = false;
                botao.innerHTML = textoOriginal;
            }
        } else {
            // Modo criação - abrir modal
            await this.abrirModalCriar();
        }
    }

    async abrirModalCriar() {
        try {
            const response = await fetch(`${window.APP_CONFIG.baseUrl}/src/pages/escalas/build-escala/components/criar-escala-modal.php`);
            if (!response.ok) throw new Error('Erro ao carregar modal');
            
            const html = await response.text();
            const modalDiv = document.createElement('div');
            modalDiv.innerHTML = html;
            document.body.appendChild(modalDiv);

            // Configurar botões de fechar
            modalDiv.querySelectorAll('.fechar-modal-salvar').forEach(btn => 
                btn.addEventListener('click', () => modalDiv.remove())
            );

            // Configurar botão de confirmação
            const btnConfirmar = modalDiv.querySelector('#btn-confirmar-salvar');
            if (btnConfirmar) {
                btnConfirmar.onclick = async () => {
                    btnConfirmar.disabled = true;
                    btnConfirmar.innerHTML = `
                        <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        <span>Criando...</span>
                    `;

                    try {
                        const resultado = await this.salvarEscala();
                        
                        // Mostrar modal de sucesso
                        const modalContent = modalDiv.querySelector('#modal-content-salvar');
                        const modalSuccess = modalDiv.querySelector('#modal-success-salvar');
                        
                        modalContent.classList.add('hidden');
                        modalSuccess.classList.remove('hidden');
                        
                        // Configurar botões com dados da resposta
                        const escalaId = resultado.data.escala_id;
                        const slug = resultado.data.slug;
                        const prefixo = resultado.data.prefixo;
                        
                        // Botão Ver Link
                        const btnLinkEscala = modalDiv.querySelector('#btn-link-escala');
                        if (btnLinkEscala) {
                            btnLinkEscala.addEventListener('click', () => {
                                const linkEscala = `https://escalas.basechurch.com.br/ver?ec=${prefixo}-${slug}`;
                                window.open(linkEscala, '_blank');
                            });
                        }
                        
                        // Botão Copiar Link
                        const btnCopiarLink = modalDiv.querySelector('#btn-copiar-link');
                        if (btnCopiarLink) {
                            btnCopiarLink.addEventListener('click', async () => {
                                const linkEscala = `https://escalas.basechurch.com.br/ver?ec=${prefixo}-${slug}`;
                                try {
                                    await navigator.clipboard.writeText(linkEscala);
                                    btnCopiarLink.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>Copiado!';
                                    setTimeout(() => {
                                        btnCopiarLink.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>Copiar';
                                    }, 2000);
                                } catch (err) {
                                    alert('Erro ao copiar link');
                                }
                            });
                        }
                        
                        // Botão Continuar Editando
                        const btnContinuarEditando = modalDiv.querySelector('#btn-continuar-editando');
                        if (btnContinuarEditando) {
                            btnContinuarEditando.addEventListener('click', () => {
                                window.location.href = `${window.APP_CONFIG.baseUrl}/escalas/editar?id=${escalaId}`;
                            });
                        }
                        
                        // Botão Voltar à Listagem
                        const btnVoltarListagem = modalDiv.querySelector('#btn-voltar-listagem');
                        if (btnVoltarListagem) {
                            btnVoltarListagem.addEventListener('click', () => {
                                window.location.href = `${window.APP_CONFIG.baseUrl}/escalas`;
                            });
                        }
                        
                        // Configurar botão de fechar no modal de sucesso
                        const btnFecharSucesso = modalSuccess.querySelector('.fechar-modal-salvar');
                        if (btnFecharSucesso) {
                            btnFecharSucesso.addEventListener('click', () => modalDiv.remove());
                        }
                    } catch (error) {
                        console.error('Erro ao criar escala:', error);
                        alert('Erro ao criar escala: ' + error.message);
                        btnConfirmar.disabled = false;
                        btnConfirmar.innerHTML = '<span>Confirmar</span>';
                    }
                };
            }
        } catch (error) {
            console.error('Erro ao abrir modal:', error);
            alert('Erro ao abrir modal: ' + error.message);
        }
    }

    async salvarEscala() {
        try {
            const estado = window.escalaManagerService.getEstadoAtual();
            const isEditMode = this.isEditMode();
            
            let response;
            
            if (isEditMode) {
                // Modo edição - usar put-v2.php
                const urlParams = new URLSearchParams(window.location.search);
                const escalaId = urlParams.get('id');
                
                const payload = {
                    id: escalaId,
                    nome: estado.cabecalho.nome,
                    tipo: estado.cabecalho.tipo,
                    data_inicio: estado.cabecalho.dataInicio,
                    data_fim: estado.cabecalho.dataTermino,
                    eventos: estado.itens || []
                };
                
                response = await fetch(`${window.APP_CONFIG.baseUrl}/src/services/api/escalas/put-v2.php`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'MINISTERIO-ID': window.USER.ministerio_atual,
                        'ORGANIZACAO-ID': window.USER.organizacao_id
                    },
                    body: JSON.stringify(payload)
                });
            } else {
                // Modo criação - usar create.php
                response = await fetch(`${window.APP_CONFIG.baseUrl}/src/services/api/escalas/create.php`, {
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
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
            }

            const resultado = await response.json();
            
            // Verificar se há erro real (não confundir mensagem de sucesso com erro)
            if (resultado.code && resultado.code !== 200 && resultado.code !== 201) {
                throw new Error(resultado.message || 'Erro ao salvar escala');
            }

            // Se for modo edição, mostrar notificação de sucesso
            if (isEditMode) {
                this.exibirNotificacaoSucesso(resultado);
            }

            // Limpar seleções de voluntários desta pessoa após salvar com sucesso
            if (window.voluntariosRealtimeService) {
                console.log('Limpando seleções de voluntários desta pessoa após salvar escala');
                window.voluntariosRealtimeService.clearMySelections();
            }

            return resultado;
        } catch (error) {
            console.error('Erro ao salvar escala:', error);
            throw error;
        }
    }

    exibirNotificacaoSucesso(resultado) {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[6000] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 max-w-sm w-full mx-4';
        
        // Extrair dados da resposta
        const escalaId = resultado.data?.escala_id || resultado.data?.id;
        const slug = resultado.data?.slug;
        const prefixo = resultado.data?.prefixo;
        
        notification.innerHTML = `
            <div class="text-center">
                <div class="flex items-center justify-center gap-3 mb-3">
                    <div class="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 dark:bg-green-900">
                        <svg class="h-4 w-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">Escala salva com sucesso!</h3>
                </div>
                
                <div class="grid gap-2">
                    ${slug && prefixo ? `
                        <div class="grid grid-cols-2 gap-2">
                            <button id="btn-ver-escala-notif" class="bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
                                Ver Escala
                            </button>
                            <button id="btn-voltar-listagem-notif" class="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded text-sm font-medium transition-colors">
                                Listagem
                            </button>
                        </div>
                    ` : `
                        <button id="btn-voltar-listagem-notif" class="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded text-sm font-medium transition-colors">
                            Voltar à Listagem
                        </button>
                    `}
                </div>
                
                <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" onclick="this.parentElement.parentElement.remove()">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
        `;

        document.body.appendChild(notification);
        
        // Configurar botões
        const btnVerEscala = notification.querySelector('#btn-ver-escala-notif');
        if (btnVerEscala && slug && prefixo) {
            btnVerEscala.addEventListener('click', () => {
                window.open(`https://escalas.basechurch.com.br/ver?ec=${prefixo}-${slug}`, '_blank');
            });
        }
        
        const btnVoltarListagem = notification.querySelector('#btn-voltar-listagem-notif');
        if (btnVoltarListagem) {
            btnVoltarListagem.addEventListener('click', () => {
                window.location.href = `${window.APP_CONFIG.baseUrl}/escalas`;
            });
        }

        // Remove automaticamente após 8 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 8000);
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.submitEscalaService = new SubmitEscalaService();
});
