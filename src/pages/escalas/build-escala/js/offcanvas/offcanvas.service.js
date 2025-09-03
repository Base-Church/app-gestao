/**
 * Serviço para gerenciar o Off Canvas Global
 * Controla a abertura, fechamento e conteúdo do painel global
 */
class OffCanvasService {
    constructor() {
        this.isOpen = false;
        this.offCanvas = null;
        this.overlay = null;
        this.openButton = null;
        this.closeButton = null;
        this.usersListElement = null;
        this.userCountElement = null;
        this.connectionStatusElement = null;
        
        this.init();
    }

    /**
     * Inicializa o serviço
     */
    init() {
        // Aguarda o DOM estar carregado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupElements());
        } else {
            this.setupElements();
        }
    }

    /**
     * Configura os elementos do DOM
     */
    setupElements() {
        this.offCanvas = document.getElementById('global-offcanvas');
        this.usersListElement = document.getElementById('global-users-list');
        this.userCountElement = document.getElementById('global-user-count');
        this.connectionStatusElement = document.getElementById('global-connection-status');

        if (!this.offCanvas) {
            console.warn('Elementos do Global Off Canvas não encontrados');
            return;
        }

        console.log('Global Off Canvas inicializado como elemento fixo');
    }

    /**
     * Atualiza a lista de usuários online
     * @param {Map} usersOnline - Map com usuários online
     * @param {Object} currentUser - Usuário atual
     */
    updateUsersList(usersOnline, currentUser) {
        if (!this.usersListElement || !this.userCountElement) return;

        const totalUsers = usersOnline.size + 1;
        this.userCountElement.textContent = totalUsers;

        // Gera HTML da lista
        let html = '';

        // Adiciona o usuário atual primeiro
        if (currentUser) {
            html += this.createUserHtml(currentUser, true);
        }

        // Adiciona outros usuários
        usersOnline.forEach(user => {
            html += this.createUserHtml(user, false);
        });

        // Se não há usuários, mostra mensagem
        if (totalUsers === 0) {
            html = `
                <div class="text-center text-gray-500 dark:text-gray-400 text-sm py-4">
                    Nenhum usuário online
                </div>
            `;
        }

        this.usersListElement.innerHTML = html;
    }

    /**
     * Cria HTML para um usuário
     * @param {Object} user - Dados do usuário
     * @param {boolean} isCurrentUser - Se é o usuário atual
     * @returns {string} HTML do usuário
     */
    createUserHtml(user, isCurrentUser = false) {
        const initial = (user.name || 'U').charAt(0).toUpperCase();
        const bgColor = isCurrentUser ? 'bg-primary-100 dark:bg-primary-900/20' : 'bg-gray-100 dark:bg-gray-700';
        const textColor = isCurrentUser ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300';
        const nameColor = isCurrentUser ? 'text-primary-900 dark:text-primary-100' : 'text-gray-900 dark:text-gray-100';
        const suffix = isCurrentUser ? ' (você)' : '';
        
        return `
            <div class="flex items-center space-x-3 p-2 rounded-lg ${isCurrentUser ? 'bg-primary-50 dark:bg-primary-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}">
                <div class="relative flex-shrink-0">
                    <div class="w-10 h-10 rounded-full ${bgColor} flex items-center justify-center">
                        <span class="${textColor} font-medium text-sm">
                            ${initial}
                        </span>
                    </div>
                    <span class="absolute -bottom-0 -right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium ${nameColor} truncate">
                        ${user.name}${suffix}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                        Online agora
                    </p>
                </div>
            </div>
        `;
    }

    /**
     * Atualiza o status de conexão
     * @param {string} status - Status da conexão ('connected', 'disconnected', 'connecting')
     */
    updateConnectionStatus(status) {
        if (!this.connectionStatusElement) return;

        const statusMap = {
            'connected': {
                text: 'Conectado',
                color: 'text-green-600 dark:text-green-400'
            },
            'disconnected': {
                text: 'Desconectado',
                color: 'text-red-600 dark:text-red-400'
            },
            'connecting': {
                text: 'Conectando...',
                color: 'text-yellow-600 dark:text-yellow-400'
            }
        };

        const statusInfo = statusMap[status] || statusMap['disconnected'];
        
        this.connectionStatusElement.textContent = statusInfo.text;
        this.connectionStatusElement.className = `text-xs ${statusInfo.color}`;
    }
}

// Inicializa o serviço globalmente
window.globalOffCanvas = new OffCanvasService();
