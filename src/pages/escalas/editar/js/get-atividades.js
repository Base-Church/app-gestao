let MINISTERIO_ATUAL = '';
let loadingAtividades = false;
let categorias = [];

async function carregarCategorias() {
    try {
        const params = new URLSearchParams();
        params.append('organizacao_id', ORGANIZACAO_ID);
        params.append('ministerio_id', MINISTERIO_ATUAL);

        const response = await fetch(`${window.APP_CONFIG.apiUrl}/api/categoria-atividade?${params}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${window.APP_CONFIG.apiKey}`
            }
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.code === 200) {
            categorias = data.data;
            return data.data;
        }
        return [];
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        return [];
    }
}

async function carregarAtividades(atividadeContainer) {
    if (loadingAtividades) return;
    
    const notification = window.notificationManager.show();
    
    try {
        if (!MINISTERIO_ATUAL) {
            MINISTERIO_ATUAL = sessionStorage.getItem('ministerio_atual') || 
                               localStorage.getItem('ministerio_atual');
            if (!MINISTERIO_ATUAL) return;
        }

        // Carregar categorias primeiro
        await carregarCategorias();

        const params = new URLSearchParams();
        params.append('organizacao_id', ORGANIZACAO_ID);
        params.append('ministerio_id', MINISTERIO_ATUAL);
        params.append('page', '1');
        params.append('limit', '100');

        const apiUrl = `${window.APP_CONFIG.apiUrl}/api/atividades?${params}`;
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${window.APP_CONFIG.apiKey}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erro HTTP! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        const loadingDiv = atividadeContainer.querySelector('#loading-atividades');
        const atividadesLista = atividadeContainer.querySelector('#atividades-lista');
        const floatingSelection = atividadeContainer.querySelector('.floating-selection');
        const searchInput = atividadeContainer.querySelector('#atividade-search-input');
        
        if (loadingDiv) {
            loadingDiv.classList.remove('hidden');
        }
        
        loadingAtividades = true;
        
        if (data.code === 200 && data.data.length > 0) {
            notification.finish(true);
            if (atividadesLista) {
                window.todasAtividades = data.data;
                
                renderizarAtividadesPorCategoria(data.data, atividadesLista, atividadeContainer);
                
                if (searchInput && !searchInput.hasEventListener) {
                    searchInput.addEventListener('input', () => filtrarAtividades(atividadeContainer));
                    searchInput.hasEventListener = true;
                }
                
                if (floatingSelection) {
                    floatingSelection.classList.remove('hidden');
                }
            }
        } else {
            notification.finish(true);
            if (atividadesLista) {
                atividadesLista.innerHTML = '<p class="text-center text-gray-500">Nenhuma atividade encontrada</p>';
            }
        }
    } catch (error) {
        notification.finish(false);
        const atividadesLista = atividadeContainer.querySelector('#atividades-lista');
        if (atividadesLista) {
            atividadesLista.innerHTML = `<p class="text-center text-red-500">Erro ao carregar atividades: ${error.message}</p>`;
        }
    } finally {
        loadingAtividades = false;
        const loadingDiv = atividadeContainer.querySelector('#loading-atividades');
        if (loadingDiv) {
            loadingDiv.classList.add('hidden');
        }
    }
}

function renderizarAtividadesPorCategoria(atividades, atividadesLista, atividadeContainer) {
    atividadesLista.innerHTML = ''; // Limpar lista anterior

    // Agrupar atividades por categoria
    const atividadesPorCategoria = {};
    
    // Inicializar todas as categorias com arrays vazios
    categorias.forEach(categoria => {
        atividadesPorCategoria[categoria.id] = {
            nome: categoria.nome,
            atividades: []
        };
    });

    // Agrupar atividades em suas respectivas categorias
    atividades.forEach(atividade => {
        const categoriaId = atividade.categoria_atividade_id;
        if (atividadesPorCategoria[categoriaId]) {
            atividadesPorCategoria[categoriaId].atividades.push(atividade);
        }
    });

    // Renderizar cada categoria e suas atividades
    Object.entries(atividadesPorCategoria).forEach(([categoriaId, categoria]) => {
        if (categoria.atividades.length > 0) {
            // Criar cabeçalho da categoria
            const categoriaHeader = document.createElement('div');
            categoriaHeader.classList.add('categoria-header', 'mt-4', 'mb-2');
            categoriaHeader.innerHTML = `
                <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-2">
                    ${categoria.nome}
                </h2>
            `;
            atividadesLista.appendChild(categoriaHeader);

            // Criar container para atividades desta categoria
            const categoriaContainer = document.createElement('div');
            categoriaContainer.classList.add('grid', 'gap-2');

            // Renderizar atividades desta categoria
            categoria.atividades.forEach(atividade => {
                const fotoPath = atividade.foto 
                    ? `${window.APP_CONFIG.baseUrl}/assets/img/atividades/${atividade.foto}` 
                    : `${window.APP_CONFIG.baseUrl}/assets/img/atividades/placeholder.jpg`;
                
                const atividadeDiv = document.createElement('div');
                atividadeDiv.classList.add(
                    'bg-white', 'dark:bg-gray-700', 
                    'shadow', 'rounded-lg', 'p-3',
                    'hover:bg-gray-100', 'dark:hover:bg-gray-600',
                    'cursor-pointer', 'transition-colors', 'duration-300',
                    'flex', 'items-center', 'space-x-3'
                );
                
                atividadeDiv.innerHTML = `
                    <img src="${fotoPath}" alt="${atividade.nome}" class="w-12 h-12 rounded-full object-cover">
                    <div class="flex-1">
                        <h3 class="text-sm font-medium text-gray-900 dark:text-white truncate">${atividade.nome}</h3>
                        <div class="w-4 h-4 rounded-full" style="background-color: ${atividade.cor_indicador}"></div>
                    </div>
                `;
                atividadeDiv.addEventListener('click', () => selecionarAtividade(atividade.id, atividade.nome, atividade.foto, atividade.cor_indicador, atividadeContainer));
                categoriaContainer.appendChild(atividadeDiv);
            });

            atividadesLista.appendChild(categoriaContainer);
        }
    });
}

function filtrarAtividades(atividadeContainer) {
    const searchInput = atividadeContainer.querySelector('#atividade-search-input');
    const atividadesLista = atividadeContainer.querySelector('#atividades-lista');
    
    if (!searchInput || !atividadesLista || !window.todasAtividades) return;
    
    const termoBusca = searchInput.value.toLowerCase().trim();
    
    const atividadesFiltradas = window.todasAtividades.filter(atividade => 
        atividade.nome.toLowerCase().includes(termoBusca)
    );
    
    if (atividadesFiltradas.length > 0) {
        renderizarAtividadesPorCategoria(atividadesFiltradas, atividadesLista, atividadeContainer);
    } else {
        atividadesLista.innerHTML = '<p class="text-center text-gray-500">Nenhuma atividade encontrada</p>';
    }
}

function selecionarAtividade(id, nome, foto, corIndicador, atividadeContainer) {
    const seletor = atividadeContainer.querySelector('.atividade-selector .cursor-pointer');
    if (seletor) {
        const fotoPath = foto 
            ? `${window.APP_CONFIG.baseUrl}/assets/img/atividades/${foto}` 
            : `${window.APP_CONFIG.baseUrl}/assets/img/atividades/placeholder.jpg`;
        
        seletor.innerHTML = `
            <div class="flex items-center space-x-3">
                <img src="${fotoPath}" class="w-12 h-12 rounded-full object-cover">
                <span class="text-gray-900 dark:text-white">${nome}</span>
                <input type="hidden" name="atividade_id[]" value="${id}">
            </div>
        `;
        const floatingSelection = atividadeContainer.querySelector('.atividade-selector .floating-selection');
        if (floatingSelection) {
            floatingSelection.classList.add('hidden');
        }
    }
}

function toggleSelector(element, type) {
    const atividadeContainer = element.closest('.dynamic-field');
    const floatingSelection = element.nextElementSibling;
    
    if (floatingSelection && floatingSelection.classList.contains('floating-selection')) {
        floatingSelection.classList.toggle('hidden');
        
        if (!floatingSelection.classList.contains('hidden') && type === 'atividade') {
            carregarAtividades(atividadeContainer);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Adicionar event listener para mudança de ministério
    window.addEventListener('ministerio-changed', function(event) {
        MINISTERIO_ATUAL = event.detail.ministerio_id;
    });
});
