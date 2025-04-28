class App {
    constructor() {
        if (!window.USER || !window.USER.baseUrl) {
            console.error('Erro: Objeto USER não encontrado ou incompleto');
            return;
        }

        this.api = new EventosAPI(window.USER.baseUrl);
        this.ui = new EventosUI();
        this.state = new EventosState();
        this.isEditing = false;

        // Inicializa a aplicação
        this.init();
    }

    async init() {
        // Configura os event listeners
        this.setupEventListeners();

        // Expõe funções necessárias globalmente
        window.app = {
            changePage: this.changePage.bind(this),
            deleteEvento: this.deleteEvento.bind(this),
            toggleModal: this.toggleModal.bind(this),
            editEvento: this.editEvento.bind(this),
            handleSubmit: this.handleSubmit.bind(this)
        };

        // Configura o formulário de criação/edição
        this.setupForm();

        // Carrega os eventos
        await this.loadEventos();
    }

    setupEventListeners() {
        // Configura a busca
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            let debounceTimer;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    this.state.setSearch(e.target.value);
                    this.loadEventos();
                }, 300);
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
                const data = Object.fromEntries(formData.entries());

                // Formata a hora se necessário
                if (data.hora && !data.hora.includes(':')) {
                    data.hora = data.hora + ':00';
                } else if (data.hora && data.hora.split(':').length === 2) {
                    data.hora = data.hora + ':00';
                }

                await this.handleSubmit(data);
            } catch (error) {
                console.error('Erro ao salvar evento:', error);
                this.ui.showToast(error.message, 'error');
            }
        });
    }

    async loadEventos() {
        try {
            this.state.setLoading(true);
            this.ui.toggleElements(true);

            const { page, limit, search } = this.state.getQueryParams();
            const response = await this.api.list(page, limit, search);

            this.ui.renderEventos(
                response.data,
                response.meta.total,
                page,
                limit
            );
        } catch (error) {
            console.error('Erro ao carregar eventos:', error);
            this.ui.showError(error.message);
        } finally {
            this.state.setLoading(false);
        }
    }

    async changePage(page) {
        this.state.setPage(page);
        await this.loadEventos();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async deleteEvento(id) {
        if (!confirm('Tem certeza que deseja excluir este evento?')) {
            return;
        }

        try {
            await this.api.delete(id);
            this.ui.showToast('Evento excluído com sucesso!');
            await this.loadEventos();
        } catch (error) {
            console.error('Erro ao excluir evento:', error);
            this.ui.showToast(error.message, 'error');
        }
    }

    toggleModal(show = true, evento = null) {
        const modal = document.getElementById('modal-create');
        const form = document.getElementById('form-create');
        const modalTitle = document.getElementById('modal-title');
        const modalSubmitText = document.getElementById('modal-submit-text');
        const eventoId = document.getElementById('evento-id');
        const nomeInput = document.getElementById('nome');
        const diaSemanaSelect = document.getElementById('dia_semana');
        const horaInput = document.getElementById('hora');
        const tipoInput = document.getElementById('tipo');
        const visibilidadeSelect = document.getElementById('visibilidade');
        const fotoInput = document.getElementById('foto');
        const fotoPreview = document.getElementById('foto_preview');

        if (!modal || !form) return;

        if (show) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';

            // Se tiver evento, é edição
            if (evento) {
                this.isEditing = true;
                modalTitle.textContent = 'Editar Evento';
                modalSubmitText.textContent = 'Salvar Alterações';
                eventoId.value = evento.id;
                nomeInput.value = evento.nome;
                diaSemanaSelect.value = evento.dia_semana;
                horaInput.value = this.ui.formatHora(evento.hora);
                tipoInput.value = evento.tipo;
                visibilidadeSelect.value = evento.visibilidade;
                fotoInput.value = evento.foto || '';

                // Atualiza o preview da foto
                if (evento.foto) {
                    const imageUrl = `${window.USER.baseUrl}/assets/img/eventos/${evento.foto}`;
                    fotoPreview.innerHTML = `<img src="${imageUrl}" class="h-full w-full object-cover" onerror="this.src='${window.USER.baseUrl}/assets/img/eventos/placeholder.jpg'">`;
                } else {
                    fotoPreview.innerHTML = `<svg class="h-8 w-8 text-gray-300 dark:text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>`;
                }
            } else {
                this.isEditing = false;
                modalTitle.textContent = 'Novo Evento';
                modalSubmitText.textContent = 'Criar Evento';
                form.reset();
                
                // Reseta o preview da foto
                fotoPreview.innerHTML = `<svg class="h-8 w-8 text-gray-300 dark:text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>`;
            }
        } else {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
            this.isEditing = false;
            form.reset();
            
            // Reseta o preview da foto
            fotoPreview.innerHTML = `<svg class="h-8 w-8 text-gray-300 dark:text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>`;
        }
    }

    editEvento(evento) {
        const form = document.getElementById('form-create');
        if (!form) return;

        this.isEditing = true;
        form.id.value = evento.id;
        form.nome.value = evento.nome;
        form.dia_semana.value = evento.dia_semana;
        form.hora.value = this.ui.formatHora(evento.hora);
        form.tipo.value = evento.tipo;
        form.visibilidade.value = evento.visibilidade;

        // Atualiza o campo válido se for evento
        if (evento.tipo === 'evento' && evento.valido) {
            const validoDate = new Date(evento.valido);
            const validoFormatted = validoDate.toISOString().slice(0, 10); // Formato YYYY-MM-DD
            form.valido.value = validoFormatted;
        }

        toggleValidoField(); // Atualiza visibilidade do campo
        this.toggleModal(true, evento);
    }

    async handleSubmit(data) {
        try {
            if (this.isEditing) {
                const id = document.getElementById('evento-id').value;
                await this.api.update(id, data);
                this.ui.showToast('Evento atualizado com sucesso!');
            } else {
                await this.api.create(data);
                this.ui.showToast('Evento criado com sucesso!');
            }

            // Fecha o modal e recarrega os eventos
            this.toggleModal(false);
            await this.loadEventos();
        } catch (error) {
            console.error('Erro ao salvar evento:', error);
            this.ui.showToast(error.message, 'error');
        }
    }
}

// Inicializa a aplicação quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
