import VoluntariosAPI from './api.js';
import VoluntariosServices from './services.js';
import { SyncService } from './sync.js';

export class VoluntariosPage {
    constructor() {
        this.currentPage = 1;
        this.search = '';
        this.status = 'todos'; // Alterado valor inicial
        this.atividades = [];
        this.categorias = [];
        this.currentVoluntario = null; // Adiciona estado para o voluntário atual
        this.syncService = new SyncService();

        // Adicionar listener para mudanças no ministério
        window.addEventListener('ministerio-changed', () => {
            this.loadDependencies();
            this.loadVoluntarios();
        });

        // Verificar ministério atual
        if (!window.USER?.ministerio_atual) {
            this.showError('Selecione um ministério para continuar');
            return;
        }

        // Alteramos a ordem de inicialização para garantir que as dependências sejam carregadas primeiro
        this.initializeApp();
    }

    async initializeApp() {
        try {
            await this.loadDependencies(); // Carrega atividades primeiro
            this.initializeEventListeners();
            this.loadVoluntarios(); // Carrega voluntários depois
            this.initializeFormListener();
        } catch (error) {
            this.showError('Erro ao carregar dados necessários');
        }
    }

    showError(message) {
        const error = document.getElementById('error-container');
        const errorMessage = document.getElementById('error-message');
        if (error && errorMessage) {
            errorMessage.textContent = message;
            error.classList.remove('hidden');
        }
    }

    async loadDependencies() {
        try {
            // Verificar ministério atual
            if (!window.USER?.ministerio_atual) {
                throw new Error('Nenhum ministério selecionado');
            }

            const [atividades, ministerios, categorias] = await Promise.all([
                VoluntariosServices.getAtividades(),
                VoluntariosServices.getMinisterios(),
                VoluntariosServices.getCategorias()
            ]);
            this.atividades = atividades.data;
            this.ministerios = ministerios.data;
            this.categorias = categorias.data;
        } catch (error) {
            this.showError(error.message);
        }
    }

    initializeEventListeners() {
        // Search Input com debounce mais curto e melhor feedback
        const searchInput = document.getElementById('search-input');
        searchInput?.addEventListener('input', this.debounce(() => {
            this.search = searchInput.value;
            // Usar os dados já carregados ao invés de fazer nova requisição
            this.renderVoluntarios({ data: this.voluntarios });
        }, 300)); // Reduzido para 300ms para feedback mais rápido

        // Status Filter
        const statusSelect = document.getElementById('status-select');
        statusSelect?.addEventListener('change', () => {
            this.status = statusSelect.value;
            // Usar os dados já carregados ao invés de fazer nova requisição
            this.renderVoluntarios({ data: this.voluntarios });
        });

        // Botão Sincronizar
        const syncButton = document.getElementById('sync-button');
        syncButton?.addEventListener('click', async () => {
            try {
                const result = await this.syncService.syncVoluntarios(this.voluntarios);
                this.voluntarios = result.data;
                this.renderVoluntarios({ data: result.data, stats: result.stats });
                this.showNotification('Voluntários sincronizados com sucesso');
            } catch (error) {
                this.showError(error.message);
            }
        });
    }

    initializeFormListener() {
        const form = document.getElementById('form-create');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleSubmit(e);
            });
        }
    }

    async loadVoluntarios() {
        // Verificar ministério atual antes de carregar
        if (!window.USER?.ministerio_atual) {
            this.showError('Selecione um ministério para continuar');
            return;
        }

        const loading = document.getElementById('loading-indicator');
        const error = document.getElementById('error-container');
        const empty = document.getElementById('empty-state');
        const grid = document.getElementById('voluntarios-grid');

        try {
            loading.classList.remove('hidden');
            error.classList.add('hidden');
            empty.classList.add('hidden');
            grid.classList.add('hidden');

            const params = {
                page: this.currentPage,
                search: this.search,
                status: this.status,
                ministerio_id: window.USER.ministerio_atual // Adicionar ministério atual
            };

            const data = await VoluntariosAPI.getVoluntarios(params);

            // Salva a lista de voluntários
            this.voluntarios = data.data;

            this.renderVoluntarios(data);
            // Removida a chamada do renderPagination que causava o erro

        } catch (err) {
            this.showError(err.message || 'Erro ao carregar voluntários');
        } finally {
            loading.classList.add('hidden');
        }
    }

    // Adicionar método toggleModal
    toggleModal(show, voluntario = null) {
        const modal = document.getElementById('modal-create');
        if (!modal) return;

        try {
            if (show && voluntario) {
                this.currentVoluntario = typeof voluntario === 'string' 
                    ? JSON.parse(voluntario) 
                    : voluntario;

                modal.classList.remove('hidden');
                this.loadVoluntarioData(this.currentVoluntario);
            } else {
                this.currentVoluntario = null;
                modal.classList.add('hidden');
            }
        } catch (error) {
            this.showNotification('Erro ao abrir modal', 'error');
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
            type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
        } transition-all duration-300 transform translate-y-0`;
        
        notification.innerHTML = `
            <div class="flex items-center">
                <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    ${type === 'success' 
                        ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>'
                        : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>'
                    }
                </svg>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('translate-y-full', 'opacity-0');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    async loadVoluntarioData(voluntario) {
        if (!voluntario) return;

        try {
            const form = document.getElementById('form-create');
            if (!form) return;

            // Reset form e campos
            form.reset();

            // Atualiza campos básicos
            const fields = {
                'voluntario-id': voluntario.id,
                'nome': voluntario.nome,
                'whatsapp': voluntario.whatsapp?.replace('@s.whats', '') || '',
                'status': voluntario.status,
                'onboarding': voluntario.onboarding // Adiciona onboarding
            };

            Object.entries(fields).forEach(([id, value]) => {
                const element = form.querySelector(`#${id}`);
                if (element) {
                    if (element.type === 'checkbox') {
                        element.checked = Boolean(value);
                    } else {
                        element.value = value;
                    }
                }
            });

            // Atualiza foto
            const fotoPreview = document.getElementById('foto_preview');
            if (fotoPreview) {
                fotoPreview.innerHTML = voluntario.foto 
                    ? `<img src="${voluntario.foto}" class="h-full w-full object-cover">`
                    : `<img src="${window.BASE_URL}/assets/img/placeholder.jpg" class="h-full w-full object-cover">`;
            }

            // Atualiza ministérios
            if (voluntario.ministerios) {
                this.renderMinisterios(voluntario.ministerios);
            }

            // Atualiza atividades
            if (voluntario.atividades) {
                this.updateAtividadesSelection(voluntario.atividades);
            }

        } catch (error) {
            this.showNotification('Erro ao carregar dados do voluntário', 'error');
        }
    }

    renderMinisterios(ministerios) {
        const container = document.getElementById('ministerios-container').querySelector('div');
        if (!container) return;

        try {
            const ministeriosArray = typeof ministerios === 'string' 
                ? JSON.parse(ministerios) 
                : ministerios;

            container.innerHTML = ministeriosArray.map(id => {
                const ministerio = this.ministerios.find(m => m.id === parseInt(id));
                if (!ministerio) return '';
                
                return `
                    <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
                        ${ministerio.nome}
                    </span>
                `;
            }).join('');
        } catch (error) {
            container.innerHTML = '';
        }
    }

    updateAtividadesSelection(atividades) {
        const container = document.getElementById('atividades-container');
        if (!container || !this.atividades || !this.categorias) return;

        let atividadesSelecionadas = [];
        try {
            // Garante que temos um array de IDs
            atividadesSelecionadas = typeof atividades === 'string' 
                ? JSON.parse(atividades) 
                : (Array.isArray(atividades) ? atividades : []);

            // Converte todos os IDs para string para comparação consistente
            atividadesSelecionadas = atividadesSelecionadas.map(id => id.toString());
        } catch (error) {
        }

        // Agrupa atividades por categoria
        const atividadesPorCategoria = this.atividades.reduce((acc, atividade) => {
            const categoria = this.categorias.find(c => c.id === atividade.categoria_atividade_id);
            if (!categoria) return acc;

            if (!acc[categoria.id]) {
                acc[categoria.id] = {
                    nome: categoria.nome,
                    cor: categoria.cor,
                    atividades: []
                };
            }
            acc[categoria.id].atividades.push(atividade);
            return acc;
        }, {});

        container.innerHTML = Object.values(atividadesPorCategoria).map(categoria => `
            <div class="space-y-3">
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300" 
                    style="color: ${categoria.cor}">
                    ${categoria.nome}
                </h4>
                <div class="grid grid-cols-2 gap-3">
                    ${categoria.atividades.map(atividade => {
                        const isSelected = atividadesSelecionadas.includes(atividade.id.toString());
                        return `
                            <label class="cursor-pointer group">
                                <input type="checkbox" 
                                       name="atividades[]" 
                                       value="${atividade.id}"
                                       ${isSelected ? 'checked' : ''}
                                       class="hidden">
                                <div class="relative flex items-center p-3 rounded-lg border transition-all duration-200 ${
                                    isSelected 
                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                                        : 'border-gray-200 dark:border-gray-700 group-hover:border-primary-300'
                                }" style="border-bottom: 3px solid ${atividade.cor_indicador}">
                                    <div class="flex items-center space-x-3">
                                        <div class="flex-shrink-0 h-10 w-10">
                                            <img class="h-10 w-10 rounded-lg object-cover" 
                                                 src="${window.BASE_URL + (atividade.foto || '/assets/img/placeholder.jpg')}" 
                                                 alt="${atividade.nome}">
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-medium text-gray-900 dark:text-white">
                                                ${atividade.nome}
                                            </p>
                                        </div>
                                        ${isSelected ? `
                                            <div class="flex-shrink-0 text-primary-500">
                                                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                                                </svg>
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                            </label>
                        `;
                    }).join('')}
                </div>
            </div>
        `).join('');

        // Adiciona listener para atualização visual dos cards
        this.initializeAtividadesListeners();
    }

    initializeAtividadesListeners() {
        const container = document.getElementById('atividades-container');
        container.querySelectorAll('label').forEach(label => {
            label.addEventListener('click', (e) => {
                const checkbox = label.querySelector('input[type="checkbox"]');
                const card = label.querySelector('div');
                
                // Toggle o checkbox
                checkbox.checked = !checkbox.checked;
                
                // Atualiza a aparência do card
                if (checkbox.checked) {
                    card.classList.add('border-primary-500', 'bg-primary-50', 'dark:bg-primary-900/20');
                    card.classList.remove('border-gray-200', 'dark:border-gray-700');
                } else {
                    card.classList.remove('border-primary-500', 'bg-primary-50', 'dark:bg-primary-900/20');
                    card.classList.add('border-gray-200', 'dark:border-gray-700');
                }

                // Adiciona ou remove o ícone de check
                const checkIcon = card.querySelector('.text-primary-500');
                if (checkbox.checked && !checkIcon) {
                    const iconContainer = document.createElement('div');
                    iconContainer.className = 'flex-shrink-0 text-primary-500';
                    iconContainer.innerHTML = `
                        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                    `;
                    card.querySelector('.flex').appendChild(iconContainer);
                } else if (!checkbox.checked && checkIcon) {
                    checkIcon.remove();
                }

                // Previne o comportamento padrão do checkbox
                e.preventDefault();
            });
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        if (!this.currentVoluntario) {
            this.showNotification('Erro: Voluntário não encontrado', 'error');
            return;
        }

        const form = event.target;
        const formData = new FormData(form);

        try {
            const data = {
                id: this.currentVoluntario.id,
                nome: formData.get('nome'),
                whatsapp: formData.get('whatsapp') + '@s.whats',
                foto: this.currentVoluntario.foto,
                id_indisponibilidades: this.currentVoluntario.id_indisponibilidades,
                mes_indisponibilidade: this.currentVoluntario.mes_indisponibilidade,
                atividades: Array.from(formData.getAll('atividades[]')),
                status: formData.get('status') === 'on',
                onboarding: formData.get('onboarding') === 'on', // Adiciona onboarding
                ministerios: this.currentVoluntario.ministerios,
                organizacao_id: window.USER.organizacao_id
            };

            const response = await VoluntariosAPI.updateVoluntario(this.currentVoluntario.id, data);
            
            if (response.code === 200) {
                // Atualiza o voluntário na lista
                const updatedData = { ...this.currentVoluntario, ...data };
                const index = this.voluntarios.findIndex(v => v.id === this.currentVoluntario.id);
                
                if (index !== -1) {
                    this.voluntarios[index] = updatedData;
                    this.renderVoluntarios({ data: this.voluntarios });
                }
                
                this.showNotification('Voluntário atualizado com sucesso');
                this.toggleModal(false);
            }
        } catch (error) {
            this.showNotification(error.message || 'Erro ao atualizar voluntário', 'error');
        }
    }

    formatWhatsApp(numero) {
        if (!numero) return '-';
        
        // Remove @s.whats e outros caracteres não numéricos
        numero = numero.replace('@s.whats', '').replace(/\D/g, '');
        
        // Remove o prefixo 55 se existir
        if (numero.startsWith('55')) {
            numero = numero.substring(2);
        }
        
        // Formata o número
        if (numero.length === 11) {
            return `(${numero.slice(0,2)}) ${numero.slice(2,7)}-${numero.slice(7)}`;
        } else if (numero.length === 10) {
            return `(${numero.slice(0,2)}) ${numero.slice(2,6)}-${numero.slice(6)}`;
        }
        
        return numero;
    }

    renderIndisponibilidade(mes, inGroup) {
        // Só mostra "Não está no grupo" se inGroup for false E já tiver sido sincronizado
        if (inGroup !== undefined && !inGroup) {
            return '<span class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Não está no grupo</span>';
        }

        const now = new Date();
        const currentMonth = now.toISOString().slice(0, 7);
        const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const nextMonth = nextMonthDate.toISOString().slice(0, 7);

        const day = now.getDate();
        const inPrazo = day >= 22 && day <= 28;

        if (!mes) {
            return '<span class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Não preencheu</span>';
        }

        if (inPrazo) {
            if (mes === nextMonth) {
                return '<span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Preencheu</span>';
            }
            if (mes === currentMonth) {
                return '<span class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Não preencheu</span>';
            }
            // Fora dos dois, desatualizado
            return '<span class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">Desatualizado</span>';
        } else {
            // Fora do prazo, lógica antiga
            if (mes === currentMonth || mes === nextMonth) {
                return '<span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Preencheu</span>';
            }
            return '<span class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">Desatualizado</span>';
        }
    }

    renderVoluntarios(data) {
        const tbody = document.getElementById('voluntarios-list');
        const grid = document.getElementById('voluntarios-grid');
        const empty = document.getElementById('empty-state');

        // Remover indicador anterior se existir
        const oldIndicator = grid.querySelector('.indicador-grupo');
        if (oldIndicator) {
            oldIndicator.remove();
        }

        // Adiciona indicador de pessoas fora do grupo
        if (data.stats?.naoEstaNoGrupo > 0) {
            const indicator = document.createElement('div');
            indicator.className = 'mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900/30 dark:border-yellow-700 indicador-grupo';
            indicator.innerHTML = `
                <div class="flex items-center">
                    <svg class="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                    <span class="text-sm text-yellow-700 dark:text-yellow-300">
                        ${data.stats.naoEstaNoGrupo} ${data.stats.naoEstaNoGrupo === 1 ? 'pessoa não está' : 'pessoas não estão'} no grupo do WhatsApp
                    </span>
                </div>
            `;
            grid.insertBefore(indicator, tbody.parentElement);
        }

        // Filtrar e ordenar voluntários
        let voluntarios = Array.isArray(data.data) ? data.data : [];

        // Aplicar filtros
        if (this.search) {
            const searchLower = this.search.toLowerCase();
            voluntarios = voluntarios.filter(voluntario => 
                voluntario.nome.toLowerCase().includes(searchLower) || 
                this.formatWhatsApp(voluntario.whatsapp).includes(searchLower)
            );
        }

        // Ordenar por ordem alfabética com proteção contra nomes nulos/undefined
        voluntarios.sort((a, b) => {
            const nameA = (a?.nome || '').toLowerCase();
            const nameB = (b?.nome || '').toLowerCase();
            return nameA.localeCompare(nameB, 'pt-BR');
        });

        // Aplicar filtro de status
        if (this.status !== 'todos') {
            const currentMonth = new Date().toISOString().slice(0, 7);
            const nextMonth = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().slice(0, 7);
            
            voluntarios = voluntarios.filter(voluntario => {
                // Ignorar voluntários que não estão no grupo ao filtrar por preenchimento
                if (!voluntario.inGroup) return true;
                
                const preencheu = voluntario.mes_indisponibilidade === currentMonth || 
                                voluntario.mes_indisponibilidade === nextMonth;
                return this.status === 'preencheu' ? preencheu : !preencheu;
            });
        }

        // Exibir estado vazio se não houver resultados
        if (!voluntarios || !voluntarios.length) {
            empty?.classList.remove('hidden');
            grid?.classList.add('hidden');
            return;
        }

        grid?.classList.remove('hidden');
        empty?.classList.add('hidden');

        // Renderizar lista filtrada
        if (tbody) {
            tbody.innerHTML = voluntarios.map(voluntario => {
                const voluntarioString = JSON.stringify(voluntario).replace(/"/g, '&quot;');
                const whatsapp = this.formatWhatsApp(voluntario.whatsapp);
                const isWhatsappOnly = voluntario.whatsappOnly;
                
                // Só mostra o status "Não está no grupo" se já foi sincronizado (inGroup !== undefined)
                const showGroupStatus = voluntario.hasOwnProperty('inGroup') && 
                                     voluntario.inGroup !== undefined && 
                                     !voluntario.inGroup;
                
                return `
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div class="p-4">
                            <div class="flex items-center gap-4">
                                <!-- Foto e Informações Principais -->
                                <div class="flex-shrink-0">
                                    <img class="h-16 w-16 rounded-lg object-cover" 
                                         src="${voluntario.foto || `${window.BASE_URL}/assets/img/placeholder.jpg`}" 
                                         alt="${voluntario.nome}"
                                         onerror="this.src='${window.BASE_URL}/assets/img/placeholder.jpg'">
                                </div>
                                
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-2">
                                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                                ${voluntario.nome}
                                            </h3>
                                            ${showGroupStatus ? 
                                              '<span class="ml-2 text-xs font-normal text-red-500">(Não está no grupo)</span>' : ''}
                                            ${isWhatsappOnly ? 
                                              '<span class="ml-2 text-xs font-normal text-yellow-500">(Apenas no WhatsApp)</span>' : ''}
                                            ${voluntario.status === false || voluntario.status === 0 || voluntario.status === null ? 
                                              '<span class="ml-2 text-xs font-normal text-gray-500">(Desativado)</span>' : ''}
                                        </div>
                                        ${!isWhatsappOnly ? `
                                            <button onclick='window.app.toggleModal(true, ${voluntarioString})' 
                                                    class="text-primary-600 hover:text-primary-900 dark:text-primary-500 dark:hover:text-primary-400">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                                                </svg>
                                            </button>
                                        ` : ''}
                                    </div>
                                    
                                    <!-- WhatsApp -->
                                    <div class="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                        </svg>
                                        ${whatsapp}
                                    </div>

                                    <!-- Status e Atividades -->
                                    <div class="mt-3 flex flex-wrap items-center gap-2">
                                        ${this.renderIndisponibilidade(voluntario.mes_indisponibilidade, voluntario.inGroup)}
                                        <div class="flex gap-1 items-center border-l border-gray-200 dark:border-gray-700 pl-2 ml-2">
                                            ${this.renderAtividadesIndicators(voluntario.atividades)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Lista de Atividades -->
                            <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                <div class="flex flex-wrap gap-2">
                                    ${this.renderAtividadesList(voluntario.atividades)}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    renderAtividadesIndicators(atividades) {
        if (!atividades || !this.atividades) return '';
        
        try {
            // Garante que temos um array de IDs
            const atividadesArray = Array.isArray(atividades) ? atividades : 
                                  typeof atividades === 'string' ? JSON.parse(atividades) : [];

            return atividadesArray.map(id => {
                // Procura a atividade pelo ID na lista de atividades carregadas
                const atividade = this.atividades.find(a => a.id === parseInt(id));
                if (!atividade) return '';
                
                return `
                    <div class="w-3 h-3 rounded-full" 
                         style="background-color: ${atividade.cor_indicador}"
                         title="${atividade.nome}">
                    </div>
                `;
            }).join('');
        } catch (error) {
            return '';
        }
    }

    renderAtividadesList(atividades) {
        if (!atividades) return '';
        
        try {
            // Garante que temos um array de IDs
            const atividadesArray = Array.isArray(atividades) ? atividades : 
                                  typeof atividades === 'string' ? JSON.parse(atividades) : [];


            return atividadesArray.map(id => {
                const atividade = this.atividades.find(a => a.id === parseInt(id));
                if (!atividade) {
                    return '';
                }
                
                return `
                    <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                        ${atividade.nome}
                    </span>
                `;
            }).join('');
        } catch (error) {
            return '';
        }
    }

    renderVoluntarioImage(foto) {
        return foto || `${window.BASE_URL}/assets/img/placeholder.jpg`;
    }

    renderPagination(meta) {
        const container = document.getElementById('pagination-container');
        if (meta.totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        const pages = [];
        for (let i = 1; i <= meta.totalPages; i++) {
            pages.push(`
                <button onclick="window.app.goToPage(${i})" 
                        class="relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                            i === meta.page
                                ? 'z-10 bg-primary-600 text-white'
                                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                        } border border-gray-300 dark:border-gray-600">
                    ${i}
                </button>
            `);
        }

        container.innerHTML = `
            <nav class="flex justify-center space-x-1">
                ${pages.join('')}
            </nav>
        `;
    }

    goToPage(page) {
        this.currentPage = page;
        this.loadVoluntarios();
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    switchTab(tabId) {
        // Atualiza botões
        document.querySelectorAll('[data-tab]').forEach(btn => {
            btn.setAttribute('data-active', btn.dataset.tab === tabId ? 'true' : 'false');
        });

        // Atualiza conteúdo
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('hidden', content.dataset.tab !== tabId);
        });
    }
}

// Inicializa a página e expõe a instância globalmente
window.addEventListener('load', () => {
    window.app = new VoluntariosPage();
});

// Listener para mudanças no ministério (evento customizado)
document.addEventListener('ministerio-changed', () => {
    if (window.app) {
        window.location.reload(); // Força recarga completa da página
    }
});
