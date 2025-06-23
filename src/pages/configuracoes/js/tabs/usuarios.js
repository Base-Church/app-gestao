import { apiService } from '../services/api.service.js';

class UsuariosTab {
    constructor() {
        this.usuarios = [];
        this.editingUserId = null;
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;
        
        // Form de usuário
        const userForm = document.getElementById('userForm');
        if (userForm) {
            userForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Máscara do WhatsApp
        const whatsappInput = document.getElementById('whatsapp');
        if (whatsappInput) {
            whatsappInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 11) value = value.slice(0, 11);
                e.target.value = this.formatWhatsApp(value);
            });
        }

        this.isInitialized = true;
    }

    async loadData() {
        if (this.usuarios.length > 0) {
            this.renderUsuariosList();
            return;
        }

        try {
            const usuarios = await apiService.getUsuarios();
            this.usuarios = usuarios;
            this.renderUsuariosList();
        } catch (error) {
            console.error('Erro ao carregar dados iniciais:', error);
        }
    }

    renderUsuariosList() {
        const container = document.getElementById('usuarios-list');
        if (!container) return;
        
        // Garante que o container não tenha grid ou colunas
        container.className = '';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '1rem';

        container.innerHTML = this.usuarios.map(usuario => {
            const nivelClass = usuario.nivel === 'superadmin' 
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
                : usuario.nivel === 'admin' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                    : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';

            return `
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div class="p-4 sm:p-6">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center min-w-0">
                                <div class="h-10 w-10 flex-shrink-0">
                                    <div class="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                                        <span class="text-primary-700 dark:text-primary-300 font-medium text-lg">
                                            ${usuario.nome.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div class="ml-4 truncate">
                                    <div class="flex items-center space-x-2">
                                        <h3 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            ${usuario.nome}
                                        </h3>
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${nivelClass}">
                                            ${usuario.nivel.charAt(0).toUpperCase() + usuario.nivel.slice(1)}
                                        </span>
                                    </div>
                                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        ${this.formatWhatsApp(usuario.whatsapp)}
                                    </p>
                                </div>
                            </div>
                            <button onclick="usuariosTab.editUsuario(${usuario.id})"
                                    class="ml-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    formatWhatsApp(numero) {
        const cleaned = numero.replace(/\D/g, '');
        if (cleaned.length <= 11) {
            return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        return cleaned;
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = {
            nome: e.target.nome.value.trim(),
            whatsapp: e.target.whatsapp.value.replace(/\D/g, ''),
            nivel: e.target.nivel.value,
            status: 'ativo',
            ministerios: []
        };

        if (!this.editingUserId) {
            formData.senha = e.target.senha.value;
            formData.organizacao_id = Number(window.USER.organizacao_id);
        }

        try {
            const result = this.editingUserId
                ? await apiService.updateUsuario(this.editingUserId, formData)
                : await apiService.createUsuario(formData);

            if (result.code === 200) {
                this.closeModal();
                // Atualiza apenas o usuário modificado na lista
                if (this.editingUserId) {
                    const index = this.usuarios.findIndex(u => u.id === this.editingUserId);
                    if (index !== -1) {
                        this.usuarios[index] = { ...this.usuarios[index], ...formData };
                    }
                } else {
                    this.usuarios.push({ id: result.data.id, ...formData });
                }
                this.renderUsuariosList();
            }
        } catch (error) {
            console.error('Erro:', error);
            alert(error.message);
        }
    }

    async editUsuario(id) {
        const usuario = this.usuarios.find(u => u.id === id);
        if (!usuario) return;

        this.editingUserId = id;
        document.getElementById('modal-title').textContent = 'Editar Usuário';
        document.querySelector('.senha-field').style.display = 'none';

        const form = document.getElementById('userForm');
        form.nome.value = usuario.nome;
        form.whatsapp.value = this.formatWhatsApp(usuario.whatsapp);
        form.nivel.value = usuario.nivel;

        this.openModal();
    }

    openModal() {
        document.getElementById('userModal').classList.remove('hidden');
    }

    closeModal() {
        document.getElementById('userModal').classList.add('hidden');
        this.resetForm();
    }

    openNewModal() {
        this.resetForm();
        this.openModal();
    }

    resetForm() {
        document.getElementById('userForm').reset();
        this.editingUserId = null;
        document.getElementById('modal-title').textContent = 'Novo Usuário';
        document.querySelector('.senha-field').style.display = 'block';
    }
}

export const usuariosTab = new UsuariosTab();

// Expor para uso global
window.usuariosTab = usuariosTab; 