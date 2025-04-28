<?php
require_once __DIR__ . '/../../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../');
$dotenv->load();

$pageTitle = 'Início';

// Include header (que já inclui navbar e sidemenu)
include __DIR__ . '/../../components/layout/header.php';
?>

<main class="mt-24 lg:ml-64 px-6 pb-8 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto">
        <!-- Cabeçalho da Página -->
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
                            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Ministérios</h2>
                        </div>
                        <span class="px-2.5 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full"></span>
                    </div>
                    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Gerencie os ministérios e suas equipes.</p>
                    <div class="mt-4">
                        <a href="<?php echo $_ENV['URL_BASE']; ?>/src/pages/ministerios" class="inline-flex items-center text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                            Ver todos os ministérios
                            <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Card de Configurações -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div class="p-5">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <div class="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                            </div>
                            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Configurações</h2>
                        </div>
                    </div>
                    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Ajuste as configurações do sistema.</p>
                    <div class="mt-4">
                        <a href="<?php echo $_ENV['URL_BASE']; ?>/src/pages/configuracoes" class="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                            Ir para configurações
                            <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Seção de Atividade Recente -->
        <div class="mt-8">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Atividade Recente</h2>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div class="p-4">
                    <div class="space-y-4">
                        <!-- Item de Atividade -->
                        <div class="flex items-start space-x-4">
                            <div class="flex-shrink-0">
                                <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                                    <svg class="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                    </svg>
                                </div>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900 dark:text-white">
                                    Nova escala criada
                                </p>
                                <p class="text-sm text-gray-600 dark:text-gray-400">
                                    Uma nova escala foi criada para o ministério de louvor
                                </p>
                                <span class="text-xs text-gray-500 dark:text-gray-500">
                                    Há 2 horas
                                </span>
                            </div>
                        </div>

                        <!-- Item de Atividade -->
                        <div class="flex items-start space-x-4">
                            <div class="flex-shrink-0">
                                <div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                                    <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                                    </svg>
                                </div>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900 dark:text-white">
                                    Escala atualizada
                                </p>
                                <p class="text-sm text-gray-600 dark:text-gray-400">
                                    A escala do próximo domingo foi atualizada
                                </p>
                                <span class="text-xs text-gray-500 dark:text-gray-500">
                                    Há 5 horas
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<?php require_once __DIR__ . '/../../components/layout/footer.php'; ?>
