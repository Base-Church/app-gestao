class DadosUI {
    constructor() {
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.errorContainer = document.getElementById('error-container');
        this.emptyState = document.getElementById('empty-state');
        this.preenchimentosGrid = document.getElementById('preenchimentos-grid');
        this.preenchimentosTable = document.getElementById('preenchimentos-table');
        this.tableHeader = document.getElementById('table-header');
        this.tableBody = document.getElementById('table-body');
    }

    showLoading() {
        this.hideAll();
        if (this.loadingIndicator) this.loadingIndicator.classList.remove('hidden');
    }

    showError(message) {
        this.hideAll();
        const errorMessage = document.getElementById('error-message');
        if (errorMessage) errorMessage.textContent = message;
        if (this.errorContainer) this.errorContainer.classList.remove('hidden');
    }

    showEmpty() {
        this.hideAll();
        if (this.emptyState) this.emptyState.classList.remove('hidden');
    }

    showTable() {
        this.hideAll();
        if (this.preenchimentosGrid) this.preenchimentosGrid.classList.remove('hidden');
    }

    hideAll() {
        const elements = [this.loadingIndicator, this.errorContainer, this.emptyState, this.preenchimentosGrid];
        elements.forEach(el => {
            if (el) el.classList.add('hidden');
        });
    }

    updatePageTitle(formulario) {
        const titleElement = document.querySelector('h1');
        const subtitleElement = document.querySelector('h1 + p');
        
        if (formulario && titleElement) {
            titleElement.textContent = `Preenchimentos - ${formulario.nome || 'Formulário'}`;
        }
        
        if (formulario && subtitleElement) {
            subtitleElement.textContent = formulario.descricao || 'Visualize os preenchimentos deste formulário';
        }
    }

    createTableHeader(formulario) {
        const tableHeader = document.getElementById('table-header');
        if (!tableHeader) return;

        // Monta um array de colunas para usar na renderização das linhas
        const columns = [];

        // Sempre começa com índice
        columns.push({ type: 'index' });

        if (formulario && formulario.dados && formulario.dados.elements) {
            formulario.dados.elements.forEach(element => {
                columns.push({
                    source: 'element',
                    id: element.id,
                    label: element.properties?.label || element.id,
                    type: element.type,
                    element: element
                });
            });
        }

        // Campos fixos que podem vir fora do objeto `dados`
        // Adiciona apenas se não houver uma coluna equivalente (por type ou label)
        const hasType = (t) => columns.some(c => c.type === 'index' ? false : (c.type === t || c.type === undefined) && (c.type === t || c.type === undefined));

        const existsByTypeOrLabel = (type, labelMatches) => {
            return columns.some(c => {
                if (c.source === 'element') {
                    if (c.type && c.type === type) return true;
                    if (c.label && labelMatches.some(l => String(c.label).toLowerCase().includes(l))) return true;
                }
                return false;
            });
        };

        if (!existsByTypeOrLabel('nome', ['nome'])) {
            columns.push({ source: 'fixed', key: 'nome', label: 'Nome', type: 'nome' });
        }
        if (!existsByTypeOrLabel('cpf', ['cpf'])) {
            columns.push({ source: 'fixed', key: 'cpf', label: 'CPF', type: 'cpf' });
        }
        if (!existsByTypeOrLabel('whatsapp', ['whatsapp', 'whats'])) {
            columns.push({ source: 'fixed', key: 'whatsapp', label: 'WhatsApp', type: 'whatsapp' });
        }
        if (!existsByTypeOrLabel('birthdate', ['nascimento', 'data de nascimento', 'birth'])) {
            columns.push({ source: 'fixed', key: 'data_nascimento', label: 'Data Nascimento', type: 'birthdate' });
        }

        // Data de preenchimento
        columns.push({ source: 'fixed', key: 'created_at', label: 'Enviado', type: 'datetime' });

        // Ações
        columns.push({ source: 'actions', label: 'Ações' });

        // Guarda colunas para renderTable
        this.columns = columns;

        // Monta header HTML com truncamento
        const maxLabelLen = 60;
        const truncate = (s, n) => String(s).length > n ? String(s).substr(0,n-1) + '…' : s;

        let headerHTML = '<tr>';
        columns.forEach(col => {
            if (col.type === 'index') {
                headerHTML += `<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">#</th>`;
            } else if (col.source === 'actions') {
                headerHTML += `<th scope="col" class="relative px-6 py-3"><span class="sr-only">Ações</span></th>`;
            } else {
                const labelFull = col.label || '';
                const labelShort = truncate(labelFull, maxLabelLen);
                // Usa line-clamp para permitir até 2 linhas e depois cortar com elipse visual
                const clampStyle = '-webkit-line-clamp:2; display:-webkit-box; -webkit-box-orient:vertical; overflow:hidden; word-break:break-word;';
                headerHTML += `<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"><div class="max-w-[220px] whitespace-normal" style="${clampStyle}" title="${this.escapeHtml(labelFull)}">${this.escapeHtml(labelShort)}</div></th>`;
            }
        });
        headerHTML += '</tr>';

        tableHeader.innerHTML = headerHTML;
    }

    renderTable(preenchimentos, formulario) {
        if (!this.tableBody) return;

        this.tableBody.innerHTML = '';

        preenchimentos.forEach((preenchimento, index) => {
            const row = this.createTableRow(preenchimento, index + 1, formulario);
            this.tableBody.appendChild(row);
        });
    }

    createTableRow(preenchimento, index, formulario) {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150';

        let rowHTML = '';

        // Use as colunas previamente montadas em createTableHeader
        const cols = this.columns || [];

        cols.forEach(col => {
            if (col.type === 'index') {
                rowHTML += `<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">${index}</td>`;
                return;
            }

            if (col.source === 'actions') {
                rowHTML += `
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div class="flex items-center justify-end space-x-2">
                            <button onclick="window.app.deletePreenchimento(${preenchimento.id})" 
                                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-150"
                                    title="Excluir">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </td>
                `;
                return;
            }

            // Obter valor para a coluna (elemento ou campo fixo)
            let cellValue = this.getCellValue(col, preenchimento);
            // Detecta se o valor contém HTML gerado (links, spans, svg)
            const isHtml = /<a\s|<svg|<span|<div/.test(String(cellValue));
            // Se for HTML, insere diretamente; caso contrário, escapa para evitar XSS
            const cellHtml = isHtml ? cellValue : this.escapeHtml(String(cellValue));

            rowHTML += `<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${cellHtml}</td>`;
        });

        row.innerHTML = rowHTML;
        return row;
    }

    getCellValue(col, preenchimento) {
        try {
            // Element-based column
            if (col.source === 'element') {
                const element = col.element;
                const raw = (preenchimento.dados && preenchimento.dados[col.id]) ?? '';

                if (raw === '' || raw === null || raw === undefined) {
                    // fallback para campos fixos por type
                    if (element.type === 'cpf') return this.formatCPF(preenchimento.cpf || 'N/A');
                    if (element.type === 'nome') return preenchimento.nome || 'N/A';
                    if (element.type === 'whatsapp') return preenchimento.whatsapp ? `<a href="https://wa.me/55${preenchimento.whatsapp.replace(/\D/g, '')}" target="_blank" class="text-green-600 hover:text-green-800 dark:text-green-400">${this.formatWhatsApp(preenchimento.whatsapp)}</a>` : 'N/A';
                    if (element.type === 'birthdate') return this.formatDate(preenchimento.data_nascimento) || 'N/A';
                    return 'N/A';
                }

                // Se for select/radio, mapeia opção para label
                if ((element.type === 'radio' || element.type === 'select') && element.properties && element.properties.options) {
                    const opt = element.properties.options.find(o => o.id === raw);
                    return opt ? opt.label : raw;
                }

                // Para outros tipos, formata usando formatFieldValue
                return this.formatFieldValue(raw, element);
            }

            // Fixed field
            if (col.source === 'fixed') {
                const key = col.key;
                const type = col.type;

                const value = preenchimento[key];
                if (key === 'created_at') return this.formatDateTime(preenchimento.created_at);
                if (type === 'cpf') return this.formatCPF(value || preenchimento.cpf || 'N/A');
                if (type === 'nome') return value || preenchimento.nome || 'N/A';
                if (type === 'whatsapp') return value ? `<a href="https://wa.me/55${String(value).replace(/\D/g, '')}" target="_blank" class="text-green-600 hover:text-green-800 dark:text-green-400">${this.formatWhatsApp(value)}</a>` : (preenchimento.whatsapp ? `<a href="https://wa.me/55${String(preenchimento.whatsapp).replace(/\D/g, '')}" target="_blank" class="text-green-600 hover:text-green-800 dark:text-green-400">${this.formatWhatsApp(preenchimento.whatsapp)}</a>` : 'N/A');
                if (type === 'birthdate') return this.formatDate(value || preenchimento.data_nascimento || 'N/A');

                return value ?? 'N/A';
            }

            return 'N/A';
        } catch (err) {
            return 'N/A';
        }
    }

    escapeHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    formatFieldValue(valor, element) {
        if (valor === null || valor === undefined || valor === '') return 'N/A';

        // Se é um campo de seleção, tenta encontrar o label da opção
        if ((element.type === 'radio' || element.type === 'select') && element.properties.options) {
            const opcao = element.properties.options.find(opt => opt.id === valor);
            if (opcao) {
                return opcao.label;
            }
        }

        // Formatação especial para tipos específicos
        switch (element.type) {
            case 'cpf':
                return this.formatCPF(valor);
            case 'nome':
                return String(valor);
            case 'birthdate':
                return this.formatDate(valor);
            case 'whatsapp':
                return `<a href="https://wa.me/55${valor.replace(/\D/g, '')}" target="_blank" class="text-green-600 hover:text-green-800 dark:text-green-400">${this.formatWhatsApp(valor)}</a>`;
            case 'email':
                return `<a href="mailto:${valor}" class="text-blue-600 hover:text-blue-800 dark:text-blue-400">${valor}</a>`;
            case 'phone':
                return `<a href="tel:${valor}" class="text-green-600 hover:text-green-800 dark:text-green-400">${this.formatWhatsApp(valor)}</a>`;
            case 'date':
                return this.formatDate(valor);
            case 'url':
                return `<a href="${valor}" target="_blank" class="text-blue-600 hover:text-blue-800 dark:text-blue-400">Link</a>`;
            case 'text':
            case 'textarea':
            default:
                return String(valor);
        }
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString('pt-BR');
    }

    formatDateTime(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'N/A';
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatWhatsApp(whatsapp) {
        if (!whatsapp) return 'N/A';
        const cleaned = whatsapp.replace(/\D/g, '');
        if (cleaned.length === 11) {
            return `(${cleaned.substr(0,2)}) ${cleaned.substr(2,5)}-${cleaned.substr(7,4)}`;
        }
        return whatsapp;
    }

    formatCPF(cpf) {
        if (!cpf) return 'N/A';
        const cleaned = String(cpf).replace(/\D/g, '');
        if (cleaned.length === 11) {
            const full = `${cleaned.substr(0,3)}.${cleaned.substr(3,3)}.${cleaned.substr(6,3)}-${cleaned.substr(9,2)}`;
            // Mask middle digits for basic protection: 000.***.***-00
            const masked = `${cleaned.substr(0,3)}.***.***-${cleaned.substr(9,2)}`;
            return `<span title="${this.escapeHtml(full)}">${this.escapeHtml(masked)}</span>`;
        }
        return this.escapeHtml(String(cpf));
    }

    // Métodos de visibilidade
    showLoading() {
        this.hideAll();
        const loading = document.getElementById('loading-indicator');
        if (loading) loading.classList.remove('hidden');
    }

    showError(message) {
        this.hideAll();
        const errorContainer = document.getElementById('error-container');
        const errorMessage = document.getElementById('error-message');
        if (errorContainer) errorContainer.classList.remove('hidden');
        if (errorMessage) errorMessage.textContent = message;
    }

    showEmpty() {
        this.hideAll();
        const emptyState = document.getElementById('empty-state');
        if (emptyState) emptyState.classList.remove('hidden');
    }

    showTable() {
        this.hideAll();
        const table = document.getElementById('preenchimentos-table');
        if (table) table.classList.remove('hidden');
    }

    hideAll() {
        const elements = [
            'loading-indicator',
            'error-container', 
            'empty-state',
            'preenchimentos-table'
        ];
        
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.classList.add('hidden');
        });
    }
}

window.DadosUI = DadosUI;
