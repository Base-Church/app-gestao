class FormPreview {
    constructor() {
        this.modal = document.getElementById('preview-modal');
        this.previewForm = document.getElementById('preview-form');
        this.previewBtn = document.getElementById('preview-form-btn');
        this.closeBtn = document.getElementById('close-preview');
        this.closeBtnFooter = document.getElementById('close-preview-btn');
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        // Abrir modal de preview
        this.previewBtn.addEventListener('click', () => {
            this.openPreview();
        });
        
        // Fechar modal
        this.closeBtn.addEventListener('click', () => {
            this.closePreview();
        });
        
        this.closeBtnFooter.addEventListener('click', () => {
            this.closePreview();
        });
        
        // Fechar modal clicando fora
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closePreview();
            }
        });
        
        // Fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                this.closePreview();
            }
        });
    }
    
    openPreview() {
        // Obter dados do formulário
        const formData = window.formBuilder.getFormJson();
        
        if (!formData.elements || formData.elements.length === 0) {
            if (window.formBuilder && window.formBuilder.showNotification) {
                window.formBuilder.showNotification('Adicione elementos ao formulário antes de visualizar o preview.', 'error');
            } else {
                alert('Adicione elementos ao formulário antes de visualizar o preview.');
            }
            return;
        }
        
        // Renderizar formulário no preview
        this.renderPreviewForm(formData);
        
        // Mostrar modal
        this.modal.classList.remove('hidden');
        
        // Aplicar condições após renderizar
        setTimeout(() => {
            this.applyConditionsToPreview();
        }, 100);
    }
    
    closePreview() {
        this.modal.classList.add('hidden');
        this.previewForm.innerHTML = '';
    }
    
    renderPreviewForm(formData) {
        this.previewForm.innerHTML = '';
        
        formData.elements.forEach(element => {
            const elementHtml = this.createPreviewElement(element);
            this.previewForm.appendChild(elementHtml);
        });
    }
    
    createPreviewElement(element) {
        const wrapper = document.createElement('div');
        wrapper.className = 'form-element-preview';
        wrapper.setAttribute('data-element-id', element.id);
        wrapper.setAttribute('data-element-type', element.type);
        
        // Garantir que element.props existe e normalizar propriedades
        if (!element.props) {
            element.props = element.properties || {};
        }

        // Armazenar condições no elemento
        const conditions = element.props.conditions || element.properties?.conditions;
        if (conditions) {
            wrapper.setAttribute('data-conditions', JSON.stringify(conditions));
        }

        let html = '';

        switch (element.type) {
            case 'text':
            case 'email':
            case 'number':
                html = `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            ${element.props.label || 'Campo de Texto'}
                            ${element.props.required ? '<span class="text-red-500">*</span>' : ''}
                        </label>
                        <input type="${element.type}" 
                               name="${element.props.name || element.id}"
                               placeholder="${element.props.placeholder || ''}"
                               ${element.props.required ? 'required' : ''}
                               class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white">
                    </div>
                `;
                break;
                
            case 'radio':
                html = `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            ${element.props.label || 'Opções'}
                            ${element.props.required ? '<span class="text-red-500">*</span>' : ''}
                        </label>
                        <div class="space-y-2">
                            ${(element.props.options || []).map((option, index) => `
                                <label class="flex items-center">
                                    <input type="radio" 
                                           name="${element.props.name || element.id}"
                                           value="${option.value || option.label || ''}"
                                           ${element.props.required ? 'required' : ''}
                                           class="mr-2 text-primary-600 focus:ring-primary-500">
                                    <span class="text-sm text-gray-700 dark:text-gray-300">${option.label || 'Opção'}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                `;
                break;
                
            case 'select':
                html = `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            ${element.props.label || 'Lista Suspensa'}
                            ${element.props.required ? '<span class="text-red-500">*</span>' : ''}
                        </label>
                        <select name="${element.props.name || element.id}"
                                ${element.props.required ? 'required' : ''}
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white">
                            <option value="">${element.props.placeholder || 'Selecione uma opção'}</option>
                            ${(Array.isArray(element.props.options) ? element.props.options : (typeof element.props.options === 'function' ? element.props.options() : [])).map(option => `
                                <option value="${option.id || option.value || ''}">${option.label || option.text || 'Opção'}</option>
                            `).join('')}
                            ${element.props.allowOther ? `<option value="other">Outro</option>` : ''}
                        </select>
                        ${element.props.allowOther ? `
                            <input type="text" 
                                   name="${element.props.name || element.id}_other_text" 
                                   placeholder="Especifique..."
                                   class="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                                   style="display: none;">
                        ` : ''}
                        ${element.props.helpText ? `<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">${element.props.helpText}</p>` : ''}
                    </div>
                `;
                break;
                
            case 'checkbox':
                html = `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            ${element.props.label || 'Caixas de Seleção'}
                            ${element.props.required ? '<span class="text-red-500">*</span>' : ''}
                        </label>
                        <div class="space-y-2">
                            ${(element.props.options || []).map((option, index) => `
                                <label class="flex items-center">
                                    <input type="checkbox" 
                                           name="${element.props.name || element.id}[]"
                                           value="${option.value || option.label || ''}"
                                           class="mr-2 text-primary-600 focus:ring-primary-500">
                                    <span class="text-sm text-gray-700 dark:text-gray-300">${option.label || 'Opção'}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                `;
                break;

            case 'range':
                html = `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            ${element.props.label || 'Selecione um valor'}
                            ${element.props.required ? '<span class="text-red-500">*</span>' : ''}
                            ${element.props.showValue ? `<span class="float-right text-sm font-normal" id="${element.id}_preview_value">${element.props.defaultValue || 50}</span>` : ''}
                        </label>
                        <input type="range" 
                               name="${element.props.name || element.id}"
                               min="${element.props.min || 0}" 
                               max="${element.props.max || 100}" 
                               step="${element.props.step || 1}" 
                               value="${element.props.defaultValue || 50}"
                               ${element.props.required ? 'required' : ''}
                               class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                               oninput="${element.props.showValue ? `document.getElementById('${element.id}_preview_value').textContent = this.value` : ''}">
                        <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span>${element.props.min || 0}</span>
                            <span>${element.props.max || 100}</span>
                        </div>
                        ${element.props.helpText ? `<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">${element.props.helpText}</p>` : ''}
                    </div>
                `;
                break;
                
            case 'title':
                html = `
                    <div class="mb-4">
                        <h${element.props.level || 2} class="text-${element.props.size || 'xl'} font-bold text-gray-900 dark:text-white">
                            ${element.props.text || 'Título'}
                        </h${element.props.level || 2}>
                    </div>
                `;
                break;
                
            case 'description':
                html = `
                    <div class="mb-4">
                        <p class="text-gray-600 dark:text-gray-400">
                            ${element.props.text || 'Descrição do formulário'}
                        </p>
                    </div>
                `;
                break;
                
            case 'separator':
                html = `
                    <div class="mb-4">
                        <hr class="border-gray-300 dark:border-gray-600">
                    </div>
                `;
                break;
                
            case 'cpf':
                html = `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            ${element.props.label || 'CPF'}
                            ${element.props.required ? '<span class="text-red-500">*</span>' : ''}
                        </label>
                        <input type="text" 
                               name="${element.props.name || element.id}"
                               placeholder="${element.props.placeholder || '000.000.000-00'}"
                               ${element.props.required ? 'required' : ''}
                               class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white">
                    </div>
                `;
                break;
                
            case 'birthdate':
                html = `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            ${element.props.label || 'Data de Nascimento'}
                            ${element.props.required ? '<span class="text-red-500">*</span>' : ''}
                        </label>
                        <input type="date" 
                               name="${element.props.name || element.id}"
                               ${element.props.required ? 'required' : ''}
                               class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white">
                    </div>
                `;
                break;
                
            case 'datetime':
                const datetimeType = element.props.datetimeType || 'datetime-local';
                html = `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            ${element.props.label || 'Data e Hora'}
                            ${element.props.required ? '<span class="text-red-500">*</span>' : ''}
                        </label>
                        <input type="${datetimeType}" 
                               name="${element.props.name || element.id}"
                               ${element.props.required ? 'required' : ''}
                               class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white">
                    </div>
                `;
                break;
                
            case 'nome':
                html = `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            ${element.props.label || 'Nome Completo'}
                            ${element.props.required ? '<span class="text-red-500">*</span>' : ''}
                        </label>
                        <input type="text" 
                               name="${element.props.name || element.id}"
                               placeholder="${element.props.placeholder || 'Digite seu nome completo'}"
                               ${element.props.required ? 'required' : ''}
                               class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white">
                        ${element.props.helpText ? `<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">${element.props.helpText}</p>` : ''}
                    </div>
                `;
                break;
                
            case 'whatsapp':
                html = `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            ${element.props.label || 'WhatsApp'}
                            ${element.props.required ? '<span class="text-red-500">*</span>' : ''}
                        </label>
                        <input type="tel" 
                               name="${element.props.name || element.id}"
                               placeholder="${element.props.placeholder || '(00) 00000-0000'}"
                               ${element.props.required ? 'required' : ''}
                               class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white">
                        ${element.props.helpText ? `<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">${element.props.helpText}</p>` : ''}
                    </div>
                `;
                break;
                
            case 'sexo':
                html = `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            ${element.props.label || 'Sexo'}
                            ${element.props.required ? '<span class="text-red-500">*</span>' : ''}
                        </label>
                        <div class="space-y-2">
                            ${(element.props.options || []).map((option, index) => `
                                <label class="flex items-center">
                                    <input type="radio" 
                                           name="${element.props.name || element.id}"
                                           value="${option.id || option.value || ''}"
                                           ${element.props.required ? 'required' : ''}
                                           class="mr-2 text-primary-600 focus:ring-primary-500">
                                    <span class="text-sm text-gray-700 dark:text-gray-300">${option.label || 'Opção'}</span>
                                </label>
                            `).join('')}
                        </div>
                        ${element.props.helpText ? `<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">${element.props.helpText}</p>` : ''}
                    </div>
                `;
                break;
                
            case 'gestao_interna':
                html = `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            ${element.props.label || 'Já foi batizado nas águas?'}
                            ${element.props.required ? '<span class="text-red-500">*</span>' : ''}
                        </label>
                        <div class="space-y-2">
                            ${(element.props.options || []).map((option, index) => `
                                <label class="flex items-center">
                                    <input type="radio" 
                                           name="${element.props.name || element.id}"
                                           value="${option.id || option.value || ''}"
                                           ${element.props.required ? 'required' : ''}
                                           class="mr-2 text-primary-600 focus:ring-primary-500">
                                    <span class="text-sm text-gray-700 dark:text-gray-300">${option.label || 'Opção'}</span>
                                </label>
                            `).join('')}
                        </div>
                        ${element.props.helpText ? `<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">${element.props.helpText}</p>` : ''}
                    </div>
                `;
                break;
                
            case 'estado_civil':
                html = `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            ${element.props.label || 'Estado Civil'}
                            ${element.props.required ? '<span class="text-red-500">*</span>' : ''}
                        </label>
                        <select name="${element.props.name || element.id}"
                                ${element.props.required ? 'required' : ''}
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white">
                            <option value="">${element.props.placeholder || 'Selecione seu estado civil'}</option>
                            ${(element.props.options || []).map(option => `
                                <option value="${option.id || option.value || ''}">${option.label || 'Opção'}</option>
                            `).join('')}
                        </select>
                        ${element.props.helpText ? `<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">${element.props.helpText}</p>` : ''}
                    </div>
                `;
                break;
            case 'batismo':
                html = `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            ${element.props.label || 'É batizado nas águas?'}
                            ${element.props.required ? '<span class="text-red-500">*</span>' : ''}
                        </label>
                        <div class="space-y-2">
                            ${element.props.options ? element.props.options.map(option => `
                                <div class="flex items-center">
                                    <input type="radio" 
                                           id="${element.id}_${option.id}" 
                                           name="${element.props.name || element.id}" 
                                           value="${option.id}"
                                           class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600"
                                           ${element.props.required ? 'required' : ''}>
                                    <label for="${element.id}_${option.id}" class="ml-2 text-sm text-gray-700 dark:text-gray-300">${option.label}</label>
                                </div>
                            `).join('') : ''}
                        </div>
                        ${element.props.helpText ? `<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">${element.props.helpText}</p>` : ''}
                    </div>
                `;
                break;
            case 'conjugue':
                html = `
                    <div class="mb-4" style="display: none;" data-conditions='${JSON.stringify(element.props.conditions || [])}'>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            ${element.props.label || 'Nome do Cônjuge'}
                            ${element.props.required ? '<span class="text-red-500">*</span>' : ''}
                        </label>
                        <input type="text" 
                               name="${element.props.name || element.id}"
                               placeholder="${element.props.placeholder || 'Digite o nome do cônjuge'}"
                               ${element.props.required ? 'required' : ''}
                               class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white">
                        ${element.props.helpText ? `<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">${element.props.helpText}</p>` : ''}
                    </div>
                `;
                break;
        }
        
        wrapper.innerHTML = html;
        
        // Adicionar event listeners para campos que podem afetar condições
        if (['text', 'email', 'number', 'radio', 'select', 'checkbox', 'cpf', 'birthdate', 'datetime', 'nome', 'whatsapp', 'range', 'conjugue', 'batismo', 'sexo', 'gestao_interna', 'estado_civil'].includes(element.type)) {
            const inputs = wrapper.querySelectorAll('input, select');
            inputs.forEach(input => {
                input.addEventListener('change', () => {
                    this.applyConditionsToPreview();
                });
                input.addEventListener('input', () => {
                    this.applyConditionsToPreview();
                });
            });
        }
        
        return wrapper;
    }
    
    applyConditionsToPreview() {
        const elements = this.previewForm.querySelectorAll('[data-conditions]');
        
        elements.forEach(element => {
            try {
                const conditions = JSON.parse(element.getAttribute('data-conditions'));
                
                if (conditions && conditions.length > 0) {
                    // Avaliamos cada condição separadamente
                    let elementVisible = true;
                    
                    conditions.forEach(condition => {
                        const conditionMet = this.evaluateCondition(condition);
                        
                        // Aplicar ação baseada na condição
                        if (conditionMet) {
                            this.applyConditionAction(element, condition.action);
                            if (condition.action === 'show') {
                                elementVisible = true;
                            }
                        } else {
                            // Se a condição não for atendida e a ação for 'show', esconder o elemento
                            if (condition.action === 'show') {
                                elementVisible = false;
                            }
                        }
                    });
                    
                    // Aplicar visibilidade final
                    if (elementVisible) {
                        element.style.display = '';
                        element.classList.remove('hidden');
                    } else {
                        element.style.display = 'none';
                        element.classList.add('hidden');
                    }
                }
            } catch (e) {
                console.error('Erro ao avaliar condições:', e, element);
            }
        });
    }
    
    evaluateConditions(conditions) {
        return conditions.some(condition => this.evaluateCondition(condition));
    }
    
    evaluateCondition(condition) {
        // Verificar se o campo está definido
        if (!condition.field || condition.field.trim() === '') {
            return false;
        }
        
        const targetField = this.previewForm.querySelector(`[name="${condition.field}"], [name="${condition.field}[]"]`);
        
        if (!targetField) {
            return false;
        }
        
        let fieldValue = '';
        
        if (targetField.type === 'radio') {
            const checkedRadio = this.previewForm.querySelector(`[name="${condition.field}"]:checked`);
            fieldValue = checkedRadio ? checkedRadio.value : '';
        } else if (targetField.type === 'checkbox') {
            const checkedBoxes = this.previewForm.querySelectorAll(`[name="${condition.field}[]"]:checked`);
            fieldValue = Array.from(checkedBoxes).map(cb => cb.value).join(',');
        } else {
            fieldValue = targetField.value || '';
        }
        
        switch (condition.operator) {
            case 'equals':
                return fieldValue === condition.value;
            case 'not_equals':
                return fieldValue !== condition.value;
            case 'contains':
                return fieldValue.toLowerCase().includes(condition.value.toLowerCase());
            case 'not_contains':
                return !fieldValue.toLowerCase().includes(condition.value.toLowerCase());
            case 'is_empty':
                return fieldValue === '' || fieldValue === null || fieldValue === undefined;
            case 'is_not_empty':
                return fieldValue !== '' && fieldValue !== null && fieldValue !== undefined;
            default:
                return false;
        }
    }
    
    applyConditionAction(element, action) {
        const inputs = element.querySelectorAll('input, select, textarea');
        
        switch (action) {
            case 'show':
                element.style.display = '';
                element.classList.remove('hidden');
                break;
            case 'hide':
                element.style.display = 'none';
                element.classList.add('hidden');
                break;
            case 'require':
                inputs.forEach(input => {
                    input.setAttribute('required', 'required');
                    // Adicionar asterisco se não existir
                    const label = element.querySelector('label');
                    if (label && !label.querySelector('.text-red-500')) {
                        label.innerHTML += ' <span class="text-red-500">*</span>';
                    }
                });
                break;
            case 'optional':
                inputs.forEach(input => {
                    input.removeAttribute('required');
                    // Remover asterisco
                    const asterisk = element.querySelector('.text-red-500');
                    if (asterisk) {
                        asterisk.remove();
                    }
                });
                break;
        }
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    window.formPreview = new FormPreview();
});