// eventos.ui.js
// Responsável por renderizar os cards de eventos

window.renderEventoCards = function(eventos, containerId, baseUrl) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    if (!eventos.length) {
        container.innerHTML = '<div class="text-gray-400">Nenhum evento encontrado.</div>';
        return;
    }
    eventos.forEach(ev => {
        const card = document.createElement('div');
        card.className = 'flex items-center gap-4 bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-3 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition';
        const imgUrl = `${baseUrl}/assets/img/eventos/${ev.foto || 'placeholder.jpg'}`;
        const turno = getTurno(ev.hora);
        card.innerHTML = `
            <img src="${imgUrl}" alt="${ev.nome}" class="w-16 h-16 object-cover rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100" onerror="this.src='${baseUrl}assets/img/eventos/placeholder.jpg'">
            <div class="flex-1">
                <div class="font-bold text-primary-700 dark:text-primary-200 text-lg mb-1">${ev.nome}</div>
                <div class="text-sm text-gray-500 dark:text-gray-300 flex items-center gap-2">
                    <span><svg class='inline w-4 h-4 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 8v4l3 3'/></svg>${ev.hora ? ev.hora.slice(0,5) : '--:--'}</span>
                    <span class="ml-2 px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-200 text-xs font-semibold">${turno}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function getTurno(hora) {
    if (!hora) return 'Indefinido';
    const h = parseInt(hora.split(':')[0], 10);
    if (h < 12) return 'Manhã';
    if (h < 18) return 'Tarde';
    return 'Noite';
} 