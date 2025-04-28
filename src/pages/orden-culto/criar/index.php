<?php
// Configurações da página
$pageTitle = "Ordem de Culto";

// Incluir o header
require_once __DIR__ . '/../../../components/layout/header.php';
?>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<div class="p-4 sm:ml-64">
    <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
        <form id="form-ordem-culto" class="space-y-6">
            <!-- Container para múltiplos cultos -->
            <div id="container-cultos" class="space-y-6">
                <!-- Botão para adicionar novo culto -->
                <button type="button" id="adicionar-culto" 
                        class="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-primary-600 bg-primary-300/50 hover:bg-primary-400/50 dark:bg-primary-900/50 dark:hover:bg-primary-800/50 transition-colors">
                    + Adicionar Novo Culto
                </button>
            </div>

            <!-- Template para novo culto -->
            <template id="template-culto">
                <div class="culto-container space-y-4">
                    <!-- Cabeçalho do Culto -->
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <div class="flex justify-between items-center mb-4">
                            <!-- Substituir select por botão que abre modal -->
                            <button type="button" 
                                    class="select-evento text-left text-xl mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white px-4 py-2">
                                Selecione um evento...
                            </button>
                            <input type="hidden" name="evento" value="">
                            <button type="button" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                    onclick="this.closest('.culto-container').remove()">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        
                        <!-- Gerenciamento de colunas específico do culto -->
                        <div class="flex flex-col md:flex-row items-center gap-4">
                            <input type="text" placeholder="Nome da nova coluna" 
                                   class="w-full md:w-64 rounded-lg border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                            <button type="button" class="adicionar-coluna px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center gap-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                </svg>
                                <span>Adicionar Coluna</span>
                            </button>
                            <button type="button" class="toggle-duracao px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <span>Adicionar Duração</span>
                            </button>
                            <button type="button" class="duplicar-culto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/>
                                </svg>
                                <span>Duplicar</span>
                            </button>
                        </div>
                    </div>

                    <!-- Tabela do Culto -->
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                            <table class="tabela-ordem-culto w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-white">
                                    <tr class="cabecalho-tabela">
                                        <th scope="col" class="px-3 py-2">Momento</th>
                                        <th scope="col" class="px-3 py-2">Responsável</th>
                                        <th scope="col" class="px-3 py-2">Música</th>
                                        <th scope="col" class="px-3 py-2">Telão</th>
                                        <th scope="col" class="px-3 py-2">Luzes</th>
                                        <th scope="col" class="px-3 py-2 text-center w-16">Remover</th>
                                    </tr>
                                </thead>
                                <tbody class="corpo-tabela">
                                </tbody>
                            </table>
                        </div>

                        <button type="button" class="adicionar-linha mt-4 w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                            + Adicionar Linha
                        </button>
                    </div>
                </div>
            </template>

            <!-- Modal de Seleção de Evento -->
            <div id="eventos-modal" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity hidden z-50" aria-modal="true">
                <div class="fixed inset-0 z-10 overflow-y-auto">
                    <div class="flex min-h-full items-start justify-center p-4">
                        <div class="relative w-full max-w-lg transform rounded-xl bg-white dark:bg-gray-800 shadow-xl transition-all mt-16">
                            <!-- Header do Modal -->
                            <div class="flex items-center justify-between border-b dark:border-gray-700 px-4 py-3">
                                <h3 class="text-base font-medium text-gray-900 dark:text-white">
                                    Selecione um Evento
                                </h3>
                                <button type="button" class="close-eventos-modal text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                                    <span class="sr-only">Fechar</span>
                                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <!-- Corpo do Modal -->
                            <div class="max-h-[60vh] overflow-y-auto">
                                <div id="eventos-grid">
                                    <!-- Preenchido via JavaScript -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Observações (opcional) -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h2 class="text-lg font-medium text-gray-800 dark:text-white mb-4">Observações</h2>
                <textarea id="observacoes" name="observacoes" rows="3" 
                          class="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Informações adicionais sobre o culto..."></textarea>
            </div>

            <!-- Botão Salvar -->
            <div class="flex justify-end">
                <button type="submit" class="px-6 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-lg flex items-center space-x-2 transition">
                    <span id="btn-text">Salvar Ordem de Culto</span>
                    <div class="hidden animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" id="spinner-submit"></div>
                </button>
            </div>
        </form>
    </div>
</div>

<!-- Definir variáveis globais -->
<script type="module">
    window.USER = {
        ministerios: <?= json_encode(SessionService::getMinisterios()) ?>,
        organizacao_id: <?= SessionService::getOrganizacaoId() ?>,
        nivel: <?= json_encode(SessionService::getNivel()) ?>,
        ministerio_atual: <?= SessionService::getMinisterioAtual() ?>
    };
    
    window.ENV = {
        API_BASE_URL: '<?= $_ENV['API_BASE_URL'] ?>',
        API_KEY: '<?= $_ENV['API_KEY'] ?>',
        URL_BASE: '<?= $_ENV['URL_BASE'] ?>'
    };
</script>


<script src="<?php echo $_ENV['URL_BASE']; ?>/src/pages/orden-culto/criar/js/app.js" type="module"></script>

<?php require_once __DIR__ . '/../../../components/layout/footer.php'; ?>
