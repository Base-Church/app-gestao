export function setupEventosModal() {
    const modal = document.getElementById('eventos-modal');
    
    // Carregar eventos ao abrir o modal
    document.addEventListener('click', async (e) => {
        const btn = e.target.closest('.select-evento');
        if (!btn) return;
        
        modal.classList.remove('hidden');
        await carregarEventos(btn);
    });
    
    // Fechar modal
    document.querySelectorAll('.close-eventos-modal').forEach(btn => {
        btn.addEventListener('click', () => modal.classList.add('hidden'));
    });
}

async function carregarEventos(btnOrigem) {
    const grid = document.getElementById('eventos-grid');
    grid.innerHTML = '<div class="col-span-full flex justify-center"><div class="animate-spin h-6 w-6 border-2 border-primary-600 rounded-full border-t-transparent"></div></div>';
    
    try {
        const response = await fetch(`${window.ENV.URL_BASE}/src/services/api/eventos/get.php`);
        const data = await response.json();
        
        if (!data.data || data.data.length === 0) {
            grid.innerHTML = '<div class="col-span-full text-center text-gray-500 dark:text-gray-400">Nenhum evento encontrado</div>';
            return;
        }
        
        grid.innerHTML = `
            <div class="col-span-full divide-y divide-gray-200 dark:divide-gray-700">
                ${data.data.map(evento => `
                    <div class="evento-card cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors p-3 flex items-center gap-3"
                         data-id="${evento.id}" 
                         data-nome="${evento.nome}">
                        <img src="${window.ENV.URL_BASE}/assets/img/eventos/${evento.foto}" 
                             onerror="this.src='${window.ENV.URL_BASE}/assets/img/placeholder.jpg'"
                             alt="${evento.nome}" 
                             class="w-12 h-12 rounded object-cover flex-shrink-0">
                        <div>
                            <h3 class="font-medium text-gray-900 dark:text-white">${evento.nome}</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                ${evento.dia_semana} - ${evento.hora.substring(0, 5)}
                            </p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Adicionar listeners para seleção
        grid.querySelectorAll('.evento-card').forEach(card => {
            card.addEventListener('click', () => {
                const cultoContainer = btnOrigem.closest('.culto-container');
                const input = cultoContainer.querySelector('input[name="evento"]');
                const btnEvento = cultoContainer.querySelector('.select-evento');
                
                // Criar preview do evento selecionado
                btnEvento.innerHTML = `
                    <div class="flex items-center gap-3">
                        <img src="${card.querySelector('img').src}" 
                             alt="${card.dataset.nome}"
                             class="w-8 h-8 rounded object-cover">
                        <div class="flex-1 text-left">
                            <div class="font-medium">${card.dataset.nome}</div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">
                                ${card.querySelector('p').textContent}
                            </div>
                        </div>
                    </div>
                `;
                
                input.value = card.dataset.id;
                document.getElementById('eventos-modal').classList.add('hidden');
            });
        });
        
    } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        grid.innerHTML = '<div class="col-span-full text-center text-red-500">Erro ao carregar eventos</div>';
    }
}
