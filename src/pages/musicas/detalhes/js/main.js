import MusicaDetalhesAPI from './api.js';

class MusicaDetalhesPage {
    constructor() {
        this.musica = null;
        this.musicaId = window.MUSICA_ID;
        this.activeFormat = null;
        this.syncTimeout = null;
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
        const form = document.getElementById('musica-form');
        
        loading.classList.remove('hidden');
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
        
        const letra = this.musica.letra || '';
        this.loadLetraToEditor(letra);
        
        this.updateYoutubePreview();
        document.getElementById('musica-form').classList.remove('hidden');
    }

    loadLetraToEditor(markdownText) {
        const editor = document.getElementById('letra-editor');
        const hiddenField = document.getElementById('letra-hidden');
        
        hiddenField.value = markdownText;
        editor.innerHTML = this.markdownToHtml(markdownText);
    }

    markdownToHtml(text) {
        if (!text) return '';
        
        let html = text;
        
        // Converte tags markdown para spans HTML
        html = html.replace(/\[BACKING\](.*?)\[\/BACKING\]/gs, '<span class="tag-backing">$1</span>');
        html = html.replace(/\[MINISTRO\](.*?)\[\/MINISTRO\]/gs, '<span class="tag-ministro">$1</span>');
        html = html.replace(/\[TODOS\](.*?)\[\/TODOS\]/gs, '<span class="tag-todos">$1</span>');
        
        return html;
    }

    htmlToMarkdown(html) {
        if (!html) return '';
        
        let markdown = html;
        
        // Converte spans para markdown
        markdown = markdown.replace(/<span class="tag-backing">(.*?)<\/span>/gs, '[BACKING]$1[/BACKING]');
        markdown = markdown.replace(/<span class="tag-ministro">(.*?)<\/span>/gs, '[MINISTRO]$1[/MINISTRO]');
        markdown = markdown.replace(/<span class="tag-todos">(.*?)<\/span>/gs, '[TODOS]$1[/TODOS]');
        
        // Remove outras tags HTML preservando o conteúdo
        markdown = markdown.replace(/<[^>]*>/g, '');
        
        return markdown;
    }

    setupEventListeners() {
        document.getElementById('url').addEventListener('input', () => {
            this.updateYoutubePreview();
        });

        document.getElementById('form-musica').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit();
        });

        // Sincronização com debounce para não perder alterações
        document.getElementById('letra-editor').addEventListener('input', () => {
            this.debouncedSync();
        });

        // Sincronização imediata em eventos importantes
        document.getElementById('letra-editor').addEventListener('blur', () => {
            this.syncHiddenField();
        });

        document.querySelectorAll('.format-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleFormatClick(btn);
            });
        });
    }

    debouncedSync() {
        if (this.syncTimeout) {
            clearTimeout(this.syncTimeout);
        }
        this.syncTimeout = setTimeout(() => {
            this.syncHiddenField();
        }, 100);
    }

    handleFormatClick(btn) {
        const formatType = btn.dataset.color;
        
        document.querySelectorAll('.format-btn').forEach(b => {
            b.classList.remove('ring-2', 'ring-offset-2');
        });
        
        if (formatType === 'none') {
            this.activeFormat = null;
            this.clearSelectedText();
        } else {
            this.activeFormat = formatType;
            btn.classList.add('ring-2', 'ring-offset-2');
            this.applyFormatToSelection();
        }
    }

    applyFormatToSelection() {
        const selection = window.getSelection();
        if (!selection.rangeCount || selection.isCollapsed) return;
        
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        if (!selectedText) return;
        
        // Verifica se a seleção já está dentro de um span formatado
        const parentElement = range.commonAncestorContainer.nodeType === Node.TEXT_NODE 
            ? range.commonAncestorContainer.parentElement 
            : range.commonAncestorContainer;
        
        const existingSpan = parentElement.closest('span[class^="tag-"]');
        
        if (existingSpan) {
            // Se já tem formatação, substitui pela nova
            const newSpan = document.createElement('span');
            newSpan.className = `tag-${this.activeFormat}`;
            newSpan.textContent = selectedText;
            
            range.deleteContents();
            range.insertNode(newSpan);
        } else {
            // Se não tem formatação, aplica nova
            const span = document.createElement('span');
            span.className = `tag-${this.activeFormat}`;
            span.textContent = selectedText;
            
            range.deleteContents();
            range.insertNode(span);
        }
        
        selection.removeAllRanges();
        this.syncHiddenField();
        
        document.querySelectorAll('.format-btn').forEach(b => {
            b.classList.remove('ring-2', 'ring-offset-2');
        });
        this.activeFormat = null;
    }

    clearSelectedText() {
        const selection = window.getSelection();
        if (!selection.rangeCount || selection.isCollapsed) return;
        
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        if (!selectedText) return;
        
        // Verifica se a seleção está dentro de um span formatado
        const parentElement = range.commonAncestorContainer.nodeType === Node.TEXT_NODE 
            ? range.commonAncestorContainer.parentElement 
            : range.commonAncestorContainer;
        
        const existingSpan = parentElement.closest('span[class^="tag-"]');
        
        if (existingSpan) {
            // Se está dentro de um span, remove a formatação apenas do texto selecionado
            const spanText = existingSpan.textContent;
            const beforeText = spanText.substring(0, spanText.indexOf(selectedText));
            const afterText = spanText.substring(spanText.indexOf(selectedText) + selectedText.length);
            
            const fragment = document.createDocumentFragment();
            
            // Adiciona texto antes (se houver) com formatação
            if (beforeText) {
                const beforeSpan = document.createElement('span');
                beforeSpan.className = existingSpan.className;
                beforeSpan.textContent = beforeText;
                fragment.appendChild(beforeSpan);
            }
            
            // Adiciona texto selecionado sem formatação
            const textNode = document.createTextNode(selectedText);
            fragment.appendChild(textNode);
            
            // Adiciona texto depois (se houver) com formatação
            if (afterText) {
                const afterSpan = document.createElement('span');
                afterSpan.className = existingSpan.className;
                afterSpan.textContent = afterText;
                fragment.appendChild(afterSpan);
            }
            
            existingSpan.parentNode.replaceChild(fragment, existingSpan);
        } else {
            // Se não está em span, apenas mantém como texto normal
            const textNode = document.createTextNode(selectedText);
            range.deleteContents();
            range.insertNode(textNode);
        }
        
        selection.removeAllRanges();
        this.syncHiddenField();
    }

    syncHiddenField() {
        const editor = document.getElementById('letra-editor');
        const hiddenField = document.getElementById('letra-hidden');
        
        if (!editor || !hiddenField) return;
        
        try {
            const currentHtml = editor.innerHTML;
            const markdown = this.htmlToMarkdown(currentHtml);
            hiddenField.value = markdown;
        } catch (error) {
            console.error('Erro na sincronização:', error);
        }
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

            // Força sincronização final antes de salvar
            this.syncHiddenField();
            
            // Aguarda um pouco para garantir que a sincronização foi processada
            await new Promise(resolve => setTimeout(resolve, 50));

            const formData = {
                nome_musica: document.getElementById('nome_musica').value.trim(),
                artista_banda: document.getElementById('artista_banda').value.trim(),
                url: document.getElementById('url').value.trim(),
                letra: document.getElementById('letra-hidden').value
            };

            if (!formData.nome_musica) {
                throw new Error('Nome da música é obrigatório');
            }
            if (!formData.artista_banda) {
                throw new Error('Artista/Banda é obrigatório');
            }

            await MusicaDetalhesAPI.updateMusica(this.musicaId, formData);
            this.showSuccess('Música atualizada com sucesso!');

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
        
        setTimeout(() => {
            error.classList.add('hidden');
        }, 5000);
    }

    showSuccess(msg) {
        const success = document.getElementById('success-container');
        const successMessage = document.getElementById('success-message');
        const error = document.getElementById('error-container');
        
        successMessage.textContent = msg;
        success.classList.remove('hidden');
        error.classList.add('hidden');
        
        setTimeout(() => {
            success.classList.add('hidden');
        }, 3000);
    }
}

window.addEventListener('load', () => {
    window.musicaDetalhesApp = new MusicaDetalhesPage();
}); 