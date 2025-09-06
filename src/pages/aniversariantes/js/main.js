import AniversariantesAPI from './api.js';

class AniversariantesPage {
    constructor() {
        this.aniversariantes = {};
        this.meta = {};
        this.init();
    }

    async init() {
        try {
            await this.loadAniversariantes();
        } catch (e) {
            this.showError(e.message);
        }
    }

    async loadAniversariantes() {
        const loading = document.getElementById('loading-indicator');
        const error = document.getElementById('error-container');
        const grid = document.getElementById('aniversariantes-grid');
        loading.classList.remove('hidden');
        error.classList.add('hidden');
        grid.classList.add('hidden');
        try {
            const data = await AniversariantesAPI.getAniversariantes();
            this.aniversariantes = data.data || {};
            this.meta = data.meta || {};
            this.renderAniversariantes();
        } catch (err) {
            this.showError(err.message);
        } finally {
            loading.classList.add('hidden');
        }
    }

    renderSection(title, list, destaque = false) {
        if (!list || !list.length) return '';
        
        return `
            <div class="mb-8">
                <h2 class="text-lg font-bold ${destaque ? 'text-primary-700 dark:text-primary-300' : 'text-gray-800 dark:text-white'} mb-4">
                    ${title}
                </h2>
                <div class="grid gap-4">
                    ${list.map(v => this.renderCard(v, destaque)).join('')}
                </div>
            </div>
        `;
    }

    getVoluntarioImageUrl(voluntario) {
        // Se tem ID, usa o padrão assets/img/voluntarios/{id}.jpg
        if (voluntario.id) {
            return `${window.APP_CONFIG.baseUrl}/assets/img/voluntarios/${voluntario.id}.jpg`;
        }
        // Fallback para foto existente ou placeholder
        return voluntario.foto || `${window.APP_CONFIG.baseUrl}/assets/img/placeholder.jpg`;
    }

    renderCard(v, destaque = false) {
        const cardClass = destaque 
            ? 'border-2 border-primary-500 bg-primary-50/50 dark:bg-primary-900/20' 
            : 'border border-gray-200 dark:border-gray-700';
        
        return `
            <div class="rounded-lg ${cardClass} overflow-hidden">
            <div class="p-4">
                <div class="flex items-center gap-4">
                <img class="h-16 w-16 rounded-lg object-cover" 
                     src="${this.getVoluntarioImageUrl(v)}" 
                     alt="${v.nome}"
                     onerror="this.src='${window.APP_CONFIG.baseUrl}/assets/img/placeholder.jpg'">
                <div class="flex-1 min-w-0">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    ${v.nome}
                    </h3>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                    <strong>Nascimento:</strong> ${this.formatDate(v.data_nascimento)} - <strong>Fará: ${v.fara_idade} anos</strong> 
                    </div>
                    <div class="text-sm text-green-600 dark:text-green-400">
                    <strong>Faltam</strong> ${v.dias_para_aniversario} dias
                    </div>
                </div>
                </div>
            </div>
            </div>
        `;
    }

    renderAniversariantes() {
        const grid = document.getElementById('aniversariantes-grid');
        const list = document.getElementById('aniversariantes-list');
        const { este_mes = [], esta_semana = [], mes_que_vem = [], outros = [] } = this.aniversariantes;

        if (!este_mes.length && !esta_semana.length && !mes_que_vem.length && !outros.length) {
            grid.classList.add('hidden');
            document.getElementById('empty-state').classList.remove('hidden');
            return;
        }

        grid.classList.remove('hidden');
        document.getElementById('empty-state').classList.add('hidden');

        list.innerHTML = `
            ${this.renderSection('Esta semana', esta_semana, true)}
            ${this.renderSection('Este mês', este_mes, true)}
            ${this.renderSection('Próximos aniversários', mes_que_vem, false)}
            ${this.renderSection('Outros aniversariantes', outros, false)}
        `;
    }

    formatDate(dateStr) {
        if (!dateStr) return '-';
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    }

    showError(msg) {
        const error = document.getElementById('error-container');
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = msg;
        error.classList.remove('hidden');
    }
}

window.addEventListener('load', () => {
    window.aniversariantesApp = new AniversariantesPage();
});
