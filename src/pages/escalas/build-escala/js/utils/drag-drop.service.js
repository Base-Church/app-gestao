/**
 * Serviço para gerenciar drag and drop de itens e conjuntos
 */
class DragDropService {
    constructor() {
        this.sortableInstances = new Map();
        this.initializeAfterDOMLoad();
    }

    initializeAfterDOMLoad() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    initialize() {
        this.setupItemsSortable();
        this.observeContainerChanges();
    }

    /**
     * Configura sortable para o container de itens
     */
    setupItemsSortable() {
        const itensContainer = document.getElementById('itens-container');
        if (!itensContainer) return;

        // Remove instância anterior se existir
        if (this.sortableInstances.has('itens-container')) {
            this.sortableInstances.get('itens-container').destroy();
        }

        const sortable = Sortable.create(itensContainer, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            dragClass: 'sortable-drag',
            handle: '.item-drag-handle',
            fallbackOnBody: true,
            swapThreshold: 0.65,
            direction: 'vertical',
            scrollSensitivity: 30,
            scrollSpeed: 10,
            bubbleScroll: true,
            onStart: (evt) => {
                document.body.classList.add('dragging-item');
            },
            onEnd: (evt) => {
                document.body.classList.remove('dragging-item');
                    this.onItemOrderChanged(evt);
                // Adiciona feedback visual durante o movimento
                const draggedElement = evt.dragged;
                const targetElement = evt.related;
                
                if (draggedElement && targetElement) {
                    console.log('Item sendo movido para nova posição');
                }
                return true; // Permite o movimento
            }
        });

        this.sortableInstances.set('itens-container', sortable);
        console.log('Sortable configurado para itens-container');
    }

    /**
     * Configura sortable para conjuntos dentro de um item
     */
    setupConjuntosSortable(conjuntosContainer, itemId, seletorId) {
        if (!conjuntosContainer) return;

        const sortableId = `conjuntos-${itemId}`;
        
        // Remove instância anterior se existir
        if (this.sortableInstances.has(sortableId)) {
            this.sortableInstances.get(sortableId).destroy();
        }

        const sortable = Sortable.create(conjuntosContainer, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            dragClass: 'sortable-drag',
            handle: '.conjunto-drag-handle',
            filter: '.btn-adicionar-conjunto',
            preventOnFilter: false,
            fallbackOnBody: true,
            swapThreshold: 0.65,
            onStart: (evt) => {
                document.body.classList.add('dragging-conjunto');
            },
            onEnd: (evt) => {
                document.body.classList.remove('dragging-conjunto');
                this.onConjuntoOrderChanged(evt, itemId, seletorId);
            }
        });

        this.sortableInstances.set(sortableId, sortable);
    }

    /**
     * Callback quando a ordem dos itens muda
     */
    onItemOrderChanged(evt) {
        if (evt.oldIndex === evt.newIndex) return;

        // Atualiza a ordem dos itens no serviço
        if (window.itemService && window.itemService.reorderItems) {
            window.itemService.reorderItems(evt.oldIndex, evt.newIndex);
        }

        // Notifica mudança na escala
        if (window.escalaService && window.escalaService.onItemOrderChanged) {
            window.escalaService.onItemOrderChanged(evt.oldIndex, evt.newIndex);
        }

       
    }

    /**
     * Callback quando a ordem dos conjuntos muda
     */
    onConjuntoOrderChanged(evt, itemId, seletorId) {
        if (evt.oldIndex === evt.newIndex) return;

        // Atualiza a ordem dos conjuntos no serviço
        const conjuntos = window.escalaService.getConjuntosDoItem(itemId);
        const conjuntoMovido = conjuntos.splice(evt.oldIndex, 1)[0];
        conjuntos.splice(evt.newIndex, 0, conjuntoMovido);

        // Re-renderiza os conjuntos com a nova ordem
        if (window.itemManagerService) {
            window.itemManagerService.renderizarConjuntos(itemId, seletorId);
        }

       
    }

    /**
     * Observa mudanças no DOM para configurar sortable em novos elementos
     */
    observeContainerChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Verifica se é um novo item adicionado
                        if (node.id && node.id.startsWith('item-')) {
                            // Usa setTimeout para garantir que a estrutura esteja completa
                            setTimeout(() => {
                                this.addDragHandleToItem(node);
                            }, 100);
                        }
                        
                        // Verifica se é um container de conjuntos
                        if (node.classList && node.classList.contains('conjuntos-container')) {
                            setTimeout(() => {
                                this.setupConjuntosFromContainer(node);
                            }, 100);
                        }
                        
                        // Verifica se há containers de conjuntos nos filhos
                        const conjuntosContainers = node.querySelectorAll && node.querySelectorAll('.conjuntos-container');
                        if (conjuntosContainers) {
                            conjuntosContainers.forEach(container => {
                                setTimeout(() => {
                                    this.setupConjuntosFromContainer(container);
                                }, 100);
                            });
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Adiciona handle de drag a um item
     */
    addDragHandleToItem(itemElement) {
        const header = itemElement.querySelector('.flex.justify-between.items-center.p-4');
        if (!header) return;

        // Verifica se já tem handle (pode ter sido criado pelo ItemComponentesService)
        if (header.querySelector('.item-drag-handle')) {
            return;
        }

        const dragHandle = document.createElement('div');
        dragHandle.className = 'item-drag-handle cursor-move text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mr-2';
        dragHandle.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9h8M8 15h8"></path>
            </svg>
        `;
        dragHandle.title = 'Arrastar item';

        // Insere antes do primeiro elemento do header
        const firstChild = header.firstElementChild;
        if (firstChild) {
            header.insertBefore(dragHandle, firstChild);
        } else {
            header.appendChild(dragHandle);
        }
        
    }

    /**
     * Configura sortable a partir de um container de conjuntos
     */
    setupConjuntosFromContainer(container) {
        // Extrai itemId e seletorId do contexto
        const itemElement = container.closest('[id^="item-"]');
        const eventDetailElement = container.closest('[id^="detalhes-evento-"]');
        
        if (!itemElement || !eventDetailElement) return;

        const itemId = itemElement.id;
        const seletorId = eventDetailElement.id.replace('detalhes-evento-', '');

        this.setupConjuntosSortable(container, itemId, seletorId);
        this.addDragHandlesToConjuntos(container);
    }

    /**
     * Adiciona handles de drag aos conjuntos
     */
    addDragHandlesToConjuntos(container) {
        const conjuntoGrids = container.querySelectorAll('.grid.grid-cols-1.md\\:grid-cols-2:not(:has(.btn-adicionar-conjunto))');
        
        conjuntoGrids.forEach(grid => {
            // Verifica se já tem handle
            if (grid.querySelector('.conjunto-drag-handle')) return;

            const dragHandle = document.createElement('div');
            dragHandle.className = 'conjunto-drag-handle cursor-move text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 absolute top-2 left-2 z-10';
            dragHandle.innerHTML = `
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9h8M8 15h8"></path>
                </svg>
            `;
            dragHandle.title = 'Arrastar conjunto';

            // Adiciona posição relativa ao grid e insere o handle
            grid.style.position = 'relative';
            grid.appendChild(dragHandle);
        });
    }

    /**
     * Atualiza sortables quando necessário
     */
    updateSortables() {
        this.setupItemsSortable();
        
        // Atualiza sortables de conjuntos existentes
        document.querySelectorAll('.conjuntos-container').forEach(container => {
            this.setupConjuntosFromContainer(container);
        });
    }

    /**
     * Destrói todas as instâncias de sortable
     */
    destroy() {
        this.sortableInstances.forEach(sortable => {
            sortable.destroy();
        });
        this.sortableInstances.clear();
    }
}

// Inicializa o serviço
window.dragDropService = new DragDropService();