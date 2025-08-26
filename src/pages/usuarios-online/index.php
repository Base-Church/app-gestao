<?php
// Configurações da página
$pageTitle = "Usuários Online";

// Incluir o header
require_once __DIR__ . '/../../components/layout/header.php';
?>

<main class="mt-24 lg:ml-64 px-6 pb-8 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto">
        <!-- Hero Section -->
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
            <div class="relative px-4 py-4 sm:px-8 sm:py-12">
                <!-- Layout Mobile (horizontal) -->
                <div class="flex md:hidden items-center space-x-4">
                    <div class="flex-shrink-0 w-16 h-16 rounded-full border-2 border-white shadow-lg overflow-hidden bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h1 class="text-lg font-bold text-white truncate">
                            Usuários Online
                        </h1>
                        <div class="flex items-center mt-1">
                            <span class="text-sm text-white/90">
                                <span id="contador-usuarios-online-mobile" class="font-bold">0</span> usuários conectados
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Layout Desktop -->
                <div class="hidden md:flex flex-col md:flex-row items-center gap-8">
                    <div class="flex-shrink-0">
                        <div class="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white/10 backdrop-blur-sm flex items-center justify-center">
                            <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                            </svg>
                        </div>
                    </div>
                    <div class="flex-1 text-center md:text-left">
                        <h1 class="text-3xl font-bold text-white mb-2">
                            Usuários Online
                        </h1>
                        <p class="text-lg text-white/90">
                            Acompanhe em tempo real quem está conectado na plataforma
                        </p>
                    </div>
                    <div class="flex-shrink-0 text-center">
                        <div class="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                            <div class="text-5xl font-bold text-white mb-2">
                                <span id="contador-usuarios-online" class="counter-value">0</span>
                            </div>
                            <div class="text-white/90">Online</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Controles -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Usuários Conectados</h2>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Lista atualizada em tempo real</p>
            </div>
            <div class="flex gap-3">
                <button onclick="usuariosManager.loadUsuariosOnline().then(() => usuariosManager.renderUsuarios())" class="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    Atualizar
                </button>
                <button onclick="usuariosManager.cleanupOfflineUsers()" class="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    Limpar Offline
                </button>
            </div>
        </div>

        <!-- Status da Conexão -->
        <div id="connection-status" class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div class="flex items-center">
                <div class="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                <span class="text-sm text-green-800 dark:text-green-200">Conectado ao servidor em tempo real</span>
            </div>
        </div>

        <!-- Lista de Usuários -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div class="p-6">
                <div id="usuarios-list" class="space-y-4">
                    <!-- Usuários serão inseridos aqui via JavaScript -->
                    <div class="text-center py-12">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                        <p class="text-gray-500 dark:text-gray-400 mt-4">Carregando usuários online...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<!-- Scripts -->
<script type="module">
    import { UsuariosOnlineManager } from '<?= $_ENV['URL_BASE'] ?>/src/pages/usuarios-online/js/usuarios-online.js';
    
    let usuariosManager;
    
    document.addEventListener('DOMContentLoaded', async () => {
        try {
            usuariosManager = new UsuariosOnlineManager();
            window.usuariosManager = usuariosManager; // Tornar global para botões
            await usuariosManager.init();
        } catch (error) {
            console.error('Erro ao inicializar UsuariosOnlineManager:', error);
        }
    });

    // Atualizar status da conexão
    window.addEventListener('load', () => {
        const updateConnectionStatus = () => {
            const statusEl = document.getElementById('connection-status');
            if (!statusEl) return;

            if (window.realtimeSocket?.connected) {
                statusEl.className = 'mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg';
                statusEl.innerHTML = `
                    <div class="flex items-center">
                        <div class="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                        <span class="text-sm text-green-800 dark:text-green-200">Conectado ao servidor em tempo real</span>
                    </div>
                `;
            } else {
                statusEl.className = 'mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg';
                statusEl.innerHTML = `
                    <div class="flex items-center">
                        <div class="w-3 h-3 bg-red-400 rounded-full mr-3"></div>
                        <span class="text-sm text-red-800 dark:text-red-200">Desconectado do servidor</span>
                    </div>
                `;
            }
        };

        // Verificar conexão a cada 5 segundos
        setInterval(updateConnectionStatus, 5000);
        updateConnectionStatus();
    });
</script>

<?php require_once __DIR__ . '/../../components/layout/footer.php'; ?>
