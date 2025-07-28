// Arquivo principal do construtor de formulários
// Inicializa a aplicação quando o DOM estiver carregado

// Função para inicializar o Form Builder
function initializeFormBuilder() {
    try {
        // Verifica se SortableJS está disponível
        if (!window.Sortable) {
            NotificationSystem.show('Erro: SortableJS não foi carregado', 'error');
            return;
        }
        
        // Inicializa o Form Builder
        window.formBuilderApp = new FormBuilder();
    } catch (error) {
        console.error('Erro ao inicializar Form Builder:', error);
        NotificationSystem.show('Erro ao inicializar o construtor de formulários', 'error');
    }
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    initializeFormBuilder();
    
    // Disponibilizar ConditionSystem globalmente
    window.ConditionSystem = ConditionSystem;
});

// Utilitários globais
window.FormBuilderUtils = {
    // Gera ID único
    generateId: function() {
        return 'element_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },
    
    // Valida JSON
    isValidJSON: function(str) {
        try {
            JSON.parse(str);
            return true;
        } catch (e) {
            return false;
        }
    },
    
    // Copia texto para clipboard
    copyToClipboard: function(text) {
        if (navigator.clipboard) {
            return navigator.clipboard.writeText(text);
        } else {
            // Fallback para navegadores mais antigos
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return Promise.resolve();
        }
    },
    
    // Debounce function
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Escapa HTML
    escapeHtml: function(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }
};

// Sistema de notificações
window.NotificationSystem = {
    show: function(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
        
        // Define cores baseado no tipo
        switch (type) {
            case 'success':
                notification.className += ' bg-green-500 text-white';
                break;
            case 'error':
                notification.className += ' bg-red-500 text-white';
                break;
            case 'warning':
                notification.className += ' bg-yellow-500 text-white';
                break;
            default:
                notification.className += ' bg-blue-500 text-white';
        }
        
        notification.innerHTML = `
            <div class="flex items-center">
                <span class="mr-2">${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Anima entrada
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Remove automaticamente
        if (duration > 0) {
            setTimeout(() => {
                notification.classList.add('translate-x-full');
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }, duration);
        }
    }
};

// Sistema de condições
window.ConditionSystem = {
    // Operadores disponíveis
    operators: {
        'equals': { 
            label: 'Igual a', 
            apply: (a, b) => {
                if (a === null || a === undefined) a = '';
                if (b === null || b === undefined) b = '';
                return a.toString() === b.toString();
            }
        },
        'not_equals': { 
            label: 'Diferente de', 
            apply: (a, b) => {
                if (a === null || a === undefined) a = '';
                if (b === null || b === undefined) b = '';
                return a.toString() !== b.toString();
            }
        },
        'contains': { 
            label: 'Contém', 
            apply: (a, b) => {
                if (a === null || a === undefined) a = '';
                if (b === null || b === undefined) b = '';
                return a.toString().toLowerCase().includes(b.toString().toLowerCase());
            }
        },
        'not_contains': { 
            label: 'Não contém', 
            apply: (a, b) => {
                if (a === null || a === undefined) a = '';
                if (b === null || b === undefined) b = '';
                return !a.toString().toLowerCase().includes(b.toString().toLowerCase());
            }
        },
        'greater_than': { 
            label: 'Maior que', 
            apply: (a, b) => {
                const numA = parseFloat(a);
                const numB = parseFloat(b);
                return !isNaN(numA) && !isNaN(numB) && numA > numB;
            }
        },
        'less_than': { 
            label: 'Menor que', 
            apply: (a, b) => {
                const numA = parseFloat(a);
                const numB = parseFloat(b);
                return !isNaN(numA) && !isNaN(numB) && numA < numB;
            }
        },
        'is_empty': { 
             label: 'Está vazio', 
             apply: (a) => !a || a.toString().trim() === ''
         },
         'is_not_empty': { 
             label: 'Não está vazio', 
             apply: (a) => a && a.toString().trim() !== ''
         }
    },
    
    // Cria uma nova condição
    createCondition: function() {
        return {
            id: FormBuilderUtils.generateId(),
            field: '',
            operator: 'equals',
            value: '',
            action: 'show' // show, hide, require, optional
        };
    },
    
    // Renderiza o editor de condições
    renderConditionEditor: function(conditions = [], availableFields = []) {
        const conditionsHtml = conditions.map((condition, index) => {
            return `
                <div class="condition-item border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-3" data-condition-id="${condition.id}">
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Condição ${index + 1}</span>
                        <button onclick="ConditionSystem.removeCondition('${condition.id}')" 
                                class="text-red-600 hover:text-red-800 p-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="grid grid-cols-1 gap-3">
                        <!-- Campo -->
                        <div>
                            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Se o campo</label>
                            <select onchange="ConditionSystem.updateCondition('${condition.id}', 'field', this.value)" 
                                    class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                                <option value="">Selecione um campo</option>
                                ${availableFields.map(field => `
                                    <option value="${field.id}" ${condition.field === field.id ? 'selected' : ''}>
                                        ${field.label}
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                        
                        <!-- Operador -->
                        <div>
                            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Operador</label>
                            <select onchange="ConditionSystem.updateCondition('${condition.id}', 'operator', this.value)" 
                                    class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                                ${Object.entries(this.operators).map(([key, op]) => `
                                    <option value="${key}" ${condition.operator === key ? 'selected' : ''}>
                                        ${op.label}
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                        
                        <!-- Valor (se necessário) -->
                        ${!['is_empty', 'is_not_empty'].includes(condition.operator) ? `
                            <div>
                                <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Valor</label>
                                <input type="text" value="${condition.value}" 
                                       onchange="ConditionSystem.updateCondition('${condition.id}', 'value', this.value)"
                                       class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                            </div>
                        ` : ''}
                        
                        <!-- Ação -->
                        <div>
                            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Então</label>
                            <select onchange="ConditionSystem.updateCondition('${condition.id}', 'action', this.value)" 
                                    class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                                <option value="show" ${condition.action === 'show' ? 'selected' : ''}>Mostrar este campo</option>
                                <option value="hide" ${condition.action === 'hide' ? 'selected' : ''}>Ocultar este campo</option>
                                <option value="require" ${condition.action === 'require' ? 'selected' : ''}>Tornar obrigatório</option>
                                <option value="optional" ${condition.action === 'optional' ? 'selected' : ''}>Tornar opcional</option>
                            </select>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        return `
            <div class="conditions-editor">
                <div class="flex items-center justify-between mb-3">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Condições</label>
                    <button onclick="ConditionSystem.addCondition()" 
                            class="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400">
                        + Adicionar condição
                    </button>
                </div>
                <div id="conditions-container">
                    ${conditionsHtml}
                    ${conditions.length === 0 ? `
                        <div class="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                            Nenhuma condição definida
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    },
    
    // Adiciona uma nova condição
    addCondition: function() {
        if (window.formBuilderApp && window.formBuilderApp.selectedElement) {
            const element = window.formBuilderApp.selectedElement;
            if (!element.props.conditions) {
                element.props.conditions = [];
            }
            element.props.conditions.push(this.createCondition());
            window.formBuilderApp.properties.renderProperties(element);
            window.formBuilderApp.updateJsonOutput();
        }
    },
    
    // Remove uma condição
    removeCondition: function(conditionId) {
        if (window.formBuilderApp && window.formBuilderApp.selectedElement) {
            const element = window.formBuilderApp.selectedElement;
            if (element.props.conditions) {
                element.props.conditions = element.props.conditions.filter(c => c.id !== conditionId);
                window.formBuilderApp.properties.renderProperties(element);
                window.formBuilderApp.updateJsonOutput();
            }
        }
    },
    
    // Atualiza uma condição
    updateCondition: function(conditionId, property, value) {
        if (window.formBuilderApp && window.formBuilderApp.selectedElement) {
            const element = window.formBuilderApp.selectedElement;
            if (element.props.conditions) {
                const condition = element.props.conditions.find(c => c.id === conditionId);
                if (condition) {
                    condition[property] = value;
                    // Re-renderiza se mudou o operador
                    if (property === 'operator') {
                        window.formBuilderApp.properties.renderProperties(element);
                    }
                    window.formBuilderApp.updateJsonOutput();
                    
                    // Avaliar condições se necessário
                    this.evaluateConditions();
                }
            }
        }
    },
    
    // Avalia condições
    evaluateConditions: function(conditions, formData) {
        return conditions.every(condition => {
            const fieldValue = formData[condition.field] || '';
            const operator = this.operators[condition.operator];
            
            if (!operator) return true;
            
            if (['is_empty', 'is_not_empty'].includes(condition.operator)) {
                return operator.apply(fieldValue);
            } else {
                return operator.apply(fieldValue, condition.value);
            }
        });
    },
    
    // Avaliar condições e aplicar ações no DOM
    evaluateAndApplyConditions: function() {
        const allElements = document.querySelectorAll('[data-element-id]');
        
        allElements.forEach(elementDiv => {
            const elementId = elementDiv.getAttribute('data-element-id');
            const element = window.formBuilderApp?.formElements?.find(el => el.id === elementId);
            
            if (!element || !element.props.conditions || element.props.conditions.length === 0) {
                // Se não há condições, mostra o elemento
                elementDiv.style.display = 'block';
                const input = elementDiv.querySelector('input, select, textarea');
                if (input && element?.props?.required) {
                    input.setAttribute('required', 'required');
                } else if (input) {
                    input.removeAttribute('required');
                }
                return;
            }
            
            let shouldShow = true;
            let shouldBeRequired = element.props.required || false;
            
            element.props.conditions.forEach(condition => {
                if (!condition.field || !condition.operator) return;
                
                const fieldElement = document.querySelector(`[name="${condition.field}"]`);
                if (!fieldElement) return;
                
                const fieldValue = this.getFieldValue(fieldElement);
                const operator = this.operators[condition.operator];
                
                if (!operator) return;
                
                let conditionMet = false;
                
                if (['is_empty', 'is_not_empty'].includes(condition.operator)) {
                     conditionMet = operator.apply(fieldValue);
                 } else {
                     conditionMet = operator.apply(fieldValue, condition.value);
                 }
                
                // Aplicar ação baseada no resultado
                if (conditionMet) {
                    switch (condition.action) {
                        case 'hide':
                            shouldShow = false;
                            break;
                        case 'show':
                            shouldShow = true;
                            break;
                        case 'require':
                            shouldBeRequired = true;
                            break;
                        case 'optional':
                            shouldBeRequired = false;
                            break;
                    }
                }
            });
            
            // Aplicar visibilidade
            elementDiv.style.display = shouldShow ? 'block' : 'none';
            
            // Aplicar obrigatoriedade
            const input = elementDiv.querySelector('input, select, textarea');
            if (input) {
                if (shouldBeRequired && shouldShow) {
                    input.setAttribute('required', 'required');
                } else {
                    input.removeAttribute('required');
                }
            }
        });
    },
    
    // Obter valor do campo
    getFieldValue: function(fieldElement) {
        if (!fieldElement) return '';
        
        if (fieldElement.type === 'checkbox') {
            if (fieldElement.name.includes('[]')) {
                // Checkbox múltiplo
                const checkboxes = document.querySelectorAll(`input[name="${fieldElement.name}"]:checked`);
                return Array.from(checkboxes).map(cb => cb.value).join(',');
            } else {
                // Checkbox único
                return fieldElement.checked ? fieldElement.value : '';
            }
        } else if (fieldElement.type === 'radio') {
            const checkedRadio = document.querySelector(`input[name="${fieldElement.name}"]:checked`);
            return checkedRadio ? checkedRadio.value : '';
        } else if (fieldElement.tagName === 'SELECT' && fieldElement.multiple) {
            // Select múltiplo
            const selectedOptions = Array.from(fieldElement.selectedOptions);
            return selectedOptions.map(option => option.value).join(',');
        } else {
            return fieldElement.value || '';
        }
    }
};

// Torna as funções disponíveis globalmente
window.FormBuilderMain = {
    initializeFormBuilder
};