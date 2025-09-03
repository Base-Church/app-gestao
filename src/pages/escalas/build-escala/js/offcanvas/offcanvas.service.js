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
        this.selectingListElement = null;
        this.selectingCountElement = null;
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
        this.selectingListElement = document.getElementById('global-selecting-list');
        this.selectingCountElement = document.getElementById('global-selecting-count');
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
            <div class="flex items-center space-x-2 p-1.5 rounded-md ${isCurrentUser ? 'bg-primary-50 dark:bg-primary-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}">
                <div class="relative flex-shrink-0">
                    <div class="w-7 h-7 rounded-full ${bgColor} flex items-center justify-center">
                        <span class="${textColor} font-medium text-xs">
                            ${initial}
                        </span>
                    </div>
                    <span class="absolute -bottom-0 -right-0 w-2 h-2 bg-green-500 border border-white dark:border-gray-900 rounded-full"></span>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-xs font-medium ${nameColor} truncate">
                        ${user.name}${suffix}
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

    /**
     * Atualiza a lista de voluntários sendo selecionados
     * @param {Map} voluntariosSelecting - Map com voluntários sendo selecionados
     */
    updateSelectingList(voluntariosSelecting) {
        console.log('UpdateSelectingList called with:', voluntariosSelecting.size, 'selections');
        
        if (!this.selectingListElement || !this.selectingCountElement) {
            console.warn('Selecting elements not found');
            return;
        }

        const total = voluntariosSelecting.size;
        this.selectingCountElement.textContent = total;

        // Gera HTML da lista com container de rolagem
        let html = '';

        if (total > 0) {
            html = '<div class="max-h-64 overflow-y-auto space-y-2 pr-1">';
            voluntariosSelecting.forEach(selection => {
                html += this.createSelectingHtml(selection);
            });
            html += '</div>';
        } else {
            html = `
                <div class="text-center text-gray-400 dark:text-gray-500 text-xs py-4">
                    Nenhum voluntário sendo selecionado
                </div>
            `;
        }

        this.selectingListElement.innerHTML = html;
        console.log('Updated selecting list HTML');
    }

    /**
     * Cria HTML para um voluntário sendo selecionado
     * @param {Object} selection - Dados da seleção {user, voluntario, atividade, timestamp}
     * @returns {string} HTML da seleção
     */
    createSelectingHtml(selection) {
        const timeAgo = this.getTimeAgo(selection.timestamp);
        const isMySelection = selection.user.id === window.USER?.id;
        
        // Usa cores primary para seleções
        const bgColor = isMySelection ? 'bg-primary-50 dark:bg-primary-900/10' : 'bg-primary-50 dark:bg-primary-900/10';
        const borderColor = isMySelection ? 'border-primary-300 dark:border-primary-700' : 'border-primary-200 dark:border-primary-800';
        const avatarBg = isMySelection ? 'bg-primary-100 dark:bg-primary-900/20' : 'bg-primary-100 dark:bg-primary-900/20';
        const avatarText = isMySelection ? 'text-primary-700 dark:text-primary-300' : 'text-primary-700 dark:text-primary-300';
        const statusColor = isMySelection ? 'text-primary-600 dark:text-primary-400' : 'text-primary-600 dark:text-primary-400';
        const pulseColor = isMySelection ? 'bg-primary-500' : 'bg-primary-500';
        
        return `
            <div class="flex items-center space-x-2 p-2 rounded-lg ${bgColor} border ${borderColor}">
                <div class="flex-shrink-0">
                    <div class="w-8 h-8 rounded-full ${avatarBg} flex items-center justify-center">
                        <span class="${avatarText} font-medium text-xs">
                            ${selection.user.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                        ${selection.voluntario.nome}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                        ${selection.atividade.nome} • ${selection.user.name}
                    </p>
                    <p class="text-xs ${statusColor}">
                        ${timeAgo}
                    </p>
                </div>
                <div class="flex-shrink-0">
                    <div class="w-2 h-2 ${pulseColor} rounded-full animate-pulse"></div>
                </div>
            </div>
        `;
    }

    /**
     * Calcula tempo decorrido
     * @param {number} timestamp - Timestamp da seleção
     * @returns {string} Tempo formatado
     */
    getTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const seconds = Math.floor(diff / 1000);
        
        if (seconds < 60) return `${seconds}s atrás`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m atrás`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h atrás`;
    }
}

// Inicializa o serviço globalmente
window.globalOffCanvas = new OffCanvasService();
