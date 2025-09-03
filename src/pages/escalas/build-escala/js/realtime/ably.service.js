/**
 * Serviço Ably para mostrar usuários online na página
 * Responsável por mostrar apenas quem está na página em tempo real
 */
class AblyService {
    constructor() {
        this.ably = null;
        this.channel = null;
        this.isConnected = false;
        this.currentPage = 'build-escala';
        this.usersOnline = [];
        this.userInfo = {
            id: window.USER?.id || 'user_' + Date.now(),
            name: window.USER?.name || 'Usuário Anônimo',
            organizacao_id: window.USER?.organizacao_id || null,
            ministerio_atual: window.USER?.ministerio_atual || null
        };
        
        console.log('Usuário atual:', this.userInfo);
        
        this.init();
        this.createOnlineUsersWidget();
        
        // Limpa usuários inativos a cada 30 segundos
        setInterval(() => this.cleanupInactiveUsers(), 30000);
    }

    /**
     * Inicializa a conexão com Ably
     */
    async init() {
        try {
            // Carrega a biblioteca Ably via CDN
            await this.loadAblyScript();
            
            // Conecta ao Ably com a API key
            this.ably = new Ably.Realtime("BUV2PA.dZF6kQ:sIO7IMsUB0NpVBRfzhGTxSffAxlBxr3hDJNE8D0zcKk");
            
            // Configura eventos de conexão
            this.setupConnectionEvents();
            
            // Cria o canal de comunicação
            this.channel = this.ably.channels.get("build-escala-page");
            
            // Configura listeners do canal
            this.setupChannelListeners();
            
            // Envia presença inicial
            this.sendPresenceUpdate('online');
            
            console.log('Ably Service inicializado - monitorando usuários online');
        } catch (error) {
            console.error('Erro ao inicializar Ably Service:', error);
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
     * Configura eventos de conexão do Ably
     */
    setupConnectionEvents() {
        this.ably.connection.on('connected', () => {
            this.isConnected = true;
            console.log('Conectado ao Ably!');
            
            // Envia presença quando conectar
            this.sendPresenceUpdate('online');
        });

        this.ably.connection.on('disconnected', () => {
            this.isConnected = false;
            console.log('Desconectado do Ably');
        });

        this.ably.connection.on('failed', (error) => {
            console.error('Falha na conexão Ably:', error);
        });
    }

    /**
     * Configura listeners do canal
     */
    setupChannelListeners() {
        // Listener para mensagens de presença
        this.channel.subscribe('user-presence', (message) => {
            console.log('Usuário online:', message.data.user.name);
            this.handleUserPresence(message.data);
        });
    }

    /**
     * Envia atualização de presença do usuário
     * @param {string} status - 'online', 'away', 'offline'
     */
    async sendPresenceUpdate(status = 'online') {
        if (!this.isConnected || !this.channel) {
            console.warn('Ably não conectado, aguardando...');
            return;
        }

        const presenceData = {
            user: {
                id: this.userInfo.id,
                name: this.userInfo.name,
                organizacao_id: this.userInfo.organizacao_id,
                ministerio_atual: this.userInfo.ministerio_atual
            },
            status: status,
            page: this.currentPage,
            timestamp: new Date().toISOString()
        };

        try {
            await this.channel.publish('user-presence', presenceData);
            console.log('Presença enviada:', this.userInfo.name, status);
        } catch (error) {
            console.error('Erro ao enviar presença:', error);
        }
    }

    /**
     * Manipula eventos de presença de outros usuários
     * @param {Object} data - Dados de presença recebidos
     */
    handleUserPresence(data) {
        const userId = data.user.id;
        const userName = data.user.name;
        const status = data.status;
        
        // Não processa eventos do próprio usuário
        if (userId === this.userInfo.id) {
            return;
        }
        
        if (status === 'online') {
            // Adiciona usuário à lista se não existir
            if (!this.usersOnline.find(u => u.id === userId)) {
                this.usersOnline.push({
                    id: userId,
                    name: userName,
                    timestamp: new Date()
                });
                console.log(`${userName} entrou na página`);
            }
        } else if (status === 'offline' || status === 'away') {
            // Remove usuário da lista
            const initialLength = this.usersOnline.length;
            this.usersOnline = this.usersOnline.filter(u => u.id !== userId);
            if (this.usersOnline.length < initialLength) {
                console.log(`${userName} saiu da página`);
            }
        }
        
        // Atualiza o widget de usuários online
        this.updateOnlineUsersWidget();
    }

    /**
     * Cria o widget de usuários online
     */
    createOnlineUsersWidget() {
        const widget = document.createElement('div');
        widget.id = 'online-users-widget';
        widget.className = 'fixed top-20 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-xs';
        widget.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Usuários Online</h3>
                <span id="online-count" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                    <span class="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                    1
                </span>
            </div>
            <div id="online-users-list" class="space-y-2">
                <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                        <span class="text-primary-700 dark:text-primary-300 font-medium text-xs">
                            ${this.userInfo.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <span class="text-sm text-gray-700 dark:text-gray-300">${this.userInfo.name} (você)</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(widget);
    }

    /**
     * Atualiza o widget com a lista de usuários online
     */
    updateOnlineUsersWidget() {
        const countElement = document.getElementById('online-count');
        const listElement = document.getElementById('online-users-list');
        
        if (!countElement || !listElement) return;
        
        // Filtra apenas usuários diferentes do atual
        const otherUsers = this.usersOnline.filter(u => u.id !== this.userInfo.id);
        
        // Conta incluindo o usuário atual
        const totalUsers = otherUsers.length + 1;
        countElement.innerHTML = `
            <span class="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
            ${totalUsers}
        `;
        
        // Monta a lista começando com o usuário atual
        let usersHtml = `
            <div class="flex items-center space-x-2">
                <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                    <span class="text-primary-700 dark:text-primary-300 font-medium text-xs">
                        ${this.userInfo.name.charAt(0).toUpperCase()}
                    </span>
                </div>
                <span class="text-sm text-gray-700 dark:text-gray-300">${this.userInfo.name} (você)</span>
            </div>
        `;
        
        // Adiciona outros usuários
        otherUsers.forEach(user => {
            usersHtml += `
                <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <span class="text-gray-700 dark:text-gray-300 font-medium text-xs">
                            ${user.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <span class="text-sm text-gray-700 dark:text-gray-300">${user.name}</span>
                </div>
            `;
        });
        
        listElement.innerHTML = usersHtml;
    }

    /**
     * Remove usuários inativos há mais de 2 minutos
     */
    cleanupInactiveUsers() {
        const now = new Date();
        const initialCount = this.usersOnline.length;
        
        this.usersOnline = this.usersOnline.filter(user => {
            const timeDiff = now - user.timestamp;
            return timeDiff < 120000; // 2 minutos
        });
        
        if (this.usersOnline.length !== initialCount) {
            console.log('Usuários inativos removidos');
            this.updateOnlineUsersWidget();
        }
    }

    /**
     * Configura eventos de visibilidade da página
     */
    setupPageVisibility() {
        // Detecta quando o usuário muda de aba ou minimiza
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.sendPresenceUpdate('away');
            } else {
                this.sendPresenceUpdate('online');
            }
        });

        // Detecta foco/blur da janela
        window.addEventListener('focus', () => {
            this.sendPresenceUpdate('online');
        });

        window.addEventListener('blur', () => {
            this.sendPresenceUpdate('away');
        });

        // Detecta quando o usuário sai da página
        window.addEventListener('beforeunload', () => {
            this.sendPresenceUpdate('offline');
        });
    }

    /**
     * Fecha a conexão com Ably
     */
    disconnect() {
        if (this.ably) {
            this.sendPresenceUpdate('offline');
            this.ably.connection.close();
        }
    }
}

// Inicializa o serviço quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    if (window.USER) {
        window.ablyService = new AblyService();
        
        // Configura eventos de visibilidade
        window.ablyService.setupPageVisibility();
        
        console.log('AblyService inicializado - mostrando usuários online na página');
    } else {
        console.error('Usuário não encontrado. AblyService não foi inicializado.');
    }
});
