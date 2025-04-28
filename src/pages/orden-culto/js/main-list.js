import { getOrdensCulto, deleteOrdemCulto } from './api.js';

document.addEventListener('DOMContentLoaded', init);

async function init() {
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorContainer = document.getElementById('error-container');
    const emptyState = document.getElementById('empty-state');
    const ordensGrid = document.getElementById('ordens-grid');
    const ordensList = document.getElementById('ordens-list');

    try {
        const ordens = await getOrdensCulto();
        
        loadingIndicator.classList.add('hidden');
        
        if (ordens.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        }

        ordensGrid.classList.remove('hidden');
        renderOrdensList(ordens, ordensList);

    } catch (error) {
        loadingIndicator.classList.add('hidden');
        errorContainer.classList.remove('hidden');
        document.getElementById('error-message').textContent = error.message;
    }
}

function renderOrdensList(ordens, container) {
    container.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div class="divide-y divide-gray-200 dark:divide-gray-700">
                ${ordens.map(ordem => {
                    // Verificar se é novo (menos de 1 hora)
                    const dataCriacao = new Date(ordem.data_criacao);
                    const agora = new Date();
                    const diffHoras = (agora - dataCriacao) / (1000 * 60 * 60);
                    const isNovo = diffHoras < 1;
                    
                    // Formatar apenas a data
                    const dataFormatada = dataCriacao.toLocaleDateString('pt-BR');

                    return `
                    <div class="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/20">
                            <span class="text-lg font-bold text-primary-600 dark:text-primary-400">#${ordem.id}</span>
                        </div>
                        
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2">
                                <h3 class="text-base font-medium text-gray-900 dark:text-white">
                                    Ordem de Culto #${ordem.id}
                                </h3>
                                ${isNovo ? '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Novo</span>' : ''}
                            </div>
                            
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                Criado em ${dataFormatada}
                                ${ordem.total_cultos > 0 ? ` • ${ordem.total_cultos} culto${ordem.total_cultos > 1 ? 's' : ''}` : ''}
                            </p>
                        </div>
                        
                        <!-- Ações -->
                        <div class="flex items-center gap-1">
                            <button onclick="window.location.href='${window.ENV.URL_BASE}/src/pages/orden-culto/visualizar/?id=${ordem.id}'"
                                    class="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                                    title="Visualizar">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                </svg>
                            </button>
                            
                            <button onclick="window.location.href='${window.ENV.URL_BASE}/src/pages/orden-culto/criar/?id=${ordem.id}'"
                                    class="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                                    title="Editar">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                </svg>
                            </button>
                            
                          
                            
                            <button onclick="confirmarExclusao(${ordem.id})"
                                    class="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                                    title="Excluir">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// Tornar função disponível globalmente
window.confirmarExclusao = function(id) {
    Swal.fire({
        title: 'Tem certeza?',
        text: "Esta ação não poderá ser revertida!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            deleteOrdem(id);
        }
    });
}

window.deleteOrdem = async function(id) {
    try {
        await deleteOrdemCulto(id);
        await init(); // Recarregar lista
        Swal.fire('Sucesso!', 'Ordem de culto excluída com sucesso.', 'success');
    } catch (error) {
        console.error('Erro ao excluir:', error);
        Swal.fire('Erro!', 'Não foi possível excluir a ordem de culto.', 'error');
    }
}

// Função placeholder para exportação de PDF
function exportarPDF(id) {
    console.log('Exportar PDF para ordem:', id);
    // Implementar lógica de exportação
}
