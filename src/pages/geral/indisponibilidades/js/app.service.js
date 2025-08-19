const loading = document.getElementById('relatorio-loading');
const erro = document.getElementById('relatorio-erro');
const relatorioDiv = document.getElementById('relatorio-content');

function animateNumber(element, finalValue, duration = 1200, suffix = '') {
    if (!element) return;
    const startValue = 0;
    const startTime = Date.now();
    function updateNumber() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.round(startValue + (finalValue - startValue) * easeOut);
        element.textContent = currentValue + suffix;
        if (progress < 1) requestAnimationFrame(updateNumber);
    }
    updateNumber();
}

function renderScorePorMinisterio(lista) {
    if (!Array.isArray(lista) || lista.length === 0) {
        relatorioDiv.innerHTML += `
            <section class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Score por Ministério</h3>
                <div class="text-center text-gray-500 dark:text-gray-400 py-8">Nenhum dado de ministério encontrado.</div>
            </section>
        `;
        return;
    }

    // Ordenar por score (maior para menor)
    const listaOrdenada = [...lista].sort((a, b) => (b.score || 0) - (a.score || 0));

    const rows = listaOrdenada.map((m, index) => {
        const score = Number(m.score) || 0;
        const totalVol = Number(m.total_voluntarios) || 0;
        const indisponiveis = Number(m.declararam_indisponibilidade) || 0;
        
        // Definir cor baseada no score
        let scoreClass = 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
        let borderClass = 'border-red-200 dark:border-red-800';
        if (score >= 70) {
            scoreClass = 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
            borderClass = 'border-green-200 dark:border-green-800';
        } else if (score >= 50) {
            scoreClass = 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400';
            borderClass = 'border-yellow-200 dark:border-yellow-800';
        }

        // Badge de posição
        let positionBadge = '';
        if (index === 0 && score > 0) {
            positionBadge = '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">🏆 Melhor Score</span>';
        } else if (index < 3 && score > 0) {
            positionBadge = `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Top ${index + 1}</span>`;
        }

        return `
            <div class="flex items-center justify-between p-4 rounded-xl border ${borderClass} ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'}">
                <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <span class="text-white font-bold text-lg">${String(m.ministerio_nome || '?').charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                        <div class="flex items-center space-x-2">
                            <h4 class="text-lg font-semibold text-gray-900 dark:text-white">${m.ministerio_nome || 'Ministério sem nome'}</h4>
                            ${positionBadge}
                        </div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">ID: ${m.ministerio_id}</div>
                    </div>
                </div>
                
                <div class="flex items-center space-x-6">
                    <div class="text-center">
                        <div class="text-sm text-gray-600 dark:text-gray-400">Total Voluntários</div>
                        <div class="text-xl font-bold text-blue-600">${totalVol}</div>
                    </div>
                    <div class="text-center">
                        <div class="text-sm text-gray-600 dark:text-gray-400">Declararam Indisponibilidade</div>
                        <div class="text-xl font-bold text-orange-600">${indisponiveis}</div>
                    </div>
                    <div class="text-center px-4 py-2 rounded-xl ${scoreClass}">
                        <div class="text-sm font-medium">Score</div>
                        <div class="text-2xl font-bold">${score}</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    const html = `
    <section class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between mb-6">
            <div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">Score de Indisponibilidades por Ministério</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">Ordenado por score de disponibilidade</p>
            </div>
            <div class="flex items-center space-x-4 text-xs">
                <div class="flex items-center space-x-1">
                    <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span class="text-gray-600 dark:text-gray-400">Excelente (70+)</span>
                </div>
                <div class="flex items-center space-x-1">
                    <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span class="text-gray-600 dark:text-gray-400">Regular (50-69)</span>
                </div>
                <div class="flex items-center space-x-1">
                    <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span class="text-gray-600 dark:text-gray-400">Baixo (0-49)</span>
                </div>
            </div>
        </div>
        <div class="space-y-3">${rows}</div>
    </section>
    `;

    relatorioDiv.innerHTML += html;
}

async function renderRelatorio() {
    try {
        if (document.readyState !== 'complete') {
            await new Promise(resolve => window.addEventListener('load', resolve));
        }
        const organizacao_id = window.USER?.organizacao_id;
        if (!organizacao_id) throw new Error('Organização não encontrada');

        const params = new URLSearchParams(window.location.search);
        const anoParam = params.get('ano') || new Date().getFullYear();

        const result = await getRelatorioGeral(organizacao_id, anoParam);
        if (!result?.data) throw new Error('Dados do relatório não encontrados');

        const d = result.data;

        // limpar area
        relatorioDiv.innerHTML = '';

        renderScorePorMinisterio(d.score_por_ministerio);

        loading.classList.add('hidden');
        erro.classList.add('hidden');
        relatorioDiv.classList.remove('hidden');

    } catch (e) {
        loading.classList.add('hidden');
        erro.classList.remove('hidden');
        relatorioDiv.classList.add('hidden');
        const erroElement = document.querySelector('#relatorio-erro span');
        if (erroElement) erroElement.textContent = `Erro ao carregar relatório: ${e.message}`;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    renderRelatorio();
});
