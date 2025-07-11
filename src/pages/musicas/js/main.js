import MusicasAPI from './api.js';

class MusicasPage {
    constructor() {
        this.musicas = {};
        this.meta = {};
        this.init();
    }

    async init() {
        try {
            await this.loadMusicas();
        } catch (e) {
            this.showError(e.message);
        }
    }

    async loadMusicas() {
        const loading = document.getElementById('loading-indicator');
        const error = document.getElementById('error-container');
        const grid = document.getElementById('musicas-grid');
        loading.classList.remove('hidden');
        error.classList.add('hidden');
        grid.classList.add('hidden');
        try {
            const data = await MusicasAPI.getMusicas();
            this.musicas = data.data || [];
            this.meta = data.meta || {};
            this.renderMusicas();
        } catch (err) {
            this.showError(err.message);
        } finally {
            loading.classList.add('hidden');
        }
    }

    renderSection(title, list, destaque = false) {
        if (!list || !list.length) return '';
        
        return `
            <div class="mb-8">
                <h2 class="text-lg font-bold ${destaque ? 'text-primary-700 dark:text-primary-300' : 'text-gray-800 dark:text-white'} mb-4">
                    ${title}
                </h2>
                <div class="space-y-3">
                    ${list.map(m => this.renderCard(m, destaque)).join('')}
                </div>
            </div>
        `;
    }

    renderCard(m, destaque = false) {
        const cardClass = destaque 
            ? 'border-2 border-primary-500 bg-primary-50/50 dark:bg-primary-900/20' 
            : 'border border-gray-200 dark:border-gray-700';
        
        // Extrai o ID do vídeo do YouTube da URL
        const getYoutubeThumbnail = (url) => {
            if (!url) return null;
            const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
            return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : null;
        };
        
        const thumbnailUrl = getYoutubeThumbnail(m.url);
        
        return `
            <div class="rounded-lg ${cardClass} overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div class="p-4">
                    <div class="flex items-center gap-4">
                        <div class="flex-shrink-0">
                            ${thumbnailUrl ? `
                                <img src="${thumbnailUrl}" alt="${m.nome_musica}" 
                                     class="w-20 h-12 object-cover rounded-lg">
                            ` : `
                                <div class="w-20 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                    <svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                    </svg>
                                </div>
                            `}
                        </div>
                        <div class="flex-1 min-w-0">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                                ${m.nome_musica || 'Sem título'}
                            </h3>
                            <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                ${m.artista_banda || 'Desconhecido'}
                            </div>
                        </div>
                        <div class="flex-shrink-0 flex gap-2">
                            <a href="${window.APP_CONFIG.baseUrl}/musica?id=${m.id_musica}" 
                               class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                                <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Editar
                            </a>
                            ${m.url ? `
                                <a href="${m.url}" target="_blank" rel="noopener noreferrer" 
                                   class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200">
                                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                    </svg>
                                    Assistir
                                </a>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderMusicas() {
        const grid = document.getElementById('musicas-grid');
        const list = document.getElementById('musicas-list');
        const musicas = this.musicas || [];

        if (!musicas.length) {
            grid.classList.add('hidden');
            document.getElementById('empty-state').classList.remove('hidden');
            return;
        }

        grid.classList.remove('hidden');
        document.getElementById('empty-state').classList.add('hidden');

        list.innerHTML = `
            ${this.renderSection('Repertório de Músicas', musicas, false)}
        `;
    }

    truncateText(text, maxLength) {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    showError(msg) {
        const error = document.getElementById('error-container');
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = msg;
        error.classList.remove('hidden');
    }
}

window.addEventListener('load', () => {
    window.musicasApp = new MusicasPage();
}); 