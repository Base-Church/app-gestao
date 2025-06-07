import { MusicasAPI } from './api.js';

export class MusicasApp {
    constructor() {
        this.api = new MusicasAPI();
        this.currentPage = 1;
        this.searchTimeout = null;
        this.currentItem = null;
        this.modal = document.getElementById('modal');
        this.form = document.getElementById('repertorio-form');
        this.allMusicas = []; // Nova propriedade para armazenar todas as músicas
        
        this.init();
        
        // Adiciona listener para o formulário
        this.form?.addEventListener('submit', this.handleSubmit.bind(this));
    }

    init() {
        // Inicializa os elementos
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.errorContainer = document.getElementById('error-container');
        this.emptyState = document.getElementById('empty-state');
        this.musicasGrid = document.getElementById('musicas-grid');
        this.musicasList = document.getElementById('musicas-list');
        this.searchInput = document.getElementById('search-input');

        // Configura os event listeners
        this.searchInput?.addEventListener('input', this.handleSearch.bind(this));

        // Carrega os dados iniciais
        this.loadMusicas();
    }

    handleSearch(event) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            const searchTerm = event.target.value.toLowerCase().trim();
            this.filtrarMusicasLocal(searchTerm);
        }, 300);
    }

    filtrarMusicasLocal(termoBusca) {
        if (!termoBusca) {
            // Se não houver termo de busca, mostrar todas as músicas
            this.renderMusicas({ 
                data: this.allMusicas,
                meta: { total: this.allMusicas.length }
            });
            return;
        }

        // Filtra as músicas localmente
        const musicasFiltradas = this.allMusicas.filter(musica => {
            const nome = (musica.nome_musica || '').toLowerCase();
            const artista = (musica.artista_banda || '').toLowerCase();
            return nome.includes(termoBusca) || artista.includes(termoBusca);
        });

        // Renderiza os resultados filtrados
        this.renderMusicas({
            data: musicasFiltradas,
            meta: { total: musicasFiltradas.length }
        });
    }

    async loadMusicas() {
        try {
            this.showLoading();
            const data = await this.api.list(this.currentPage, 1000); // Carregar mais itens
            this.allMusicas = data.data || []; // Armazena todas as músicas
            this.renderMusicas(data);
            this.updateMusicCount(data.meta.total);
        } catch (error) {
            this.showError(error.message);
        }
    }

    updateMusicCount(total) {
        const countElement = document.getElementById('music-count');
        if (countElement) {
            countElement.textContent = total;
        }
    }

    showLoading() {
        this.loadingIndicator.classList.remove('hidden');
        this.errorContainer.classList.add('hidden');
        this.emptyState.classList.add('hidden');
        this.musicasGrid.classList.add('hidden');
    }

    showError(message) {
        this.loadingIndicator.classList.add('hidden');
        this.errorContainer.classList.remove('hidden');
        this.emptyState.classList.add('hidden');
        this.musicasGrid.classList.add('hidden');
        document.getElementById('error-message').textContent = message;
    }

    getYoutubeId(url) {
        if (!url) return null;
        
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        
        return (match && match[2].length === 11) ? match[2] : null;
    }

    toggleModal(show, item = null) {
        this.currentItem = item;
        if (!this.modal) {
            console.error('Modal element not found');
            return;
        }
        
        this.modal.classList.toggle('hidden', !show);
        
        if (show) {
            if (item) {
                // Modo edição
                this.form.nome_musica.value = item.nome_musica || '';
                this.form.artista_banda.value = item.artista_banda || '';
                this.form.url.value = item.url || '';
                // Aguarda o DOM ser atualizado antes de inicializar o preview
                setTimeout(() => this.previewVideo(item.url), 100);
            } else {
                // Modo criação
                this.form.reset();
                this.previewVideo('');
            }
        } else {
            // Limpa o player ao fechar o modal
            if (this.player) {
                this.player.destroy();
                this.player = null;
            }
        }
    }

    previewVideo(url) {
        const previewContainer = document.getElementById('video-preview');
        if (!previewContainer) return;

        const youtubeId = this.getYoutubeId(url);
        
        if (youtubeId) {
            previewContainer.innerHTML = `
                <iframe 
                    class="w-full h-full rounded-lg"
                    src="https://www.youtube.com/embed/${youtubeId}"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
                </iframe>
            `;
        } else {
            previewContainer.innerHTML = `
                <div class="w-full h-full flex items-center justify-center">
                    <svg class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            `;
        }
    }

    initYouTubePlayer(videoId) {
        // Carrega a API do YouTube se ainda não estiver carregada
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = () => {
                this.createPlayer(videoId);
            };
        } else {
            this.createPlayer(videoId);
        }
    }

    createPlayer(videoId) {
        this.player = new YT.Player('youtube-player', {
            videoId: videoId,
            events: {
                onStateChange: (event) => {
                    const playPauseIcon = document.getElementById('play-pause-icon');
                    if (event.data === YT.PlayerState.PLAYING) {
                        playPauseIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
                    } else if (event.data === YT.PlayerState.PAUSED) {
                        playPauseIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
                    }
                }
            }
        });

        // Atualiza a barra de progresso
        setInterval(() => {
            if (this.player && this.player.getCurrentTime) {
                const progress = (this.player.getCurrentTime() / this.player.getDuration()) * 100;
                document.getElementById('progress-bar').style.width = `${progress}%`;
            }
        }, 1000);
    }

    toggleVideoPlay() {
        if (!this.player) return;
        
        const state = this.player.getPlayerState();
        if (state === YT.PlayerState.PLAYING) {
            this.player.pauseVideo();
        } else {
            this.player.playVideo();
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        const formData = {
            nome_musica: this.form.nome_musica.value.trim(),
            artista_banda: this.form.artista_banda.value.trim() || null,
            url: this.form.url.value.trim() || null
        };

        // Validação apenas do nome
        if (!formData.nome_musica) {
            this.showError('Nome da música é obrigatório');
            return;
        }

        try {
            if (this.currentItem?.id_musica) {
                await this.api.update(this.currentItem.id_musica, formData);
            } else {
                await this.api.create(formData);
            }
            
            this.toggleModal(false);
            this.loadMusicas(); // Corrigido para M maiúsculo
        } catch (error) {
            this.showError(error.message);
        }
    }

    renderMusicas(data) { // Corrigido para M maiúsculo
        this.loadingIndicator.classList.add('hidden');
        this.errorContainer.classList.add('hidden');

        if (!data.data || data.data.length === 0) {
            this.emptyState.classList.remove('hidden');
            this.musicasGrid.classList.add('hidden');
            return;
        }

        this.emptyState.classList.add('hidden');
        this.musicasGrid.classList.remove('hidden');
        
        this.musicasList.innerHTML = data.data.map(musica => {
            const youtubeId = this.getYoutubeId(musica.url);
            const thumbnailUrl = youtubeId ? 
                `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg` : 
                `${window.APP_CONFIG.baseUrl}/assets/img/placeholder-music.jpg`;

            return `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 h-16 w-24 bg-gray-100 rounded-lg overflow-hidden relative group">
                                <img src="${thumbnailUrl}" 
                                     alt="Thumbnail" 
                                     class="h-16 w-24 object-cover"
                                     onerror="this.src='${window.APP_CONFIG.baseUrl}/assets/img/placeholder.jpg'">
                                ${youtubeId ? `
                                <div class="youtube-thumbnail absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer" data-url="${musica.url}">
                                    <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z"/>
                                    </svg>
                                </div>` : ''}
                            </div>
                            <div class="ml-4">
                                <div class="text-sm font-medium text-gray-900 dark:text-white">
                                    ${musica.nome_musica}
                                </div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        ${musica.artista_banda}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        ${youtubeId ? `
                        <a href="${musica.url}" 
                           target="_blank" 
                           class="text-primary-600 hover:text-primary-700 flex items-center">
                            <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M21.582 7.15c-.239-2.012-.978-3.707-2.992-3.947C16.309 3 12 3 12 3s-4.309 0-6.59.203c-2.014.24-2.753 1.935-2.992 3.947C2.212 9.446 2 11.958 2 12c0 .042.212 2.554.418 4.85.239 2.012.978 3.707 2.992 3.947C7.691 21 12 21 12 21s4.309 0 6.59-.203c2.014-.24 2.753-1.935 2.992-3.947.206-2.296.418-4.808.418-4.85 0-.042-.212-2.554-.418-4.85zM10 15V9l5.25 3-5.25 3z"/>
                            </svg>
                            Ver no YouTube
                        </a>
                        ` : ''}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onclick='window.app.toggleModal(true, ${JSON.stringify(musica).replace(/'/g, "&apos;")})' 
                                class="text-primary-600 hover:text-primary-900 mr-3">
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button onclick="window.app.deletarRepertorio(${musica.id_musica})"
                                class="text-red-600 hover:text-red-900">
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        this.setupThumbnailListeners();
    }

    setupThumbnailListeners() {
        const thumbnails = document.querySelectorAll('#musicas-list .group');  // Especifica o contexto
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation(); // Impede propagação do evento
                
                const link = thumbnail.querySelector('a');
                if (!link) return;

                const url = link.getAttribute('href');
                const youtubeId = this.getYoutubeId(url);
                if (!youtubeId) return;

                this.createVideoModal(youtubeId);
            });
        });
    }

    createVideoModal(youtubeId) {
        const playerModal = document.createElement('div');
        playerModal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
        playerModal.setAttribute('data-modal-type', 'youtube-player'); // Adiciona identificador
        playerModal.innerHTML = `
            <div class="absolute inset-0 bg-black bg-opacity-75" onclick="this.closest('[data-modal-type=youtube-player]').remove()"></div>
            <div class="relative w-full max-w-4xl aspect-video">
                <div class="absolute top-4 right-4 z-10">
                    <button onclick="this.closest('[data-modal-type=youtube-player]').remove()" class="text-white hover:text-gray-300">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <iframe 
                    class="w-full h-full rounded-lg"
                    src="https://www.youtube.com/embed/${youtubeId}?autoplay=1"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
                </iframe>
            </div>
        `;
        document.body.appendChild(playerModal);
    }

    async deletarRepertorio(id) {
        if (!confirm('Tem certeza que deseja excluir esta música?')) {
            return;
        }

        try {
            await this.api.delete(id);
            this.loadMusicas(); // Corrigido para M maiúsculo
        } catch (error) {
            this.showError(error.message);
        }
    }
}

window.MusicasApp = MusicasApp;
