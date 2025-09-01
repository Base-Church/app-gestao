// Serviço para componentes HTML de voluntários (off-canvas)
class VoluntariosComponentesService {
    criarSidebar(voluntariosData, onSelecionar) {
        // Fecha qualquer sidebar já aberto
        document.querySelectorAll('.voluntarios-offcanvas').forEach(el => el.remove());

        const { sugestoes = [], todos = [] } = voluntariosData;
        const sidebar = document.createElement('div');
        sidebar.className = 'voluntarios-offcanvas fixed top-0 right-0 w-full max-w-md h-full bg-white dark:bg-gray-900 shadow-2xl z-[2000] transition-transform duration-300 translate-x-full';
        sidebar.style.maxWidth = '380px';

        sidebar.innerHTML = `
            <div class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Selecionar Voluntário</h3>
                <button type="button" class="fechar-sidebar text-gray-400 hover:text-red-500">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div class="p-4 pb-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <input type="text" class="input-busca-voluntario w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white px-3 py-2 focus:ring-primary-500 focus:border-primary-500 transition" placeholder="Buscar voluntário...">
            </div>
            <div class="overflow-y-auto max-h-[calc(100vh-120px)] p-4 space-y-6">
                <div>
                    <h4 class="text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2">Sugestões</h4>
                    <div class="lista-voluntarios-sugestoes space-y-1">
                        ${sugestoes.length ? sugestoes.map(this.criarCardVoluntario).join('') : '<p class="text-xs text-gray-400">Nenhuma sugestão</p>'}
                    </div>
                </div>
                <div>
                    <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Todos</h4>
                    <div class="lista-voluntarios-todos space-y-1">
                        ${todos.length ? todos.map(this.criarCardVoluntario).join('') : '<p class="text-xs text-gray-400">Nenhum voluntário encontrado</p>'}
                    </div>
                </div>
            </div>
        `;

        // Evento fechar
        sidebar.querySelector('.fechar-sidebar').onclick = () => {
            sidebar.classList.add('translate-x-full');
            setTimeout(() => sidebar.remove(), 300);
        };

        // Evento selecionar voluntário
        sidebar.querySelectorAll('.selecionar-voluntario').forEach(area => {
            area.onclick = () => {
                const card = area.closest('.voluntario-card');
                const voluntarioId = card.dataset.voluntarioId;
                const nome = card.querySelector('h4').textContent;
                const img = card.querySelector('img').src;
                const voluntario = { id: voluntarioId, nome, img };
                if (typeof onSelecionar === 'function') onSelecionar(voluntario);
                sidebar.classList.add('translate-x-full');
                setTimeout(() => sidebar.remove(), 300);
            };
        });

        // Evento histórico de indisponibilidade
        sidebar.querySelectorAll('.btn-historico-indisponibilidade').forEach(btn => {
            btn.onclick = async (e) => {
                e.stopPropagation(); // Evita que dispare o evento de seleção
                
                // Adiciona loading no botão
                const originalHTML = btn.innerHTML;
                btn.innerHTML = `
                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                `;
                btn.disabled = true;
                
                try {
                    const voluntario = {
                        id: btn.dataset.voluntarioId,
                        nome: btn.dataset.voluntarioNome,
                        img: btn.dataset.voluntarioImg
                    };
                    
                    if (window.historicoIndisponibilidadeService) {
                        await window.historicoIndisponibilidadeService.abrirHistoricoIndisponibilidade(voluntario);
                    } else {
                        console.error('Serviço de histórico de indisponibilidade não encontrado');
                        alert('Erro: Serviço não disponível');
                    }
                } catch (error) {
                    console.error('Erro ao abrir histórico:', error);
                    alert('Erro ao carregar histórico');
                } finally {
                    // Restaura o botão
                    btn.innerHTML = originalHTML;
                    btn.disabled = false;
                }
            };
        });

        // Filtro de busca
        const inputBusca = sidebar.querySelector('.input-busca-voluntario');
        inputBusca.addEventListener('input', function () {
            const termo = this.value.trim().toLowerCase();
            // Sugestões
            sidebar.querySelectorAll('.lista-voluntarios-sugestoes .voluntario-card').forEach(card => {
                const nome = card.querySelector('h4').textContent.toLowerCase();
                card.style.display = nome.includes(termo) ? '' : 'none';
            });
            // Todos
            sidebar.querySelectorAll('.lista-voluntarios-todos .voluntario-card').forEach(card => {
                const nome = card.querySelector('h4').textContent.toLowerCase();
                card.style.display = nome.includes(termo) ? '' : 'none';
            });
        });

        // Exibe o sidebar
        document.body.appendChild(sidebar);
        setTimeout(() => sidebar.classList.remove('translate-x-full'), 10);
    }

    criarCardVoluntario(voluntario) {
        // Mapeamento de status para cor
        const statusMap = {
            'Disponível': 'bg-green-100 text-green-800 border-green-300',
            'Indisponível': 'bg-red-100 text-red-700 border-red-300',
            'Não preencheu': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'Já escalado': 'bg-blue-100 text-blue-800 border-blue-300'
        };
        const status = voluntario.statusLabel || '';
        const statusClass = statusMap[status] || 'bg-gray-100 text-gray-700 border-gray-300';

        // Foto: usa a URL se existir, senão placeholder, e fallback para placeholder se erro
        const imagemPath = voluntario.foto
            ? voluntario.foto
            : `${window.APP_CONFIG.baseUrl}/assets/img/placeholder.jpg`;

        return `
        <div class="voluntario-card flex items-center p-3 border-b border-gray-200 dark:border-gray-700 rounded transition-all duration-200" data-voluntario-id="${voluntario.id}">
            <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex-shrink-0">
                <img src="${imagemPath}" alt="${voluntario.nome}" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='${window.APP_CONFIG.baseUrl}/assets/img/placeholder.jpg'">
            </div>
            <div class="ml-3 flex-1 selecionar-voluntario cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded p-1 -m-1">
                <h4 class="text-sm font-medium text-gray-800 dark:text-white truncate">${voluntario.nome}</h4>
                <span class="inline-block px-2 py-0.5 rounded border text-xs font-semibold ${statusClass}">${status}</span>
            </div>
            <div class="ml-2 flex-shrink-0">
                <button type="button" class="btn-historico-indisponibilidade p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" 
                        data-voluntario-id="${voluntario.id}" 
                        data-voluntario-nome="${voluntario.nome}" 
                        data-voluntario-img="${imagemPath}"
                        title="Ver histórico de indisponibilidade">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </button>
            </div>
        </div>`;
    }
}

window.voluntariosComponentesService = new VoluntariosComponentesService();
