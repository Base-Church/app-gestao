export class UXService {
    static ministeriosMap = new Map();
    
    static setMinisterios(ministerios) {
        this.ministeriosMap.clear();
        ministerios.forEach(ministerio => {
            this.ministeriosMap.set(ministerio.id, ministerio);
        });
    }
    
    static renderVoluntarios(voluntarios) {
        const container = document.getElementById('voluntarios-list');
        const grid = document.getElementById('voluntarios-grid');
        const emptyState = document.getElementById('empty-state');
        
        if (!voluntarios || voluntarios.length === 0) {
            grid.classList.add('hidden');
            emptyState.classList.remove('hidden');
            return;
        }
        
        emptyState.classList.add('hidden');
        grid.classList.remove('hidden');
        
        container.innerHTML = voluntarios.map(voluntario => this.createVoluntarioCard(voluntario)).join('');
    }

    static createVoluntarioCard(voluntario) {
        const atividades = this.getAtividadesText(voluntario.detalhes_atividades);
        const inicial = voluntario.nome ? voluntario.nome.charAt(0).toUpperCase() : 'V';
        const whatsapp = this.formatWhatsApp(voluntario.whatsapp);
        const statusBadge = this.getStatusBadge(voluntario.status, voluntario.onboarding);

        // Função para fallback da imagem
        const imgId = `vol-img-${voluntario.id}`;
        let fotoHtml = `<div class="h-14 w-14 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
            <span class="text-lg font-semibold text-gray-700 dark:text-gray-200">${inicial}</span>
        </div>`;
        if (voluntario.foto) {
            fotoHtml = `<img src="${voluntario.foto}" alt="${voluntario.nome}" id="${imgId}" class="h-14 w-14 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                <div style="display:none" class="h-14 w-14 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                    <span class="text-lg font-semibold text-gray-700 dark:text-gray-200">${inicial}</span>
                </div>`;
        }

        // Mostra ministérios com foto
        let ministeriosHtml = '';
        if (voluntario.ministerios && voluntario.ministerios.length > 0 && this.ministeriosMap) {
            ministeriosHtml = voluntario.ministerios.map(minId => {
                const min = this.ministeriosMap.get(minId);
                let nome = min && min.nome ? min.nome : `Ministério ${minId}`;
                let foto = min && min.foto ? min.foto : null;
                let fotoUrl = foto ? `${window.APP_CONFIG.baseUrl}/${foto.replace(/^\/+/, '')}` : '';
                return `<span class="flex items-center gap-2 mr-2 mb-1">
                    ${fotoUrl ? `<img src="${fotoUrl}" alt="${nome}" class="h-6 w-6 rounded-full object-cover border border-gray-300 dark:border-gray-600">` : ''}
                    <span class="text-xs text-gray-700 dark:text-gray-300">${nome}</span>
                </span>`;
            }).join('');
        }

        return `
            <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div class="p-4 sm:p-6">
                    <div class="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                        <!-- Avatar -->
                        <div class="flex-shrink-0 self-center sm:self-start">
                            ${fotoHtml}
                        </div>

                        <!-- Informações principais -->
                        <div class="flex-1 min-w-0 w-full">
                            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                                <div class="flex-1 min-w-0">
                                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white break-words">
                                        ${voluntario.nome || 'Nome não informado'}
                                    </h3>
                                    
                                    <div class="mt-1 space-y-1">
                                        ${voluntario.cpf ? 
                                            `<p class="text-sm text-gray-600 dark:text-gray-400">
                                                <span class="inline-flex items-center flex-wrap">
                                                    <svg class="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-4 0V4a2 2 0 014 0v2"></path>
                                                    </svg>
                                                    <span class="break-all">CPF: ${this.formatCPF(voluntario.cpf)}</span>
                                                </span>
                                            </p>` : ''
                                        }
                                        
                                        ${whatsapp ? 
                                            `<p class="text-sm text-gray-600 dark:text-gray-400">
                                                <span class="inline-flex items-center flex-wrap">
                                                    <svg class="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                                                    </svg>
                                                    <span class="break-all">${whatsapp}</span>
                                                </span>
                                            </p>` : ''
                                        }
                                    </div>
                                </div>

                                <!-- Status Badge -->
                                <div class="flex-shrink-0 mt-2 sm:mt-0 sm:ml-2">
                                    ${statusBadge}
                                </div>
                            </div>

                            <!-- Ministérios e Atividades -->
                            <div class="mt-4 space-y-2">
                                ${ministeriosHtml ? 
                                    `<div class="flex flex-wrap items-center gap-2">
                                        ${ministeriosHtml}
                                    </div>` : ''
                                }
                                
                                ${atividades ? 
                                    `<div class="flex flex-col sm:flex-row sm:items-start">
                                        <span class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 sm:mb-0">Atividades:</span>
                                        <div class="sm:ml-2 flex flex-wrap gap-1">
                                            ${this.createAtividadeTags(voluntario.detalhes_atividades)}
                                        </div>
                                    </div>` : ''
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static getMinisteriosText(ministerios) {
        if (!ministerios || ministerios.length === 0) return '';
        
        return ministerios.map(ministerioId => 
            this.ministeriosMap.get(ministerioId) || `Ministério ${ministerioId}`
        ).join(', ');
    }

    static getAtividadesText(atividades) {
        if (!atividades || atividades.length === 0) return '';
        
        return atividades.map(atividade => atividade.atividade_nome).join(', ');
    }

    static createAtividadeTags(atividades) {
        if (!atividades || atividades.length === 0) return '';
        
        return atividades.map(atividade => 
            `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                ${atividade.atividade_nome}
            </span>`
        ).join('');
    }

    static formatCPF(cpf) {
        if (!cpf) return '';
        
        // Remove tudo que não é dígito
        const digits = cpf.replace(/\D/g, '');
        
        // Aplica a máscara XXX.XXX.XXX-XX
        return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    static formatWhatsApp(whatsapp) {
        if (!whatsapp) return '';
        
        // Remove o @s.whats e formata o número
        const number = whatsapp.replace('@s.whats', '');
        
        // Verifica se é um número brasileiro (começa com 55)
        if (number.startsWith('55')) {
            const formatted = number.replace(/^55(\d{2})(\d{5})(\d{4})$/, '+55 ($1) $2-$3');
            return formatted !== number ? formatted : number;
        }
        
        return number;
    }

    static getStatusBadge(status, onboarding) {
        if (!status) {
            return `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                Inativo
            </span>`;
        }
        
        if (!onboarding) {
            return `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                Pendente
            </span>`;
        }
        
        return `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Ativo
        </span>`;
    }

    static showLoading(show = true) {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.classList.toggle('hidden', !show);
        }
    }

    static showError(message, show = true) {
        const errorContainer = document.getElementById('error-container');
        const errorMessage = document.getElementById('error-message');
        
        if (errorContainer && errorMessage) {
            errorContainer.classList.toggle('hidden', !show);
            if (show && message) {
                errorMessage.textContent = message;
            }
        }
    }
}
