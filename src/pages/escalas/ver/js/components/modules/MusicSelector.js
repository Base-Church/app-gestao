import { MusicasService } from '../../services/MusicasService.js';

export class MusicSelector {
    constructor() {
        this.allMusicas = []; // Lista completa de músicas
        this.filteredMusicas = []; // Lista filtrada para exibição
        this.isLoading = false;
        this.initialized = false;
        this.selectedMusicas = new Map(); // Armazenar músicas com seus metadados
    }

    async initialize() {
        if (this.initialized) return;

        try {
            this.isLoading = true;
            const result = await MusicasService.searchMusicas('', 1, 100); // Carrega todas as músicas
            this.allMusicas = result.data;
            this.filteredMusicas = [...this.allMusicas];
            this.initialized = true;
            this.isLoading = false;
        } catch (error) {
            console.error('Erro ao carregar músicas:', error);
            this.isLoading = false;
        }
    }

    filterMusicas(query) {
        if (!query.trim()) {
            this.filteredMusicas = [...this.allMusicas];
        } else {
            const searchTerm = query.toLowerCase().trim();
            this.filteredMusicas = this.allMusicas.filter(musica => {
                const nome = musica.nome_musica?.toLowerCase() || '';
                const artista = musica.artista_banda?.toLowerCase() || '';
                return nome.includes(searchTerm) || artista.includes(searchTerm);
            });
        }
        this.updateSuggestions();
    }

    createUI() {
        return `
            <div id="musicas-step" class="flex-1 overflow-y-auto p-4 hidden">
                <div class="space-y-4">
                    ${this.createMusicItem()}
                    
                    <button id="add-song-button" class="w-full p-3 border-2 border-dashed rounded-lg text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300">
                        + Adicionar música
                    </button>
                </div>
            </div>
        `;
    }

    createMusicItem() {
        return `
            <div class="musica-item p-4 border rounded-lg border-gray-200 dark:border-zinc-800">
                <div class="space-y-4">
                    <div class="relative">
                        <!-- Campo de busca / Card da música selecionada -->
                        <div class="search-input-container">
                            <div class="flex flex-col gap-2">
                                <input type="text" 
                                       placeholder="Nome da música" 
                                       class="w-full p-3 border rounded-lg bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white">
                                <!-- Campo URL só aparece para músicas novas -->
                                <input type="text" 
                                       placeholder="URL do YouTube" 
                                       class="manual-url w-full p-3 border rounded-lg bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white">
                            </div>
                        </div>

                        <!-- Card da música selecionada da API -->
                        <div class="selected-song hidden">
                            <div class="flex items-center gap-3 p-3 border rounded-lg bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700">
                                <div class="w-16 h-16 rounded-lg bg-gray-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0">
                                    <img src="" alt="" class="w-full h-full object-cover">
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h4 class="font-medium text-gray-900 dark:text-white truncate"></h4>
                                    <p class="text-sm text-gray-500 dark:text-gray-400"></p>
                                </div>
                                <button class="unselect-song p-1 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded">
                                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!-- Lista de sugestões flutuante -->
                        <div class="suggestions hidden absolute left-0 right-0 mt-2 border rounded-lg bg-white dark:bg-zinc-900 shadow-lg max-h-[300px] overflow-y-auto z-10">
                            <div class="sticky top-0 flex items-center justify-between p-2 border-b bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                                <h4 class="font-medium text-gray-900 dark:text-white">Selecione uma música</h4>
                                <button class="close-suggestions p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            </div>
                            <div class="p-2 grid gap-2 suggestions-container"></div>
                        </div>
                    </div>
                    
                    <button class="text-red-500 hover:text-red-600 text-sm">Remover</button>
                </div>
            </div>
        `;
    }

    renderSuggestions() {
        if (this.isLoading) {
            return this.renderLoadingState();
        }

        if (this.filteredMusicas.length === 0) {
            return `
                <div class="p-4 text-center text-gray-500 dark:text-gray-400">
                    Nenhuma música encontrada
                </div>
            `;
        }

        return this.filteredMusicas.map(musica => `
            <div class="p-2 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg cursor-pointer song-suggestion border border-gray-200 dark:border-zinc-800" 
                 data-song-id="${musica.id_musica || musica.id}" 
                 data-url="${musica.url}"
                 data-nome="${musica.nome_musica}"
                 data-artista="${musica.artista_banda}">
                <div class="flex items-center gap-3">
                    <div class="w-16 h-16 rounded-lg bg-gray-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0">
                        <img src="${MusicasService.getYouTubeThumbnail(musica.url) || `${window.ENV.URL_BASE}/assets/img/placeholder.jpg`}" 
                             alt="${musica.nome_musica}"
                             class="w-full h-full object-cover">
                    </div>
                    <div class="flex-1 min-w-0">
                        <h4 class="font-medium text-gray-900 dark:text-white truncate">
                            ${musica.nome_musica}
                        </h4>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            ${musica.artista_banda}
                        </p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async searchMusicas(query) {
        try {
            this.isLoading = true;
            this.updateSuggestions();

            const result = await MusicasService.searchMusicas(query);
            this.musicas = result.data;
            
            this.isLoading = false;
            this.updateSuggestions();
        } catch (error) {
            console.error('Erro ao buscar músicas:', error);
            this.isLoading = false;
            this.updateSuggestions();
        }
    }

    updateSuggestions() {
        const containers = document.querySelectorAll('.musica-item .suggestions .suggestions-container');
        containers.forEach(container => {
            if (container) {
                container.innerHTML = this.renderSuggestions();
            }
        });
    }

    bindEvents(container) {
        console.log('Binding music events to container:', container);
        this.initialize().then(() => {
            this.updateSuggestions();
            
            // Bind events para o botão de adicionar música
            const addButton = container.querySelector('#add-song-button');
            const musicList = container.querySelector('.space-y-4');

            addButton?.addEventListener('click', () => {
                const newItem = document.createElement('div');
                newItem.innerHTML = this.createMusicItem();
                const actualItem = newItem.firstElementChild;
                
                // Insere antes do botão de adicionar
                musicList.insertBefore(actualItem, addButton);
                
                // Bind events no novo item
                this.bindMusicItemEvents(actualItem);
            });

            // Bind events nos itens existentes
            container.querySelectorAll('.musica-item').forEach(item => {
                this.bindMusicItemEvents(item);
            });
        });
    }

    bindMusicItemEvents(item) {
        const searchContainer = item.querySelector('.search-input-container');
        const selectedSong = item.querySelector('.selected-song');
        const nameInput = searchContainer.querySelector('input[placeholder="Nome da música"]');
        const urlInput = searchContainer.querySelector('.manual-url');
        const suggestions = item.querySelector('.suggestions');
        const suggestionsContainer = suggestions.querySelector('.suggestions-container');
        const removeButton = item.querySelector('button.text-red-500'); // Modificado: seletor mais específico

        // Mostrar sugestões ao focar
        nameInput?.addEventListener('focus', () => {
            suggestions?.classList.remove('hidden');
            this.updateSuggestions();
        });

        // Filtrar músicas ao digitar
        nameInput?.addEventListener('input', (e) => {
            suggestions?.classList.remove('hidden');
            this.filterMusicas(e.target.value);
        });

        // Seleção de música da API
        suggestionsContainer?.addEventListener('click', (e) => {
            const songItem = e.target.closest('.song-suggestion');
            if (!songItem) return;

            const songId = songItem.dataset.songId;
            console.log('Música selecionada ID:', songId); // Debug

            const songData = {
                id_musica: parseInt(songId), // Convertendo para número
                nome_musica: songItem.dataset.nome,
                url: songItem.dataset.url
            };

            // Armazena a música selecionada com ID único do elemento
            const musicItemId = Date.now();
            item.dataset.musicItemId = musicItemId;
            this.selectedMusicas.set(musicItemId, songData);
            
            // Atualizar card
            const img = selectedSong.querySelector('img');
            const title = selectedSong.querySelector('h4');
            const artist = selectedSong.querySelector('p');

            img.src = MusicasService.getYouTubeThumbnail(songData.url) || `${window.ENV.URL_BASE}/assets/img/placeholder.jpg`;
            img.alt = songData.nome_musica;
            title.textContent = songData.nome_musica;
            artist.textContent = songData.artista_banda;

            // Esconder inputs e mostrar card
            searchContainer.classList.add('hidden');
            selectedSong.classList.remove('hidden');
            suggestions.classList.add('hidden');
        });

        // Para músicas inseridas manualmente
        nameInput?.addEventListener('change', () => {
            if (!selectedSong.classList.contains('hidden') || !nameInput.value.trim()) return;
            
            const musicItemId = item.dataset.musicItemId || Date.now();
            item.dataset.musicItemId = musicItemId;
            
            this.selectedMusicas.set(musicItemId, {
                id_musica: null,
                nome_musica: nameInput.value.trim(),
                url: urlInput.value.trim() || '',
                artista_banda: '' // Adicionado campo obrigatório
            });
        });

        urlInput?.addEventListener('change', () => {
            if (!selectedSong.classList.contains('hidden') || !nameInput.value.trim()) return;
            
            const musicItemId = item.dataset.musicItemId || Date.now();
            item.dataset.musicItemId = musicItemId;
            
            this.selectedMusicas.set(musicItemId, {
                id_musica: null,
                nome_musica: nameInput.value.trim(),
                url: urlInput.value.trim(),
                artista_banda: '' // Adicionado campo obrigatório
            });
        });

        // Botão de remover seleção
        selectedSong.querySelector('.unselect-song')?.addEventListener('click', () => {
            searchContainer.classList.remove('hidden');
            selectedSong.classList.add('hidden');
            nameInput.value = '';
            urlInput.value = '';
            nameInput.focus();
        });

        // Fechar sugestões
        suggestions.querySelector('.close-suggestions')?.addEventListener('click', () => {
            suggestions.classList.add('hidden');
        });

        // Remover grupo inteiro - Corrigido
        if (removeButton) {
            removeButton.addEventListener('click', (e) => {
                e.preventDefault();
                const musicaItem = e.target.closest('.musica-item');
                if (musicaItem) {
                    const musicItemId = musicaItem.dataset.musicItemId;
                    if (musicItemId) {
                        this.selectedMusicas.delete(parseInt(musicItemId));
                    }
                    musicaItem.remove();
                }
            });
        }

        // Fechar ao clicar fora
        document.addEventListener('click', (e) => {
            if (!item.contains(e.target)) {
                suggestions?.classList.add('hidden');
            }
        });
    }

    renderLoadingState() {
        return `
            <div class="p-4 text-center text-gray-500 dark:text-gray-400">
                <div class="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent rounded-full"></div>
                <p class="mt-2">Buscando músicas...</p>
            </div>
        `;
    }

    renderErrorState() {
        return `
            <div class="p-4 text-center text-red-500 dark:text-red-400">
                Erro ao buscar músicas. Tente novamente.
            </div>
        `;
    }

    // Adicionar novo método para debug
    initializeMusicItem(item) {
        console.log('Initializing music item:', item); // Debug
        this.bindMusicItemEvents(item);
    }

    // Novo método para obter músicas selecionadas
    getSelectedMusicas() {
        // Filtra músicas vazias antes de retornar
        return Array.from(this.selectedMusicas.values())
            .filter(musica => {
                return musica.id_musica || (musica.nome_musica.trim() && musica.url.trim());
            });
    }
}
