import VoluntariosAPI from './api.js';

export class NotificacaoApp {
    constructor() {
        this.modal = document.getElementById('modal-notificacao');
        this.voluntariosList = document.getElementById('voluntarios-notificacao');
        this.voluntariosPendentes = [];
        this.voluntariosSelecionados = new Set(); // Add selected volunteers tracking
    }

    toggleModal(show) {
        if (!this.modal) return;
        
        if (show) {
            this.carregarVoluntariosPendentes();
            this.modal.classList.remove('hidden');
        } else {
            this.modal.classList.add('hidden');
        }
    }

    carregarVoluntariosPendentes() {
        const currentMonth = new Date().toISOString().slice(0, 7);
        const nextMonth = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().slice(0, 7);
        
        // Filtra voluntários que não preencheram ou estão desatualizados
        this.voluntariosPendentes = window.app.voluntarios.filter(v => {
            const mes = v.mes_indisponibilidade;
            return !mes || (mes !== currentMonth && mes !== nextMonth);
        });

        // Atualiza contadores
        const naoPreencheram = this.voluntariosPendentes.filter(v => !v.mes_indisponibilidade).length;
        const desatualizados = this.voluntariosPendentes.length - naoPreencheram;

        document.getElementById('nao-preencheu-count').textContent = naoPreencheram;
        document.getElementById('desatualizado-count').textContent = desatualizados;

        // Renderiza lista
        this.renderizarLista();
    }

    renderizarLista() {
        if (!this.voluntariosList) return;

        this.voluntariosList.innerHTML = this.voluntariosPendentes.map(voluntario => `
            <div class="bg-white dark:bg-gray-700 rounded-lg shadow-sm transition-all cursor-pointer 
                      ${this.voluntariosSelecionados.has(voluntario.id) ? 
                        'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20' : 
                        'hover:bg-gray-50 dark:hover:bg-gray-600'}"
                 onclick="window.notificacaoApp.toggleSelecao(${voluntario.id})"
                 data-voluntario-id="${voluntario.id}">
                <div class="p-4 flex items-center gap-4">
                    <div class="flex-shrink-0">
                        <div class="relative">
                            <img class="h-12 w-12 rounded-full object-cover" 
                                 src="${voluntario.foto || `${window.BASE_URL}/assets/img/placeholder.jpg`}" 
                                 alt="${voluntario.nome}">
                            ${this.voluntariosSelecionados.has(voluntario.id) ? `
                                <div class="absolute -top-1 -right-1 bg-primary-500 rounded-full p-1">
                                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                                    </svg>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h4 class="text-sm font-medium text-gray-900 dark:text-white">${voluntario.nome}</h4>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            ${voluntario.mes_indisponibilidade ? 'Desatualizado' : 'Não preencheu'}
                        </p>
                        <div class="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                            </svg>
                            ${this.formatWhatsApp(voluntario.whatsapp)}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    formatWhatsApp(numero) {
        if (!numero) return '-';
        numero = numero.replace('@s.whats', '').replace(/\D/g, '');
        if (numero.startsWith('55')) numero = numero.substring(2);
        if (numero.length === 11) {
            return `(${numero.slice(0,2)}) ${numero.slice(2,7)}-${numero.slice(7)}`;
        }
        return numero;
    }

    async notificarVoluntario(whatsapp, nome) {
        try {
            // Aqui você implementa a lógica de envio da notificação
            // Por exemplo, usando a API do WhatsApp
            console.log(`Notificando ${nome} no WhatsApp ${whatsapp}`);
            
            // Mostra notificação de sucesso
            window.app.showNotification(`Notificação enviada para ${nome}`);
        } catch (error) {
            console.error('Erro ao enviar notificação:', error);
            window.app.showNotification('Erro ao enviar notificação', 'error');
        }
    }

    toggleSelecao(id) {
        if (this.voluntariosSelecionados.has(id)) {
            this.voluntariosSelecionados.delete(id);
        } else {
            this.voluntariosSelecionados.add(id);
        }
        this.renderizarLista();
        this.atualizarBotaoNotificar();
    }

    toggleSelecionarTodos() {
        // Se todos estão selecionados, desmarca todos
        if (this.voluntariosSelecionados.size === this.voluntariosPendentes.length) {
            this.voluntariosSelecionados.clear();
        } else {
            // Caso contrário, seleciona todos
            this.voluntariosSelecionados = new Set(
                this.voluntariosPendentes.map(v => v.id)
            );
        }
        this.renderizarLista();
        this.atualizarBotaoNotificar();
    }

    atualizarBotaoNotificar() {
        const button = document.querySelector('[onclick="window.notificacaoApp.notificarTodos()"]');
        if (button) {
            button.textContent = this.voluntariosSelecionados.size > 0 
                ? `Notificar Selecionados (${this.voluntariosSelecionados.size})` 
                : 'Notificar Todos';
        }
    }

    async notificarTodos() {
        try {
            const voluntariosParaNotificar = this.voluntariosSelecionados.size > 0 
                ? this.voluntariosPendentes.filter(v => this.voluntariosSelecionados.has(v.id))
                : this.voluntariosPendentes;

            this.toggleLoading(true);

            const mesAtual = new Date();
            mesAtual.setMonth(mesAtual.getMonth() + 1);
            const mes = mesAtual.toISOString().slice(0, 7).replace('-', '/');

            const response = await VoluntariosAPI.enviarNotificacoes({
                mes,
                ministerio_id: window.USER.ministerio_atual,
                destinatarios: voluntariosParaNotificar.map(v => ({
                    nome: v.nome,
                    numero: v.whatsapp.replace('@s.whats', '')
                }))
            });

            // Processa o resultado
            if (response.data.sucesso) {
                const { resumo, detalhes } = response.data;
                this.mostrarResultadoNotificacao(resumo, detalhes);
            } else {
                throw new Error(response.data.message || 'Erro ao enviar notificações');
            }

            this.voluntariosSelecionados.clear();
            this.toggleModal(false);
        } catch (error) {
            console.error('Erro ao notificar:', error);
            window.app.showNotification(error.message || 'Erro ao enviar notificações', 'error');
        } finally {
            this.toggleLoading(false);
        }
    }

    mostrarResultadoNotificacao(resumo, detalhes) {
        // Cria um modal de resultado
        const resultModal = document.createElement('div');
        resultModal.className = 'fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4';
        resultModal.style.zIndex = '10000';

        resultModal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg">
                <div class="p-6">
                    <div class="text-center mb-6">
                        <div class="mb-4">
                            <svg class="w-12 h-12 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Notificações Enviadas</h3>
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Total processado: ${resumo.total}</p>
                    </div>

                    <div class="grid grid-cols-3 gap-4 mb-6">
                        <div class="text-center p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                            <div class="text-2xl font-bold text-green-600 dark:text-green-400">${resumo.notificados}</div>
                            <div class="text-sm text-green-600 dark:text-green-400">Notificados</div>
                        </div>
                        <div class="text-center p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                            <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">${resumo.jaNotificados}</div>
                            <div class="text-sm text-yellow-600 dark:text-yellow-400">Já Notificados</div>
                        </div>
                        <div class="text-center p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                            <div class="text-2xl font-bold text-red-600 dark:text-red-400">${resumo.erros}</div>
                            <div class="text-sm text-red-600 dark:text-red-400">Erros</div>
                        </div>
                    </div>

                    ${this.renderizarDetalhes(detalhes)}

                    <div class="mt-6 text-center">
                        <button onclick="this.closest('.fixed').remove()" 
                                class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-500">
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(resultModal);
    }

    renderizarDetalhes(detalhes) {
        const sections = [];

        if (detalhes.notificados.length > 0) {
            sections.push(`
                <div class="mb-4">
                    <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Notificados com Sucesso</h4>
                    <div class="space-y-1">
                        ${detalhes.notificados.map(item => `
                            <div class="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                </svg>
                                ${item.nome}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `);
        }

        if (detalhes.jaNotificados.length > 0) {
            sections.push(`
                <div class="mb-4">
                    <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Já Notificados</h4>
                    <div class="space-y-1">
                        ${detalhes.jaNotificados.map(item => `
                            <div class="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                <svg class="w-4 h-4 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                                </svg>
                                ${item.nome} - ${item.motivo}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `);
        }

        if (detalhes.erros.length > 0) {
            sections.push(`
                <div class="mb-4">
                    <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Erros</h4>
                    <div class="space-y-1">
                        ${detalhes.erros.map(item => `
                            <div class="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                <svg class="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                                ${item.nome} - ${item.motivo || 'Erro desconhecido'}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `);
        }

        return sections.length > 0 
            ? `<div class="border-t dark:border-gray-700 pt-4">${sections.join('')}</div>` 
            : '';
    }

    toggleLoading(show) {
        const content = this.modal.querySelector('.space-y-4');
        const loadingEl = this.modal.querySelector('.loading-overlay');

        if (show) {
            // Cria e mostra loading se não existir
            if (!loadingEl) {
                const loading = document.createElement('div');
                loading.className = 'loading-overlay flex items-center justify-center p-8';
                loading.innerHTML = `
                    <div class="flex flex-col items-center">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">Enviando notificações...</p>
                    </div>
                `;
                content.parentNode.appendChild(loading);
            }
            content.classList.add('hidden');
        } else {
            // Remove loading e mostra conteúdo
            content.classList.remove('hidden');
            loadingEl?.remove();
        }
    }
}

// Inicializa e expõe globalmente
window.addEventListener('load', () => {
    window.notificacaoApp = new NotificacaoApp();
});
