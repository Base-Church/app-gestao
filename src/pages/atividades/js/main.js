import { AtividadesAPI } from './api.js';
import { UI } from './ui.js';
import { State } from './state.js';

class App {
    constructor() {
        if (!window.USER || !window.USER.ministerios) {
            return;
        }

        // Usa o baseUrl do footer
        const baseUrl = window.APP_CONFIG.baseUrl;
        if (!baseUrl) {
            console.warn('Base URL não encontrada');
        }

        // Inicializa o ministério atual
        window.USER.ministerio_atual = window.USER.ministerio_atual || 
                                     localStorage.getItem('ministerio_atual') || 
                                     window.USER.ministerios[0];

        this.api = new AtividadesAPI();
        this.ui = new UI();
        this.state = new State();
        this.isEditing = false;
        this.dadosOriginais = [];
        
        this.setupEventListeners();
        this.loadCategorias(); // Adicionar esta linha antes de loadAtividades
        this.loadAtividades();
    }

    setupEventListeners() {
        let searchTimeout;
        this.ui.searchInput?.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.filtrarDados(e.target.value, document.getElementById('categoria-select')?.value);
            }, 300);
        });

        const categoriaSelect = document.getElementById('categoria-select');
        if (categoriaSelect) {
            categoriaSelect.addEventListener('change', (e) => {
                this.filtrarDados(this.ui.searchInput?.value || '', e.target.value);
            });
        }

        const form = document.getElementById('form-create');
        if (form) {
            form.removeEventListener('submit', this.handleFormSubmit.bind(this));
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        const editButtons = document.querySelectorAll('[data-edit]');
        editButtons.forEach(button => {
            button.addEventListener('click', () => this.handleEdit(button.dataset.edit));
        });

        const deleteButtons = document.querySelectorAll('[data-delete]');
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => this.handleDelete(button.dataset.delete));
        });

        window.app = {
            changePage: (page) => this.changePage(page),
            deleteAtividade: (id, nome) => this.deleteAtividade(id, nome),
            toggleModal: (show) => this.toggleModal(show),
            editAtividade: (atividade) => {
                return this.editAtividade(atividade);
            }
        };
    }

    async loadCategorias() {
        try {
            const response = await this.api.getCategorias();
            if (response.data) {
                this.updateCategoriasFiltro(response.data);
                this.populateCategoriasModal(response.data);
            }
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
            this.ui.showToast('Erro ao carregar categorias', 'error');
        }
    }

    populateCategoriasModal(categorias) {
        const modalSelect = document.getElementById('categoria_atividade_id');
        if (modalSelect) {
            modalSelect.innerHTML = '<option value="">Selecione uma categoria</option>' +
                categorias.map(cat => 
                    `<option value="${cat.id}">${cat.nome}</option>`
                ).join('');
        }
    }

    updateCategoriasFiltro(categorias) {
        const filterSelect = document.getElementById('categoria-select');
        if (filterSelect) {
            filterSelect.innerHTML = '<option value="">Todas as categorias</option>' +
                categorias.map(cat => 
                    `<option value="${cat.id}">${cat.nome}</option>`
                ).join('');
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        try {
            // Obter ministerio_id de várias fontes possíveis
            const ministerio_id = Number(
                window.USER?.ministerio_atual || 
                localStorage.getItem('ministerio_atual') || 
                this.state.getQueryParams().ministerios[0]
            );

            if (!ministerio_id || isNaN(ministerio_id)) {
                throw new Error('Ministério não selecionado');
            }

            // Atribuir o ministerio_id aos dados
            data.ministerio_id = ministerio_id;
            
            if (this.isEditing) {
                data.id = Number(document.getElementById('atividade-id').value);
                
                // Se não houver nova foto sendo enviada e já existir uma foto
                const fotoInput = document.getElementById('foto');
                if ((!data.foto || data.foto === '') && fotoInput.dataset.currentFoto) {
                    data.foto = fotoInput.dataset.currentFoto;
                }
            }

            if (data.categoria_atividade_id) {
                data.categoria_atividade_id = Number(data.categoria_atividade_id);
            }

            // Remove campos vazios ou undefined
            Object.keys(data).forEach(key => {
                if (data[key] === undefined || data[key] === '' || Number.isNaN(data[key])) {
                    delete data[key];
                }
            });

            let response;
            if (this.isEditing) {
                response = await this.api.update(data);
            } else {
                response = await this.api.create(data);
            }

            this.toggleModal(false);
            this.loadAtividades();
            this.ui.showToast('Atividade ' + (this.isEditing ? 'atualizada' : 'criada') + ' com sucesso!');

        } catch (error) {
            let errorMessage = error.message || 'Erro ao salvar atividade';
            this.ui.showToast(errorMessage, 'error');
        }
    }

    async handleEdit(id) {
        try {
            const atividadeEl = document.querySelector(`[data-edit="${id}"]`);
            if (!atividadeEl) {
                throw new Error('Elemento da atividade não encontrado');
            }

            const atividade = {
                id: id,
                nome: atividadeEl.dataset.nome,
                categoria_atividade_id: atividadeEl.dataset.categoriaId,
                cor_indicador: atividadeEl.dataset.corIndicador || '#33ccad',
                foto: atividadeEl.dataset.foto
            };

            this.isEditing = true;
            this.toggleModal(true);

            const fields = {
                'atividade-id': atividade.id,
                'nome': atividade.nome,
                'categoria_atividade_id': atividade.categoria_atividade_id,
                'cor_indicador': atividade.cor_indicador,
                'ministerio_id': window.USER?.ministerio_atual
            };

            Object.entries(fields).forEach(([id, value]) => {
                const element = document.getElementById(id);
                if (element) {
                    element.value = value;
                }
            });

            if (atividade.foto) {
                const preview = document.getElementById('foto_preview');
                if (preview) {
                    preview.innerHTML = `<img src="/baseescalas/assets/img/atividades/${atividade.foto}" class="h-full w-full object-cover">`;
                }
            }

            const titleEl = document.getElementById('modal-title');
            const submitTextEl = document.getElementById('modal-submit-text');
            
            if (titleEl) titleEl.textContent = 'Editar Atividade';
            if (submitTextEl) submitTextEl.textContent = 'Salvar Alterações';

        } catch (error) {
            alert(error.message || 'Erro ao carregar atividade');
            this.toggleModal(false);
        }
    }

    async handleDelete(id) {
        if (!confirm('Tem certeza que deseja excluir esta atividade?')) {
            return;
        }

        try {
            await this.api.delete(id);
            this.ui.showToast('Atividade excluída com sucesso!');
            this.loadAtividades();
        } catch (error) {
            this.ui.showToast('Erro ao excluir atividade', 'error');
        }
    }

    toggleModal(show = true) {
        const modal = document.getElementById('modal-create');
        if (!modal) return;

        if (show) {
            modal.classList.remove('hidden');
        } else {
            modal.classList.add('hidden');
            
            const form = document.getElementById('form-create');
            if (form) form.reset();

            const idInput = document.getElementById('atividade-id');
            if (idInput) idInput.value = '';

            const titleEl = document.getElementById('modal-title');
            if (titleEl) titleEl.textContent = 'Nova Atividade';

            const submitText = document.getElementById('modal-submit-text');
            if (submitText) submitText.textContent = 'Criar Atividade';

            const preview = document.getElementById('foto_preview');
            if (preview) {
                preview.innerHTML = `
                    <svg class="h-8 w-8 text-gray-300 dark:text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                `;
            }

            const ministerioInput = document.getElementById('ministerio_id');
            if (ministerioInput && window.USER?.ministerio_atual) {
                ministerioInput.value = window.USER.ministerio_atual;
            }

            this.isEditing = false;
        }
    }

    async editAtividade(atividade) {
        try {
            this.isEditing = true;
            this.toggleModal(true);

            const fields = {
                'atividade-id': atividade.id,
                'nome': atividade.nome,
                'categoria_atividade_id': atividade.categoria_atividade_id,
                'cor_indicador': atividade.cor_indicador || '#33ccad',
                'ministerio_id': atividade.ministerio_id
            };

            Object.entries(fields).forEach(([id, value]) => {
                const element = document.getElementById(id);
                if (element) {
                    element.value = value || '';
                }
            });

            // Atualizar o input hidden da foto com a foto atual
            const fotoInput = document.getElementById('foto');
            if (fotoInput && atividade.foto) {
                fotoInput.value = '';  // Limpa o valor atual
                fotoInput.dataset.currentFoto = atividade.foto;  // Guarda a foto atual como dataset
            }

            const preview = document.getElementById('foto_preview');
            if (preview) {
                if (atividade.foto) {
                    preview.innerHTML = `<img src="${this.ui.getImageUrl(atividade.foto)}" class="h-full w-full object-cover">`;
                    document.getElementById('foto').value = atividade.foto;
                } else {
                    preview.innerHTML = `
                        <svg class="h-8 w-8 text-gray-300 dark:text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    `;
                }
            }

            const titleEl = document.getElementById('modal-title');
            const submitTextEl = document.getElementById('modal-submit-text');
            
            if (titleEl) titleEl.textContent = 'Editar Atividade';
            if (submitTextEl) submitTextEl.textContent = 'Salvar Alterações';

        } catch (error) {
            this.ui.showToast('Erro ao preparar edição da atividade', 'error');
            this.toggleModal(false);
        }
    }

    async loadAtividades() {
        if (this.state.isLoading) return;

        try {
            const { page } = this.state.getQueryParams();
            const ministerio_atual = window.USER.ministerio_atual;

            console.group('Requisição de Atividades');
            console.log('Ministério Atual:', ministerio_atual);
            console.log('Página:', page);
            console.groupEnd();

            this.state.setLoading(true);
            this.ui.toggleElements(true);

            const data = await this.api.list(ministerio_atual, page, 20);
            
            console.log('Dados recebidos:', data);

            if (!data.data || data.data.length === 0) {
                console.log('Nenhuma atividade encontrada');
                this.ui.toggleElements(false, false, true);
                return;
            }

            this.dadosOriginais = data.data;
            console.log('Dados originais armazenados:', this.dadosOriginais);
            
            this.atualizarCategorias(data.data);
            this.ui.renderAtividades(data.data);
            
            if (data.meta) {
                console.log('Metadados da paginação:', data.meta);
                this.ui.renderPaginationContainer(data.meta);
            }

            this.ui.toggleElements();

        } catch (error) {
            console.error('Erro ao carregar atividades:', error);
            this.state.setError(error.message);
            this.ui.toggleElements(false, true);
            this.ui.errorMessage.textContent = error.message;
        } finally {
            this.state.setLoading(false);
        }
    }

    updateCategoriasFiltro(atividades) {
        const categorias = [...new Set(atividades.map(a => ({
            id: a.categoria_atividade_id,
            nome: a.categoria_nome
        })))].filter(cat => cat.id && cat.nome);

        const categoriasUnicas = Array.from(
            new Map(categorias.map(item => [item.id, item])).values()
        ).sort((a, b) => a.nome.localeCompare(b.nome));

        const categoriaSelect = document.getElementById('categoria-select');
        if (categoriaSelect) {
            const selectedValue = categoriaSelect.value;
            
            categoriaSelect.innerHTML = '<option value="">Todas as categorias</option>' +
                categoriasUnicas.map(cat => 
                    `<option value="${cat.id}" ${cat.id == selectedValue ? 'selected' : ''}>${cat.nome}</option>`
                ).join('');
        }
    }

    async deleteAtividade(id, nome) {
        try {
            if (!confirm(`Tem certeza que deseja excluir a atividade "${nome}"?`)) {
                return;
            }

            await this.api.delete(id);
            this.ui.showToast('Atividade excluída com sucesso!');
            this.loadAtividades();
        } catch (error) {
            this.ui.showToast(error.message, 'error');
        }
    }

    changePage(page) {
        this.state.setPage(page);
        this.loadAtividades();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    filtrarDados(busca = '', categoriaId = '') {
        const termo = busca.toLowerCase().trim();
        
        let dadosFiltrados = this.dadosOriginais.filter(atividade => {
            const matchBusca = !termo || 
                atividade.nome.toLowerCase().includes(termo) || 
                (atividade.descricao || '').toLowerCase().includes(termo);
                
            const matchCategoria = !categoriaId || 
                atividade.categoria_atividade_id.toString() === categoriaId;

            return matchBusca && matchCategoria;
        });

        if (dadosFiltrados.length === 0) {
            this.ui.toggleElements(false, false, true);
        } else {
            this.ui.toggleElements(false, false, false);
            this.ui.renderAtividades(dadosFiltrados);
        }
    }

    atualizarCategorias(atividades) {
        const categorias = [...new Map(
            atividades.map(a => [
                a.categoria_atividade_id, 
                { id: a.categoria_atividade_id, nome: a.categoria_nome }
            ])
        ).values()].sort((a, b) => a.nome.localeCompare(b.nome));

        const options = [
            { id: '', nome: 'Todas as categorias' },
            ...categorias
        ];

        this.atualizarSelect('categoria-select', options);
        this.atualizarSelect('categoria_atividade_id', options, 'Selecione uma categoria');
    }

    atualizarSelect(elementId, options, firstOptionText = 'Todas as categorias') {
        const select = document.getElementById(elementId);
        if (select) {
            const currentValue = select.value;
            select.innerHTML = options
                .map((opt, index) => {
                    if (index === 0) {
                        return `<option value="${opt.id}">${firstOptionText}</option>`;
                    }
                    return `<option value="${opt.id}"${opt.id == currentValue ? ' selected' : ''}>${opt.nome}</option>`;
                })
                .join('');
        }
    }
}

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => new App());