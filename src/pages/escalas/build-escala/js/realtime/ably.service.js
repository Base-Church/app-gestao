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
            name: window.USER?.name || null
        };
        
        // Validação - não inicializa se não tiver dados do usuário
        if (!this.userInfo.id || !this.userInfo.name) {
            console.error('Dados do usuário inválidos - AblyService não inicializado');
            return;
        }
        
        console.log('Usuário:', this.userInfo.name);
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
                console.log('Ably conectado');
                this.updateOffCanvasStatus('connected');
                this.sendPresence('online');
            });

            this.ably.connection.on('disconnected', () => {
                this.isConnected = false;
                console.log('Ably desconectado');
                this.updateOffCanvasStatus('disconnected');
            });

            this.ably.connection.on('connecting', () => {
                console.log('Conectando ao Ably...');
                this.updateOffCanvasStatus('connecting');
            });
            
            this.channel = this.ably.channels.get("build-escala-page");
            
            // Listener único para presença
            this.channel.subscribe('presence', (message) => {
                this.handlePresence(message.data);
            });
            
            this.setupPageEvents();
            
        } catch (error) {
            console.error('Erro Ably:', error);
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
     * Envia presença (apenas online/offline)
     */
    async sendPresence(status) {
        if (!this.isConnected || !this.channel) return;
        
        try {
            await this.channel.publish('presence', {
                userId: this.userInfo.id,
                userName: this.userInfo.name,
                status: status,
                timestamp: Date.now()
            });
            console.log(`Presença: ${status}`);
        } catch (error) {
            console.error('Erro ao enviar presença:', error);
        }
    }

    /**
     * Manipula eventos de presença
     */
    handlePresence(data) {
        const { userId, userName, status } = data;
        
        // Ignora próprio usuário
        if (userId === this.userInfo.id) return;
        
        if (status === 'online') {
            this.usersOnline.set(userId, { name: userName, timestamp: Date.now() });
            console.log(`${userName} entrou`);
        } else {
            this.usersOnline.delete(userId);
            console.log(`${userName} saiu`);
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
    if (window.USER?.id && window.USER?.name) {
        window.ablyService = new AblyService();
        console.log('AblyService inicializado');
    } else {
        console.error('Dados do usuário não encontrados');
    }
});
