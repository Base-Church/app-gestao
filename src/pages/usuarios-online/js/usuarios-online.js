export class UsuariosOnlineManager {
    constructor() {
        this.baseUrl = window.APP_CONFIG?.baseUrl;
        this.usuarios = [];
        this.isTabActive = true;
        this.initTabVisibilityDetection();
    }

    initTabVisibilityDetection() {
        // Detectar se a aba está ativa ou não
        document.addEventListener('visibilitychange', () => {
            this.isTabActive = !document.hidden;
            this.updateTabStatus();
        });

        // Detectar foco/blur da janela
        window.addEventListener('focus', () => {
            this.isTabActive = true;
            this.updateTabStatus();
        });

        window.addEventListener('blur', () => {
            this.isTabActive = false;
            this.updateTabStatus();
        });
    }

    updateTabStatus() {
        if (window.realtimeSocket) {
            window.realtimeSocket.emit('user-activity', { 
                activity: this.isTabActive ? 'active' : 'away',
                tabActive: this.isTabActive
            });
        }
    }

    async init() {
        this.setupRealtimeListeners();
        await this.loadUsuariosOnline();
        this.renderUsuarios();
    }

    setupRealtimeListeners() {
        // Ouvir eventos de usuários online
        window.addEventListener('users-online-updated', (event) => {
            this.usuarios = event.detail || [];
            this.renderUsuarios();
        });

        window.addEventListener('user-connected', (event) => {
            const newUser = event.detail;
            const existingIndex = this.usuarios.findIndex(u => u.userId === newUser.userId);
            if (existingIndex === -1) {
                this.usuarios.push({
                    userId: newUser.userId,
                    userName: newUser.userName,
                    organizacaoId: newUser.organizacaoId,
                    status: 'online',
                    connectedAt: new Date().toISOString(),
                    currentPage: 'inicio'
                });
                this.renderUsuarios();
                this.showNotification(`${newUser.userName} entrou online`, 'success');
            }
        });

        window.addEventListener('user-disconnected', (event) => {
            const user = event.detail;
            this.usuarios = this.usuarios.filter(u => u.userId !== user.userId);
            this.renderUsuarios();
            this.showNotification(`${user.userName} saiu`, 'info');
        });

        window.addEventListener('user-page-changed', (event) => {
            const { userId, currentPage, userName } = event.detail;
            const userIndex = this.usuarios.findIndex(u => u.userId === userId);
            if (userIndex !== -1) {
                this.usuarios[userIndex].currentPage = currentPage;
                this.renderUsuarios();
            }
        });

        window.addEventListener('user-status-changed', (event) => {
            const { userId, activity, tabActive } = event.detail;
            const userIndex = this.usuarios.findIndex(u => u.userId === userId);
            if (userIndex !== -1) {
                this.usuarios[userIndex].activity = activity;
                this.usuarios[userIndex].tabActive = tabActive;
                this.renderUsuarios();
            }
        });
    }

    async loadUsuariosOnline() {
        try {
            if (!window.USER?.organizacao_id) {
                console.error('ID da organização não encontrado');
                return;
            }

            const response = await fetch(`${window.REALTIME_CONFIG?.socketUrl}/api/users-online/${window.USER.organizacao_id}`);
            if (!response.ok) throw new Error('Erro ao carregar usuários online');
            
            const data = await response.json();
            this.usuarios = data.data || [];
            
        } catch (error) {
            console.error('Erro ao carregar usuários online:', error);
            this.usuarios = [];
        }
    }

    renderUsuarios() {
        const container = document.getElementById('usuarios-list');
        const counter = document.getElementById('contador-usuarios-online');
        
        if (!container) return;

        // Atualizar contador
        if (counter) {
            this.animateCounter('contador-usuarios-online', this.usuarios.length);
        }

        // Renderizar lista
        if (this.usuarios.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                    </div>
                    <p class="text-gray-500 dark:text-gray-400">Nenhum usuário online no momento</p>
                </div>
            `;
            return;
        }

        const usuariosHtml = this.usuarios.map(usuario => this.renderUsuarioCard(usuario)).join('');
        container.innerHTML = usuariosHtml;
    }

    renderUsuarioCard(usuario) {
        const isAway = usuario.activity === 'away' || usuario.tabActive === false;
        const timeOnline = this.getTimeOnline(usuario.connectedAt);
        const statusColor = isAway ? 'bg-yellow-400' : 'bg-green-400';
        const statusText = isAway ? 'Ausente' : 'Online';
        const pageName = this.getPageDisplayName(usuario.currentPage);

        return `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="relative">
                            <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center">
                                <span class="text-sm font-medium text-primary-600 dark:text-primary-400">
                                    ${usuario.userName.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div class="absolute -bottom-1 -right-1 w-4 h-4 ${statusColor} rounded-full border-2 border-white dark:border-gray-800"></div>
                        </div>
                        <div>
                            <h3 class="text-sm font-medium text-gray-900 dark:text-white">${usuario.userName}</h3>
                            <p class="text-xs text-gray-500 dark:text-gray-400">
                                <span class="inline-flex items-center">
                                    <span class="w-2 h-2 ${statusColor} rounded-full mr-1"></span>
                                    ${statusText}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                            Online há ${timeOnline}
                        </div>
                        <div class="text-xs text-primary-600 dark:text-primary-400 mt-1">
                            📍 ${pageName}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getPageDisplayName(page) {
        const pageNames = {
            'inicio': 'Início',
            'escalas': 'Escalas',
            'voluntarios': 'Voluntários',
            'ministerios': 'Ministérios',
            'aniversariantes': 'Aniversariantes',
            'usuarios-online': 'Usuários Online',
            'configuracoes': 'Configurações'
        };
        
        return pageNames[page] || page.charAt(0).toUpperCase() + page.slice(1);
    }

    getTimeOnline(connectedAt) {
        if (!connectedAt) return '0m';
        
        const now = new Date();
        const connected = new Date(connectedAt);
        const diff = Math.floor((now - connected) / 1000); // segundos

        if (diff < 60) return `${diff}s`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m`;
        return `${Math.floor(diff / 3600)}h`;
    }

    animateCounter(elementId, target) {
        const element = document.getElementById(elementId);
        if (!element) return;

        target = parseInt(target) || 0;
        let current = parseInt(element.textContent) || 0;
        
        if (current === target) return;

        const duration = 500; // 0.5 segundos
        const steps = 20;
        const increment = (target - current) / steps;

        let step = 0;
        const timer = setInterval(() => {
            step++;
            current += increment;
            
            if (step >= steps) {
                clearInterval(timer);
                element.textContent = target;
            } else {
                element.textContent = Math.round(current);
            }
        }, duration / steps);
    }

    showNotification(message, type = 'info') {
        // Criar notificação simples
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
        
        const bgColor = type === 'success' ? 'bg-green-500' : 
                       type === 'error' ? 'bg-red-500' : 'bg-blue-500';
        
        notification.classList.add(bgColor);
        notification.innerHTML = `
            <div class="flex items-center space-x-2 text-white">
                <span class="text-sm">${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => notification.classList.remove('translate-x-full'), 100);
        
        // Auto remover após 3 segundos
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    async cleanupOfflineUsers() {
        try {
            const response = await fetch(`${window.REALTIME_CONFIG?.socketUrl}/api/cleanup-offline-users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                this.showNotification(`${result.removedCount} usuários offline removidos`, 'success');
                await this.loadUsuariosOnline();
                this.renderUsuarios();
            }
        } catch (error) {
            console.error('Erro ao limpar usuários offline:', error);
            this.showNotification('Erro ao limpar usuários offline', 'error');
        }
    }
}
