class PreenchimentosUI {
    constructor() {
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.errorContainer = document.getElementById('error-container');
        this.emptyState = document.getElementById('empty-state');
        this.preenchimentosGrid = document.getElementById('preenchimentos-grid');
        this.preenchimentosList = document.getElementById('preenchimentos-list');
        this.paginationContainer = document.getElementById('pagination-container');
        this.detailsModal = document.getElementById('details-modal');
        this.modalContent = document.getElementById('modal-content');
        this.formularioFilter = document.getElementById('formulario-filter');
    }

    showLoading() {
        this.hideAll();
        this.loadingIndicator.classList.remove('hidden');
    }

    showError(message) {
        this.hideAll();
        document.getElementById('error-message').textContent = message;
        this.errorContainer.classList.remove('hidden');
    }

    showEmpty() {
        this.hideAll();
        this.emptyState.classList.remove('hidden');
    }

    showPreenchimentos() {
        this.hideAll();
        this.preenchimentosGrid.classList.remove('hidden');
    }

    hideAll() {
        this.loadingIndicator.classList.add('hidden');
        this.errorContainer.classList.add('hidden');
        this.emptyState.classList.add('hidden');
        this.preenchimentosGrid.classList.add('hidden');
    }

    renderPreenchimentos(preenchimentos, formularios = []) {
        this.preenchimentosList.innerHTML = '';
        this.formularios = formularios; // Armazena os formulários para uso na criação das linhas

        preenchimentos.forEach(preenchimento => {
            // Adiciona o nome do formulário ao objeto preenchimento
            const formulario = formularios.find(f => f.id == preenchimento.formulario_id);
            if (formulario) {
                preenchimento.formulario_nome = formulario.nome;
            }
            
            const row = this.createPreenchimentoRow(preenchimento);
            this.preenchimentosList.appendChild(row);
        });
    }

    createPreenchimentoRow(preenchimento) {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150';

        const formatDate = (dateString) => {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        const calculateAge = (birthDateString) => {
            if (!birthDateString) return 'N/A';
            
            try {
                const birthDate = new Date(birthDateString);
                const today = new Date();
                
                // Verifica se a data é válida
                if (isNaN(birthDate.getTime())) return 'N/A';
                
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                
                // Se ainda não chegou o mês de aniversário, ou chegou mas não o dia, subtrai 1
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                
                return age >= 0 ? `${age} anos` : 'N/A';
            } catch (error) {
                return 'N/A';
            }
        };

        const formatWhatsApp = (whatsapp) => {
            if (!whatsapp) return 'N/A';
            
            // Remove todos os caracteres não numéricos
            const cleaned = whatsapp.replace(/\D/g, '');
            
            // Se tem 11 dígitos (formato brasileiro)
            if (cleaned.length === 11) {
                return `(${cleaned.substr(0,2)}) ${cleaned.substr(2,5)}-${cleaned.substr(7,4)}`;
            }
            // Se tem 10 dígitos (formato brasileiro antigo)
            else if (cleaned.length === 10) {
                return `(${cleaned.substr(0,2)}) ${cleaned.substr(2,4)}-${cleaned.substr(6,4)}`;
            }
            // Retorna o valor original se não conseguir formatar
            return whatsapp;
        };

        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                    ${preenchimento.formulario_nome || 'Formulário'}
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">
                    ${preenchimento.nome || 'N/A'}
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                ${preenchimento.cpf || 'N/A'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                ${calculateAge(preenchimento.data_nascimento)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                <a href="https://wa.me/55${preenchimento.whatsapp?.replace(/\D/g, '') || ''}" 
                   target="_blank" 
                   class="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-150"
                   title="Enviar mensagem no WhatsApp">
                    ${formatWhatsApp(preenchimento.whatsapp)}
                </a>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                ${formatDate(preenchimento.created_at)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                    <button onclick="window.app.viewPreenchimento(${preenchimento.id})" 
                            class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-150"
                            title="Visualizar detalhes">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                    </button>
                    <button onclick="window.app.deletePreenchimento(${preenchimento.id})" 
                            class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-150"
                            title="Excluir preenchimento">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </td>
        `;

        return row;
    }

    renderPagination(meta) {
        if (!meta || meta.totalPages <= 1) {
            this.paginationContainer.innerHTML = '';
            return;
        }

        const { page, totalPages, total, limit } = meta;
        const startItem = ((page - 1) * limit) + 1;
        const endItem = Math.min(page * limit, total);

        let paginationHTML = `
            <div class="flex-1 flex justify-between sm:hidden">
                ${page > 1 ? `<button onclick="window.app.changePage(${page - 1})" class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">Anterior</button>` : '<div></div>'}
                ${page < totalPages ? `<button onclick="window.app.changePage(${page + 1})" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">Próximo</button>` : '<div></div>'}
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p class="text-sm text-gray-700 dark:text-gray-300">
                        Mostrando <span class="font-medium">${startItem}</span> a <span class="font-medium">${endItem}</span> de <span class="font-medium">${total}</span> resultados
                    </p>
                </div>
                <div>
                    <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
        `;

        // Botão Anterior
        if (page > 1) {
            paginationHTML += `
                <button onclick="window.app.changePage(${page - 1})" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                </button>
            `;
        }

        // Números das páginas
        const startPage = Math.max(1, page - 2);
        const endPage = Math.min(totalPages, page + 2);

        for (let i = startPage; i <= endPage; i++) {
            const isActive = i === page;
            paginationHTML += `
                <button onclick="window.app.changePage(${i})" class="relative inline-flex items-center px-4 py-2 border ${isActive ? 'border-primary-500 bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-200' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'} text-sm font-medium">
                    ${i}
                </button>
            `;
        }

        // Botão Próximo
        if (page < totalPages) {
            paginationHTML += `
                <button onclick="window.app.changePage(${page + 1})" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                </button>
            `;
        }

        paginationHTML += `
                    </nav>
                </div>
            </div>
        `;

        this.paginationContainer.innerHTML = paginationHTML;
    }

    renderFormularioOptions(formularios) {
        this.formularioFilter.innerHTML = '<option value="">Todos os formulários</option>';
        
        if (formularios && formularios.length > 0) {
            formularios.forEach(formulario => {
                const option = document.createElement('option');
                option.value = formulario.id;
                option.textContent = formulario.nome || `Formulário ${formulario.id}`;
                this.formularioFilter.appendChild(option);
            });
        }
    }

    showDetailsModal(preenchimento) {
        const modalTitle = document.getElementById('modal-title');
        
        // Determina o nome do formulário para o título
        let formularioNome = 'Formulário';
        if (preenchimento.formulario_detalhes && preenchimento.formulario_detalhes.nome) {
            formularioNome = preenchimento.formulario_detalhes.nome;
        }
        
        modalTitle.textContent = `Preenchimento - ${formularioNome}`;

        let detailsHTML = `
            <div class="space-y-4">
        `;

        // Se temos dados do preenchimento, vamos relacionar com os campos do formulário
        if (preenchimento.dados && preenchimento.formulario_detalhes && 
            preenchimento.formulario_detalhes.dados && 
            preenchimento.formulario_detalhes.dados.elements) {
            
            const elementos = preenchimento.formulario_detalhes.dados.elements;
            const dadosPreenchimento = preenchimento.dados;

            detailsHTML += `
                <div class="bg-white dark:bg-gray-800">
                    <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Respostas do Formulário</h4>
                    <div class="space-y-4">
            `;

            // Para cada elemento do formulário, procura a resposta correspondente
            elementos.forEach((elemento) => {
                const valor = dadosPreenchimento[elemento.id];
                if (valor !== undefined) {
                    let valorFormatado = valor;
                    
                    // Se é um campo de seleção, tenta encontrar o label da opção
                    if (elemento.type === 'radio' || elemento.type === 'select') {
                        if (elemento.properties.options) {
                            const opcao = elemento.properties.options.find(opt => opt.id === valor);
                            if (opcao) {
                                valorFormatado = opcao.label;
                            }
                        }
                    }
                    
                    detailsHTML += `
                        <div class="border-b border-gray-200 dark:border-gray-600 pb-4 last:border-b-0">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                ${elemento.properties.label || 'Campo sem nome'}
                            </label>
                            <div class="mt-1">
                                <p class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
                                    ${valorFormatado}
                                </p>
                            </div>
                        </div>
                    `;
                }
            });

            detailsHTML += `
                    </div>
                </div>
            `;
        } else if (preenchimento.dados) {
            // Se não temos o formulário, mostra apenas os dados básicos
            detailsHTML += `
                <div class="bg-white dark:bg-gray-800">
                    <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Dados Preenchidos</h4>
                    <div class="space-y-3">
            `;

            Object.entries(preenchimento.dados).forEach(([key, value]) => {
                detailsHTML += `
                    <div class="border-b border-gray-200 dark:border-gray-600 pb-3 last:border-b-0">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Campo
                        </label>
                        <div class="mt-1">
                            <p class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
                                ${value}
                            </p>
                        </div>
                    </div>
                `;
            });

            detailsHTML += `
                    </div>
                </div>
            `;
        } else {
            detailsHTML += `
                <div class="text-center py-8">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Nenhum dado de preenchimento encontrado.</p>
                </div>
            `;
        }

        // Informações adicionais do formulário (apenas nome e descrição se houver)
        if (preenchimento.formulario_detalhes) {
            const formulario = preenchimento.formulario_detalhes;
            if (formulario.descricao) {
                detailsHTML += `
                    <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sobre o Formulário</h4>
                        <p class="text-sm text-gray-600 dark:text-gray-400">${formulario.descricao}</p>
                    </div>
                `;
            }
        }

        const formatDate = (dateString) => {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        // Data do preenchimento
        detailsHTML += `
            <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p class="text-xs text-gray-500 dark:text-gray-400">
                    Preenchido em ${formatDate(preenchimento.created_at)}
                </p>
            </div>
        `;

        detailsHTML += '</div>';
        
        this.modalContent.innerHTML = detailsHTML;
        this.detailsModal.classList.remove('hidden');
    }

    hideDetailsModal() {
        this.detailsModal.classList.add('hidden');
    }
}

window.PreenchimentosUI = PreenchimentosUI;