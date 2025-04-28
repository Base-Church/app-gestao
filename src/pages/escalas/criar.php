<?php
require_once __DIR__ . '/../../../vendor/autoload.php';
require_once __DIR__ . '/../../services/SessionService.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../');
$dotenv->load();

$pageTitle = 'Criar Escala';
include __DIR__ . '/../../components/layout/header.php';
?>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<div class="p-4 sm:ml-64">
    <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
        <form class="space-y-6">
            <!-- Cabeçalho da Escala -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome da Escala</label>
                        <input type="text" class="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo</label>
                        <select class="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                            <option >- Escolher -</option>
                            <option value="semanal">Semanal</option>
                            <option value="mensal">Mensal</option>
                            <option value="avulso">Avulso</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Data Início</label>
                        <input type="date" class="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Data Término</label>
                        <input type="date" class="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                    </div>
                </div>
            </div>

            <!-- Container de Eventos -->
            <div id="eventos-container" class="space-y-4">
                <!-- Os eventos serão adicionados dinamicamente aqui -->
            </div>

            <!-- Botão Adicionar Evento -->
            <button type="button" id="btn-adicionar-evento" class="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-primary-600 hover:text-primary-700 dark:text-primary-400">
                + Adicionar Evento
            </button>

            <!-- Botão Salvar -->
            <div class="flex justify-end">
                <button type="submit" class="px-6 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-lg flex items-center space-x-2">
                    <span>Salvar Escala</span>
                    <div class="hidden animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" id="spinner-submit"></div>
                </button>
            </div>
        </form>
    </div>
</div>

<?php require_once __DIR__ . '/templates.php'; ?>
<!-- Definir variáveis globais -->
<script>
    const API_KEY = '<?php echo $_ENV['API_KEY']; ?>';
    const API_BASE_URL = '<?php echo $_ENV['API_BASE_URL']; ?>';
    const ORGANIZACAO_ID = '<?php echo SessionService::getOrganizacaoId(); ?>';
    const URL_BASE = '<?php echo $_ENV['URL_BASE']; ?>';
</script>

<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/js/notification-manager.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/js/get-eventos.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/js/get-atividades.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/js/get-voluntarios.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/js/get-modelos.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/js/dynamic-fields-manager.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/js/main.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/js/escala-service.js"></script>

<?php require_once __DIR__ . '/../../components/layout/footer.php'; ?>
