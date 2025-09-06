/**
 * Serviço Ably para mostrar usuários online na página
 */
class AblyService {
    constructor() {
        this.ably = null;
        this.channel = null;
        this.isConnected = false;
        this.usersOnline = new Map(); // Usar Map para melhor controle
        this.userInfo = {
            id: window.USER?.id || null,
            name: window.USER?.nome || window.USER?.name || null
        };
        
        // Validação - não inicializa se não tiver dados do usuário
        if (!this.userInfo.id || !this.userInfo.name) {
            return;
        }
        
        this.init();
    }

    /**
     * Inicializa a conexão com Ably
     */
    async init() {
        try {
            await this.loadAblyScript();
            
            this.ably = new Ably.Realtime("BUV2PA.dZF6kQ:sIO7IMsUB0NpVBRfzhGTxSffAxlBxr3hDJNE8D0zcKk");
            
            this.ably.connection.on('connected', () => {
                this.isConnected = true;
                this.updateOffCanvasStatus('connected');
                this.sendPresence('online');
            });

            this.ably.connection.on('disconnected', () => {
                this.isConnected = false;
                this.updateOffCanvasStatus('disconnected');
            });

            this.ably.connection.on('connecting', () => {
                this.updateOffCanvasStatus('connecting');
            });
            
            this.channel = this.ably.channels.get("build-escala-page");
            
            // Listener único para presença
            this.channel.subscribe('presence', (message) => {
                this.handlePresence(message.data);
            });
            
            this.setupPageEvents();
            
        } catch (error) {
            this.updateOffCanvasStatus('disconnected');
        }
    }

    /**
     * Carrega a biblioteca Ably via CDN
     */
    loadAblyScript() {
        return new Promise((resolve, reject) => {
            if (window.Ably) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://cdn.ably.io/lib/ably.min-1.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Envia presença (online/offline ou dados customizados)
     * @param {string|Object} data - Status ou dados customizados
     */
    async sendPresence(data) {

        
        if (!this.isConnected || !this.channel) {
            return;
        }
        
        try {
            let messageData;
            
            if (typeof data === 'string') {
                // Presença simples (online/offline)
                messageData = {
                    userId: this.userInfo.id,
                    userName: this.userInfo.name,
                    status: data,
                    timestamp: Date.now()
                };
            } else {
                // Dados customizados (voluntários, etc.)
                messageData = data;
            }
            
            await this.channel.publish('presence', messageData);
        } catch (error) {
        }
    }

    /**
     * Manipula eventos de presença
     */
    handlePresence(data) {
        
        // Verifica se é dados de voluntário primeiro
        if (data.action && (data.action === 'voluntario_selecting' || data.action === 'voluntario_removed')) {
            
            // Para voluntários, não ignora próprio usuário - deixa o serviço decidir
            if (window.voluntariosRealtimeService) {
                window.voluntariosRealtimeService.handlePresenceData(data);
            } else {
            }
            return;
        }
        
        
        // Para presença de usuário padrão, ignora próprio usuário
        if (data.userId === this.userInfo.id) {
            return;
        }
        
        // Processa presença de usuário padrão
        const { userId, userName, status } = data;
        
        if (status === 'online') {
            this.usersOnline.set(userId, { name: userName, timestamp: Date.now() });
        } else {
            this.usersOnline.delete(userId);
        }
        
        this.updateOffCanvas();
    }

    /**
     * Atualiza o off canvas com usuários online
     */
    updateOffCanvas() {
        // Verifica se o off canvas service existe
        if (window.globalOffCanvas && typeof window.globalOffCanvas.updateUsersList === 'function') {
            window.globalOffCanvas.updateUsersList(this.usersOnline, this.userInfo);
        }
    }

    /**
     * Atualiza status de conexão no off canvas
     */
    updateOffCanvasStatus(status) {
        if (window.globalOffCanvas && typeof window.globalOffCanvas.updateConnectionStatus === 'function') {
            window.globalOffCanvas.updateConnectionStatus(status);
        }
    }

    /**
     * Configura eventos da página
     */
    setupPageEvents() {
        // Sai quando fecha a página/aba
        window.addEventListener('beforeunload', () => {
            this.sendPresence('offline');
        });
        
        // Detecta mudança de visibilidade da aba
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.sendPresence('offline');
            } else {
                this.sendPresence('online');
            }
        });
        
        // Atualiza off canvas na inicialização
        setTimeout(() => {
            this.updateOffCanvas();
        }, 1000);
    }
}

// Inicializa quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    if (window.USER?.id && (window.USER?.nome || window.USER?.name)) {
        window.ablyService = new AblyService();
    } else {
    }
});
