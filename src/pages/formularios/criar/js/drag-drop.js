// Gerenciador de drag and drop usando SortableJS
class DragDropManager {
    constructor(formBuilder) {
        this.formBuilder = formBuilder;
        this.formContainer = document.getElementById('drop-zone');
        this.elementsContainer = document.querySelector('.col-span-3 .p-3.space-y-2');
        this.sortableInstance = null;
        
        this.init();
    }

    init() {
        this.setupSortable();
    }

    setupSortable() {
        // Configura drag dos elementos da sidebar
        this.setupElementsSidebar();
        
        // Configura drop zone do formulário
        this.setupFormDropZone();
    }

    setupElementsSidebar() {
        if (!this.elementsContainer) return;
        
        // Configura SortableJS para a sidebar (apenas drag, sem sort)
        new Sortable(this.elementsContainer, {
            group: {
                name: 'form-elements',
                pull: 'clone',
                put: false
            },
            sort: false,
            animation: 150,
            ghostClass: 'opacity-50',
            chosenClass: 'sortable-chosen',
            onStart: (evt) => {
                // Adiciona feedback visual
                evt.item.classList.add('opacity-50');
            },
            onEnd: (evt) => {
                // Remove feedback visual
                evt.item.classList.remove('opacity-50');
            }
        });
    }

    setupFormDropZone() {
        if (!this.formContainer) return;
        
        // Configura SortableJS para a área do formulário
        this.sortableInstance = new Sortable(this.formContainer, {
            group: {
                name: 'form-elements',
                pull: true,
                put: true
            },
            animation: 150,
            ghostClass: 'opacity-50',
            chosenClass: 'sortable-chosen',
            dragClass: 'sortable-drag',
            fallbackOnBody: true,
            swapThreshold: 0.65,
            onAdd: (evt) => {
                // Elemento arrastado da sidebar
                const elementType = evt.item.dataset.type;
                if (elementType) {
                    // Remove o elemento clonado da sidebar
                    evt.item.remove();
                    
                    // Adiciona o elemento real no formulário
                    this.formBuilder.addElement(elementType, evt.newIndex);
                }
            },
            onUpdate: (evt) => {
                // Reordenação dentro do formulário
                const elementId = evt.item.dataset.elementId;
                if (elementId) {
                    this.formBuilder.moveElement(elementId, evt.newIndex);
                }
            },
            onStart: (evt) => {
                // Feedback visual durante drag
                this.formContainer.classList.add('bg-primary-50', 'dark:bg-primary-900/10');
            },
            onEnd: (evt) => {
                // Remove feedback visual
                this.formContainer.classList.remove('bg-primary-50', 'dark:bg-primary-900/10');
            }
        });
    }

    // Atualiza o sortable quando o formulário muda
    updateSortable() {
        if (this.sortableInstance) {
            // Força atualização do sortable
            this.sortableInstance.option('disabled', false);
        }
    }

    // Desabilita temporariamente o sortable
    disableSortable() {
        if (this.sortableInstance) {
            this.sortableInstance.option('disabled', true);
        }
    }

    // Habilita o sortable
    enableSortable() {
        if (this.sortableInstance) {
            this.sortableInstance.option('disabled', false);
        }
    }

    // Destrói o sortable
    destroy() {
        if (this.sortableInstance) {
            this.sortableInstance.destroy();
            this.sortableInstance = null;
        }
    }
}

// Exporta a classe globalmente
window.DragDropManager = DragDropManager;