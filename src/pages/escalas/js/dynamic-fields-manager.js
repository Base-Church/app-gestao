class DynamicFieldsManager {
    constructor(config) {
        this.config = {
            containerSelector: config.containerSelector,
            addButtonSelector: config.addButtonSelector,
            templateSelector: config.templateSelector,
            maxFields: config.maxFields || 10,
            onAddField: config.onAddField || this.defaultOnAddField,
            onRemoveField: config.onRemoveField || this.defaultOnRemoveField,
            onInitField: config.onInitField || this.defaultOnInitField
        };

        // Usar setTimeout para garantir que o DOM esteja completamente carregado
        setTimeout(() => {
            this.initializeEvents();
        }, 0);
    }

    initializeEvents() {
        const container = typeof this.config.containerSelector === 'string' 
            ? document.querySelector(this.config.containerSelector) 
            : this.config.containerSelector;
        
        const addButton = typeof this.config.addButtonSelector === 'string'
            ? document.querySelector(this.config.addButtonSelector)
            : this.config.addButtonSelector;

        if (addButton) {
            addButton.addEventListener('click', () => this.addField());
        }

        // Delegated event listener for dynamic remove buttons
        if (container) {
            container.addEventListener('click', (event) => {
                const removeButton = event.target.closest('.btn-remove-field');
                if (removeButton) {
                    this.removeField(removeButton.closest('.dynamic-field'));
                }
            });
        }
    }

    addField() {
        const container = typeof this.config.containerSelector === 'string' 
            ? document.querySelector(this.config.containerSelector) 
            : this.config.containerSelector;
        
        const template = typeof this.config.templateSelector === 'string'
            ? document.querySelector(this.config.templateSelector)
            : this.config.templateSelector;
        
        if (!container || !template) return;

        // Clonar template
        const newField = template.content.cloneNode(true);
        const newFieldElement = newField.querySelector('.dynamic-field');

        // Gerar ID único para o novo campo
        const uniqueId = `field-${Date.now()}`;
        newFieldElement.setAttribute('data-field-id', uniqueId);

        // Remover código que adiciona botão de remoção, pois já existe no template

        // Chamar método de inicialização personalizado
        if (this.config.onInitField) {
            this.config.onInitField(newFieldElement, uniqueId);
        }

        // Adicionar novo campo ao container
        container.appendChild(newFieldElement);

        // Chamar método de adição personalizado
        if (this.config.onAddField) {
            this.config.onAddField(newFieldElement, uniqueId);
        }
    }

    removeField(fieldElement) {
        const container = typeof this.config.containerSelector === 'string' 
            ? document.querySelector(this.config.containerSelector) 
            : this.config.containerSelector;
        
        // Verificar se é o último campo
        const currentFields = container.querySelectorAll('.dynamic-field');
        if (currentFields.length <= 1) {
            alert('Não é possível remover o último campo.');
            return;
        }

        // Chamar método de remoção personalizado
        const fieldId = fieldElement.getAttribute('data-field-id');
        if (this.config.onRemoveField) {
            // Se onRemoveField retornar false, cancelar a remoção
            if (this.config.onRemoveField(fieldElement, fieldId) === false) {
                return;
            }
        }

        // Remover elemento
        fieldElement.remove();
    }

    defaultOnInitField(fieldElement, uniqueId) {
        // Método padrão de inicialização - pode ser sobrescrito
        // console.log(`Inicializando campo ${uniqueId}`);
    }

    defaultOnAddField(fieldElement, uniqueId) {
        // Método padrão de adição - pode ser sobrescrito
        // console.log(`Campo ${uniqueId} adicionado`);
    }

    defaultOnRemoveField(fieldElement, uniqueId) {
        // Método padrão de remoção - pode ser sobrescrito
        // console.log(`Campo ${uniqueId} removido`);
    }

    // Método estático para inicializar múltiplos gerenciadores
    static initializeAll(configurations) {
        return configurations.map(config => new DynamicFieldsManager(config));
    }
}

// Exportar para uso global
window.DynamicFieldsManager = DynamicFieldsManager;
