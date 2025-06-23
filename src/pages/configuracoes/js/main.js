import "./tabs.js";
import { usuariosTab } from './tabs/usuarios.js';

// Gerenciador de Estado
class UserManager {
    constructor() {
        this.selectedMinisterios = new Set();
        this.editingUserId = null;
        this.ministerios = [];
        this.usuarios = [];
    }

    toggleMinisterio(id) {
        if (this.selectedMinisterios.has(id)) {
            this.selectedMinisterios.delete(id);
        } else {
            this.selectedMinisterios.add(id);
        }
        this.updateMinisterioUI(id);
    }

    updateMinisterioUI(id) {
        const card = document.querySelector(`.ministerio-card[data-id="${id}"]`);
        if (!card) return;

        const isSelected = this.selectedMinisterios.has(id);
        card.classList.toggle('bg-primary-50', isSelected);
        card.classList.toggle('dark:bg-primary-900/20', isSelected);
        card.classList.toggle('border-primary-500', isSelected);
        
        const checkmark = card.querySelector('.selection-indicator');
        if (checkmark) {
            checkmark.style.opacity = isSelected ? '1' : '0';
        }
    }

    clearSelections() {
        this.selectedMinisterios.clear();
        document.querySelectorAll('.ministerio-card').forEach(card => {
            const id = card.dataset.id;
            this.updateMinisterioUI(id);
        });
    }

    setInitialSelections(ministerios = []) {
        this.clearSelections();
        ministerios.forEach(id => {
            this.selectedMinisterios.add(id);
            this.updateMinisterioUI(id);
        });
    }

    getSelectedMinisterios() {
        return Array.from(this.selectedMinisterios);
    }

    resetForm() {
        document.getElementById('userForm').reset();
        this.clearSelections();
        this.editingUserId = null;
        document.getElementById('modal-title').textContent = 'Novo Usuário';
        document.querySelector('.senha-field').style.display = 'block';
    }
}

// Instância global do gerenciador
const userManager = new UserManager();

// Funções de API
async function fetchUsuarios() {
    try {
        const response = await fetch(`${window.APP_CONFIG.baseUrl}/src/services/api/usuarios/get.php`);
        const data = await response.json();
        if (data.code === 200) {
            userManager.usuarios = data.data;
            renderUsuariosList(data.data);
        }
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
    }
}

async function fetchMinisterios() {
    try {
        const response = await fetch(`${window.APP_CONFIG.baseUrl}/src/services/api/ministerios/get.php`);
        const data = await response.json();
        if (data.code === 200) {
            userManager.ministerios = data.data;
            renderMinisteriosList(data.data);
        }
    } catch (error) {
        console.error('Erro ao carregar ministérios:', error);
    }
}

async function createUsuario(data) {
    try {
        const response = await fetch(`${window.APP_CONFIG.baseUrl}/src/services/api/usuarios/registro.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        throw error;
    }
}

async function updateUsuario(id, data) {
    try {
        const response = await fetch(`${window.APP_CONFIG.baseUrl}/src/services/api/usuarios/update.php?id=${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        throw error;
    }
}

// Funções de UI
function renderUsuariosList(usuarios) {
    const ministeriosMap = new Map(userManager.ministerios.map(m => [m.id.toString(), m]));
    const tbody = document.getElementById('usuarios-list');
    
    tbody.innerHTML = usuarios.map(usuario => {
        const ministeriosTags = usuario.ministerios
            ? usuario.ministerios.map(id => {
                const ministerio = ministeriosMap.get(id);
                if (!ministerio) return '';
                return `
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 mr-1">
                        ${ministerio.nome}
                    </span>
                `;
            }).join('')
            : '';

        return `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="h-10 w-10 flex-shrink-0">
                            <div class="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                                <span class="text-primary-700 dark:text-primary-300 font-medium text-sm">
                                    ${usuario.nome.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900 dark:text-white">
                                ${usuario.nome}
                            </div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        usuario.nivel === 'superadmin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300' :
                        usuario.nivel === 'admin' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                        'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    }">
                        ${usuario.nivel.charAt(0).toUpperCase() + usuario.nivel.slice(1)}
                    </span>
                </td>
                <td class="px-6 py-4">
                    <div class="flex flex-wrap gap-1">
                        ${ministeriosTags}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    ${formatWhatsApp(usuario.whatsapp)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onclick="editUsuario(${usuario.id})"
                            class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                        Editar
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function renderMinisteriosList(ministerios) {
    const container = document.getElementById('ministerios-list');
    container.innerHTML = ministerios.map(ministerio => `
        <div class="ministerio-card group cursor-pointer p-2 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
             data-id="${ministerio.id}"
             onclick="userManager.toggleMinisterio('${ministerio.id}')">
            <div class="flex items-center">
                ${ministerio.foto 
                    ? `<img src="${window.APP_CONFIG.baseUrl}/${ministerio.foto}" alt="${ministerio.nome}" class="w-6 h-6 rounded-full object-cover">` 
                    : `<div class="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                           <span class="text-primary-700 dark:text-primary-300 font-medium text-xs">
                               ${ministerio.nome.charAt(0).toUpperCase()}
                           </span>
                       </div>`
                }
                <span class="ml-2 text-sm font-medium text-gray-900 dark:text-white truncate">
                    ${ministerio.nome}
                </span>
                <div class="selection-indicator ml-auto opacity-0">
                    <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                </div>
            </div>
        </div>
    `).join('');
}

// Funções de Utilidade
function formatWhatsApp(numero) {
    const cleaned = numero.replace(/\D/g, '');
    if (cleaned.length <= 11) {
        return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return cleaned;
}

// Event Handlers
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        nome: e.target.nome.value.trim(),
        whatsapp: e.target.whatsapp.value.replace(/\D/g, ''),
        nivel: e.target.nivel.value,
        status: 'ativo',
        ministerios: userManager.getSelectedMinisterios()
    };

    if (!userManager.editingUserId) {
        formData.senha = e.target.senha.value;
        formData.organizacao_id = Number(window.USER.organizacao_id);
    }

    try {
        const result = userManager.editingUserId
            ? await updateUsuario(userManager.editingUserId, formData)
            : await createUsuario(formData);

        if (result.code === 200) {
            closeUserModal();
            await fetchUsuarios();
        }
    } catch (error) {
        console.error('Erro:', error);
        alert(error.message);
    }
}

async function editUsuario(id) {
    const usuario = userManager.usuarios.find(u => u.id === id);
    if (!usuario) return;

    userManager.editingUserId = id;
    document.getElementById('modal-title').textContent = 'Editar Usuário';
    document.querySelector('.senha-field').style.display = 'none';

    const form = document.getElementById('userForm');
    form.nome.value = usuario.nome;
    form.whatsapp.value = formatWhatsApp(usuario.whatsapp);
    form.nivel.value = usuario.nivel;

    userManager.setInitialSelections(usuario.ministerios);
    openUserModal();
}

// Modal Controls
function openUserModal() {
    document.getElementById('userModal').classList.remove('hidden');
}

function closeUserModal() {
    document.getElementById('userModal').classList.add('hidden');
    userManager.resetForm();
}

function openNewUserModal() {
    userManager.resetForm();
    openUserModal();
}

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    // Carregar dados iniciais
    await Promise.all([fetchUsuarios(), fetchMinisterios()]);

    // Setup event listeners
    document.getElementById('userForm').addEventListener('submit', handleFormSubmit);

    // Setup máscara do WhatsApp
    const whatsappInput = document.getElementById('whatsapp');
    whatsappInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        e.target.value = formatWhatsApp(value);
    });
});

// Expor funções necessárias globalmente
window.userManager = userManager;
window.openNewUserModal = openNewUserModal;
window.closeUserModal = closeUserModal;
window.editUsuario = editUsuario; 