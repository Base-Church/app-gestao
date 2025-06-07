import { permissionsManager } from './logic.js';

export function updatePermissionsUI(ministerios) {
    // Renderiza os cards de ministérios nos modais
    const ministeriosHtml = ministerios.map(ministerio => `
        <div class="ministerio-card group cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors mb-2 last:mb-0"
             data-selected="false"
             data-id="${ministerio.id}">
            <div class="flex items-center">
                ${ministerio.foto 
                    ? `<img src="${window.APP_CONFIG.baseUrl}/${ministerio.foto}" alt="${ministerio.nome}" class="w-8 h-8 rounded-full object-cover">`
                    : `<div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                           <span class="text-primary-700 dark:text-primary-300 font-medium text-sm">
                               ${ministerio.nome.charAt(0).toUpperCase()}
                           </span>
                       </div>`
                }
                <span class="ml-3 text-sm font-medium text-gray-900 dark:text-white">
                    ${ministerio.nome}
                </span>
                <div class="selection-indicator ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            </div>
        </div>
    `).join('');

    // Atualiza os ministérios em ambos os modais
    const lists = ['#ministerios-list', '#ministerios-list-permissions'];
    lists.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.innerHTML = ministeriosHtml;
        }
    });

    // Adiciona os event listeners depois de renderizar
    document.querySelectorAll('.ministerio-card').forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const id = this.dataset.id;
            window.permissionsManager.toggleMinisterio(id, this);
        });
    });
}

export function setInitialSelections(usuario) {
    permissionsManager.clearSelections();
    permissionsManager.clearAndUpdateUI();
    if (usuario.ministerios?.length > 0) permissionsManager.setInitialMinisterios(usuario.ministerios);
    if (usuario.permissoes?.length > 0) permissionsManager.setInitialPermissions(usuario.permissoes);
}
