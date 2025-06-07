// Helper class to manage permissions state
class PermissionsManager {
    constructor() {
        this.selectedPermissions = new Map();
        this.selectedMinisterios = new Map();
    }

    togglePermission(id, element) {
        if (this.selectedPermissions.has(id)) {
            this.selectedPermissions.delete(id);
            this.updateCardStyle(element, false);
        } else {
            this.selectedPermissions.set(id, true);
            this.updateCardStyle(element, true);
        }
    }

    toggleMinisterio(id, element) {
        if (this.selectedMinisterios.has(id)) {
            this.selectedMinisterios.delete(id);
            this.updateCardStyle(element, false);
        } else {
            this.selectedMinisterios.set(id, true);
            this.updateCardStyle(element, true);
        }
    }

    getSelectedPermissions() {
        return Array.from(this.selectedPermissions.keys());
    }

    getSelectedMinisterios() {
        return Array.from(this.selectedMinisterios.keys());
    }

    clearSelections() {
        this.selectedPermissions.clear();
        this.selectedMinisterios.clear();
    }

    clearAndUpdateUI() {
        // Primeiro, limpa todas as seleções visuais
        document.querySelectorAll('.ministerio-card, .permissao-card').forEach(card => {
            card.dataset.selected = 'false';
            this.updateCardStyle(card, false);
        });

        // Depois, atualiza com as seleções atuais
        this.updateUI();
    }

    setInitialPermissions(permissions = []) {
        this.selectedPermissions.clear();
        permissions.forEach(id => this.selectedPermissions.set(id, true));
        this.clearAndUpdateUI();
    }

    setInitialMinisterios(ministerios = []) {
        this.selectedMinisterios.clear();
        ministerios.forEach(id => this.selectedMinisterios.set(id, true));
        this.clearAndUpdateUI();
    }

    updateUI() {
        // Update permissions UI
        document.querySelectorAll('.permissao-card').forEach(card => {
            const id = card.dataset.code;
            const isSelected = this.selectedPermissions.has(id);
            this.updateCardStyle(card, isSelected);
            card.dataset.selected = isSelected;
        });

        // Update ministerios UI
        document.querySelectorAll('.ministerio-card').forEach(card => {
            const id = card.dataset.id;
            const isSelected = this.selectedMinisterios.has(id);
            this.updateCardStyle(card, isSelected);
            card.dataset.selected = isSelected;
        });
    }

    updateCardStyle(card, isSelected) {
        if (!card) return;
        
        const indicator = card.querySelector('.selection-indicator');
        if (indicator) {
            indicator.style.opacity = isSelected ? '1' : '0';
        }

        if (isSelected) {
            card.classList.add('bg-primary-50', 'dark:bg-primary-900/20', 'border-primary-500');
        } else {
            card.classList.remove('bg-primary-50', 'dark:bg-primary-900/20', 'border-primary-500');
        }
    }
}

// Inicializa o gerenciador e expõe globalmente
const permissionsManager = new PermissionsManager();
window.permissionsManager = permissionsManager;

// Expõe a função openPermissionsModal globalmente
window.openPermissionsModal = openPermissionsModal;

export async function updatePermissions(userId, data) {
    console.group('Atualização de Permissões');
    console.log('ID do usuário:', userId);
    console.log('Dados enviados para API:', data);

    try {
        const response = await fetch(`${window.APP_CONFIG.baseUrl}/src/services/api/usuarios/update.php?id=${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();
        console.log('Retorno da API:', responseData);

        if (responseData.error) {
            throw new Error(responseData.error);
        }

        console.groupEnd();
        return responseData;
    } catch (error) {
        console.error('Erro na atualização:', error);
        console.groupEnd();
        throw error;
    }
}

// Remove a referência ao toggleMinisterioSelection antigo
async function loadMinisteriosForPermissions() {
    try {
        const response = await fetch(`${window.APP_CONFIG.baseUrl}/src/services/api/ministerios/get.php`);
        const result = await response.json();
        
        if (result.data) {
            const ministeriosHtml = result.data.map(ministerio => `
                <div class="ministerio-card group cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors mb-2 last:mb-0"
                     data-selected="false"
                     data-id="${ministerio.id}">
                    <div class="flex items-center">
                        ${ministerio.foto 
                            ? `<img src="${window.APP_CONFIG.baseUrl}/${ministerio.foto}" alt="${ministerio.nome}" class="w-8 h-8 rounded-full object-cover">`
                            : `<div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                                   <span class="text-primary-700 dark:text-primary-300 font-medium text-sm">
                                       ${ministerio.nome.charAt(0).toUpperCase()}
                                   </span>
                               </div>`
                        }
                        <span class="ml-3 text-sm font-medium text-gray-900 dark:text-white">
                            ${ministerio.nome}
                        </span>
                        <div class="selection-indicator ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            `).join('');

            // Atualiza os ministérios em ambos os modais
            const lists = ['#ministerios-list', '#ministerios-list-permissions'];
            lists.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    element.innerHTML = ministeriosHtml;
                }
            });

            // Adiciona os event listeners depois de renderizar
            document.querySelectorAll('.ministerio-card').forEach(card => {
                card.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const id = this.dataset.id;
                    window.permissionsManager.toggleMinisterio(id, this);
                });
            });
        }
    } catch (error) {
        console.error('Erro ao carregar ministérios:', error);
    }
}

export function openPermissionsModal(userId) {
    loadMinisteriosForPermissions().then(() => {
        const usuario = window.usuariosData.find(u => u.id === Number(userId));
        if (!usuario) return;

        const form = document.getElementById('updatePermissionsForm');
        form.dataset.userId = userId;

        // Reset form fields
        form.querySelector('[name="nome"]').value = usuario.nome;
        form.querySelector('[name="whatsapp"]').value = usuario.whatsapp;
        form.querySelector('[name="nivel"]').value = usuario.nivel;

        // Limpa todas as seleções anteriores
        window.permissionsManager.clearSelections();
        window.permissionsManager.clearAndUpdateUI();

        // Define novas seleções
        if (usuario.ministerios?.length > 0) {
            window.permissionsManager.setInitialMinisterios(usuario.ministerios);
        }

        if (usuario.permissoes?.length > 0) {
            window.permissionsManager.setInitialPermissions(usuario.permissoes);
        }

        // Atualiza título
        const title = document.querySelector('#permissionsModal .text-lg.font-semibold');
        if (title) {
            title.textContent = `Editar Permissões - ${usuario.nome}`;
        }
        
        document.getElementById('permissionsModal').classList.remove('hidden');
    });
}

async function handlePermissionsSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const userId = form.dataset.userId;

    try {
        const data = {
            nome: form.querySelector('[name="nome"]').value.trim(),
            whatsapp: form.querySelector('[name="whatsapp"]').value.replace(/\D/g, ''),
            nivel: form.querySelector('[name="nivel"]').value,
            status: 'ativo'
        };

        // Only add arrays if there are selected items
        const selectedMinisterios = permissionsManager.getSelectedMinisterios();
        if (selectedMinisterios.length > 0) {
            data.ministerios = selectedMinisterios;
        }

        const selectedPermissions = permissionsManager.getSelectedPermissions();
        if (selectedPermissions.length > 0) {
            data.permissoes = selectedPermissions;
        }

        const result = await updatePermissions(userId, data);
        if (result.code === 200) {
            document.getElementById('permissionsModal').classList.add('hidden');
            await loadUsuarios();
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
}

// Modificar o initializePermissionsHandlers para usar a instância
export function initializePermissionsHandlers() {
    document.getElementById('updatePermissionsForm')?.addEventListener('submit', handlePermissionsSubmit);
}

function handlePermissionClick(e) {
    const permissaoCard = e.target.closest('.permissao-card');
    const ministerioCard = e.target.closest('.ministerio-card');
    
    if (permissaoCard) {
        window.permissionsManager.togglePermission(permissaoCard.dataset.code, permissaoCard);
    }
    
    if (ministerioCard) {
        window.permissionsManager.toggleMinisterio(ministerioCard.dataset.id, ministerioCard);
    }
}

function formatWhatsApp(numero) {
    const cleaned = numero.replace(/\D/g, '');
    if (cleaned.length <= 11) {
        return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return cleaned;
}

// Add WhatsApp mask to both modals
document.addEventListener('DOMContentLoaded', function() {
    const whatsappInputs = document.querySelectorAll('input[name="whatsapp"]');
    whatsappInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            e.target.value = formatWhatsApp(value);
        });
    });
});
