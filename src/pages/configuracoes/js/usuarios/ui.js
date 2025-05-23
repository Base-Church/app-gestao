// filepath: c:\xampp\htdocs\base\src\pages\configuracoes\js\usuarios\ui.js

export function renderUsuariosList(usuarios, ministerios) {
    const ministeriosMap = new Map(ministerios.map(m => [m.id.toString(), m]));
    const usuariosList = document.getElementById('usuarios-list');
    usuariosList.innerHTML = usuarios.map(usuario => renderUserCard(usuario, ministeriosMap)).join('');
}

function renderUserCard(usuario, ministeriosMap) {
    const ministeriosTags = usuario.ministerios
        ? usuario.ministerios.map(id => {
            const ministerio = ministeriosMap.get(id);
            if (!ministerio) return '';
            return `
                <span class="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 text-primary-800 dark:bg-primary-900/20 dark:text-primary-200 text-sm font-medium mr-2 mb-1">
                    ${ministerio.nome}
                </span>
            `;
        }).join('')
        : '';

    return `
        <li>
            <div class="flex items-center gap-6 bg-white dark:bg-gray-800 rounded-md shadow border border-gray-100 dark:border-gray-800 px-6 py-4">
                <!-- Avatar -->
                <div class="flex-shrink-0 w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-xl font-bold text-primary-700 dark:text-primary-200">
                    ${usuario.nome.charAt(0).toUpperCase()}
                </div>
                <!-- Info -->
                <div class="flex-1 flex flex-col gap-1 min-w-0">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                        <span class="text-base font-semibold text-gray-900 dark:text-white truncate">${usuario.nome}</span>
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            usuario.nivel === 'superadmin' ? 'bg-purple-50 text-purple-800 dark:bg-purple-900/10 dark:text-purple-300' :
                            usuario.nivel === 'admin' ? 'bg-blue-50 text-blue-800 dark:bg-blue-900/10 dark:text-blue-300' :
                            'bg-green-50 text-green-800 dark:bg-green-900/10 dark:text-green-300'
                        } ml-0 sm:ml-2 mt-1 sm:mt-0">
                            ${usuario.nivel.charAt(0).toUpperCase() + usuario.nivel.slice(1)}
                        </span>
                    </div>
                    <div class="flex flex-wrap mt-1">
                        ${ministeriosTags}
                    </div>
                </div>
                <!-- Ações -->
                <div class="flex flex-col items-end gap-2 ml-4">
                    <button onclick="openPermissionsModal(${usuario.id})"
                        class="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/10 hover:bg-primary-100 dark:hover:bg-primary-800/20 transition focus:outline-none">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        <span>Permissões</span>
                    </button>
                </div>
            </div>
        </li>
    `;
}