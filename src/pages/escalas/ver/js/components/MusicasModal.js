import { ModalBase } from './modules/ModalBase.js';

export class MusicasModal extends ModalBase {
    constructor() {
        super();
        this.modal = this.createModal();
        this.bindEvents();
    }

    bindEvents() {
        super.bindCloseEvents();

        // Limpar conteúdo quando o modal for fechado
        this.modal.querySelector('.close-modal').addEventListener('click', () => {
            const container = this.modal.querySelector('#musicas-container');
            container.innerHTML = `
                <div class="animate-pulse flex justify-center py-12">
                    <div class="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            `;
        });
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 hidden';
        modal.innerHTML = `
            <div class="absolute inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm"></div>
            <div class="absolute inset-0 flex items-center justify-center p-4">
                <div class="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-xl shadow-xl">
                    <div class="p-4 border-b border-gray-200 dark:border-zinc-800">
                        <div class="flex items-center justify-between mb-2">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Músicas do Repertório</h3>
                            <button class="close-modal p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                        <div id="event-info" class="text-sm text-gray-600 dark:text-gray-400"></div>
                    </div>
                    <div class="p-4 max-h-[70vh] overflow-y-auto" id="musicas-container">
                        <div class="animate-pulse flex justify-center py-12">
                            <div class="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }

    async loadMusicas(musicasIds) {
        const container = this.modal.querySelector('#musicas-container');
        
        try {
            const musicas = await Promise.all(
                musicasIds.map(async (id) => {
                    const response = await fetch(`${window.ENV.URL_BASE}/src/services/api/musicas/get_id.php?id=${id}`);
                    if (!response.ok) throw new Error('Erro ao carregar música');
                    return response.json();
                })
            );

            container.innerHTML = `
                <div class="space-y-4">
                    ${musicas.map(result => {
                        if (result.code !== 200) return '';
                        const musica = result.data;
                        const thumbnailUrl = musica.url ? this.getYouTubeThumbnail(musica.url) : null;
                        
                        return `
                            <div class="bg-gray-50 dark:bg-zinc-800/50 rounded-lg overflow-hidden">
                                <div class="flex gap-4 p-3">
                                    <div class="w-40 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-zinc-700">
                                        ${thumbnailUrl ? `
                                            <img src="${thumbnailUrl}" 
                                                 alt="${musica.nome_musica}" 
                                                 class="w-full h-full object-cover">
                                        ` : `
                                            <div class="w-full h-full flex items-center justify-center">
                                                <svg class="w-12 h-12 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                                                </svg>
                                            </div>
                                        `}
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <h4 class="font-medium text-gray-900 dark:text-white truncate">
                                            ${musica.nome_musica}
                                        </h4>
                                        ${musica.artista_banda ? `
                                            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                                                ${musica.artista_banda}
                                            </p>
                                        ` : ''}
                                        ${musica.url ? `
                                            <a href="${musica.url}" 
                                               target="_blank"
                                               class="inline-flex items-center gap-1 mt-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                                                </svg>
                                                Ver no YouTube
                                            </a>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        } catch (error) {
            container.innerHTML = `
                <div class="text-center py-8 text-red-500 dark:text-red-400">
                    Erro ao carregar músicas: ${error.message}
                </div>
            `;
        }
    }

    getYouTubeThumbnail(url) {
        if (!url) return null;
        
        const videoId = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/);
        return videoId ? `https://img.youtube.com/vi/${videoId[1]}/hqdefault.jpg` : null;
    }

    show(musicasIds, eventoInfo = null) {
        console.log('MusicasModal.show - IDs recebidos:', musicasIds);
        
        // Garantir que musicasIds é um array e tem elementos
        const ids = Array.isArray(musicasIds) ? musicasIds : [];
        
        if (ids.length === 0) {
            console.error('Nenhuma música encontrada para este evento');
            return;
        }

        // Mostrar loading antes de carregar novo conteúdo
        const container = this.modal.querySelector('#musicas-container');
        container.innerHTML = `
            <div class="animate-pulse flex justify-center py-12">
                <div class="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        `;
        
        // Atualizar informações do evento se fornecidas
        if (eventoInfo) {
            const eventInfoEl = this.modal.querySelector('#event-info');
            eventInfoEl.innerHTML = `
                <div class="flex items-center gap-2">
                    <span class="font-medium">${eventoInfo.nome}</span>
                    <span>·</span>
                    <span>${eventoInfo.data} às ${eventoInfo.hora}</span>
                </div>
            `;
        }

        // Mostrar modal e carregar novo conteúdo
        this.modal.classList.remove('hidden');
        this.loadMusicas(ids);
    }
}
