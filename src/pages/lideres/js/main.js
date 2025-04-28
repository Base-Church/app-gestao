class App {
    constructor() {
        if (!window.USER?.baseUrl) {
            console.error('Erro: Objeto USER não encontrado ou incompleto');
            return;
        }

        this.api = new LideresAPI(window.USER.baseUrl);
        this.ui = new LideresUI();
        this.state = new LideresState();
        this.isEditing = false;

        // Garante que as configurações do WhatsApp existam
        if (!window.APP_CONFIG?.whatsapp) {
            console.error('Configurações do WhatsApp não encontradas');
            return;
        }

        // Inicializa a aplicação
        this.init();
    }

    async init() {
        // Configura os event listeners
        this.setupEventListeners();

        // Expõe funções necessárias globalmente
        window.app = {
            api: this.api, // Expõe a API globalmente
            changePage: this.changePage.bind(this),
            deleteLider: this.deleteLider.bind(this),
            toggleModal: this.toggleModal.bind(this),
            editLider: this.editLider.bind(this),
            handleSubmit: this.handleSubmit.bind(this)
        };

        // Carrega os líderes
        await this.loadLideres();
    }

    async loadLideres() {
        try {
            this.state.setLoading(true);
            this.ui.toggleElements(true);

            const { page, limit, search } = this.state.getQueryParams();
            const response = await this.api.list(page, limit, search);

            this.ui.renderLideres(response.data, response.meta.total, page, limit);
        } catch (error) {
            console.error('Erro ao carregar líderes:', error);
            this.ui.showError(error.message);
        } finally {
            this.state.setLoading(false);
        }
    }

    async changePage(page) {
        this.state.setPage(page);
        await this.loadLideres();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async deleteLider(id) {
        if (!confirm('Tem certeza que deseja excluir este líder?')) {
            return;
        }

        try {
            await this.api.delete(id);
            this.ui.showToast('Líder excluído com sucesso!');
            await this.loadLideres();
        } catch (error) {
            console.error('Erro ao excluir líder:', error);
            this.ui.showToast(error.message, 'error');
        }
    }

    toggleModal(show = true, lider = null) {
        const modal = document.getElementById('modal-create');
        const form = document.getElementById('form-create');
        const modalTitle = document.getElementById('modal-title');
        const modalSubmitText = document.getElementById('modal-submit-text');
        
        if (!modal || !form) return;

        if (show) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';

            // Se tiver líder, é edição
            if (lider) {
                this.isEditing = true;
                modalTitle.textContent = 'Editar Líder';
                modalSubmitText.textContent = 'Salvar Alterações';
                this.fillFormData(lider);
            } else {
                this.isEditing = false;
                modalTitle.textContent = 'Novo Líder';
                modalSubmitText.textContent = 'Criar Líder';
                form.reset();
            }
        } else {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
            this.isEditing = false;
            form.reset();
        }
    }

    setupEventListeners() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            let debounceTimer;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    this.state.setSearch(e.target.value);
                    this.loadLideres();
                }, 300);
            });
        }

        const form = document.getElementById('form-create');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                await this.handleSubmit(Object.fromEntries(formData));
            });
        }
    }

    editLider(lider) {
        this.toggleModal(true, lider);
    }

    async handleSubmit(data) {
        try {
            let response;
            if (this.isEditing) {
                const id = document.getElementById('lider-id').value;
                response = await this.api.update(id, data);
                this.ui.showToast('Líder atualizado com sucesso!', 'success');
            } else {
                response = await this.api.create(data);
                this.ui.showToast('Líder criado com sucesso!', 'success');
            }

            if (response.data) {
                this.toggleModal(false);
                await this.loadLideres();
            }
        } catch (error) {
            console.error('Erro ao salvar líder:', error);
            this.ui.showToast(error.message, 'error');
        }
    }

    fillFormData(lider) {
        const form = document.getElementById('form-create');
        if (!form) return;

        form.id.value = lider.id;
        form.nome.value = lider.nome;
        form.whatsapp.value = this.ui.formatTelefone(lider.whatsapp);
        form.ministerio_id.value = lider.ministerio_id;
        
        if (lider.foto) {
            document.getElementById('foto-preview').src = this.ui.getImageUrl(lider.foto);
        }
    }
}

// Inicializa a aplicação quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
