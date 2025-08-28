import { API } from './api.js';
import { UI } from './ui.js';
import { DragDrop } from './dragdrop.js';

class CriarModelo {
    constructor() {
        const baseUrl = window.APP_CONFIG.baseUrl;
        if (!baseUrl) console.warn('Base URL não encontrada');

        this.api = new API(baseUrl);
        this.ui = new UI();
        this.dragDrop = new DragDrop();

        this.init();
    }

    async init() {
        await this.carregarDados();
        this.setupEventListeners();
    }

    async carregarDados() {
        try {
            const ministerio_id = window.USER.ministerio_atual;
            const [categoriasResponse, atividadesResponse] = await Promise.all([
                this.api.getCategorias(ministerio_id),
                this.api.getAtividades(ministerio_id)
            ]);

            this.ui.renderAtividadesPorCategoria(
                categoriasResponse.data,
                atividadesResponse.data
            );
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    }

    setupEventListeners() {
        document.getElementById('salvarModelo').addEventListener('click', () => this.salvarModelo());
    }

    async salvarModelo() {
        const btnSalvar = document.getElementById('salvarModelo');
        const btnOriginalContent = btnSalvar.innerHTML; // Armazena o conteúdo original do botão

        try {
            const nome = document.getElementById('nomeModelo').value;
            if (!nome) {
                alert('Digite um nome para o modelo');
                return;
            }

            const atividades = Array.from(document.querySelectorAll('#modeloContainer .draggable'))
                .map(el => parseInt(el.dataset.id));

            if (atividades.length === 0) {
                alert('Adicione pelo menos uma atividade ao modelo');
                return;
            }

            // Mostra o spinner
            btnSalvar.disabled = true;
            btnSalvar.innerHTML = `
                <div class="inline-flex items-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Salvando...
                </div>
            `;

            const dados = {
                nome,
                atividades,
                ministerio_id: window.USER.ministerio_atual,
                organizacao_id: window.USER.organizacao_id
            };

            const response = await this.api.salvarModelo(dados);
            
            // Verifica se a resposta indica sucesso (código 200 ou 201)
            if (response.code === 200 || response.code === 201) {
                // Redireciona para a página de listagem
                window.location.href = `${window.location.origin}${window.location.pathname.split('/criar.php')[0]}`;
                return; // Importante para evitar a execução do código abaixo
            } else {
                throw new Error(response.message || 'Erro ao salvar modelo');
            }
        } catch (error) {
            console.error('Erro ao salvar modelo:', error);
            // Só mostra alerta se for realmente um erro, não quando for mensagem de sucesso
            if (!error.message.includes('sucesso')) {
                alert(error.message || 'Erro ao salvar modelo');
            }
        } finally {
            // Restaura o botão independente do resultado
            if (btnSalvar) {
                btnSalvar.disabled = false;
                btnSalvar.innerHTML = btnOriginalContent;
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new CriarModelo());
