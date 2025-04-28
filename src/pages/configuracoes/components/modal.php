<?php
$menuConfig = json_decode(file_get_contents(__DIR__ . '/../../../../menu.config.json'), true);
?>

<div id="configModal" class="fixed inset-0 z-50 hidden">
    <div class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
    
    <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-screen items-center justify-center p-4">
            <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 w-full max-w-4xl h-[90vh] md:min-h-[90vh] flex flex-col">
                <form id="newUserForm" class="flex flex-col h-full">
                    <div class="flex-1 overflow-y-auto p-4 md:p-6">
                        <!-- Container principal com layout responsivo -->
                        <div class="flex flex-col md:flex-row gap-4 md:gap-6 h-full">
                            <!-- Coluna da Esquerda - Formulário -->
                            <div class="flex-1 space-y-4 md:space-y-6">
                                <!-- Nome -->
                                <div>
                                    <label for="nome" class="block text-sm font-medium text-gray-900 dark:text-white">
                                        Nome do Usuário *
                                    </label>
                                    <input type="text" id="nome" name="nome" required 
                                        class="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 dark:bg-gray-800 dark:focus:ring-primary-500 sm:text-sm sm:leading-6">
                                </div>

                                <!-- WhatsApp -->
                                <div>
                                    <label for="whatsapp" class="block text-sm font-medium text-gray-900 dark:text-white">
                                        WhatsApp *
                                    </label>
                                    <input type="tel" id="whatsapp" name="whatsapp" required placeholder="(63) 98419-3411"
                                        class="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 dark:bg-gray-800 dark:focus:ring-primary-500 sm:text-sm sm:leading-6">
                                </div>

                                <!-- Senha (visível apenas na criação) -->
                                <div class="senha-field">
                                    <label for="senha" class="block text-sm font-medium text-gray-900 dark:text-white">
                                        Senha *
                                    </label>
                                    <input type="password" 
                                           id="senha" 
                                           name="senha" 
                                           required
                                           autocomplete="new-password"
                                           class="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 dark:bg-gray-800 dark:focus:ring-primary-500 sm:text-sm sm:leading-6">
                                </div>

                                <!-- Nível -->
                                <div>
                                    <label for="nivel" class="block text-sm font-medium text-gray-900 dark:text-white">
                                        Nível de Acesso *
                                    </label>
                                    <select id="nivel" name="nivel" required
                                        class="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-600 dark:bg-gray-800 dark:focus:ring-primary-500 sm:text-sm sm:leading-6">
                                        <option value="gestão" selected>Gestão</option>
                                        <option value="admin">Admin</option>
                                        <option value="superadmin">Super Admin</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Coluna da Direita -->
                            <div class="flex-1 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 pt-4 md:pt-0 md:pl-6 space-y-4 md:space-y-6">
                                <!-- Ministérios -->
                                <div class="flex-1">
                                    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Ministérios</h3>
                                    <div id="ministerios-list" class="h-[200px] md:h-[35vh] overflow-y-auto pr-2 space-y-2">
                                        <!-- Será preenchido via JavaScript -->
                                    </div>
                                </div>

                                <!-- Permissões -->
                                <div class="flex-1">
                                    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Permissões</h3>
                                    <div class="h-[200px] md:h-[35vh] overflow-y-auto pr-2 space-y-2">
                                        <?php foreach ($menuConfig as $menuItem): ?>
                                            <div class="permissao-card group cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors mb-2 last:mb-0"
                                                 data-selected="false"
                                                 data-code="<?= $menuItem['id'] ?>"
                                                 onclick="window.permissionsManager.togglePermission('<?= $menuItem['id'] ?>', this)">
                                                <div class="flex items-center">
                                                    <span class="text-sm font-medium text-gray-900 dark:text-white">
                                                        <?= $menuItem['nome'] ?>
                                                    </span>
                                                    <div class="selection-indicator ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    <?= $menuItem['url'] ?>
                                                </div>
                                            </div>
                                        <?php endforeach; ?>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="flex justify-end gap-3 px-4 md:px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                        <button type="button" 
                                onclick="document.getElementById('configModal').classList.add('hidden')"
                                class="rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
                            Cancelar
                        </button>
                        <button type="submit" 
                                class="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
document.getElementById('newUserForm').addEventListener('submit', function(e) {
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

    // Pegar permissões e ministérios do gerenciador
    const selectedPermissions = window.permissionsManager.getSelectedPermissions();
    if (selectedPermissions.length > 0) {
        data.permissoes = selectedPermissions;
    }

    const selectedMinisterios = window.permissionsManager.getSelectedMinisterios();
    if (selectedMinisterios.length > 0) {
        data.ministerios = selectedMinisterios;
    }

    // Limpar seleções ao enviar
    window.permissionsManager.clearSelections();
    
    window.createUsuario(data)
        .then(result => {
            if (result.code === 200) {
                document.getElementById('configModal').classList.add('hidden');
                this.reset();
                window.loadUsuarios();
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert(error.message);
        });
});

// Limpar seleções quando o modal for fechado
document.getElementById('configModal').addEventListener('click', function (e) {
    if (e.target === this) {
        this.classList.add('hidden');
        window.permissionsManager.clearSelections();
    }
});
</script>
