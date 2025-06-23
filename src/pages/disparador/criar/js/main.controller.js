class MainController {
    constructor() {
        this.gruposService = new GruposService();
        this.messageService = window.messageService || new MessageService();
        this.selectedGroups = [];
        this.init();
    }

    init() {
        // Abrir modal de grupos automaticamente ao carregar a página
        setTimeout(() => {
            this.openGroupsModal();
        }, 100);
    }

    // Modal de Grupos
    openGroupsModal() {
        const modal = document.getElementById('modalGrupos');
        if (modal) {
            modal.classList.remove('hidden');
            
            // Carregar grupos se ainda não foram carregados
            if (this.gruposService.getGroups().length === 0) {
                this.gruposService.loadGroups();
            } else {
                this.renderGroupsList();
            }
        }
    }

    closeGroupsModal() {
        const modal = document.getElementById('modalGrupos');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    renderGroupsList() {
        const container = document.getElementById('groupsList');
        if (!container) return;
        
        const groups = this.gruposService.getGroups();
        
        if (groups.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    <p class="text-sm text-gray-500">Nenhum grupo encontrado</p>
                </div>
            `;
            return;
        }

        container.innerHTML = groups.map(group => {
            const groupId = group.jid || group.JID;
            const isSelected = this.selectedGroups.includes(groupId);
            
            return `
                <div class="group-card relative p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer ${
                    isSelected 
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md' 
                        : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }" onclick="window.mainController.toggleGroupCard('${groupId}')">
                    
                    <!-- Indicador de seleção -->
                    <div class="absolute top-3 right-3">
                        <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            isSelected 
                                ? 'bg-primary-500 border-primary-500' 
                                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-500'
                        }">
                            ${isSelected ? `
                                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                                </svg>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Checkbox oculto para acessibilidade -->
                    <input type="checkbox" 
                           id="group-${groupId}" 
                           value="${groupId}"
                           class="sr-only"
                           ${isSelected ? 'checked' : ''}
                           onchange="window.mainController.toggleGroup('${groupId}', this.checked)">
                    
                    <!-- Conteúdo do card -->
                    <div class="flex items-center">
                        <div class="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                            ${group.image ? 
                                `<img src="${group.image}" alt="${group.name || group.Name}" class="w-12 h-12 rounded-full object-cover">` : 
                                `<svg class="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>`
                            }
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-semibold text-gray-900 dark:text-white truncate ${
                                isSelected ? 'text-primary-900 dark:text-primary-100' : ''
                            }">${group.name || group.Name || 'Grupo sem nome'}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${group.participants || 0} participantes</p>
                        </div>
                    </div>

                    <!-- Efeito de hover -->
                    <div class="absolute inset-0 rounded-lg transition-opacity duration-200 opacity-0 hover:opacity-100 pointer-events-none ${
                        isSelected 
                            ? 'bg-primary-100 dark:bg-primary-800/30' 
                            : 'bg-gray-100 dark:bg-gray-600/30'
                    }"></div>
                </div>
            `;
        }).join('');

        // Marcar grupos já selecionados
        this.selectedGroups.forEach(groupId => {
            const checkbox = document.getElementById(`group-${groupId}`);
            if (checkbox) checkbox.checked = true;
        });

        this.updateSelectedCount();
        
        // Carregar imagens dos grupos após renderizar
        setTimeout(() => {
            this.gruposService.loadGroupImages();
        }, 100);
    }

    toggleGroupCard(groupId) {
        const checkbox = document.getElementById(`group-${groupId}`);
        if (checkbox) {
            checkbox.checked = !checkbox.checked;
            this.toggleGroup(groupId, checkbox.checked);
            this.updateGroupCardVisual(groupId, checkbox.checked);
        }
    }

    updateGroupCardVisual(groupId, isSelected) {
        const card = document.querySelector(`[onclick="window.mainController.toggleGroupCard('${groupId}')"]`);
        if (!card) return;

        const indicator = card.querySelector('.absolute.top-3.right-3 > div');
        const nameElement = card.querySelector('.text-sm.font-semibold');
        
        if (isSelected) {
            card.className = card.className.replace(/border-gray-[^ ]*|hover:border-[^ ]*/g, 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md');
            indicator.className = indicator.className.replace(/bg-white|dark:bg-gray-700|border-gray-[^ ]*/g, 'bg-primary-500 border-primary-500');
            indicator.innerHTML = `
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
            `;
            nameElement.className = nameElement.className.replace(/text-gray-900|dark:text-white/g, 'text-primary-900 dark:text-primary-100');
        } else {
            card.className = card.className.replace(/border-primary-500|bg-primary-50|dark:bg-primary-900\/20|shadow-md/g, 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-gray-50 dark:hover:bg-gray-700');
            indicator.className = indicator.className.replace(/bg-primary-500|border-primary-500/g, 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-500');
            indicator.innerHTML = '';
            nameElement.className = nameElement.className.replace(/text-primary-900|dark:text-primary-100/g, 'text-gray-900 dark:text-white');
        }
    }

    toggleGroup(groupId, isSelected) {
        if (isSelected) {
            if (!this.selectedGroups.includes(groupId)) {
                this.selectedGroups.push(groupId);
            }
        } else {
            this.selectedGroups = this.selectedGroups.filter(id => id !== groupId);
        }
        
        this.updateSelectedCount();
        this.updateAvancarButton();
    }

    updateSelectedCount() {
        const countElement = document.getElementById('selectedGroupsCount');
        if (countElement) {
            countElement.textContent = this.selectedGroups.length;
        }
    }

    updateAvancarButton() {
        const btnAvancar = document.getElementById('btnAvancar');
        if (btnAvancar) {
            btnAvancar.disabled = this.selectedGroups.length === 0;
        }
    }

    selectAllGroups() {
        const checkboxes = document.querySelectorAll('#groupsList input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            if (!checkbox.checked) {
                checkbox.checked = true;
                this.toggleGroup(checkbox.value, true);
                this.updateGroupCardVisual(checkbox.value, true);
            }
        });
    }

    deselectAllGroups() {
        const checkboxes = document.querySelectorAll('#groupsList input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                checkbox.checked = false;
                this.toggleGroup(checkbox.value, false);
                this.updateGroupCardVisual(checkbox.value, false);
            }
        });
    }

    filterGroups(searchTerm) {
        const groups = document.querySelectorAll('#groupsList > div');
        const term = searchTerm.toLowerCase();
        
        groups.forEach(group => {
            const name = group.querySelector('.text-sm.font-semibold').textContent.toLowerCase();
            if (name.includes(term)) {
                group.style.display = 'block';
            } else {
                group.style.display = 'none';
            }
        });
    }

    confirmarGrupos() {
        if (this.selectedGroups.length === 0) {
            alert('Selecione pelo menos um grupo para continuar.');
            return;
        }

        this.closeGroupsModal();
        this.showSelectedGroups();
    }

    showSelectedGroups() {
        const gruposInfo = document.getElementById('gruposInfo');
        const gruposCount = document.getElementById('gruposCount');
        const gruposList = document.getElementById('gruposList');
        
        gruposInfo.classList.remove('hidden');
        gruposCount.textContent = this.selectedGroups.length;
        
        // Mostrar lista dos grupos selecionados
        const selectedGroupsData = this.gruposService.getGroups().filter(group => 
            this.selectedGroups.includes(group.jid || group.JID)
        );
        
        gruposList.innerHTML = selectedGroupsData.map(group => `
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                ${group.name || group.Name}
            </span>
        `).join('');
    }

    // Modal de Tipo de Mensagem
    openMessageTypeModal() {
        const modal = document.getElementById('messageTypeModal');
        modal.classList.remove('hidden');
    }

    closeMessageTypeModal() {
        const modal = document.getElementById('messageTypeModal');
        modal.classList.add('hidden');
    }

    createMessage(type) {
        this.messageService.createMessage(type);
        this.closeMessageTypeModal();
    }

    // Modal de Envio
    showSendModal() {
        if (this.selectedGroups.length === 0) {
            alert('Selecione pelo menos um grupo antes de enviar a campanha.');
            return;
        }

        if (this.messageService.messages.length === 0) {
            alert('Crie pelo menos uma mensagem antes de enviar a campanha.');
            return;
        }

        const modal = document.getElementById('sendModal');
        modal.classList.remove('hidden');
        
        // Atualizar informações no modal
        document.getElementById('modalTotalGrupos').textContent = this.selectedGroups.length;
        document.getElementById('modalTotalMensagens').textContent = this.messageService.messages.length;
        document.getElementById('modalTotalEnvio').textContent = this.selectedGroups.length * this.messageService.messages.length;
    }

    closeSendModal() {
        const modal = document.getElementById('sendModal');
        modal.classList.add('hidden');
    }

    async enviarCampanha() {
        const btnEnviar = document.getElementById('btnEnviarCampanha');
        const btnCancelar = document.getElementById('btnCancelarEnvio');
        
        btnEnviar.disabled = true;
        btnCancelar.disabled = true;
        btnEnviar.innerHTML = `
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
            Enviando...
        `;

        try {
            const messages = this.messageService.getMessages();
            let successCount = 0;
            let errorCount = 0;

            for (const groupId of this.selectedGroups) {
                for (const message of messages) {
                    try {
                        // Aqui você implementaria o envio real
                        // Por enquanto, vamos simular
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        successCount++;
                    } catch (error) {
                        console.error('Erro ao enviar mensagem:', error);
                        errorCount++;
                    }
                }
            }

            this.closeSendModal();
            
            if (errorCount === 0) {
                alert(`Campanha enviada com sucesso!\n${successCount} mensagens enviadas.`);
                // Limpar dados
                this.selectedGroups = [];
                this.messageService.messages = [];
                this.messageService.showEmptyMessage();
                document.getElementById('gruposInfo').classList.add('hidden');
            } else {
                alert(`Campanha enviada com ${successCount} sucessos e ${errorCount} erros.`);
            }

        } catch (error) {
            console.error('Erro ao enviar campanha:', error);
            alert('Erro ao enviar campanha. Tente novamente.');
        } finally {
            btnEnviar.disabled = false;
            btnCancelar.disabled = false;
            btnEnviar.innerHTML = 'Enviar Campanha';
        }
    }
}

// Inicializar controller
window.mainController = new MainController();

// Funções globais
function openGroupsModal() {
    window.mainController.openGroupsModal();
}

function closeGroupsModal() {
    window.mainController.closeGroupsModal();
}

function selectAllGroups() {
    window.mainController.selectAllGroups();
}

function deselectAllGroups() {
    window.mainController.deselectAllGroups();
}

function filterGroups(searchTerm) {
    window.mainController.filterGroups(searchTerm);
}

function confirmarGrupos() {
    window.mainController.confirmarGrupos();
}

function openMessageTypeModal() {
    window.mainController.openMessageTypeModal();
}

function closeMessageTypeModal() {
    window.mainController.closeMessageTypeModal();
}

function createMessage(type) {
    window.mainController.createMessage(type);
}

function selectMessageType(type) {
    window.mainController.createMessage(type);
}

function showSendModal() {
    window.mainController.showSendModal();
}

function closeSendModal() {
    window.mainController.closeSendModal();
}

function enviarCampanha() {
    window.mainController.enviarCampanha();
} 