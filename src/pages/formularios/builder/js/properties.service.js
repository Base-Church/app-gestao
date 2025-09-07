// Gerenciador do painel de propriedades
class PropertiesManager {
    constructor(formBuilder) {
        this.formBuilder = formBuilder;
        this.currentElement = null;
        this.activeTab = 'properties';
        
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        this.propertiesPanel = document.getElementById('element-properties');
        this.noSelectionPanel = document.getElementById('no-selection');
        this.propertiesContent = document.getElementById('properties-content');
        this.conditionsContent = document.getElementById('conditions-content');
        
        // Tabs
        this.propertiesTab = document.getElementById('properties-tab');
        this.conditionsTab = document.getElementById('conditions-tab');
    }

    setupEventListeners() {
        this.setupTabSwitching();
        this.setupConditionsListeners();
    }

    // Configura a troca entre abas
    setupTabSwitching() {
        // Configura listeners para as abas de propriedades
        if (this.propertiesTab) {
            this.propertiesTab.addEventListener('click', () => this.switchTab('properties'));
        }
        if (this.conditionsTab) {
            this.conditionsTab.addEventListener('click', () => this.switchTab('conditions'));
        }
        
        // Configura listeners para as abas principais (Properties/JSON)
        const mainTabButtons = document.querySelectorAll('.tab-button');
        mainTabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.id.replace('tab-', '').replace('-panel', '');
                this.switchMainTab(targetTab);
            });
        });
    }

    switchMainTab(tabName) {
        // Alterna entre as abas principais (Properties/JSON)
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.classList.remove('active', 'border-primary-500', 'text-primary-600', 'dark:text-primary-400');
            button.classList.add('border-transparent', 'text-gray-500', 'dark:text-gray-400');
        });
        
        tabContents.forEach(content => {
            content.classList.add('hidden');
        });
        
        const activeButton = document.getElementById(`tab-${tabName}`);
        const activeContent = document.getElementById(`${tabName}-panel`);
        
        if (activeButton) {
            activeButton.classList.add('active', 'border-primary-500', 'text-primary-600', 'dark:text-primary-400');
            activeButton.classList.remove('border-transparent', 'text-gray-500', 'dark:text-gray-400');
        }
        
        if (activeContent) {
            activeContent.classList.remove('hidden');
        }
    }

    switchTab(tabName) {
        this.activeTab = tabName;
        
        // Remove active class from all tabs
        const tabs = [this.propertiesTab, this.conditionsTab];
        tabs.forEach(tab => {
            if (tab) {
                tab.classList.remove('border-primary-500', 'text-primary-600', 'dark:text-primary-400');
                tab.classList.add('border-transparent', 'text-gray-500', 'dark:text-gray-400');
            }
        });
        
        // Hide all content panels
        const contents = [this.propertiesContent, this.conditionsContent];
        contents.forEach(content => {
            if (content) {
                content.classList.add('hidden');
            }
        });
        
        // Add active class to selected tab and show content
        let activeTab, activeContent;
        
        switch(tabName) {
            case 'properties':
                activeTab = this.propertiesTab;
                activeContent = this.propertiesContent;
                if (this.currentElement) {
                    this.renderProperties(this.currentElement);
                }
                break;
            case 'conditions':
                activeTab = this.conditionsTab;
                activeContent = this.conditionsContent;
                this.renderConditions();
                break;
        }
        
        if (activeTab) {
            activeTab.classList.add('border-primary-500', 'text-primary-600', 'dark:text-primary-400');
            activeTab.classList.remove('border-transparent', 'text-gray-500', 'dark:text-gray-400');
        }
        
        if (activeContent) {
            activeContent.classList.remove('hidden');
        }
    }



    renderConditions() {
         if (!this.conditionsContent || !this.currentElement) return;
         
         const element = this.currentElement;
         // Garante que as condições estão em props.conditions
         if (!element.props.conditions) {
             element.props.conditions = [];
         }
         const conditions = element.props.conditions;
         
         const conditionsList = this.conditionsContent.querySelector('#conditions-list');
         if (!conditionsList) return;
         
         conditionsList.innerHTML = '';
         
         if (conditions.length === 0) {
             conditionsList.innerHTML = '<p class="text-sm text-gray-500 dark:text-gray-400">Nenhuma condição definida.</p>';
             return;
         }
         
         conditions.forEach((condition, index) => {
             const conditionElement = this.createConditionElement(condition, index);
             conditionsList.appendChild(conditionElement);
         });
     }

     createConditionElement(condition, index) {
         const div = document.createElement('div');
         div.className = 'p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800';
         
         const availableFields = this.getAvailableFields();
         
         div.innerHTML = `
             <div class="flex items-center justify-between mb-2">
                 <span class="text-xs font-medium text-gray-700 dark:text-gray-300">Condição ${index + 1}</span>
                 <button type="button" class="text-red-500 hover:text-red-700 text-sm" onclick="window.formBuilder.properties.removeCondition(${index})">
                     Remover
                 </button>
             </div>
             
             <div class="space-y-2">
                 <div>
                     <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Se o campo</label>
                     <select class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100" 
                             onchange="window.formBuilder.properties.updateCondition(${index}, 'field', this.value)">
                         <option value="">Selecione um campo</option>
                         ${availableFields.map(field => 
                             `<option value="${field.id}" ${condition.field === field.id ? 'selected' : ''}>${field.label}</option>`
                         ).join('')}
                     </select>
                 </div>
                 
                 <div>
                     <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Operador</label>
                     <select class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100" 
                             onchange="window.formBuilder.properties.updateCondition(${index}, 'operator', this.value)">
                         <option value="equals" ${condition.operator === 'equals' ? 'selected' : ''}>Igual a</option>
                         <option value="not_equals" ${condition.operator === 'not_equals' ? 'selected' : ''}>Diferente de</option>
                         <option value="contains" ${condition.operator === 'contains' ? 'selected' : ''}>Contém</option>
                         <option value="not_contains" ${condition.operator === 'not_contains' ? 'selected' : ''}>Não contém</option>
                         <option value="is_empty" ${condition.operator === 'is_empty' ? 'selected' : ''}>Vazio</option>
                         <option value="is_not_empty" ${condition.operator === 'is_not_empty' ? 'selected' : ''}>Não vazio</option>
                     </select>
                 </div>
                 
                 <div class="${condition.operator === 'is_empty' || condition.operator === 'is_not_empty' ? 'hidden' : ''}">
                     <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Valor</label>
                     <input type="text" 
                            class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100" 
                            value="${condition.value || ''}" 
                            onchange="window.formBuilder.properties.updateCondition(${index}, 'value', this.value)" 
                            placeholder="Digite o valor...">
                 </div>
                 
                 <div>
                     <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Então</label>
                     <select class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100" 
                             onchange="window.formBuilder.properties.updateCondition(${index}, 'action', this.value)">
                         <option value="show" ${condition.action === 'show' ? 'selected' : ''}>Visualizar este campo</option>
                         <option value="hide" ${condition.action === 'hide' ? 'selected' : ''}>Ocultar este campo</option>
                         <option value="require" ${condition.action === 'require' ? 'selected' : ''}>Tornar obrigatório</option>
                         <option value="optional" ${condition.action === 'optional' ? 'selected' : ''}>Tornar opcional</option>
                     </select>
                 </div>
             </div>
         `;
         
         return div;
     }

    setupConditionsListeners() {
         const addConditionBtn = document.getElementById('add-condition');
         if (addConditionBtn) {
             addConditionBtn.addEventListener('click', () => {
                 this.addCondition();
             });
         }
     }



     // Obter campos disponíveis para condições
     getAvailableFields() {
         return this.formBuilder.formElements
             .filter(el => el.id !== this.currentElement.id && ['text', 'number', 'email', 'radio', 'select', 'checkbox', 'range'].includes(el.type))
             .map(el => ({ id: el.id, label: el.props.label || el.props.placeholder || `Campo ${el.type}` }));
     }

     addCondition() {
         if (!this.currentElement) return;
         
         // Garante que as condições estão em props.conditions
         if (!this.currentElement.props.conditions) {
             this.currentElement.props.conditions = [];
         }
         
         const newCondition = {
             id: this.generateConditionId(),
             field: '',
             operator: 'equals',
             value: '',
             action: 'show'
         };
         
         this.currentElement.props.conditions.push(newCondition);
         this.renderConditions();
         this.formBuilder.updateJsonOutput();
     }

     updateCondition(index, property, value) {
         if (!this.currentElement || !this.currentElement.props.conditions || !this.currentElement.props.conditions[index]) return;
         
         this.currentElement.props.conditions[index][property] = value;
         
         // Se o operador mudou para is_empty ou is_not_empty, limpa o valor
         if (property === 'operator' && (value === 'is_empty' || value === 'is_not_empty')) {
             this.currentElement.props.conditions[index].value = '';
         }
         
         // Se não tem action definida, define como 'show'
         if (!this.currentElement.props.conditions[index].action) {
             this.currentElement.props.conditions[index].action = 'show';
         }
         
         // Re-renderiza se mudou o operador para atualizar a interface
         if (property === 'operator') {
             this.renderConditions();
         }
         
         this.formBuilder.updateJsonOutput();
     }

     removeCondition(index) {
         if (!this.currentElement || !this.currentElement.props.conditions) return;
         
         this.currentElement.props.conditions.splice(index, 1);
         this.renderConditions();
         this.formBuilder.updateJsonOutput();
     }
     
     // Gera ID único para condições
     generateConditionId() {
         return 'condition_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
     }

    // Mostra as propriedades de um elemento
    showElementProperties(element) {
        this.currentElement = element;
        this.noSelectionPanel.classList.add('hidden');
        this.propertiesPanel.classList.remove('hidden');
        
        // Renderiza baseado na aba ativa
        this.switchTab(this.activeTab);
    }

    // Esconde o painel de propriedades
    hideElementProperties() {
        this.currentElement = null;
        this.propertiesPanel.classList.add('hidden');
        this.noSelectionPanel.classList.remove('hidden');
    }

    // Renderiza as propriedades baseado no tipo do elemento
    renderProperties(element) {
        const elementType = this.formBuilder.elements.getElementType(element.type);
        if (!elementType) return;

        let html = `<h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">${elementType.label}</h4>`;
        
        // Gera campos baseado no tipo
        switch (element.type) {
            case 'text':
                html += this.renderTextProperties(element);
                break;
            case 'number':
                html += this.renderNumberProperties(element);
                break;
            case 'email':
                html += this.renderEmailProperties(element);
                break;
            case 'radio':
                html += this.renderRadioProperties(element);
                break;
            case 'select':
                html += this.renderSelectProperties(element);
                break;
            case 'checkbox':
                html += this.renderCheckboxProperties(element);
                break;
            case 'title':
                html += this.renderTitleProperties(element);
                break;
            case 'description':
                html += this.renderDescriptionProperties(element);
                break;
            case 'separator':
                html += this.renderSeparatorProperties(element);
                break;
            case 'cpf':
                html += this.renderCpfProperties(element);
                break;
            case 'birthdate':
                html += this.renderBirthdateProperties(element);
                break;
            case 'datetime':
                html += this.renderDatetimeProperties(element);
                break;
            case 'nome':
                html += this.renderNomeProperties(element);
                break;
            case 'whatsapp':
                html += this.renderWhatsappProperties(element);
                break;
            case 'range':
                html += this.renderRangeProperties(element);
                break;
        }

        // Botão de deletar
        html += `
            <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                <button onclick="window.formBuilder.deleteElement('${element.id}')" 
                        class="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    Excluir Elemento
                </button>
            </div>
        `;

        this.propertiesContent.innerHTML = html;
        this.setupPropertyListeners(element);
    }

    // Propriedades para campo de texto
    renderTextProperties(element) {
        return `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rótulo</label>
                    <input type="text" id="prop-label" value="${element.props.label}" 
                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Placeholder</label>
                    <input type="text" id="prop-placeholder" value="${element.props.placeholder || ''}" 
                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Texto de Ajuda</label>
                    <input type="text" id="prop-helptext" value="${element.props.helpText || ''}" 
                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                </div>

                <div class="flex items-center">
                    <input type="checkbox" id="prop-required" ${element.props.required ? 'checked' : ''} 
                           class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded">
                    <label for="prop-required" class="ml-2 text-sm text-gray-700 dark:text-gray-300">Campo obrigatório</label>
                </div>
            </div>
        `;
    }

    // Propriedades para campo numérico
    renderNumberProperties(element) {
        return `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rótulo</label>
                    <input type="text" id="prop-label" value="${element.props.label || ''}" 
                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Placeholder</label>
                    <input type="text" id="prop-placeholder" value="${element.props.placeholder || ''}" 
                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Texto de Ajuda</label>
                    <input type="text" id="prop-helptext" value="${element.props.helpText || ''}" 
                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                </div>

                <div class="flex items-center">
                    <input type="checkbox" id="prop-required" ${element.props.required ? 'checked' : ''} 
                           class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded">
                    <label for="prop-required" class="ml-2 text-sm text-gray-700 dark:text-gray-300">Campo obrigatório</label>
                </div>
            </div>
        `;
    }

    // Propriedades para campo de email
    renderEmailProperties(element) {
        return `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rótulo</label>
                    <input type="text" id="prop-label" value="${element.props.label || ''}" 
                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Placeholder</label>
                    <input type="text" id="prop-placeholder" value="${element.props.placeholder || ''}" 
                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Texto de Ajuda</label>
                    <input type="text" id="prop-helptext" value="${element.props.helpText || ''}" 
                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                </div>
                <div class="flex items-center">
                    <input type="checkbox" id="prop-required" ${element.props.required ? 'checked' : ''} 
                           class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded">
                    <label for="prop-required" class="ml-2 text-sm text-gray-700 dark:text-gray-300">Campo obrigatório</label>
                </div>
            </div>
        `;
    }

    // Propriedades para radio buttons
    renderRadioProperties(element) {
        return `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rótulo</label>
                    <input type="text" id="prop-label" value="${element.props.label}" 
                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Opções</label>
                    <div id="options-container" class="space-y-2">
                        ${(element.props.options || []).map((option, index) => `
                            <div class="flex items-center gap-2">
                                <input type="text" value="${option.label || option.text || 'Opção'}" data-option-index="${index}" data-option-field="label"
                                       class="option-label-input grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm" placeholder="Texto da opção">
                                <button type="button" class="copy-option-id text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 p-1 flex-shrink-0" data-option-id="${option.id || option.value || ''}" title="Copiar ID">
                                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16h8M8 12h8m-7 8h6a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                    </svg>
                                </button>
                                <button onclick="this.parentElement.remove(); window.formBuilder.properties.removeOption(${index})" 
                                        class="text-red-600 hover:text-red-800 p-1 flex-shrink-0" title="Remover opção">
                                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                    <button onclick="window.formBuilder.properties.addOption()" 
                            class="mt-2 text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300">
                        + Adicionar opção
                    </button>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Texto de Ajuda</label>
                    <textarea id="prop-helpText" rows="2" 
                              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">${element.props.helpText || ''}</textarea>
                </div>
                <div class="flex items-center">
                    <input type="checkbox" id="prop-allowOther" ${element.props.allowOther ? 'checked' : ''} 
                           class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded">
                    <label for="prop-allowOther" class="ml-2 text-sm text-gray-700 dark:text-gray-300">Permitir opção "Outro"</label>
                </div>
                <div class="flex items-center">
                    <input type="checkbox" id="prop-required" ${element.props.required ? 'checked' : ''} 
                           class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded">
                    <label for="prop-required" class="ml-2 text-sm text-gray-700 dark:text-gray-300">Campo obrigatório</label>
                </div>
            </div>
        `;
    }

    // Propriedades para select
    renderSelectProperties(element) {
        return this.renderRadioProperties(element).replace('Opções', 'Opções da Lista');
    }

    // Propriedades para checkbox
    renderCheckboxProperties(element) {
        return this.renderRadioProperties(element).replace('Opções', 'Opções de Seleção');
    }

    // Propriedades para título
    renderTitleProperties(element) {
        return `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Texto</label>
                    <input type="text" id="prop-text" value="${element.props.text || ''}" 
                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
                    <textarea id="prop-description" rows="2" 
                              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">${element.props.description || ''}</textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alinhamento</label>
                    <select id="prop-alignment" 
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                        <option value="left" ${element.props.alignment === 'left' ? 'selected' : ''}>Esquerda</option>
                        <option value="center" ${element.props.alignment === 'center' ? 'selected' : ''}>Centro</option>
                        <option value="right" ${element.props.alignment === 'right' ? 'selected' : ''}>Direita</option>
                    </select>
                </div>
            </div>
        `;
    }

    // Propriedades para descrição
    renderDescriptionProperties(element) {
        return `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Texto</label>
                    <textarea id="prop-text" rows="3" 
                              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">${element.props.text || ''}</textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alinhamento</label>
                    <select id="prop-alignment" 
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                        <option value="left" ${element.props.alignment === 'left' ? 'selected' : ''}>Esquerda</option>
                        <option value="center" ${element.props.alignment === 'center' ? 'selected' : ''}>Centro</option>
                        <option value="right" ${element.props.alignment === 'right' ? 'selected' : ''}>Direita</option>
                    </select>
                </div>
            </div>
        `;
    }

    // Propriedades para separador
    renderSeparatorProperties(element) {
        return `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estilo</label>
                    <select id="prop-style" 
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                        <option value="solid" ${element.props.style === 'solid' ? 'selected' : ''}>Sólido</option>
                        <option value="dashed" ${element.props.style === 'dashed' ? 'selected' : ''}>Tracejado</option>
                        <option value="dotted" ${element.props.style === 'dotted' ? 'selected' : ''}>Pontilhado</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Espessura (px)</label>
                    <input type="number" id="prop-thickness" value="${element.props.thickness}" min="1" max="10" 
                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cor</label>
                    <select id="prop-color" 
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                        <option value="gray" ${element.props.color === 'gray' ? 'selected' : ''}>Cinza</option>
                        <option value="primary" ${element.props.color === 'primary' ? 'selected' : ''}>Primária</option>
                        <option value="red" ${element.props.color === 'red' ? 'selected' : ''}>Vermelho</option>
                        <option value="blue" ${element.props.color === 'blue' ? 'selected' : ''}>Azul</option>
                        <option value="green" ${element.props.color === 'green' ? 'selected' : ''}>Verde</option>
                    </select>
                </div>
            </div>
        `;
    }

    // Propriedades para CPF
    renderCpfProperties(element) {
        return `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rótulo</label>
                    <input type="text" id="prop-label" value="${element.props.label}" 
                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Texto de Ajuda</label>
                    <input type="text" id="prop-placeholder" value="${element.props.placeholder}" 
                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                </div>
                <div class="flex items-center">
                    <input type="checkbox" id="prop-required" ${element.props.required ? 'checked' : ''} 
                           class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded">
                    <label for="prop-required" class="ml-2 text-sm text-gray-700 dark:text-gray-300">Campo obrigatório</label>
                </div>
            </div>
        `;
    }

    // Propriedades para data de nascimento
    renderBirthdateProperties(element) {
        return `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rótulo</label>
                    <input type="text" id="prop-label" value="${element.props.label}" 
                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                </div>
                <div class="flex items-center">
                    <input type="checkbox" id="prop-required" ${element.props.required ? 'checked' : ''} 
                           class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded">
                    <label for="prop-required" class="ml-2 text-sm text-gray-700 dark:text-gray-300">Campo obrigatório</label>
                </div>
            </div>
        `;
    }

    // Propriedades para data e hora
    renderDatetimeProperties(element) {
        return `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rótulo</label>
                    <input type="text" id="prop-label" value="${element.props.label}" 
                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo</label>
                    <select id="prop-dateType" 
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                        <option value="date" ${element.props.dateType === 'date' ? 'selected' : ''}>Apenas Data</option>
                        <option value="time" ${element.props.dateType === 'time' ? 'selected' : ''}>Apenas Hora</option>
                        <option value="datetime-local" ${element.props.dateType === 'datetime-local' ? 'selected' : ''}>Data e Hora</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Texto de Ajuda</label>
                    <textarea id="prop-helpText" rows="2" 
                              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">${element.props.helpText}</textarea>
                </div>
                <div class="flex items-center">
                    <input type="checkbox" id="prop-required" ${element.props.required ? 'checked' : ''} 
                           class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded">
                    <label for="prop-required" class="ml-2 text-sm text-gray-700 dark:text-gray-300">Campo obrigatório</label>
                </div>
            </div>
        `;
    }

    // Propriedades para Nome Completo
    renderNomeProperties(element) {
        return `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rótulo</label>
                    <input type="text" id="prop-label" value="${element.props.label}" 
                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Placeholder</label>
                    <input type="text" id="prop-placeholder" value="${element.props.placeholder || ''}" 
                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Texto de Ajuda</label>
                    <textarea id="prop-helpText" rows="2" 
                              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">${element.props.helpText || ''}</textarea>
                </div>
                <div class="flex items-center">
                    <input type="checkbox" id="prop-required" ${element.props.required ? 'checked' : ''} 
                           class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded">
                    <label for="prop-required" class="ml-2 text-sm text-gray-700 dark:text-gray-300">Campo obrigatório</label>
                </div>
            </div>
        `;
    }

    // Propriedades para WhatsApp
    // Propriedades para WhatsApp
    renderWhatsappProperties(element) {
        return `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rótulo</label>
                    <input type="text" id="prop-label" value="${element.props.label}" 
                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Placeholder</label>
                    <input type="text" id="prop-placeholder" value="${element.props.placeholder || ''}" 
                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Texto de Ajuda</label>
                    <textarea id="prop-helpText" rows="2" 
                              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">${element.props.helpText || ''}</textarea>
                </div>
                <div class="flex items-center">
                    <input type="checkbox" id="prop-required" ${element.props.required ? 'checked' : ''} 
                           class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded">
                    <label for="prop-required" class="ml-2 text-sm text-gray-700 dark:text-gray-300">Campo obrigatório</label>
                </div>
            </div>
        `;
    }

    // Propriedades para Range Slider
    renderRangeProperties(element) {
        return `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rótulo</label>
                    <input type="text" id="prop-label" value="${element.props.label}" 
                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                </div>
                <div class="grid grid-cols-3 gap-2">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valor Mínimo</label>
                        <input type="number" id="prop-min" value="${element.props.min || 0}" 
                               class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valor Máximo</label>
                        <input type="number" id="prop-max" value="${element.props.max || 100}" 
                               class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Incremento</label>
                        <input type="number" id="prop-step" value="${element.props.step || 1}" 
                               step="0.1" min="0.1"
                               class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valor Padrão</label>
                    <input type="number" id="prop-defaultValue" value="${element.props.defaultValue || 50}" 
                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Texto de Ajuda</label>
                    <textarea id="prop-helpText" rows="2" 
                              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm">${element.props.helpText || ''}</textarea>
                </div>
                <div class="flex items-center">
                    <input type="checkbox" id="prop-showValue" ${element.props.showValue ? 'checked' : ''} 
                           class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded">
                    <label for="prop-showValue" class="ml-2 text-sm text-gray-700 dark:text-gray-300">Exibir valor atual</label>
                </div>
                <div class="flex items-center">
                    <input type="checkbox" id="prop-required" ${element.props.required ? 'checked' : ''} 
                           class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded">
                    <label for="prop-required" class="ml-2 text-sm text-gray-700 dark:text-gray-300">Campo obrigatório</label>
                </div>
            </div>
        `;
    }

    // Configura os listeners para os campos de propriedades
    setupPropertyListeners(element) {
        const inputs = this.propertiesPanel.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.updateElementProperty(element, input);
            });
            
            input.addEventListener('change', () => {
                this.updateElementProperty(element, input);
            });
        });

        // Listener especial para inputs de opções
        const optionInputs = this.propertiesPanel.querySelectorAll('.option-input');
        optionInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.updateOptionsFromInputs();
            });
        });
    }

    // Atualiza uma propriedade do elemento
    updateElementProperty(element, input) {
        const propertyName = input.id.replace('prop-', '');
        let value = input.type === 'checkbox' ? input.checked : input.value;
        
        // Converte valores numéricos
        if (input.type === 'number' && value !== '') {
            value = parseFloat(value);
        }
        
        element.props[propertyName] = value;
        this.formBuilder.updateElement(element.id, element.props);
        this.formBuilder.renderForm();
    }

    // Adiciona uma nova opção com id único e label
    addOption() {
        if (!this.currentElement) return;
        if (!Array.isArray(this.currentElement.props.options)) this.currentElement.props.options = [];
        this.currentElement.props.options.push({ id: 'opt_' + Math.random().toString(36).substr(2, 9), label: 'Nova opção' });
        this.formBuilder.updateElement(this.currentElement.id, this.currentElement.props);
        this.renderProperties(this.currentElement);
    }

    // Atualiza apenas os labels das opções existentes
    updateOptionsFromInputs() {
        if (!this.currentElement || !Array.isArray(this.currentElement.props.options)) return;
        const optionLabelInputs = document.querySelectorAll('.option-label-input');
        for (let i = 0; i < optionLabelInputs.length; i++) {
            if (this.currentElement.props.options[i]) {
                this.currentElement.props.options[i].label = optionLabelInputs[i].value;
            }
        }
        this.formBuilder.updateElement(this.currentElement.id, this.currentElement.props);
        this.formBuilder.renderForm();
    }

    // Remove uma opção específica
    removeOption(index) {
        if (!this.currentElement || !Array.isArray(this.currentElement.props.options)) return;
        this.currentElement.props.options.splice(index, 1);
        this.formBuilder.updateElement(this.currentElement.id, this.currentElement.props);
        this.renderProperties(this.currentElement);
    }
    // Adiciona listeners para copiar ID das opções
    setupPropertyListeners(element) {
        const inputs = this.propertiesPanel.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.updateElementProperty(element, input);
            });
            input.addEventListener('change', () => {
                this.updateElementProperty(element, input);
            });
        });

        // Listener especial para inputs de opções
        const optionLabelInputs = this.propertiesPanel.querySelectorAll('.option-label-input');
        const optionIdInputs = this.propertiesPanel.querySelectorAll('.option-id-input');
        optionLabelInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.updateOptionsFromInputs();
            });
        });
        optionIdInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.updateOptionsFromInputs();
            });
        });

        // Botão de copiar ID
        const copyButtons = this.propertiesPanel.querySelectorAll('.copy-option-id');
        copyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = btn.getAttribute('data-option-id');
                if (id) {
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(id);
                    } else {
                        const tempInput = document.createElement('input');
                        tempInput.value = id;
                        document.body.appendChild(tempInput);
                        tempInput.select();
                        document.execCommand('copy');
                        document.body.removeChild(tempInput);
                    }
                    if (window.NotificationSystem) {
                        window.NotificationSystem.show('ID copiado: ' + id, 'success', 2000);
                    } else if (window.formBuilder && window.formBuilder.showNotification) {
                        window.formBuilder.showNotification('ID copiado: ' + id, 'success');
                    } else {
                        alert('ID copiado: ' + id);
                    }
                }
            });
        });
    }
}

// Exporta a classe globalmente
window.PropertiesManager = PropertiesManager;