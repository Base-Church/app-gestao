<?php
// Configurações da página
$pageTitle = "Escalas";

// Incluir o header
require_once __DIR__ . '/../../../components/layout/header.php';
?>
<div class="sm:ml-64">
    <div class="p-2 sm:p-4 border-gray-200 rounded-lg dark:border-gray-700 mt-14">
        <div class="space-y-6">
            <!-- Cabeçalho da Escala -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <!-- Header com título e status -->
                <div class="bg-gradient-to-r from-primary-600 to-primary-700 p-6">
                    <div class="flex flex-wrap justify-between items-center">
                        <h2 class="text-2xl font-bold text-white">Nova Escala</h2>
                        <span class="px-4 py-1 bg-white bg-opacity-20 rounded-full text-white text-sm">Beta</span>
                    </div>
                </div>

                <!-- Conteúdo do cabeçalho -->
                <div class="p-6 space-y-6">
                    <!-- Primeira linha -->
                    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <div class="w-full sm:flex-1">
                            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Nome da Escala</label>
                            <input type="text" 
                                       id="nome-escala"
                                   class="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 
                                          shadow-sm focus:ring-primary-500 focus:border-primary-500 
                                          dark:bg-gray-700 dark:text-white text-lg"
                                   placeholder="Ex: Escala Ministério de Louvor">
                        </div>
                        <div class="w-full sm:w-48">
                            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo</label>
                            <select id="tipo-escala" 
                                    class="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 
                                           shadow-sm focus:ring-primary-500 focus:border-primary-500 
                                           dark:bg-gray-700 dark:text-white">
                                <option value="">Selecione</option>
                                <option value="semanal">📅 Semanal</option>
                                <option value="mensal">📅 Mensal</option>
                                <option value="avulso">📝 Avulso</option>
                            </select>
                        </div>
                    </div>

                    <!-- Segunda linha -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="flex flex-col sm:flex-row gap-4">
                            <div class="w-full sm:flex-1">
                                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Data Início</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                                        </svg>
                                    </div>
                                    <input type="date" 
                                           id="data-inicio"
                                           class="mt-1 pl-10 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                                </div>
                            </div>
                            <div class="w-full sm:flex-1">
                                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Data Término</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                                        </svg>
                                    </div>
                                    <input type="date" 
                                           id="data-termino"
                                           class="mt-1 pl-10 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                                </div>
                            </div>
                        </div>
                        <div class="flex items-end">
                            <button type="button" class="w-full px-4 py-2 bg-primary-600 hover:bg-primary-600 text-white rounded-lg flex items-center justify-center gap-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
          <!-- Container de Eventos -->
            <div id="eventos-container" class="p-4 space-y-4">
                <!-- Os eventos serão adicionados dinamicamente aqui -->
            </div>

            <!-- Botão Adicionar Evento -->
            <button type="button" id="btn-adicionar-evento" class="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-primary-600 hover:text-primary-700 dark:text-primary-400">
                + Adicionar Evento
            </button>
        </div>
    </div>
</div>

<script>
    // Definindo variáveis globais para uso nos serviços
    window.API_KEY = '<?php echo $_ENV['API_KEY']; ?>';
    window.API_BASE_URL = '<?php echo $_ENV['API_BASE_URL']; ?>';
    window.ORGANIZACAO_ID = '<?php echo SessionService::getOrganizacaoId(); ?>';
    window.URL_BASE = '<?php echo $_ENV['URL_BASE']; ?>';
</script>

<!-- Scripts na ordem correta de dependência -->
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/criar/js/api.service.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/criar/js/eventos.componentes.service.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/criar/js/cabecalho.service.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/criar/js/eventos.service.js"></script>

<?php require_once __DIR__ . '/../../../components/layout/footer.php'; ?>



