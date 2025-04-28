class App {
    constructor() {
        if (!window.USER || !window.USER.baseUrl) {
            console.error('Erro: Objeto USER não encontrado ou incompleto');
            return;
        }

        this.api = new CategoriaAtividadeAPI(window.USER.baseUrl);
        this.ui = new CategoriaAtividadeUI();
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.searchTerm = '';
        this.isEditing = false;

        // Adiciona organizacao_id e ministerio_atual ao estado inicial
        this.organizacao_id = window.USER?.organizacao_id;
        this.ministerio_atual = window.USER?.ministerio_atual;
        
        if (!this.organizacao_id || !this.ministerio_atual) {
            console.error('Erro: organizacao_id ou ministerio_atual não encontrados');
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
            changePage: this.changePage.bind(this),
            deleteCategoria: this.deleteCategoria.bind(this),
            toggleModal: this.toggleModal.bind(this),
            editCategoria: this.editCategoria.bind(this)
        };

        // Configura o formulário de criação/edição
        this.setupForm();

        // Carrega as categorias
        await this.loadCategorias();
    }

    setupEventListeners() {
        // Configura a busca
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value;
                this.currentPage = 1;
                this.loadCategorias();
            });
        }
    }

    setupForm() {
        const form = document.getElementById('form-create');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const formData = new FormData(form);
                const data = {
                    nome: formData.get('nome'),
                    cor: formData.get('cor'),
                    organizacao_id: this.organizacao_id,
                    ministerio_id: this.ministerio_atual
                };

                if (this.isEditing) {
                    const id = formData.get('id');
                    await this.api.update(id, data);
                    this.ui.showToast('Categoria atualizada com sucesso!');
                } else {
                    await this.api.create(data);
                    this.ui.showToast('Categoria criada com sucesso!');
                }

                this.toggleModal(false);
                form.reset();
                this.loadCategorias();
            } catch (error) {
                console.error('Erro ao salvar categoria:', error);
                this.ui.showToast(error.message, 'error');
            }
        });
    }

    toggleModal(show = true, categoria = null) {
        const modal = document.getElementById('modal-create');
        const form = document.getElementById('form-create');
        const modalTitle = document.getElementById('modal-title');
        const modalSubmitText = document.getElementById('modal-submit-text');
        const categoriaId = document.getElementById('categoria-id');
        const nomeInput = document.getElementById('nome');
        const corInput = document.getElementById('cor');

        if (!modal || !form) return;

        if (show) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';

            // Se tiver categoria, é edição
            if (categoria) {
                this.isEditing = true;
                modalTitle.textContent = 'Editar Categoria';
                modalSubmitText.textContent = 'Salvar Alterações';
                
                // Preenche o formulário
                categoriaId.value = categoria.id;
                nomeInput.value = categoria.nome;
                corInput.value = categoria.cor;
            } else {
                this.isEditing = false;
                modalTitle.textContent = 'Nova Categoria';
                modalSubmitText.textContent = 'Criar Categoria';
                form.reset();
            }
        } else {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
            this.isEditing = false;
            form.reset();
        }
    }

    async loadCategorias() {
        try {
            const response = await this.api.list(this.currentPage, this.itemsPerPage, this.searchTerm);
            this.ui.renderCategorias(response.data, response.total, this.currentPage, this.itemsPerPage);
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
            this.ui.showError(error.message);
        }
    }

    async deleteCategoria(id) {
        if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;

        try {
            await this.api.delete(id);
            this.ui.showToast('Categoria excluída com sucesso!');
            this.loadCategorias();
        } catch (error) {
            console.error('Erro ao excluir categoria:', error);
            this.ui.showToast(error.message, 'error');
        }
    }

    editCategoria(categoria) {
        console.log('Editando categoria:', categoria);
        this.toggleModal(true, categoria);
    }

    changePage(page) {
        this.currentPage = page;
        this.loadCategorias();
    }
}

// Inicializa a aplicação quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
