// Utilitário para combinar eventos em um item
(function() {
    async function abrirModalCombinarEventos(seletorId, eventoId) {
        // Remove modal anterior se existir
        document.getElementById('modal-combinar-eventos')?.remove();

        // Busca eventos disponíveis
        const eventos = await window.apiService.buscarEventos();

        // Recupera eventos já combinados (se houver)
        const miniCards = document.querySelector(`.mini-cards-eventos-combinados[data-seletor-id="${seletorId}"]`);
        let eventosCombinados = [];
        if (miniCards && miniCards.dataset.eventosCombinados) {
            eventosCombinados = miniCards.dataset.eventosCombinados.split(',').map(id => parseInt(id)).filter(Boolean);
        }

        // Cria modal
        const modalDiv = document.createElement('div');
        modalDiv.id = 'modal-combinar-eventos';
        modalDiv.className = 'fixed inset-0 z-[4000] flex items-center justify-center bg-black/40';
        modalDiv.innerHTML = `
            <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-lg w-full p-6 relative">
                <button class="fechar-modal-combinar absolute top-2 right-2 text-gray-400 hover:text-red-500">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
                <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Combinar Eventos</h3>
                <div class="overflow-y-auto max-h-80 space-y-2 mb-4">
                    ${eventos.map(ev => `
                        <div class="evento-card-combinavel flex items-center gap-3 p-2 rounded border border-gray-200 dark:border-gray-700 cursor-pointer transition ${eventosCombinados.includes(ev.id) ? 'bg-primary-50 border-primary-400' : 'bg-white dark:bg-gray-900'}"
                            data-evento-id="${ev.id}">
                            <img src="${ev.foto ? window.URL_BASE + '/assets/img/eventos/' + ev.foto : window.URL_BASE + '/assets/img/placeholder.jpg'}" class="w-10 h-10 rounded-full object-cover" alt="${ev.nome}">
                            <div class="flex-1 min-w-0">
                                <div class="font-semibold text-gray-900 dark:text-white">${ev.nome}</div>
                                <div class="text-xs text-gray-500">${ev.dia_semana || ''} • ${ev.hora ? ev.hora.substring(0,5) : ''} • ${ev.tipo || ''}</div>
                            </div>
                            <input type="checkbox" class="checkbox-combinar-evento" ${eventosCombinados.includes(ev.id) ? 'checked' : ''} />
                        </div>
                    `).join('')}
                </div>
                <div class="flex justify-end gap-2">
                    <button class="btn-salvar-combinacao px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold">Salvar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modalDiv);

        // Fechar modal
        modalDiv.querySelector('.fechar-modal-combinar').onclick = () => modalDiv.remove();

        // Seleção de eventos (toggle)
        modalDiv.querySelectorAll('.evento-card-combinavel').forEach(card => {
            card.onclick = (e) => {
                if (e.target.classList.contains('checkbox-combinar-evento')) return;
                const checkbox = card.querySelector('.checkbox-combinar-evento');
                checkbox.checked = !checkbox.checked;
                card.classList.toggle('bg-primary-50', checkbox.checked);
                card.classList.toggle('border-primary-400', checkbox.checked);
            };
        });

        // Salvar seleção
        modalDiv.querySelector('.btn-salvar-combinacao').onclick = () => {
            const selecionados = Array.from(modalDiv.querySelectorAll('.evento-card-combinavel'))
                .filter(card => card.querySelector('.checkbox-combinar-evento').checked)
                .map(card => parseInt(card.dataset.eventoId));
            // Atualiza mini-cards no cabeçalho do evento
            const miniCards = document.querySelector(`.mini-cards-eventos-combinados[data-seletor-id="${seletorId}"]`);
            if (miniCards) {
                miniCards.innerHTML = '';
                miniCards.dataset.eventosCombinados = selecionados.filter(id => Number.isInteger(id)).join(',');
                // Layout: mini-cards sempre em linha, sem quebra
                miniCards.style.display = "flex";
                miniCards.style.flexDirection = "row";
                miniCards.style.flexWrap = "nowrap";
                miniCards.style.overflowX = "auto";
                miniCards.style.alignItems = "center";
                miniCards.style.maxWidth = "220px";
                eventos.filter(ev => selecionados.includes(ev.id)).forEach(ev => {
                    miniCards.innerHTML += `
                        <span class="inline-flex items-center px-2 py-1 rounded-full border border-primary-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs mr-1 min-w-0" title="${ev.nome}" style="white-space:nowrap;">
                            <img src="${ev.foto ? window.URL_BASE + '/assets/img/eventos/' + ev.foto : window.URL_BASE + '/assets/img/placeholder.jpg'}" class="w-5 h-5 rounded-full object-cover mr-1 flex-shrink-0" alt="${ev.nome}">
                            <span class="truncate max-w-[100px]">${ev.nome}</span>
                            <span class="ml-1 text-gray-500 dark:text-gray-400 flex-shrink-0">${ev.hora ? ev.hora.substring(0,5) : ''}</span>
                        </span>
                    `;
                });
            }
            modalDiv.remove();
        };
    }

    // Evento global para abrir o modal ao clicar no botão "Combinar"
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.btn-combinar-eventos');
        if (btn) {
            const seletorId = btn.dataset.seletorId;
            const eventoId = btn.dataset.eventoId;
            abrirModalCombinarEventos(seletorId, eventoId);
        }
    });
})();
