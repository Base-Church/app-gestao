<?php
$pageTitle = "Processos e Etapas";
require_once __DIR__ . '/../../components/layout/header.php';
?>

<style>
/* Estilos para Drag & Drop */
.sortable-ghost {
    opacity: 0.4;
    transform: rotate(5deg);
    box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.3);
}

.sortable-chosen {
    cursor: grabbing !important;
}

.sortable-drag {
    transform: rotate(5deg);
    z-index: 9999;
    box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.3);
}

.sortable-fallback {
    opacity: 0.8;
    background: #3B82F6;
    color: white;
    border-radius: 8px;
    transform: rotate(5deg);
    box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.3);
}

.dragging-active {
    background: linear-gradient(135deg, #EBF4FF 0%, #DBEAFE 100%);
    border-color: #3B82F6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.drop-zone-highlight {
    border-color: #10B981;
    background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.draggableEtapa:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.15);
}

.draggableEtapa.sortable-chosen {
    transform: rotate(5deg) scale(1.05);
    box-shadow: 0 12px 30px -8px rgba(0, 0, 0, 0.3);
    z-index: 1000;
}

/* Animações suaves */
.draggableEtapa {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.etapasContainer {
    transition: all 0.3s ease;
}

/* Estados dark mode */
.dark .dragging-active {
    background: linear-gradient(135deg, #1E293B 0%, #334155 100%);
    border-color: #3B82F6;
}

.dark .drop-zone-highlight {
    background: linear-gradient(135deg, #064E3B 0%, #065F46 100%);
    border-color: #10B981;
}

/* Loading states */
@keyframes pulse-slow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.loading-pulse {
    animation: pulse-slow 2s infinite;
}

/* Hover effects melhorados */
.btnAddEtapa:hover, .btnDeleteProcesso:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btnDeleteEtapa:hover {
    background: rgba(239, 68, 68, 0.1);
}

/* Indicadores visuais */
.process-card {
    transition: all 0.3s ease;
    border-left: 4px solid transparent;
}

.process-card:hover {
    border-left-color: #3B82F6;
    transform: translateY(-1px);
}

/* Responsive melhorado */
@media (max-width: 768px) {
    .etapasContainer {
        flex-direction: column;
        gap: 12px;
    }
    
    .draggableEtapa {
        min-width: 100%;
        max-width: 100%;
    }
}
</style>

<main class="with-sidebar mt-24 px-6 pb-8 dark:bg-gray-900">
  <div class="max-w-8xl mx-auto">
        <!-- Cabeçalho -->
        <div class="mb-8 flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Processos e Etapas</h1>
                <p class="mt-2 text-sm text-gray-700 dark:text-gray-400">
                    Gerencie processos e etapas de forma dinâmica e intuitiva com drag & drop.
                </p>
            </div>
            <div>
                <button id="btnNovoProcesso" class="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-all duration-200 hover:scale-105">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Novo Processo
                </button>
            </div>
        </div>

        <!-- Grid Principal -->
        <div id="processosContainer" class="space-y-8">
            <!-- Processos e etapas serão renderizados aqui -->
        </div>
    </div>
</main>

<!-- Modal Novo Processo -->
<div id="modalNovoProcesso" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 hidden backdrop-blur-sm">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md mx-4 transform transition-all">
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Novo Processo</h2>
            <button id="btnCancelarProcesso" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
        
        <form id="formNovoProcesso" class="space-y-6">
            <div id="processoErrorMsg" class="hidden text-red-500 text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"></div>
            
            <div>
                <label for="nomeProcesso" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nome do Processo</label>
                <input type="text" id="nomeProcesso" name="nome" placeholder="Ex: Processo de Membresia" class="w-full px-4 py-3 rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all" required>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
                <button type="button" id="btnCancelarProcesso2" class="px-6 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">Cancelar</button>
                <button type="submit" class="px-6 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 transition-all">
                    <span class="inline-flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Criar Processo
                    </span>
                </button>
            </div>
        </form>
    </div>
</div>

<?php require_once __DIR__ . '/../../components/layout/footer.php'; ?>

<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/processos/js/main.js"></script>
