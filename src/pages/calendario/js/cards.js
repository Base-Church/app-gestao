const Cards = {
    renderVoluntarioCard(voluntario, isSelected = false) {
        return `
            <div class="card-voluntario transition-all duration-200 ${isSelected ? 'card-selected' : ''}" 
                 data-id="${voluntario.id}">
                <div class="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                    <img src="${voluntario.foto || window.USER.baseUrl + '/assets/img/placeholder.jpg'}" 
                         alt="${voluntario.nome}" 
                         class="w-10 h-10 rounded-full"
                         onerror="this.src='${window.USER.baseUrl}/assets/img/placeholder.jpg';">
                    <div class="ml-3 flex-1">
                        <p class="text-sm font-medium text-gray-900 dark:text-white">${voluntario.nome}</p>
                        ${voluntario.observacoes ? `
                            <p class="text-xs text-gray-500 dark:text-gray-400">${voluntario.observacoes}</p>
                        ` : ''}
                    </div>
                    ${isSelected ? `
                        <div class="flex-shrink-0">
                            <div class="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                </svg>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    },

    renderEventoCard(evento, isSelected = false) {
        return `
            <div class="card-evento transition-all duration-200 ${isSelected ? 'card-selected' : ''}" 
                 data-id="${evento.id}"
                 data-dia-semana="${evento.dia_semana}">
                <div class="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center" 
                         style="background-color: ${evento.cor || '#4F46E5'}20">
                        <span class="text-lg font-semibold" 
                              style="color: ${evento.cor || '#4F46E5'}">${evento.nome.charAt(0)}</span>
                    </div>
                    <div class="ml-3 flex-1">
                        <p class="text-sm font-medium text-gray-900 dark:text-white">${evento.nome}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">${this.getDiaSemanaFormatado(evento.dia_semana)}</p>
                    </div>
                    ${isSelected ? `
                        <div class="flex-shrink-0">
                            <div class="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                </svg>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    },

    getDiaSemanaFormatado(dia) {
        const dias = {
            'domingo': 'Domingo',
            'segunda': 'Segunda-feira',
            'terca': 'Terça-feira',
            'quarta': 'Quarta-feira',
            'quinta': 'Quinta-feira',
            'sexta': 'Sexta-feira',
            'sabado': 'Sábado'
        };
        return dias[dia] || dia;
    },

    toggleCardSelection(card, type) {
        card.classList.toggle('card-selected');
        Filters.updateFiltersCount();
        Filters.applyFilters();
    },

    renderResults(items, type) {
        return items.map(item => {
            const isSelected = document.querySelector(`.card-${type}[data-id="${item.id}"].card-selected`);
            return this[`render${type.charAt(0).toUpperCase() + type.slice(1)}Card`](item, isSelected);
        }).join('');
    },

    applyFilters() {
        const selectedVoluntarios = new Set(
            Array.from(document.querySelectorAll('.card-voluntario.card-selected'))
                .map(card => parseInt(card.dataset.id))
        );

        const selectedDias = new Set(
            Array.from(document.querySelectorAll('.card-evento.card-selected'))
                .map(card => card.dataset.diaSemana)
        );

        const selectedAtividades = new Set(
            Array.from(document.querySelectorAll('.card-atividade.card-selected'))
                .map(card => parseInt(card.dataset.id))
        );

        document.querySelectorAll('#calendar-days [data-date]').forEach(dayEl => {
            const date = dayEl.dataset.date;
            const diaIndisponivel = ui.diasIndisponiveisMap.get(date);
            
            if (!diaIndisponivel) return;

            const diaSemana = new Date(date).toLocaleDateString('pt-BR', { weekday: 'long' }).toLowerCase();
            const temVoluntarioSelecionado = diaIndisponivel.voluntarios.some(v => 
                selectedVoluntarios.size === 0 || selectedVoluntarios.has(v.voluntario.id)
            );
            const diaSelecionado = selectedDias.size === 0 || selectedDias.has(diaSemana);
            const temAtividadeSelecionada = selectedAtividades.size === 0 || 
                diaIndisponivel.eventos?.some(evento => selectedAtividades.has(evento.id));

            dayEl.classList.toggle('opacity-40', 
                (selectedVoluntarios.size > 0 && !temVoluntarioSelecionado) ||
                (selectedDias.size > 0 && !diaSelecionado) ||
                (selectedAtividades.size > 0 && !temAtividadeSelecionada)
            );
        });
    },
};

export { Cards };
