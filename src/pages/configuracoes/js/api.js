import { initializePermissionsHandlers } from './permissions.js';

document.addEventListener('DOMContentLoaded', function() {
    initializeConfigPage();
    loadUsuarios();
    initializePermissionsHandlers(); // Garante que as funções de permissões sejam inicializadas
    
    // Adiciona o event listener do form uma única vez
    const form = document.getElementById('newUserForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const data = {
                nome: this.nome.value.trim(),
                whatsapp: this.whatsapp.value.replace(/\D/g, ''),
                senha: this.senha.value,
                nivel: this.nivel.value,
                status: 'ativo',
                organizacao_id: Number(window.USER.organizacao_id)
            };

            // Only add arrays if there are selected items
            const selectedMinisterios = permissionsManager.getSelectedMinisterios();
            if (selectedMinisterios.length > 0) {
                data.ministerios = selectedMinisterios;
            }

            const selectedPermissions = permissionsManager.getSelectedPermissions();
            if (selectedPermissions.length > 0) {
                data.permissoes = selectedPermissions;
            }

            createUsuario(data)
                .then(result => {
                    if (result.code === 200) {
                        document.getElementById('configModal').classList.add('hidden');
                        resetModal();
                        loadUsuarios();
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert(error.message);
                });
        });
    }
});

function initializeConfigPage() {
    const modal = document.getElementById('configModal');
    const closeModal = document.getElementById('closeModal');
    const newUserButton = document.querySelector('button[onclick*="configModal"]');
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }

    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
    
    modal?.querySelector('.relative').addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// Funções de utilidade
function formatWhatsApp(numero) {
    const numbers = numero.replace(/\D/g, '');
    const base = numbers.startsWith('55') ? numbers : `55${numbers}`;
    return `(${base.slice(2, 4)}) ${base.slice(4, 9)}-${base.slice(9, 13)}`;
}

// Carregar usuários
export async function loadUsuarios() {
    try {
        const [response, ministeriosResponse] = await Promise.all([
            fetch(`${window.APP_CONFIG.baseUrl}/src/services/api/usuarios/get.php`),
            fetch(`${window.APP_CONFIG.baseUrl}/src/services/api/ministerios/get.php`)
        ]);
        
        const data = await response.json();
        const ministeriosData = await ministeriosResponse.json();
        
        if (data.code === 200) {
            window.usuariosData = data.data;
            
            const ministeriosMap = new Map(ministeriosData.data.map(m => [m.id.toString(), m]));
            const usuariosList = document.getElementById('usuarios-list');
            
            usuariosList.innerHTML = data.data.map(usuario => {
                const ministeriosTags = usuario.ministerios
                    ? usuario.ministerios.map(id => {
                        const ministerio = ministeriosMap.get(id);
                        if (!ministerio) return '';
                        
                        const imageUrl = ministerio.foto 
                            ? `${window.APP_CONFIG.baseUrl}/${ministerio.foto}`
                            : null;
                            
                        return `
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-200 mr-2 mb-2">
                                ${imageUrl ? `<img src="${imageUrl}" alt="" class="w-4 h-4 rounded-full mr-1">` : ''}
                                ${ministerio.nome}
                            </span>
                        `;
                    }).join('')
                    : '<span class="text-gray-400 dark:text-gray-500 text-sm">Nenhum ministério</span>';

                return renderUserCard(usuario, ministeriosMap);
            }).join('');
        }
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
    }
}

// Criar usuário
export async function createUsuario(userData) {
    try {
        const response = await fetch(`${window.APP_CONFIG.baseUrl}/src/services/api/usuarios/registro.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error);
        }
        return data;
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        throw error;
    }
}

// Atualizar a função que renderiza os usuários para incluir o novo botão
function renderUserCard(usuario, ministeriosMap) {
    const ministeriosTags = usuario.ministerios
        ? usuario.ministerios.map(id => {
            const ministerio = ministeriosMap.get(id);
            if (!ministerio) return '';
            
            return `
                <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 mr-2 mb-2">
                    ${ministerio.nome}
                </span>
            `;
        }).join('')
        : '';

    return `
        <li>
            <div class="block hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div class="p-4">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div class="flex-shrink-0">
                                <div class="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                                    <span class="text-primary-700 dark:text-primary-300 font-medium text-lg">
                                        ${usuario.nome.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-900 dark:text-white">${usuario.nome}</p>
                                <div class="flex items-center mt-1">
                                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                        usuario.nivel === 'superadmin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                                        usuario.nivel === 'admin' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                    }">
                                        ${usuario.nivel.charAt(0).toUpperCase() + usuario.nivel.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button onclick="openPermissionsModal(${usuario.id})"
                                    class="flex-1 sm:flex-none inline-flex items-center justify-center p-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                                <span class="sm:hidden ml-2">Editar Permissões</span>
                            </button>
                        </div>
                    </div>
                    <div class="mt-4 flex flex-wrap">
                        ${ministeriosTags}
                    </div>
                </div>
            </div>
        </li>
    `;
}

// Expor apenas funções essenciais
window.createUsuario = createUsuario;
window.loadUsuarios = loadUsuarios;
