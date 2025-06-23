import { usuariosTab } from './tabs/usuarios.js';
import { loadData as geralTabLoadData, init as geralTabInit } from './tabs/geral.js';

class TabManager {
    constructor() {
        this.activeTab = null;
        this.tabs = {
            'geral': { loadData: geralTabLoadData, init: geralTabInit },
            'usuarios': usuariosTab
        };
    }

    init() {
        // Inicializa todos os módulos
        Object.values(this.tabs).forEach(tab => {
            if (typeof tab.init === 'function') tab.init();
        });

        // Setup dos event listeners
        document.querySelectorAll('[data-tab-target]').forEach(button => {
            button.addEventListener('click', () => this.switchTab(button.dataset.tabTarget));
        });

        // Carrega a tab inicial baseada na URL ou default para 'geral'
        const hash = window.location.hash.slice(1) || 'geral';
        this.switchTab(hash);

        // Atualiza a URL quando mudar de tab
        window.addEventListener('hashchange', () => {
            const newHash = window.location.hash.slice(1);
            if (newHash !== this.activeTab) {
                this.switchTab(newHash);
            }
        });
    }

    async switchTab(tabId) {
        if (!this.tabs[tabId] || tabId === this.activeTab) return;

        // Atualiza classes dos botões
        document.querySelectorAll('[data-tab-target]').forEach(button => {
            const isActive = button.dataset.tabTarget === tabId;
            button.classList.toggle('bg-gray-100', isActive);
            button.classList.toggle('dark:bg-gray-800', isActive);
            button.classList.toggle('text-gray-900', isActive);
            button.classList.toggle('dark:text-white', isActive);
            button.classList.toggle('text-gray-600', !isActive);
            button.classList.toggle('dark:text-gray-400', !isActive);
            button.classList.toggle('hover:bg-gray-50', !isActive);
            button.classList.toggle('dark:hover:bg-gray-700', !isActive);
        });

        // Atualiza visibilidade dos painéis
        document.querySelectorAll('[data-tab-content]').forEach(panel => {
            panel.classList.toggle('hidden', panel.dataset.tabContent !== tabId);
        });

        // Carrega dados da nova tab
        if (typeof this.tabs[tabId].loadData === 'function') {
            await this.tabs[tabId].loadData();
        }

        // Atualiza estado
        this.activeTab = tabId;
        window.location.hash = tabId;
    }
}

// Inicializa o gerenciador de tabs
const tabManager = new TabManager();
document.addEventListener('DOMContentLoaded', () => tabManager.init()); 