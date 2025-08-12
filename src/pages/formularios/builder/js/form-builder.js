// Construtor de formulários principal
class FormBuilder {
    constructor() {
        this.formElements = [];
        this.selectedElement = null;
        this.nextId = 1;
        this.conditions = [];
        
        this.init();
    }

    init() {
        // Inicializa os componentes
        this.elements = new FormElements();
        this.dragDrop = new DragDropManager(this);
        this.properties = new PropertiesManager(this);
        
        // Configura eventos
        this.setupEventListeners();
        
        // Renderiza elementos iniciais
        this.renderElementsSidebar();
        this.updateJsonOutput();
        
        // Inicializa sistema de condições
        this.conditions = [];
        
        // Torna disponível globalmente
        window.formBuilder = this;
    }

    setupEventListeners() {
        // Botão de salvar formulário
        const saveBtn = document.getElementById('save-form-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveForm());
        }

        // Botão de limpar formulário
        const clearBtn = document.getElementById('clear-form-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearForm());
        }

        // Clique na área do formulário para deselecionar
        const formArea = document.getElementById('drop-zone');
        if (formArea) {
            formArea.addEventListener('click', (e) => {
                if (e.target === formArea) {
                    this.deselectElement();
                }
            });
        }
    }

    // Renderiza a barra lateral de elementos
    renderElementsSidebar() {
        const container = document.querySelector('.col-span-3 .p-3.space-y-2');
        if (!container) return;

        const elementTypes = this.elements.getElementTypes();
        
        // Definir categorias
        const categories = {
            'Campos de Entrada': ['text', 'number', 'email'],
            'Campos Especiais': ['cpf', 'birthdate'],
            'Seleção': ['radio', 'select', 'checkbox'],
            'Data e Hora': ['datetime'],
            'Conteúdo': ['title', 'description', 'separator']
        };
        
        let html = '';
        let isFirstCategory = true;
        
        // Renderizar cada categoria
        Object.entries(categories).forEach(([categoryName, elementTypesInCategory]) => {
            const elementsInCategory = elementTypes.filter(element => 
                elementTypesInCategory.includes(element.type)
            );
            
            if (elementsInCategory.length > 0) {
                // Adicionar espaçamento antes da categoria (exceto a primeira)
                if (!isFirstCategory) {
                    html += `<div class="pt-3 border-t border-gray-200 dark:border-gray-600"></div>`;
                }
                
                html += `<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">${categoryName}</h4>`;
                
                elementsInCategory.forEach(element => {
                    html += `
                        <div class="element-item bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 cursor-move hover:shadow-md transition-shadow"
                             draggable="true" data-type="${element.type}">
                            <div class="flex items-center space-x-3">
                                <div class="text-primary-600 dark:text-primary-400">
                                    ${element.icon}
                                </div>
                                <div>
                                    <div class="font-medium text-gray-900 dark:text-white text-sm">${element.label}</div>
                                    <div class="text-xs text-gray-500 dark:text-gray-400">${element.description}</div>
                                </div>
                            </div>
                        </div>
                    `;
                });
                
                isFirstCategory = false;
            }
        });
        
        container.innerHTML = html;
    }

    // Adiciona um elemento ao formulário
    addElement(elementType, position = null) {
        const elementConfig = this.elements.getElementType(elementType);
        if (!elementConfig) return null;

        // Gerar ID único e aleatório
        const randomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        
        const element = {
            id: `element_${randomId}`,
            type: elementType,
            props: { ...elementConfig.defaultProps }
        };

        if (position !== null && position >= 0 && position <= this.formElements.length) {
            this.formElements.splice(position, 0, element);
        } else {
            this.formElements.push(element);
        }

        this.renderForm();
        this.updateJsonOutput();
        this.selectElement(element.id);
        
        // Atualiza o sortable após adicionar elemento
        if (this.dragDrop && this.dragDrop.updateSortable) {
            this.dragDrop.updateSortable();
        }
        
        return element;
    }

    // Remove um elemento do formulário
    deleteElement(elementId) {
        const index = this.formElements.findIndex(el => el.id === elementId);
        if (index !== -1) {
            this.formElements.splice(index, 1);
            
            // Se o elemento removido estava selecionado, limpa a seleção
            if (this.selectedElement && this.selectedElement.id === elementId) {
                this.deselectElement();
            }
            
            this.renderForm();
            this.updateJsonOutput();
        }
    }

    // Atualiza as propriedades de um elemento
    updateElement(elementId, newProps) {
        const element = this.formElements.find(el => el.id === elementId);
        if (element) {
            element.props = { ...element.props, ...newProps };
            this.renderForm();
            this.updateJsonOutput();
        }
    }

    // Move um elemento para uma nova posição
    moveElement(elementId, newPosition) {
        const currentIndex = this.formElements.findIndex(el => el.id === elementId);
        if (currentIndex === -1) return;

        const element = this.formElements.splice(currentIndex, 1)[0];
        this.formElements.splice(newPosition, 0, element);
        
        this.renderForm();
        this.updateJsonOutput();
    }

    // Seleciona um elemento
    selectElement(elementId) {
        // Remove seleção anterior
        document.querySelectorAll('.form-element').forEach(el => {
            el.classList.remove('ring-2', 'ring-primary-500');
        });

        // Encontra o elemento
        const element = this.formElements.find(el => el.id === elementId);
        if (!element) return;

        this.selectedElement = element;
        
        // Adiciona visual de seleção
        const elementDiv = document.querySelector(`[data-element-id="${elementId}"]`);
        if (elementDiv) {
            elementDiv.classList.add('ring-2', 'ring-primary-500');
        }

        // Mostra propriedades
        this.properties.showElementProperties(element);
    }

    // Deseleciona elemento atual
    deselectElement() {
        document.querySelectorAll('.form-element').forEach(el => {
            el.classList.remove('ring-2', 'ring-primary-500');
        });
        
        this.selectedElement = null;
        this.properties.hideElementProperties();
    }

    // Renderiza o formulário
    renderForm() {
        const container = document.getElementById('drop-zone');
        if (!container) return;

        if (this.formElements.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12 text-gray-500 dark:text-gray-400">
                    <svg class="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <p class="text-lg font-medium mb-2">Formulário vazio</p>
                    <p class="text-sm">Arraste elementos da barra lateral para começar a construir seu formulário</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.formElements.map((element, index) => {
            const elementConfig = this.elements.getElementType(element.type);
            if (!elementConfig) return '';

            const html = elementConfig.template(element.props, element.id);
            
            return `
                <div class="form-element relative group border border-transparent rounded-lg p-1 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                     data-element-id="${element.id}" data-element-index="${index}">
                    
                    <!-- Controles do elemento -->
                    <div class="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 z-10">
                        <button onclick="window.formBuilder.selectElement('${element.id}')" 
                                class="bg-primary-600 text-white rounded-full p-1 hover:bg-primary-700 shadow-lg"
                                title="Configurar">
                            <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                        </button>
                        <button onclick="window.formBuilder.deleteElement('${element.id}')" 
                                class="bg-red-600 text-white rounded-full p-1 hover:bg-red-700 shadow-lg"
                                title="Excluir">
                            <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                        </button>
                    </div>
                    
                    <!-- Indicador de arrastar -->
                    <div class="absolute left-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move drag-handle"
                         data-element-id="${element.id}">
                        <svg class="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                        </svg>
                    </div>
                    
                    <!-- Conteúdo do elemento -->
                    <div class="ml-6">
                        ${html}
                    </div>
                </div>
            `;
        }).join('');

        // Adiciona event listeners para cliques nos elementos
        document.querySelectorAll('.form-element').forEach(elementDiv => {
            elementDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                const elementId = elementDiv.dataset.elementId;
                if (elementId) {
                    this.selectElement(elementId);
                }
            });
            
            // Event listeners removidos - condições aplicadas apenas no preview
        });
        
        // Reaplica seleção se houver
        if (this.selectedElement) {
            const elementDiv = document.querySelector(`[data-element-id="${this.selectedElement.id}"]`);
            if (elementDiv) {
                elementDiv.classList.add('ring-2', 'ring-primary-500');
            }
        }
    }

    // Atualiza a saída JSON
    updateJsonOutput() {
        const jsonContainer = document.getElementById('form-json');
        if (!jsonContainer) return;

        const titleInput = document.getElementById('form-title-input');
        const formTitle = titleInput ? titleInput.value.trim() : 'Formulário Personalizado';

        const formData = {
            title: formTitle || 'Formulário Personalizado',
            elements: this.formElements.map(element => {
                const properties = { ...element.props };
                // Substituir helpText por placeholder no JSON final
                if (properties.helpText !== undefined) {
                    properties.placeholder = properties.helpText;
                    delete properties.helpText;
                }
                // Garante que options de radio/select/checkbox são [{id,label}]
                if (["radio","select","checkbox"].includes(element.type) && Array.isArray(properties.options)) {
                    properties.options = properties.options.map(opt =>
                        typeof opt === 'object' && opt !== null && 'id' in opt && 'label' in opt
                            ? opt
                            : { id: 'op' + Math.random().toString(36).substr(2, 6), label: String(opt) }
                    );
                }
                return {
                    id: element.id,
                    type: element.type,
                    properties: properties
                };
            })
        };

        jsonContainer.textContent = JSON.stringify(formData, null, 2);
        
        // Condições aplicadas apenas no preview
    }

    // Salva o formulário
    async saveForm() {
        try {
            if (this.formElements.length === 0) {
                alert('Adicione pelo menos um elemento ao formulário antes de salvar.');
                return;
            }

            const formTitle = document.getElementById('form-title-input')?.value || 'Formulário Personalizado';
            const processoEtapaInput = document.getElementById('processo-etapa-select');
            const processoEtapaValue = processoEtapaInput ? processoEtapaInput.value.trim() : '';
            
            // Converter string separada por vírgula em array (pode ser vazio)
            const processoEtapaIds = processoEtapaValue ? processoEtapaValue.split(',').filter(id => id.trim()).map(id => parseInt(id.trim())) : [];

            // Importa e usa a API
            const { FormulariosAPI } = await import('./api.js');
            const api = new FormulariosAPI();
            const ministerioId = api.getMinisterioId();

            // Verificar se é edição (tem ID na URL)
            const urlParams = new URLSearchParams(window.location.search);
            const formularioId = urlParams.get('id');

            const formData = {
                nome: formTitle,
                processo_etapa_ids: processoEtapaIds,
                ministerio_id: ministerioId,
                dados: {
                    elements: this.formElements.map(element => {
                        const properties = { ...element.props };
                        // Substituir helpText por placeholder no JSON final
                        if (properties.helpText !== undefined) {
                            properties.placeholder = properties.helpText;
                            delete properties.helpText;
                        }
                        // Garante que options de radio/select/checkbox são [{id,label}]
                        if (["radio","select","checkbox"].includes(element.type) && Array.isArray(properties.options)) {
                            properties.options = properties.options.map(opt =>
                                typeof opt === 'object' && opt !== null && 'id' in opt && 'label' in opt
                                    ? opt
                                    : { id: 'op' + Math.random().toString(36).substr(2, 6), label: String(opt) }
                            );
                        }
                        return {
                            id: element.id,
                            type: element.type,
                            properties: properties
                        };
                    })
                }
            };

            // Não precisa adicionar ID ao formData pois será passado como parâmetro

            // Usa a API para salvar ou atualizar o formulário
            const result = formularioId 
                ? await api.updateFormulario(formularioId, formData)
                : await api.createFormulario(formData);
            
            const message = formularioId ? 'Formulário atualizado com sucesso!' : 'Formulário salvo com sucesso!';
            alert(message);
            
            // Redirecionar para a lista de formulários
            window.location.href = `${window.location.origin}${window.location.pathname.replace('/criar', '').replace('/editar', '')}`;

        } catch (error) {
            console.error('Erro ao salvar formulário:', error);
            alert('Erro ao salvar formulário: ' + error.message);
        }
    }



    // Limpa o formulário
    clearForm() {
        if (this.formElements.length === 0) return;
        
        if (confirm('Tem certeza que deseja limpar todo o formulário? Esta ação não pode ser desfeita.')) {
            this.formElements = [];
            this.selectedElement = null;
            this.nextId = 1;
            
            this.renderForm();
            this.updateJsonOutput();
            this.properties.hideElementProperties();
        }
    }

    // Obter elemento por ID
    getElement(id) {
        return this.formElements.find(element => element.id === id);
    }
    
    // Obter todos os elementos que podem ser usados como campos em condições
    getFieldElements() {
        return this.formElements.filter(element => {
            const fieldTypes = ['text', 'number', 'email', 'radio', 'select', 'checkbox'];
            return fieldTypes.includes(element.type);
        });
    }

    // Obtém o JSON do formulário
    getFormJson() {
        const titleInput = document.getElementById('form-title-input');
        const formTitle = titleInput ? titleInput.value.trim() : 'Formulário Personalizado';
        
        return {
            title: formTitle || 'Formulário Personalizado',
            elements: this.formElements.map(element => {
                const properties = { ...element.props };
                // Substituir helpText por placeholder no JSON final
                if (properties.helpText !== undefined) {
                    properties.placeholder = properties.helpText;
                    delete properties.helpText;
                }
                // Garante que options de radio/select/checkbox são [{id,label}]
                if (["radio","select","checkbox"].includes(element.type) && Array.isArray(properties.options)) {
                    properties.options = properties.options.map(opt =>
                        typeof opt === 'object' && opt !== null && 'id' in opt && 'label' in opt
                            ? opt
                            : { id: 'op' + Math.random().toString(36).substr(2, 6), label: String(opt) }
                    );
                }
                return {
                    id: element.id,
                    type: element.type,
                    properties: properties
                };
            })
        };
    }

    // Carrega um formulário a partir de JSON
    loadFormFromJson(jsonData) {
        try {
            this.formElements = jsonData.elements.map(element => {
                const elementConfig = this.elements.getElementType(element.type);
                const props = { ...element.properties };
                
                // Para elementos com opções (select, radio, checkbox), garantir que options existe e está no formato correto
                if (['select', 'radio', 'checkbox'].includes(element.type)) {
                    if (!props.options || !Array.isArray(props.options)) {
                        props.options = elementConfig ? elementConfig.defaultProps.options : [];
                    } else {
                        // Normalizar opções para garantir estrutura {id, label}
                        props.options = props.options.map(opt => {
                            if (typeof opt === 'string') {
                                return { id: 'opt_' + Math.random().toString(36).substr(2, 9), label: opt };
                            }
                            if (typeof opt === 'object' && opt !== null) {
                                return {
                                    id: opt.id || opt.value || 'opt_' + Math.random().toString(36).substr(2, 9),
                                    label: opt.label || opt.text || opt.name || 'Opção'
                                };
                            }
                            return { id: 'opt_' + Math.random().toString(36).substr(2, 9), label: 'Opção' };
                        });
                    }
                }
                
                return {
                    id: element.id,
                    type: element.type,
                    props: props
                };
            });
            
            this.renderForm();
            this.updateJsonOutput();
            this.deselectElement();
            
        } catch (error) {
            console.error('Erro ao carregar formulário:', error);
            alert('Erro ao carregar o formulário. Verifique se o JSON está correto.');
        }
    }
}

// Exporta a classe para uso em módulos
export { FormBuilder };

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new FormBuilder();
});