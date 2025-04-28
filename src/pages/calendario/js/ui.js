import { Cards } from './cards.js';

const ui = {
    elements: {
        loading: document.getElementById('loading-indicator'),
        error: document.getElementById('error-container'),
        errorMessage: document.getElementById('error-message'),
        calendar: document.getElementById('calendar-container'),
        calendarDays: document.getElementById('calendar-days'),
        monthPicker: document.getElementById('month-picker'),
        offCanvas: document.getElementById('off-canvas'),
        offCanvasContent: document.getElementById('off-canvas-content'),
        totalVoluntarios: document.getElementById('total-voluntarios'),
    },

    diasIndisponiveisMap: new Map(),
    eventosMap: new Map(),

    showLoading() {
        if (this.elements.loading) {
            this.elements.loading.classList.remove('hidden');
        }
        if (this.elements.calendar) {
            this.elements.calendar.classList.add('hidden');
        }
        if (this.elements.error) {
            this.elements.error.classList.add('hidden');
        }
    },

    showError(message) {
        if (this.elements.loading) {
            this.elements.loading.classList.add('hidden');
        }
        if (this.elements.calendar) {
            this.elements.calendar.classList.add('hidden');
        }
        if (this.elements.error) {
            this.elements.error.classList.remove('hidden');
        }
        if (this.elements.errorMessage) {
            this.elements.errorMessage.textContent = message;
        }
    },

    showCalendar() {
        if (this.elements.loading) {
            this.elements.loading.classList.add('hidden');
        }
        if (this.elements.error) {
            this.elements.error.classList.add('hidden');
        }
        if (this.elements.calendar) {
            this.elements.calendar.classList.remove('hidden');
        }
    },

    generateCalendar(mes, response) {
        // Ajuste para garantir que a data está no formato correto
        const [year, month] = mes.split('-');
        const date = new Date(year, month - 1, 1); // mês começa em 0
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const today = new Date();

        // Debug para verificar datas
        console.log('Primeiro dia:', firstDay);
        console.log('Último dia:', lastDay);
        console.log('Total de dias:', lastDay.getDate());
        
        this.diasIndisponiveisMap = new Map(
            (response?.data?.dias_indisponiveis || []).map(dia => [dia.dia, dia])
        );

        let html = '';
        
        // Garante que começamos do dia correto da semana
        const startingDayOfWeek = firstDay.getDay();
        for (let i = 0; i < startingDayOfWeek; i++) {
            html += `<div class="border-b border-r border-gray-200 dark:border-gray-700 p-4 min-h-[120px]"></div>`;
        }

        // Garante que geramos todos os dias do mês
        const totalDays = lastDay.getDate();
        for (let day = 1; day <= totalDays; day++) {
            const currentDate = `${mes}-${String(day).padStart(2, '0')}`;
            const diaIndisponivel = this.diasIndisponiveisMap.get(currentDate);
            const isToday = today.toISOString().split('T')[0] === currentDate;
            
            const classes = [
                'border-b border-r border-gray-200 dark:border-gray-700 p-4 min-h-[120px] cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700',
                isToday ? 'ring-2 ring-primary-500 ring-inset' : '',
                diaIndisponivel ? 'bg-red-50/50 dark:bg-red-900/20' : 'bg-white dark:bg-gray-800',
                day % 2 === 0 ? 'bg-opacity-50 dark:bg-opacity-50' : ''
            ].join(' ');

            html += `
                <div class="${classes} relative group" data-date="${currentDate}" onclick="ui.showVoluntariosList('${currentDate}')">
                    <div class="flex justify-between items-start">
                        <span class="inline-flex items-center justify-center w-7 h-7 rounded-full ${
                            isToday ? 'bg-primary-500 text-white' : 'text-gray-900 dark:text-white'
                        }">${day}</span>
                        ${diaIndisponivel ? `
                            <span class="flex items-center text-xs font-medium text-red-600 dark:text-red-400">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                                </svg>
                                ${diaIndisponivel.total_voluntarios}
                            </span>
                        ` : ''}
                    </div>
                    
                    ${diaIndisponivel ? `
                        <div class="absolute bottom-2 left-2 flex items-center space-x-1">
                            ${diaIndisponivel.voluntarios.slice(0, 3).map(v => `
                                <img src="${v.voluntario.foto || window.USER.baseUrl + '/assets/img/placeholder.jpg'}" alt="${v.voluntario.nome}" class="w-6 h-6 rounded-full" onerror="this.onerror=null;this.src='${window.USER.baseUrl}/assets/img/placeholder.jpg';">
                            `).join('')}
                            ${diaIndisponivel.voluntarios.length > 3 ? `
                                <div class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-600 dark:text-gray-300">
                                    +${diaIndisponivel.voluntarios.length - 3}
                                </div>
                            ` : ''}
                        </div>
                    ` : ''}
                </div>
            `;
        }

        // Calcula corretamente os dias restantes
        const lastDayOfWeek = lastDay.getDay();
        const remainingDays = lastDayOfWeek < 6 ? 6 - lastDayOfWeek : 0;
        for (let i = 0; i < remainingDays; i++) {
            html += `<div class="border-b border-r border-gray-200 dark:border-gray-700 p-4 min-h-[120px]"></div>`;
        }

        if (this.elements.calendarDays) {
            this.elements.calendarDays.innerHTML = html;
        }

        // Atualizar o total de voluntários
        this.updateTotalVoluntarios(response);

        // Adiciona análise estatística
        this.updateStats(response?.data?.dias_indisponiveis || []);
    },

    showVoluntariosList(date) {
        const diaIndisponivel = this.diasIndisponiveisMap.get(date);
        if (!diaIndisponivel) return;

        let html = `
            <div class="p-4">
                <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Voluntários Indisponíveis - ${date}</h2>
                <div class="space-y-4">
                    ${diaIndisponivel.voluntarios.map(v => `
                        <div class="flex items-center space-x-4">
                            <img src="${v.voluntario.foto || window.USER.baseUrl + '/assets/img/placeholder.jpg'}" alt="${v.voluntario.nome}" class="w-12 h-12 rounded-full" onerror="this.onerror=null;this.src='${window.USER.baseUrl}/assets/img/placeholder.jpg';">
                            <div>
                                <p class="text-sm font-medium text-gray-900 dark:text-white">${v.voluntario.nome}</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">${v.observacoes}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        if (this.elements.offCanvasContent) {
            this.elements.offCanvasContent.innerHTML = html;
        }
        if (this.elements.offCanvas) {
            this.elements.offCanvas.classList.remove('hidden');
        }
    },

    hideVoluntariosList() {
        if (this.elements.offCanvas) {
            this.elements.offCanvas.classList.add('hidden');
        }
    },

    updateTotalVoluntarios(response) {
        const totalVoluntarios = new Set();
        (response?.data?.dias_indisponiveis || []).forEach(dia => {
            dia.voluntarios.forEach(v => totalVoluntarios.add(v.voluntario.id));
        });
        if (this.elements.totalVoluntarios) {
            this.elements.totalVoluntarios.textContent = totalVoluntarios.size;
        }
    },

    updateStats(diasIndisponiveis) {
        if (!diasIndisponiveis.length) return;

        // Data atual para comparação
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        // Filtra dias posteriores à data atual
        const diasFuturos = diasIndisponiveis.filter(dia => {
            const dataDia = new Date(dia.dia);
            return dataDia >= hoje;
        });

        // Ordena por número de indisponibilidades e data
        const diasOrdenados = diasFuturos.sort((a, b) => {
            if (a.total_voluntarios === b.total_voluntarios) {
                // Se tiver mesmo número de indisponibilidades, prioriza a data mais próxima
                return new Date(a.dia) - new Date(b.dia);
            }
            return a.total_voluntarios - b.total_voluntarios;
        });

        // Pega o dia mais lotado e o mais livre
        const diaMaisIndisponivel = diasIndisponiveis.sort((a, b) => 
            b.total_voluntarios - a.total_voluntarios
        )[0];

        const diaMaisLivre = diasOrdenados[0];

        // Formata as datas para exibição
        const formatarData = (data) => {
            const [ano, mes, dia] = data.split('-');
            return new Date(ano, mes - 1, dia).toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
            });
        };

        // Atualiza elementos da UI
        document.getElementById('dia-mais-indisponivel').textContent = formatarData(diaMaisIndisponivel.dia);
        document.getElementById('total-mais-indisponivel').textContent = 
            `${diaMaisIndisponivel.total_voluntarios} voluntários indisponíveis`;

        if (diaMaisLivre) {
            document.getElementById('dia-mais-livre').textContent = formatarData(diaMaisLivre.dia);
            document.getElementById('total-mais-livre').textContent = 
                `${diaMaisLivre.total_voluntarios} voluntários indisponíveis`;

            // Gera sugestão com contexto temporal
            const sugestao = document.getElementById('sugestao-escala');
            sugestao.innerHTML = `
                <p>O melhor dia para agendar reuniões ou encontros é 
                <span class="font-medium">${formatarData(diaMaisLivre.dia)}</span>, 
                pois teremos maior participação com apenas 
                <span class="font-medium text-green-600 dark:text-green-400">${diaMaisLivre.total_voluntarios} 
                pessoas indisponíveis</span>.</p>
                <p class="mt-1 text-xs text-green-500 dark:text-green-400">
                    💡 Ideal para: treinamentos, ensaios, reuniões de equipe
                </p>
            `;

            // Destaca visualmente o melhor dia no calendário
            const diaElement = document.querySelector(`[data-date="${diaMaisLivre.dia}"]`);
            if (diaElement) {
                diaElement.classList.add('ring-2', 'ring-green-500', 'dark:ring-green-400');
                diaElement.classList.add('relative');
                
                // Adiciona badge de "Melhor dia"
                const indicator = document.createElement('div');
                indicator.className = 'absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-lg';
                indicator.textContent = '✓ Melhor dia';
                diaElement.appendChild(indicator);

                // Adiciona tooltip com mais informações
                diaElement.setAttribute('title', `Melhor data disponível: ${diaMaisLivre.total_voluntarios} voluntários indisponíveis`);
            }
        } else {
            // Caso não encontre dias disponíveis após a data atual
            document.getElementById('dia-mais-livre').textContent = 'Nenhum dia disponível';
            document.getElementById('total-mais-livre').textContent = 'Consulte o próximo mês';
            document.getElementById('sugestao-escala').innerHTML = `
                <p class="text-yellow-600 dark:text-yellow-400">
                    Não encontramos dias adequados para reuniões neste mês. 
                    Sugerimos consultar o próximo mês para melhor planejamento.
                </p>
            `;
        }
    },

    initializeSearchHandlers() {
        // Nenhum filtro para inicializar
    },
};

window.ui = ui; // Torna o objeto ui disponível globalmente

export { ui };
