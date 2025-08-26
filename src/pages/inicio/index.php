<?php
// Configurações da página
$pageTitle = "Inicio";

// Incluir o header
require_once __DIR__ . '/../../components/layout/header.php';
?>


<main class="mt-24 lg:ml-64 px-6 pb-8 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto">
        <!-- Hero Section do Ministério -->
        <div id="ministerio-hero" class="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
            <div class="relative px-4 py-4 sm:px-8 sm:py-12">
                <!-- Layout Mobile (horizontal) -->
                <div class="flex md:hidden items-center space-x-4">
                    <div id="ministerio-foto-mobile" class="flex-shrink-0 w-16 h-16 rounded-full border-2 border-white shadow-lg overflow-hidden">
                        <!-- Foto será inserida via JavaScript -->
                    </div>
                    <div class="flex-1 min-w-0">
                        <h1 id="ministerio-nome-mobile" class="text-lg font-bold text-white truncate">
                            <!-- Nome será inserido via JavaScript -->
                        </h1>
                        <div class="flex items-center mt-1">
                            <span class="text-sm text-white/90">
                                <span id="contador-voluntarios-mobile" class="font-bold">0</span> Voluntários
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Layout Desktop (original) -->
                <div class="hidden md:flex flex-col md:flex-row items-center gap-8">
                    <div class="flex-shrink-0">
                        <div id="ministerio-foto" class="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden">
                            <!-- Foto será inserida via JavaScript -->
                        </div>
                    </div>
                    <div class="flex-1 text-center md:text-left">
                        <h1 id="ministerio-nome" class="text-3xl font-bold text-white mb-2">
                            <!-- Nome será inserido via JavaScript -->
                        </h1>
                        <p id="ministerio-descricao" class="text-lg text-white/90">
                            <!-- Descrição será inserida via JavaScript -->
                        </p>
                    </div>
                    <div class="flex-shrink-0 text-center">
                        <div class="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                            <div class="text-5xl font-bold text-white mb-2">
                                <span id="contador-voluntarios" class="counter-value">0</span>
                            </div>
                            <div class="text-white/90">Voluntários</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Cards de Métricas -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Outras métricas aqui -->
        </div>

        <!-- Rest of the existing dashboard content -->
        <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Bem-vindo ao painel de controle do sistema de escalas.</p>
        </div>

        <!-- Grid de Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Card de Escalas -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div class="p-5">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <div class="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
                                <svg class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                            </div>
                            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Escalas</h2>
                        </div>
                        <span class="px-2.5 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-full"></span>
                    </div>
                    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Gerencie todas as escalas de ministério.</p>
                    <div class="mt-4">
                        <a href="<?php echo $_ENV['URL_BASE']; ?>/src/pages/escalas" class="inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                            Ver todas as escalas
                            <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Card de Ministérios -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div class="p-5">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <div class="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                                <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                            </div>
                            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Voluntários</h2>
                        </div>
                    </div>
                    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Gerencie os voluntários do ministério.</p>
                    <div class="mt-4">
                        <a href="<?php echo $_ENV['URL_BASE']; ?>/src/pages/voluntarios" class="inline-flex items-center text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                            Ver todos os voluntários
                            <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Card de Aniversariantes -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div class="p-5">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <div class="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"/>
                                </svg>
                            </div>
                            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Aniversariantes</h2>
                        </div>
                    </div>
                    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Veja os aniversariantes do mês.</p>
                    <div class="mt-4">
                        <a href="<?php echo $_ENV['URL_BASE']; ?>/src/pages/aniversariantes" class="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                            Ver aniversariantes
                            <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<!-- Scripts com caminhos corrigidos -->
<script type="module">
    import { MinisterioManager } from '<?= $_ENV['URL_BASE'] ?>/src/pages/inicio/js/ministerio.js';
    
    document.addEventListener('DOMContentLoaded', () => {
        try {
            const manager = new MinisterioManager();
            manager.renderDashboard();
        } catch (error) {
            console.error('Erro ao inicializar MinisterioManager:', error);
        }
    });
</script>

<?php require_once __DIR__ . '/../../components/layout/footer.php'; ?>
