<?php
$menuConfig = json_decode(file_get_contents(__DIR__ . '/../../../../menu.config.json'), true);
?>

<div id="permissionsModal" class="fixed inset-0 z-50 hidden">
    <div class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
    
    <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-screen items-center justify-center p-4">
            <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 w-full max-w-3xl shadow-xl">
                <!-- Tabs Navigation -->
                <div class="border-b border-gray-200 dark:border-gray-700">
                    <nav class="-mb-px flex" aria-label="Tabs">
                        <button type="button" onclick="switchModalTab('user-info')" 
                                class="modal-tab-button w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm border-primary-500 text-primary-600 dark:text-primary-500" 
                                data-tab="user-info">
                            Informações do Usuário
                        </button>
                        <button type="button" onclick="switchModalTab('permissions')" 
                                class="modal-tab-button w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm border-transparent text-gray-500" 
                                data-tab="permissions">
                            Permissões
                        </button>
                    </nav>
                </div>

                <form id="updatePermissionsForm" class="flex flex-col">
                    <!-- User Info Tab -->
                    <div class="modal-tab-content" id="user-info-content">
                        <div class="p-6 space-y-4">
                            <div>
                                <label for="nome" class="block text-sm font-medium text-gray-900 dark:text-white">
                                    Nome do Usuário *
                                </label>
                                <input type="text" id="nome" name="nome" required 
                                       class="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 dark:bg-gray-800 dark:focus:ring-primary-500 sm:text-sm sm:leading-6">
                            </div>

                            <div>
                                <label for="whatsapp" class="block text-sm font-medium text-gray-900 dark:text-white">
                                    WhatsApp *
                                </label>
                                <input type="text" id="whatsapp" name="whatsapp" required placeholder="(63) 98419-3411"
                                       class="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 dark:bg-gray-800 dark:focus:ring-primary-500 sm:text-sm sm:leading-6">
                            </div>

                            <div>
                                <label for="nivel" class="block text-sm font-medium text-gray-900 dark:text-white">
                                    Nível de Acesso *
                                </label>
                                <select id="nivel" name="nivel" required
                                        class="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-600 dark:bg-gray-800 dark:focus:ring-primary-500 sm:text-sm sm:leading-6">
                                    <option value="gestão">Gestão</option>
                                    <option value="admin">Admin</option>
                                    <option value="superadmin">Super Admin</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Permissions Tab -->
                    <div class="modal-tab-content hidden" id="permissions-content">
                        <div class="p-4 md:p-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                                <!-- Ministérios -->
                                <div>
                                    <h4 class="text-base font-medium text-gray-900 dark:text-white mb-4 px-1">Ministérios</h4>
                                    <div class="border rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                        <div id="ministerios-list-permissions" class="overflow-y-auto max-h-[300px] md:max-h-[400px] p-2">
                                            <!-- Será preenchido via JavaScript -->
                                        </div>
                                    </div>
                                </div>

                                <!-- Permissões -->
                                <div>
                                    <h4 class="text-base font-medium text-gray-900 dark:text-white mb-4 px-1">Permissões</h4>
                                    <div class="border rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                        <div class="overflow-y-auto max-h-[300px] md:max-h-[400px] p-2">
                                            <?php foreach ($menuConfig as $menuItem): ?>
                                                <div class="permissao-card group cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors mb-2 last:mb-0"
                                                     data-selected="false"
                                                     data-code="<?= $menuItem['id'] ?>"
                                                     onclick="window.permissionsManager?.togglePermission('<?= $menuItem['id'] ?>', this)">
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
                    </div>

                    <!-- Footer -->
                    <div class="flex justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                        <button type="button" 
                                onclick="document.getElementById('permissionsModal').classList.add('hidden')"
                                class="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                            Cancelar
                        </button>
                        <button type="submit" 
                                class="inline-flex justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
function switchModalTab(tabId) {
    document.querySelectorAll('.modal-tab-button').forEach(button => {
        const isActive = button.dataset.tab === tabId;
        button.classList.toggle('border-primary-500', isActive);
        button.classList.toggle('text-primary-600', isActive);
        button.classList.toggle('border-transparent', !isActive);
    });

    document.querySelectorAll('.modal-tab-content').forEach(content => {
        content.classList.toggle('hidden', content.id !== `${tabId}-content`);
    });
}
</script>
