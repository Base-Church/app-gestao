import MusicaDetalhesAPI from './api.js';

class MusicaDetalhesPage {
    constructor() {
        this.musica = null;
        this.musicaId = window.MUSICA_ID;
        this.init();
    }

    async init() {
        try {
            await this.loadMusica();
            this.setupEventListeners();
        } catch (e) {
            this.showError(e.message);
        }
    }

    async loadMusica() {
        const loading = document.getElementById('loading-indicator');
        const error = document.getElementById('error-container');
        const form = document.getElementById('musica-form');
        
        loading.classList.remove('hidden');
        error.classList.add('hidden');
        form.classList.add('hidden');

        try {
            const data = await MusicaDetalhesAPI.getMusicaById(this.musicaId);
            this.musica = data.data || {};
            this.populateForm();
        } catch (err) {
            this.showError(err.message);
        } finally {
            loading.classList.add('hidden');
        }
    }

    populateForm() {
        if (!this.musica) return;

        document.getElementById('nome_musica').value = this.musica.nome_musica || '';
        document.getElementById('artista_banda').value = this.musica.artista_banda || '';
        document.getElementById('url').value = this.musica.url || '';
        document.getElementById('letra-editor').value = this.musica.letra || '';
        
        this.updateYoutubePreview();
        document.getElementById('musica-form').classList.remove('hidden');
    }

    setupEventListeners() {
        // Preview do YouTube quando URL é alterada
        document.getElementById('url').addEventListener('input', () => {
            this.updateYoutubePreview();
        });

        // Submit do formulário
        document.getElementById('form-musica').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit();
        });

        // Botões de inserção de tags
        document.querySelectorAll('.insert-tag-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.insertTagAtCursor(btn.dataset.tag);
            });
        });
    }

    insertTagAtCursor(tag) {
        const textarea = document.getElementById('letra-editor');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        
        // Insere a tag na posição do cursor
        const newText = text.substring(0, start) + tag + text.substring(end);
        textarea.value = newText;
        
        // Posiciona o cursor após a tag inserida
        const newCursorPos = start + tag.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        
        // Foca no textarea
        textarea.focus();
    }

    



    updateYoutubePreview() {
        const urlInput = document.getElementById('url');
        const preview = document.getElementById('youtube-preview');
        const thumbnail = document.getElementById('youtube-thumbnail');
        
        const url = urlInput.value.trim();
        if (!url) {
            preview.classList.add('hidden');
            return;
        }

        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        if (match) {
            const thumbnailUrl = `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
            thumbnail.src = thumbnailUrl;
            preview.classList.remove('hidden');
        } else {
            preview.classList.add('hidden');
        }
    }

    async handleSubmit() {
        const submitBtn = document.querySelector('#form-musica button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Salvando...';

            const formData = {
                nome_musica: document.getElementById('nome_musica').value.trim(),
                artista_banda: document.getElementById('artista_banda').value.trim(),
                url: document.getElementById('url').value.trim(),
                letra: document.getElementById('letra-editor').value.trim()
            };

            // Validações
            if (!formData.nome_musica) {
                throw new Error('Nome da música é obrigatório');
            }
            if (!formData.artista_banda) {
                throw new Error('Artista/Banda é obrigatório');
            }

            await MusicaDetalhesAPI.updateMusica(this.musicaId, formData);
            this.showSuccess('Música atualizada com sucesso!');
            
            // Atualiza os dados locais
            this.musica = { ...this.musica, ...formData };

        } catch (err) {
            this.showError(err.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    showError(msg) {
        const error = document.getElementById('error-container');
        const errorMessage = document.getElementById('error-message');
        const success = document.getElementById('success-container');
        
        errorMessage.textContent = msg;
        error.classList.remove('hidden');
        success.classList.add('hidden');
    }

    showSuccess(msg) {
        const success = document.getElementById('success-container');
        const successMessage = document.getElementById('success-message');
        const error = document.getElementById('error-container');
        
        successMessage.textContent = msg;
        success.classList.remove('hidden');
        error.classList.add('hidden');
    }
}

window.addEventListener('load', () => {
    window.musicaDetalhesApp = new MusicaDetalhesPage();
}); 