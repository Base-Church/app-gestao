import { UI } from './ui.js';

export class DragDrop {
    constructor() {
        this.draggedItem = null;
        this.draggedClone = null;
        this.placeholder = null;
        this.isReordering = false;
        this.isDraggingOverContainer = false;
        this.initializeDragDrop();
    }

    createPlaceholder() {
        const placeholder = document.createElement('div');
        placeholder.className = 'h-16 border-2 border-dashed border-primary-400 rounded-lg bg-primary-50/30 dark:bg-primary-900/20 mb-3 transition-all duration-200';
        return placeholder;
    }

    initializeDragDrop() {
        const modeloContainer = document.getElementById('modeloContainer');

        // Evento de início do arrasto
        document.addEventListener('dragstart', (e) => {
            if (!e.target.classList.contains('draggable')) return;
            
            this.draggedItem = e.target;
            this.isReordering = this.draggedItem.closest('#modeloContainer') !== null;
            
            // Adiciona delay para a opacidade para melhor feedback visual
            setTimeout(() => {
                this.draggedItem.classList.add('opacity-50', 'scale-95');
            }, 0);
            
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', e.target.dataset.id);
        });

        // Evento de fim do arrasto
        document.addEventListener('dragend', (e) => {
            if (this.draggedItem) {
                this.draggedItem.classList.remove('opacity-50', 'scale-95');
                this.draggedItem = null;
            }
            if (this.placeholder) {
                this.placeholder.remove();
                this.placeholder = null;
            }
            modeloContainer.classList.remove(
                'border-primary-500',
                'bg-primary-50/20',
                'dark:bg-primary-900/10'
            );
            this.isDraggingOverContainer = false;
            this.isReordering = false;
        });

        // Eventos do container do modelo
        modeloContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';

            if (!this.isDraggingOverContainer) {
                this.isDraggingOverContainer = true;
                modeloContainer.classList.add(
                    'border-primary-500',
                    'bg-primary-50/20',
                    'dark:bg-primary-900/10'
                );
            }

            const target = e.target.closest('.draggable');
            
            if (!this.placeholder) {
                this.placeholder = this.createPlaceholder();
            }

            if (target && (this.isReordering || target.parentNode === modeloContainer)) {
                const rect = target.getBoundingClientRect();
                const middleY = rect.top + (rect.height / 2);
                
                if (e.clientY < middleY) {
                    target.parentNode.insertBefore(this.placeholder, target);
                } else {
                    target.parentNode.insertBefore(this.placeholder, target.nextSibling);
                }
            } else if (!modeloContainer.contains(this.placeholder)) {
                modeloContainer.appendChild(this.placeholder);
            }
        });

        modeloContainer.addEventListener('dragleave', (e) => {
            if (!modeloContainer.contains(e.relatedTarget)) {
                this.isDraggingOverContainer = false;
                modeloContainer.classList.remove(
                    'border-primary-500',
                    'bg-primary-50/20',
                    'dark:bg-primary-900/10'
                );
                if (this.placeholder && !this.isReordering) {
                    this.placeholder.remove();
                    this.placeholder = null;
                }
            }
        });

        modeloContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            this.isDraggingOverContainer = false;
            modeloContainer.classList.remove(
                'border-primary-500',
                'bg-primary-50/20',
                'dark:bg-primary-900/10'
            );

            if (this.isReordering && this.draggedItem) {
                // Reordenação
                if (this.placeholder) {
                    this.draggedItem.classList.remove('opacity-50', 'scale-95');
                    modeloContainer.insertBefore(this.draggedItem, this.placeholder);
                }
            } else if (this.draggedItem) {
                // Nova atividade
                const ui = new UI();
                const id = this.draggedItem.dataset.id;
                const nome = this.draggedItem.querySelector('h3').textContent;
                const categoria = this.draggedItem.querySelector('p').textContent;
                const cor = this.draggedItem.querySelector('.w-3').style.backgroundColor;

                const atividade = { id, nome, categoria_nome: categoria, cor_indicador: cor };
                const novoElemento = document.createElement('div');
                novoElemento.innerHTML = ui.renderAtividade(atividade, true);
                const clone = novoElemento.firstElementChild;
                
                if (this.placeholder) {
                    modeloContainer.insertBefore(clone, this.placeholder);
                } else {
                    modeloContainer.appendChild(clone);
                }
            }

            if (this.placeholder) {
                this.placeholder.remove();
                this.placeholder = null;
            }
        });

        // Lidar com botões de exclusão
        modeloContainer.addEventListener('click', (e) => {
            const deleteBtn = e.target.closest('.delete-btn');
            if (deleteBtn) {
                const item = deleteBtn.closest('.draggable');
                if (item) {
                    item.remove();
                }
            }
        });
    }
}
