<?php
// Modal de Usuário
?>
<div id="userModal" class="fixed inset-0 z-50 hidden overflow-y-auto">
    <div class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
    
    <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                <form id="userForm" class="flex flex-col">
                    <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6">
                        <div class="sm:flex sm:items-start">
                            <div class="w-full">
                                <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-white mb-4" id="modal-title">
                                    Novo Usuário
                                </h3>
                                <div class="space-y-4">
                                    <!-- Nome -->
                                    <div>
                                        <label for="nome" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Nome do Usuário *
                                        </label>
                                        <input type="text" name="nome" id="nome" required
                                               class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm">
                                    </div>

                                    <!-- WhatsApp -->
                                    <div>
                                        <label for="whatsapp" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            WhatsApp *
                                        </label>
                                        <input type="tel" name="whatsapp" id="whatsapp" required
                                               placeholder="(63) 98419-3411"
                                               class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm">
                                    </div>

                                    <!-- Senha -->
                                    <div class="senha-field">
                                        <label for="senha" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Senha *
                                        </label>
                                        <input type="password" name="senha" id="senha" required
                                               class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm">
                                    </div>

                                    <!-- Nível -->
                                    <div>
                                        <label for="nivel" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Nível de Acesso *
                                        </label>
                                        <select name="nivel" id="nivel" required
                                                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm">
                                            <option value="gestão">Gestão</option>
                                            <option value="admin">Admin</option>
                                            <option value="superadmin">Super Admin</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button type="submit"
                                class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 sm:ml-3 sm:w-auto">
                            Salvar
                        </button>
                        <button type="button"
                                onclick="closeUserModal()"
                                class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 sm:mt-0 sm:w-auto">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div> 