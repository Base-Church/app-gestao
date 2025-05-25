import { MinisteriosAPI } from './api.js';
import { UI } from './ui.js';
import { State } from './state.js';

class App {
    constructor() {
        // Verifica se o objeto USER existe e tem as propriedades necessárias
        if (!window.USER) {
            console.error('Erro: Objeto USER não encontrado', window.USER);
            return;
        }


        // Usa a configuração do APP_CONFIG em vez de calcular a baseUrl
        this.api = new MinisteriosAPI(window.APP_CONFIG.baseUrl);
        
        // Inicializa os módulos
        this.ui = new UI();
        this.state = new State();
        this.isEditing = false;
        
        // Inicializa os eventos
        this.setupEventListeners();
        
        // Carrega os dados iniciais
        this.loadMinisterios();

        this.initializeColorPicker();
    }

    initializeColorPicker() {
        this.pickr = Pickr.create({
            el: '#color-picker',
            theme: 'classic',
            defaultRepresentation: 'HEX',
            default: '#000000',
            swatches: [
                '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e',
                '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50',
                '#f1c40f', '#e67e22', '#e74c3c', '#ecf0f1', '#95a5a6',
                '#f39c12', '#d35400', '#c0392b', '#bdc3c7', '#7f8c8d'
            ],
            components: {
                preview: true,
                opacity: true,
                hue: true,
                interaction: {
                    input: true,
                    save: true
                }
            }
        });

        this.pickr.on('save', (color) => {
            const hexColor = color.toHEXA().toString();
            document.getElementById('cor').value = hexColor;
            document.getElementById('color-preview').style.backgroundColor = hexColor;
            document.getElementById('color-value').textContent = hexColor;
            this.pickr.hide();
        });
    }

    setupEventListeners() {

        // Image Preview
        const fotoInput = document.getElementById('foto');
        const fotoPreview = document.getElementById('foto-preview');
        
        if (fotoInput && fotoPreview) {
            fotoInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        fotoPreview.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                } else {
                    fotoPreview.src = `${this.api.baseUrl}/assets/img/ministerios/placeholder.jpg`;
                }
            });
        }

        // Busca
        let searchTimeout;
        this.ui.searchInput?.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.state.setSearch(e.target.value);
                this.state.setPage(1);
                this.loadMinisterios();
            }, 300);
        });

        // Formulário de criação/edição
        const form = document.getElementById('form-create');
        if (form) {
            form.removeEventListener('submit', this.handleFormSubmit.bind(this));
            form.addEventListener('submit', this.handleFormSubmit.bind(this));
        }

        // Expõe funções necessárias globalmente
        window.app = {
            changePage: this.changePage.bind(this),
            deleteMinisterio: this.deleteMinisterio.bind(this),
            toggleModal: this.toggleModal.bind(this),
            editMinisterio: this.editMinisterio.bind(this)
        };

        // Adicionar eventos para o grupo WhatsApp
        const searchInput = document.getElementById('grupo_whatsapp_search');
        const gruposList = document.getElementById('grupos-list');
        
        if (searchInput) {
            let grupos = [];
            let searchTimeout;

            // Carregar grupos ao clicar no input
            searchInput.addEventListener('focus', async () => {
                if (grupos.length === 0) {
                    try {
                        grupos = await this.api.fetchWhatsAppGroups();
                        this.renderGruposList(grupos);
                        gruposList.classList.remove('hidden');
                    } catch (error) {
                        this.ui.showToast(error.message, 'error');
                    }
                } else {
                    gruposList.classList.remove('hidden');
                }
            });

            // Filtrar grupos ao digitar
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    const filteredGrupos = grupos.filter(grupo => 
                        grupo.subject.toLowerCase().includes(e.target.value.toLowerCase())
                    );
                    this.renderGruposList(filteredGrupos);
                }, 300);
            });

            // Fechar lista ao clicar fora
            document.addEventListener('click', (e) => {
                if (!searchInput.contains(e.target) && !gruposList.contains(e.target)) {
                    gruposList.classList.add('hidden');
                }
            });
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        try {
            const data = {
                nome: formData.get('nome'),
                foto: form.foto.files[0] ? await this.api.handleImageUpload(form.foto.files[0]) : formData.get('foto-atual'),
                descricao: formData.get('descricao'),
                prefixo: formData.get('prefixo'),
                grupo_whatsapp: formData.get('grupo_whatsapp'),
                cor: formData.get('cor'), // Garantir que a cor seja enviada
                organizacao_id: window.USER.organizacao_id // Adiciona organizacao_id
            };

            let result;
            if (this.isEditing) {
                const id = formData.get('id');
                result = await this.api.update(id, data);
                this.ui.showToast('Ministério atualizado com sucesso!');
            } else {
                result = await this.api.create(data);
                this.ui.showToast('Ministério criado com sucesso!');
            }

            this.toggleModal(false);
            form.reset();
            this.loadMinisterios();
        } catch (error) {
            console.error('Erro ao salvar ministério:', error);
            this.ui.showToast(error.message, 'error');
        }
    }

    toggleModal(show = false, ministerio = null) {
        const modal = document.getElementById('modal-create');
        const form = document.getElementById('form-create');
        const title = document.getElementById('modal-title');
        const submitText = document.getElementById('modal-submit-text');
        
        if (!modal || !form) return;

        if (show) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';

            if (ministerio) {
                this.isEditing = true;
                title.textContent = 'Editar Ministério';
                submitText.textContent = 'Salvar Alterações';
                
                // Preenche o formulário
                form.id.value = ministerio.id;
                form.nome.value = ministerio.nome;
                form.descricao.value = ministerio.descricao || '';
            } else {
                this.isEditing = false;
                title.textContent = 'Novo Ministério';
                submitText.textContent = 'Criar Ministério';
                form.reset();
            }
        } else {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
            this.isEditing = false;
            form.reset();
        }
    }

    editMinisterio(ministerio) {
        console.log('Editando ministério:', ministerio);
        const form = document.getElementById('form-create');
        const fotoPreview = document.getElementById('foto-preview');
        
        if (form) {
            form.id.value = ministerio.id;
            form.nome.value = ministerio.nome;
            form.descricao.value = ministerio.descricao || '';
            form.prefixo.value = ministerio.prefixo || '';
            form.grupo_whatsapp.value = ministerio.grupo_whatsapp || '';
            form.cor.value = ministerio.cor || '#000000';
            
            // Adiciona campo oculto para manter a URL atual da foto
            let fotoAtualInput = form.querySelector('input[name="foto-atual"]');
            if (!fotoAtualInput) {
                fotoAtualInput = document.createElement('input');
                fotoAtualInput.type = 'hidden';
                fotoAtualInput.name = 'foto-atual';
                form.appendChild(fotoAtualInput);
            }
            fotoAtualInput.value = ministerio.foto || 'assets/img/ministerios/placeholder.jpg';
            
            // Atualiza preview com URL base correta
            if (fotoPreview) {
                const photoUrl = ministerio.foto || 'assets/img/ministerios/placeholder.jpg';
                fotoPreview.src = `${this.api.baseUrl}/${photoUrl}`;
            }

            // Atualizar cor no picker
            this.pickr.setColor(ministerio.cor || '#000000');
            document.getElementById('color-preview').style.backgroundColor = ministerio.cor || '#000000';
            document.getElementById('color-value').textContent = ministerio.cor || '#000000';
        }
        this.toggleModal(true, ministerio);
    }

    async deleteMinisterio(id, nome) {
        try {
            if (!confirm(`Tem certeza que deseja excluir o ministério "${nome}"?`)) {
                return;
            }

            await this.api.delete(id);
            this.ui.showToast('Ministério excluído com sucesso!');
            this.loadMinisterios();
        } catch (error) {
            console.error('Erro ao excluir ministério:', error);
            this.ui.showToast(error.message, 'error');
        }
    }

    changePage(page) {
        this.state.setPage(page);
        this.loadMinisterios();
    }

    async loadMinisterios() {
        if (this.state.isLoading) {
            console.log('Já está carregando, ignorando chamada...');
            return;
        }

        try {
            this.state.setLoading(true);
            this.state.setError(null);
            this.ui.toggleElements(true);

            const { page, search } = this.state.getQueryParams();

            const data = await this.api.list(page, 12, search);

            if (!data.data || data.data.length === 0) {
                this.ui.toggleElements(false, false, true);
                return;
            }

            // Renderiza grid de cards
            if (this.ui.ministeriosGrid) this.ui.ministeriosGrid.innerHTML = '';
            if (this.ui.gridContainer) {
                this.ui.gridContainer.innerHTML = this.ui.renderMinisteriosGrid(data.data);
            }

            // Anima os contadores de voluntários
            setTimeout(() => {
                document.querySelectorAll('.animate-vol-counter').forEach(el => {
                    const target = parseInt(el.getAttribute('data-count')) || 0;
                    let current = 0;
                    const duration = 700;
                    const step = Math.ceil(target / (duration / 30));
                    const animate = () => {
                        current += step;
                        if (current >= target) {
                            el.textContent = target;
                        } else {
                            el.textContent = current;
                            setTimeout(animate, 30);
                        }
                    };
                    animate();
                });
            }, 200);

            if (data.meta && this.ui.paginationContainer) {
                this.ui.paginationContainer.innerHTML = this.ui.renderPagination(data.meta);
            }

            this.ui.toggleElements();

        } catch (error) {
            console.error('Erro ao carregar ministérios:', error);
            this.state.setError(error.message);
            this.ui.toggleElements(false, true);
            if (this.ui.errorMessage) this.ui.errorMessage.textContent = error.message;
        } finally {
            this.state.setLoading(false);
        }
    }

    renderGruposList(grupos) {
        const gruposList = document.getElementById('grupos-list');
        const gruposHTML = grupos.map(grupo => `
            <div class="grupo-item cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md"
                 data-id="${grupo.id}"
                 data-owner="${grupo.subjectOwner}"
                 data-name="${grupo.subject}"
                 data-size="${grupo.size}"
                 data-photo="${grupo.pictureUrl || `${this.api.baseUrl}/assets/img/ministerios/placeholder.jpg`}">
                <div class="flex items-center">
                    <img src="${grupo.pictureUrl || `${this.api.baseUrl}/assets/img/ministerios/placeholder.jpg`}" 
                         alt="${grupo.subject}"
                         class="w-10 h-10 rounded-full object-cover">
                    <div class="ml-3">
                        <h4 class="text-sm font-medium text-gray-900 dark:text-white">${grupo.subject}</h4>
                        <p class="text-xs text-gray-500 dark:text-gray-400">${grupo.size} membros</p>
                    </div>
                </div>
            </div>
        `).join('');

        gruposList.querySelector('.grid').innerHTML = gruposHTML;

        // Adicionar eventos de clique
        gruposList.querySelectorAll('.grupo-item').forEach(item => {
            item.addEventListener('click', () => {
                const grupoSelecionado = document.getElementById('grupo-selecionado');
                const grupoInput = document.getElementById('grupo_whatsapp');
                const searchInput = document.getElementById('grupo_whatsapp_search');
                
                // Atualizar input hidden com o ID do owner
                grupoInput.value = item.dataset.owner;
                
                // Atualizar visual do grupo selecionado
                document.getElementById('grupo-foto').src = item.dataset.photo;
                document.getElementById('grupo-nome').textContent = item.dataset.name;
                document.getElementById('grupo-membros').textContent = `${item.dataset.size} membros`;
                
                // Mostrar card do grupo selecionado
                grupoSelecionado.classList.remove('hidden');
                
                // Limpar e fechar busca
                searchInput.value = '';
                gruposList.classList.add('hidden');
            });
        });
    }
}

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
