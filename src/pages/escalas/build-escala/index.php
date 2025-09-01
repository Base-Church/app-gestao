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
                            <button type="button" 
                                    data-action="salvar-escala"
                                    class="w-full px-4 py-2 bg-primary-600 hover:bg-primary-600 text-white rounded-lg flex items-center justify-center gap-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                </svg>
                                Criar escala
                            </button>
                        </div>
                    </div>
                </div>
            </div>
          <!-- Container de Itens -->
            <div id="itens-container" class="space-y-4">
                <!-- Os itens serão adicionados dinamicamente aqui -->
            </div>

            <!-- Botão Adicionar Item -->
            <button type="button" id="btn-adicionar-item" class="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-primary-600 hover:text-primary-700 dark:text-primary-400">
                + Adicionar Item
            </button>
        </div>
    </div>
</div>

<style>
    @import url('<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/build-escala/css/animacoes.escala.css');
     @import url('<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/build-escala/css/datepicker.custom.css');
     @import url('<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/build-escala/css/historico-indisponibilidade.css');
</style>

 <link rel="stylesheet" href="https://code.jquery.com/ui/1.14.1/themes/base/jquery-ui.css">
  <script src="https://code.jquery.com/jquery-3.7.1.js"></script>
  <script src="https://code.jquery.com/ui/1.14.1/jquery-ui.js"></script>


<!-- Geral -->
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/build-escala/js/api.service.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/build-escala/js/cabecalho/cabecalho.service.js"></script>

<!-- Eventos -->
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/build-escala/js/eventos/eventos.service.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/build-escala/js/eventos/eventos.componentes.service.js"></script>

<!-- Escala -->
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/build-escala/js/escala/escala.manager.service.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/build-escala/js/escala/escala.service.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/build-escala/js/escala/submit.service.js"></script>

<!-- Atividades -->
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/build-escala/js/atividades/atividades.componentes.service.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/build-escala/js/atividades/atividades.service.js"></script>

<!-- Itens -->
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/build-escala/js/item/item.componentes.service.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/build-escala/js/item/item.manager.service.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/build-escala/js/item/item.service.js"></script>

<!-- voluntarios -->
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/build-escala/js/voluntarios/voluntarios.componentes.service.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/build-escala/js/voluntarios/voluntarios.service.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/build-escala/js/voluntarios/historico-indisponibilidade.service.js"></script>

<!-- Utilitários -->
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/build-escala/js/utils/item.duplicar.service.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/build-escala/js/utils/item.modelos.service.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/build-escala/js/utils/resumo.escala.util.service.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/build-escala/js/utils/json.debug.util.service.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/build-escala/js/utils/eventos.combinacao.util.service.js"></script>

<!-- Escala Editar: Popula campos ao carregar se for edição -->
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/build-escala/js/escala/escala.editar.service.js"></script>

<!-- Inicialização: Detecta modo de edição -->
<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Verifica se há parâmetro id na URL para modo de edição
        const urlParams = new URLSearchParams(window.location.search);
        const escalaId = urlParams.get('id');
        
        if (escalaId) {
            console.log('Modo de edição detectado para escala ID:', escalaId);
            
            // Aguarda um pouco para garantir que todos os serviços estejam carregados
            setTimeout(async () => {
                if (window.EscalaEditarService) {
                    window.EscalaEditarService = await window.EscalaEditarService.inicializar();
                } else {
                    console.error('EscalaEditarService não encontrado');
                }
            }, 500);
        }
    });
</script>

<?php require_once __DIR__ . '/../../../components/layout/footer.php'; ?>



