<?php
/**
 * Serviço para integração com Socket.IO
 * Gerencia a comunicação entre o PHP e o servidor Node.js
 */

class RealtimeService {
    private static $socketUrl;
    private static $initialized = false;

    public static function init() {
        if (!self::$initialized) {
            // URL do servidor Socket.IO (pode vir de variável de ambiente)
            self::$socketUrl = $_ENV['SOCKET_URL'] ?? 'http://localhost:3000';
            self::$initialized = true;
        }
    }

    /**
     * Gera dados do usuário para autenticação no Socket.IO
     */
    public static function getUserSocketData() {
        self::init();
        
        if (!SessionService::isLoggedIn()) {
            return null;
        }

        $user = SessionService::getUser();
        
        return [
            'sessionId' => session_id(),
            'userId' => md5($user['nome'] . $user['organizacao_id']), // ID único baseado no nome e organização
            'userName' => $user['nome'],
            'organizacaoId' => $user['organizacao_id'],
            'ministerioAtual' => $user['ministerio_atual'],
            'nivel' => $user['nivel'],
            'socketUrl' => self::$socketUrl
        ];
    }

    /**
     * Obter usuários online de uma organização
     */
    public static function getOnlineUsers($organizacaoId = null) {
        self::init();
        
        if (!$organizacaoId) {
            $organizacaoId = SessionService::getOrganizacaoId();
        }

        $url = self::$socketUrl . "/api/users-online/" . $organizacaoId;
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json'
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 200 && $response) {
            return json_decode($response, true);
        }

        return ['success' => false, 'data' => [], 'total' => 0];
    }

    /**
     * Limpar usuários offline antigos
     */
    public static function cleanupOfflineUsers() {
        self::init();
        
        $url = self::$socketUrl . "/api/cleanup-offline-users";
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json'
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 200 && $response) {
            return json_decode($response, true);
        }

        return ['success' => false, 'message' => 'Erro ao limpar usuários offline'];
    }

    /**
     * Verificar se o servidor Socket.IO está rodando
     */
    public static function isServerRunning() {
        self::init();
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, self::$socketUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 3);
        curl_setopt($ch, CURLOPT_NOBODY, true);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return $httpCode === 200;
    }

    /**
     * Gerar script JavaScript para conexão com Socket.IO
     */
    public static function generateClientScript() {
        $userData = self::getUserSocketData();
        
        if (!$userData) {
            return '';
        }

        return "
        <script src=\"{$userData['socketUrl']}/socket.io/socket.io.js\"></script>
        <script>
        window.REALTIME_CONFIG = " . json_encode($userData) . ";
        
        // Inicializar conexão Socket.IO
        window.initializeRealtime = function() {
            if (typeof io === 'undefined') {
                console.warn('Socket.IO não carregado');
                return null;
            }

            const socket = io(window.REALTIME_CONFIG.socketUrl, {
                auth: {
                    sessionId: window.REALTIME_CONFIG.sessionId,
                    userId: window.REALTIME_CONFIG.userId,
                    userName: window.REALTIME_CONFIG.userName,
                    organizacaoId: window.REALTIME_CONFIG.organizacaoId
                }
            });

            // Eventos do socket
            socket.on('connect', function() {
                console.log('Conectado ao servidor em tempo real');
                
                // Notificar página atual
                const currentPage = window.location.pathname.split('/').pop() || 'inicio';
                socket.emit('page-changed', { page: currentPage });
            });

            socket.on('disconnect', function() {
                console.log('Desconectado do servidor em tempo real');
            });

            socket.on('users-online', function(users) {
                console.log('Usuários online:', users);
                window.dispatchEvent(new CustomEvent('users-online-updated', { detail: users }));
            });

            socket.on('user-connected', function(user) {
                console.log('Usuário conectado:', user);
                window.dispatchEvent(new CustomEvent('user-connected', { detail: user }));
            });

            socket.on('user-disconnected', function(user) {
                console.log('Usuário desconectado:', user);
                window.dispatchEvent(new CustomEvent('user-disconnected', { detail: user }));
            });

            socket.on('user-page-changed', function(data) {
                console.log('Usuário mudou de página:', data);
                window.dispatchEvent(new CustomEvent('user-page-changed', { detail: data }));
            });

            socket.on('user-status-changed', function(data) {
                console.log('Status do usuário mudou:', data);
                window.dispatchEvent(new CustomEvent('user-status-changed', { detail: data }));
            });

            // Detectar mudanças de página
            let currentPath = window.location.pathname;
            const observer = new MutationObserver(function() {
                if (currentPath !== window.location.pathname) {
                    currentPath = window.location.pathname;
                    const page = currentPath.split('/').pop() || 'inicio';
                    socket.emit('page-changed', { page: page });
                }
            });
            
            observer.observe(document.body, { childList: true, subtree: true });

            // Detectar atividade do usuário
            let activityTimeout;
            const reportActivity = function() {
                clearTimeout(activityTimeout);
                activityTimeout = setTimeout(() => {
                    socket.emit('user-activity', { 
                        activity: 'idle',
                        tabActive: !document.hidden 
                    });
                }, 30000); // 30 segundos de inatividade
                
                socket.emit('user-activity', { 
                    activity: 'active',
                    tabActive: !document.hidden 
                });
            };

            ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
                document.addEventListener(event, reportActivity, true);
            });

            // Detectar quando o usuário sai da aba
            document.addEventListener('visibilitychange', function() {
                socket.emit('user-activity', { 
                    activity: document.hidden ? 'away' : 'active',
                    tabActive: !document.hidden 
                });
            });

            // Detectar logout/fechamento da página
            window.addEventListener('beforeunload', function() {
                socket.emit('user-logout');
            });

            return socket;
        };

        // Auto-inicializar quando o DOM estiver pronto
        document.addEventListener('DOMContentLoaded', function() {
            window.realtimeSocket = window.initializeRealtime();
        });
        </script>
        ";
    }
}
