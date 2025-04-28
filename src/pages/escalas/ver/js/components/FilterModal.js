export class FilterModal {
    constructor(escalaData) {
        this.escalaData = escalaData;
        this.selectedVolunteers = new Set();
        this.filteringEvents = false; // Novo estado para controle do filtro de eventos
        this.modal = this.createModal();
        this.volunteers = this.extractVolunteers();
        this.bindEvents();
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 hidden';
        modal.innerHTML = `
            <div class="absolute inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm"></div>
            <div class="absolute inset-0 flex items-center justify-center p-4">
                <div class="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-xl shadow-xl flex flex-col" style="max-height: 85vh">
                    <!-- Header -->
                    <div class="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                            Buscar Voluntário
                        </h3>
                        <button class="close-modal p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <!-- Search Input -->
                    <div class="flex-shrink-0 p-4 border-b border-gray-200 dark:border-zinc-800">
                        <div class="relative">
                            <input type="text" 
                                   id="volunteer-search"
                                   class="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                                   placeholder="Digite o nome do voluntário...">
                            <svg class="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                        </div>
                    </div>

                    <!-- Volunteers List - Scrollable Area -->
                    <div class="flex-1 min-h-0 overflow-y-auto" style="max-height: 400px">
                        <div id="volunteers-list" class="p-4 space-y-2">
                            <!-- Volunteers will be inserted here -->
                        </div>
                    </div>

                    <!-- Filter Actions -->
                    <div class="flex-shrink-0 p-4 border-t border-gray-200 dark:border-zinc-800">
                        <button id="toggle-event-filter" 
                                class="w-full px-4 py-2 text-sm font-medium rounded-lg mb-3 flex items-center justify-center gap-2 transition-colors border">
                            <svg class="w-5 h-5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                            <span>Filtrar eventos por seleção</span>
                            <span class="ml-1 text-xs opacity-75">(desativado)</span>
                        </button>
                    </div>

                    <!-- Footer with Actions -->
                    <div class="flex-shrink-0 flex items-center justify-between gap-3 p-4 border-t border-gray-200 dark:border-zinc-800">
                        <div class="text-sm text-gray-500 dark:text-gray-400">
                            <span id="selected-count">0</span> selecionados
                        </div>
                        <div class="flex gap-3">
                            <button class="close-modal px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg">
                                Cancelar
                            </button>
                            <button id="apply-filter" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
                                Aplicar Filtro
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }

    extractVolunteers() {
        const volunteersMap = new Map();
        
        this.escalaData.data.eventos.forEach(evento => {
            evento.atividades.forEach(atividade => {
                const volunteerId = atividade.voluntario_id;
                
                if (!volunteersMap.has(volunteerId)) {
                    volunteersMap.set(volunteerId, {
                        id: volunteerId,
                        name: atividade.voluntario_nome,
                        photo: atividade.voluntario_foto,
                        atividade: atividade.atividade_nome
                    });
                }
            });
        });

        return Array.from(volunteersMap.values());
    }

    renderVolunteers(volunteers = this.volunteers) {
        const list = this.modal.querySelector('#volunteers-list');
        if (!volunteers || volunteers.length === 0) {
            list.innerHTML = `
                <div class="text-center py-4 text-gray-500 dark:text-gray-400">
                    Nenhum voluntário encontrado
                </div>
            `;
            return;
        }

        list.innerHTML = volunteers.map(volunteer => `
            <div class="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 rounded-lg cursor-pointer"
                 data-volunteer-id="${volunteer.id}">
                <input type="checkbox" 
                       class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                       ${this.selectedVolunteers.has(volunteer.id.toString()) ? 'checked' : ''}>
                <div class="relative flex-shrink-0">
                    <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                        ${volunteer.photo ? `
                            <img src="${volunteer.photo}" 
                                 alt="${volunteer.name}"
                                 class="w-full h-full object-cover"
                                 onerror="this.onerror=null; this.src='${window.ENV.URL_BASE}/assets/img/placeholder.jpg'">
                        ` : `
                            <span class="text-lg font-semibold text-gray-500 dark:text-gray-400">
                                ${volunteer.name.charAt(0)}
                            </span>
                        `}
                    </div>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                        ${volunteer.name}
                    </p>
                </div>
            </div>
        `).join('');
    }

    bindEvents() {
        // Close modal events
        this.modal.querySelectorAll('.close-modal').forEach(button => {
            button.addEventListener('click', () => this.hide());
        });

        // Click outside to close
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.hide();
        });

        // Search input with debounce
        const searchInput = this.modal.querySelector('#volunteer-search');
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const query = e.target.value.toLowerCase().trim();
                const filtered = this.volunteers.filter(v => 
                    v.name.toLowerCase().includes(query) || 
                    (v.atividade && v.atividade.toLowerCase().includes(query))
                );
                this.renderVolunteers(filtered);
            }, 300);
        });

        // Volunteer selection
        this.modal.querySelector('#volunteers-list').addEventListener('click', (e) => {
            const volunteerItem = e.target.closest('[data-volunteer-id]');
            if (volunteerItem) {
                const volunteerId = volunteerItem.dataset.volunteerId;
                const checkbox = volunteerItem.querySelector('input[type="checkbox"]');
                
                checkbox.checked = !checkbox.checked;
                
                if (checkbox.checked) {
                    this.selectedVolunteers.add(volunteerId);
                } else {
                    this.selectedVolunteers.delete(volunteerId);
                }
                
                this.highlightVolunteers();
                this.updateSelectedCount();
            }
        });

        // Apply filter
        this.modal.querySelector('#apply-filter').addEventListener('click', () => {
            this.highlightVolunteers();
            this.hide();
        });

        // Novo evento para filtro de eventos com feedback visual melhorado
        this.modal.querySelector('#toggle-event-filter').addEventListener('click', () => {
            this.filteringEvents = !this.filteringEvents;
            this.toggleEventFilter();
            
            // Atualiza visual do botão
            const button = this.modal.querySelector('#toggle-event-filter');
            const statusText = button.querySelector('span:last-child');
            const icon = button.querySelector('svg');
            
            if (this.filteringEvents) {
                button.classList.add('bg-blue-600', 'text-white', 'border-blue-600');
                button.classList.remove('text-gray-700', 'dark:text-gray-300', 'border-gray-300', 'dark:border-zinc-700');
                statusText.textContent = '(ativado)';
                icon.classList.add('rotate-180');
            } else {
                button.classList.remove('bg-blue-600', 'text-white', 'border-blue-600');
                button.classList.add('text-gray-700', 'dark:text-gray-300', 'border-gray-300', 'dark:border-zinc-700');
                statusText.textContent = '(desativado)';
                icon.classList.remove('rotate-180');
            }
        });
    }

    highlightVolunteers() {
        document.querySelectorAll('.space-y-6 [data-volunteer-id]').forEach(el => {
            const volunteerId = el.dataset.volunteerId;
            if (this.selectedVolunteers.has(volunteerId)) {
                // Remove classes anteriores para evitar conflitos
                el.classList.remove('text-gray-900', 'dark:text-white', 'text-gray-500', 'dark:text-gray-400');
                
                // Adiciona as novas classes
                el.classList.add(
                    'bg-zinc-900',      // Modo claro: fundo escuro
                    'dark:!bg-white',    // Modo escuro: fundo branco
                    'text-white',        // Modo claro: texto branco
                    'dark:!text-zinc-900' // Modo escuro: texto preto (usando zinc-900 para melhor contraste)
                );

                // Ajusta todos os textos internos
                el.querySelectorAll('p, span').forEach(text => {
                    text.classList.remove(
                        'text-gray-900', 
                        'dark:text-white', 
                        'text-gray-500', 
                        'dark:text-gray-400'
                    );
                    text.classList.add(
                        'text-white',         // Modo claro: texto branco
                        'dark:!text-zinc-900'  // Modo escuro: texto preto
                    );
                });
            } else {
                // Remove classes de destaque
                el.classList.remove(
                    'bg-zinc-900',
                    'dark:!bg-white',
                    'text-white',
                    'dark:!text-zinc-900'
                );

                // Restaura classes originais dos textos internos
                const mainText = el.querySelector('p:first-child');
                const subText = el.querySelector('p:last-child');
                
                if (mainText) {
                    mainText.classList.remove('text-white', 'dark:!text-zinc-900');
                    mainText.classList.add('text-gray-900', 'dark:text-white');
                }
                
                if (subText) {
                    subText.classList.remove('text-white', 'dark:!text-zinc-900');
                    subText.classList.add('text-gray-500', 'dark:text-gray-400');
                }
            }
        });
    }

    toggleEventFilter() {
        const eventos = document.querySelectorAll('.space-y-6 > div');
        
        eventos.forEach(evento => {
            if (this.filteringEvents) {
                // Verifica se o evento tem algum voluntário selecionado
                const hasSelectedVolunteer = Array.from(evento.querySelectorAll('[data-volunteer-id]'))
                    .some(el => this.selectedVolunteers.has(el.dataset.volunteerId));
                
                // Mostra/esconde o evento baseado na presença de voluntários selecionados
                evento.classList.toggle('hidden', !hasSelectedVolunteer);
            } else {
                // Mostra todos os eventos quando o filtro está desativado
                evento.classList.remove('hidden');
            }
        });
    }

    updateSelectedCount() {
        this.modal.querySelector('#selected-count').textContent = this.selectedVolunteers.size;
    }

    show() {
        this.modal.classList.remove('hidden');
        this.renderVolunteers();
        this.modal.querySelector('#volunteer-search').focus();
    }

    hide() {
        this.modal.classList.add('hidden');
    }
}
