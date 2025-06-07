class App {
    constructor() {
        if (!window.USER) {
            console.error('Erro: Objeto USER não encontrado');
            return;
        }

        // Verifica e inicializa o ministério atual de várias fontes possíveis
        const ministerioAtual = window.USER.ministerio_atual;

        // Normaliza o ministério atual para um objeto com id
        if (ministerioAtual) {
            window.USER.ministerio_atual = typeof ministerioAtual === 'number' 
                ? { id: ministerioAtual } 
                : (typeof ministerioAtual === 'object' ? ministerioAtual : { id: Number(ministerioAtual) });
        }

        console.log('Ministério Atual:', window.USER.ministerio_atual);

        // Garante que o objeto ministerio_atual esteja disponível globalmente
        window.USER = {
            ...window.USER,
            ministerio_atual: window.USER.ministerio_atual
        };

        this.api = new RecadosAPI();
        this.ui = new RecadosUI();
        this.showAll = false; // Adiciona controle para mostrar todos
        this.isEditing = false;
        this.currentRecado = null;
        this.init();
    }

    async init() {
        this.setupEventListeners();
        window.app = {
            toggleModal: this.toggleModal.bind(this),
            handleSubmit: this.handleSubmit.bind(this),
            editRecado: this.editRecado.bind(this),
            deleteRecado: this.deleteRecado.bind(this)
        };
        await this.loadRecados();
    }

    setupEventListeners() {
        const form = document.getElementById('form-create');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                await this.handleSubmit(Object.fromEntries(formData));
            });
        }

        // Adiciona evento para o switch de mostrar todos
        const showAllSwitch = document.getElementById('show-all');
        if (showAllSwitch) {
            showAllSwitch.addEventListener('change', (e) => {
                this.showAll = e.target.checked;
                this.loadRecados();
            });
        }
    }

    async loadRecados() {
        try {
            if (!this.showAll && !window.USER.ministerio_atual) {
                throw new Error('Selecione um ministério');
            }

            this.ui.toggleElements(true);
            const response = await this.api.list(this.showAll ? null : window.USER.ministerio_atual?.id);
            this.ui.renderRecados(response.data);
        } catch (error) {
            console.error('Erro ao carregar recados:', error);
            this.ui.showError(error.message || 'Erro ao carregar recados');
            
            // Se não houver ministério selecionado, desabilita o botão de novo recado
            if (error.message.includes('Selecione um ministério')) {
                const btnNovoRecado = document.querySelector('button[onclick="window.app.toggleModal(true)"]');
                if (btnNovoRecado) {
                    btnNovoRecado.disabled = true;
                    btnNovoRecado.classList.add('opacity-50', 'cursor-not-allowed');
                }
            }
        }
    }

    toggleModal(show = true, recado = null) {
        const modal = document.getElementById('modal-create');
        const form = document.getElementById('form-create');
        const modalTitle = document.querySelector('#modal-create h3');
        const submitButton = document.querySelector('#modal-create button[type="submit"]');
        
        if (show) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';

            if (recado) {
                this.isEditing = true;
                this.currentRecado = recado;
                modalTitle.textContent = 'Editar Recado';
                submitButton.textContent = 'Salvar Alterações';
                this.fillFormData(recado);
            } else {
                this.isEditing = false;
                this.currentRecado = null;
                modalTitle.textContent = 'Novo Recado';
                submitButton.textContent = 'Criar Recado';
                form?.reset();
            }
        } else {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
            form?.reset();
            this.isEditing = false;
            this.currentRecado = null;
        }
    }

    fillFormData(recado) {
        const form = document.getElementById('form-create');
        if (!form) return;

        form.titulo.value = recado.titulo;
        form.texto.value = recado.texto;
        form.validade.value = recado.validade ? recado.validade.split('T')[0] : '';
    }

    async handleSubmit(data) {
        try {
            if (this.isEditing && this.currentRecado) {
                await this.api.update(this.currentRecado.id, data);
                this.ui.showToast('Recado atualizado com sucesso!');
            } else {
                await this.api.create(data);
                this.ui.showToast('Recado criado com sucesso!');
            }
            this.toggleModal(false);
            await this.loadRecados();
        } catch (error) {
            console.error('Erro ao salvar recado:', error);
            this.ui.showToast(error.message, 'error');
        }
    }

    async editRecado(recado) {
        this.toggleModal(true, recado);
    }

    async deleteRecado(id, titulo) {
        if (!confirm(`Tem certeza que deseja excluir o recado "${titulo}"?`)) {
            return;
        }

        try {
            await this.api.delete(id);
            this.ui.showToast('Recado excluído com sucesso!');
            await this.loadRecados();
        } catch (error) {
            console.error('Erro ao excluir recado:', error);
            this.ui.showToast(error.message, 'error');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new App());
