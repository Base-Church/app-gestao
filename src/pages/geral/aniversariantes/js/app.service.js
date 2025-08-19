const loading = document.getElementById('relatorio-loading');
const erro = document.getElementById('relatorio-erro');
const relatorioDiv = document.getElementById('relatorio-geral');

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

function criarGraficoMeses(aniversariantes_por_mes) {
    // aniversariantes_por_mes: [{mes: 1, total: X}, ...]
    const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const totals = new Array(12).fill(0);
    if (Array.isArray(aniversariantes_por_mes)) {
        aniversariantes_por_mes.forEach(item => {
            const m = Number(item.mes);
            if (!isNaN(m) && m >=1 && m <=12) totals[m-1] = Number(item.total) || 0;
        });
    }

    // Simples barra em HTML (pequeno gráfico) seguindo estilo do projeto
    let max = Math.max(...totals, 1);
    const bars = totals.map((t, i) => {
        const height = Math.round((t / max) * 100);
        return `
            <div class="flex flex-col items-center text-xs">
                <div class="w-6 bg-primary-600 dark:bg-primary-400 rounded-t-lg" style="height:${height}px"></div>
                <div class="mt-1 text-gray-600 dark:text-gray-300">${meses[i]}</div>
                <div class="text-xs text-gray-500">${t}</div>
            </div>`;
    }).join('');

    return `
        <div class="w-full overflow-x-auto">
            <div class="flex items-end justify-between space-x-2 p-4">${bars}</div>
        </div>
    `;
}

function renderVisaoGeral(visao, totalOverride = null) {
    const porMes = visao?.aniversariantes_por_mes || [];
    // calcular total do mês atual (1-12)
    const now = new Date();
    const mesAtual = now.getMonth() + 1;
    const mesNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    const totalMesAtualVisao = porMes.reduce((acc, item) => {
        const m = Number(item?.mes);
        const t = Number(item?.total) || 0;
        return acc + ((m === mesAtual) ? t : 0);
    }, 0);
    // usar override se fornecido, senão usar o valor vindo da visão
    const totalMesAtual = (typeof totalOverride === 'number' && totalOverride >= 0) ? totalOverride : totalMesAtualVisao;

    // Debug leve: se total for 0, expor porMes no console para investigar origem
    if (totalMesAtual === 0) {
        console.debug('[aniversariantes] renderVisaoGeral: mesAtual=', mesAtual, 'porMes=', porMes);
    }

    let html = `
    <section class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between mb-4">
            <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Visão geral</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Quantidade de aniversariantes no mês corrente</p>
            </div>
            <div class="text-center">
                <div id="total-aniversariantes" class="text-3xl font-bold text-primary-600">${totalMesAtual}</div>
                <div class="text-xs text-gray-500">Aniversariantes em ${mesNames[mesAtual-1]}</div>
            </div>
        </div>
        <div>
            ${criarGraficoMeses(porMes)}
        </div>
    </section>
    `;

    relatorioDiv.innerHTML += html;
    const el = document.getElementById('total-aniversariantes');
    animateNumber(el, totalMesAtual);
}

function renderSeparacaoMinisterio(separacao) {
    if (!separacao) return;

    // Preferir dados específicos por mês quando disponíveis
    const mesAtual = (new Date()).getMonth() + 1;
    const dadosPorMes = Array.isArray(separacao.aniversariantes_por_mes_ministerio) ? separacao.aniversariantes_por_mes_ministerio : null;

    let agregados = [];
    if (dadosPorMes) {
        // Filtrar pelo mês atual e agregar por ministerio_id
        const mapa = new Map();
        dadosPorMes.forEach(item => {
            if (Number(item.mes) !== mesAtual) return;
            const id = item.ministerio_id;
            const nome = item.ministerio_nome || '—';
            const total = Number(item.total) || 0;
            if (!mapa.has(id)) mapa.set(id, { ministerio_id: id, ministerio_nome: nome, total: 0 });
            mapa.get(id).total += total;
        });
        agregados = Array.from(mapa.values());
    }

    // Se não houver dados por mês, fallback para totais globais
    if ((!agregados || agregados.length === 0) && Array.isArray(separacao.aniversariantes_por_ministerio)) {
        agregados = separacao.aniversariantes_por_ministerio.map(m => ({
            ministerio_id: m.ministerio_id,
            ministerio_nome: m.ministerio_nome,
            total: Number(m.total) || 0
        }));
    }

    if (!agregados || agregados.length === 0) {
        relatorioDiv.innerHTML += `<div class="text-center text-gray-500 dark:text-gray-400">Nenhum aniversariante encontrado para o mês atual.</div>`;
        return;
    }

    let rows = agregados.map(m => `
        <div class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-3">
                <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-sm">${String(m.ministerio_nome || '?').charAt(0) || '?'}</div>
                <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">${m.ministerio_nome}</div>
                    <div class="text-xs text-gray-500">ID: ${m.ministerio_id}</div>
                </div>
            </div>
            <div class="text-right">
                <div class="text-lg font-bold text-primary-600">${m.total}</div>
                <div class="text-xs text-gray-500">No mês</div>
            </div>
        </div>
    `).join('');

    const html = `
    <section class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Separação por ministério (mês atual)</h3>
        <div class="space-y-1">${rows}</div>
    </section>
    `;

    relatorioDiv.innerHTML += html;
}

function renderListagem(voluntarios) {
    if (!Array.isArray(voluntarios)) return;

    let rows = voluntarios.map(v => `
        <div class="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-3">
                <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                    ${v.foto ? `<img src="${v.foto}" alt="${v.nome}" class="w-full h-full object-cover">` : `<div class="w-full h-full flex items-center justify-center text-gray-400">👤</div>`}
                </div>
                <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">${v.nome}</div>
                    <div class="text-xs text-gray-500">Nascimento: ${v.data_nascimento} • ${v.ministerios?.map(m=>m.nome).join(', ')}</div>
                </div>
            </div>
            <div class="text-right">
                <div class="text-sm font-medium text-gray-900 dark:text-white">Em ${v.dias_para_aniversario} dias</div>
                <div class="text-xs text-gray-500">Fará ${v.fara_idade} anos</div>
            </div>
        </div>
    `).join('');

    const html = `
    <section class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Próximos aniversariantes</h3>
        <div class="divide-y divide-gray-100 dark:divide-gray-700">${rows}</div>
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

        // usar o ano da querystring ou ano atual
        const params = new URLSearchParams(window.location.search);
        const anoParam = params.get('ano') || new Date().getFullYear();

        const result = await getRelatorioGeral(organizacao_id, anoParam);
        if (!result?.data) throw new Error('Dados do relatório não encontrados');

        const d = result.data;

        // Debug: log completo do retorno para investigação
        try {
            console.debug('[aniversariantes] API result.data:', d);
            console.debug('[aniversariantes] visao_geral:', d.visao_geral);
            console.debug('[aniversariantes] aniversariantes_por_mes:', d?.visao_geral?.aniversariantes_por_mes);
            console.debug('[aniversariantes] separacao_por_ministerio:', d.separacao_por_ministerio);
            console.debug('[aniversariantes] listagem_voluntarios (count):', Array.isArray(d.listagem_voluntarios) ? d.listagem_voluntarios.length : 0);
        } catch (err) {
            console.warn('[aniversariantes] erro ao logar resultado:', err);
        }

        // limpar area
        relatorioDiv.innerHTML = '';

        renderVisaoGeral(d.visao_geral);
        renderSeparacaoMinisterio(d.separacao_por_ministerio);

        // Filtrar listagem: somente datas válidas e aniversariantes que ainda não ocorreram (hoje em diante)
        const voluntariosRaw = Array.isArray(d.listagem_voluntarios) ? d.listagem_voluntarios : [];

        function isValidDateString(s) {
            if (!s) return false;
            // aceitar formatos ISO YYYY-MM-DD
            if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
            const dt = new Date(s);
            return !isNaN(dt.getTime());
        }

        function daysUntil(dateStr) {
            const today = new Date();
            today.setHours(0,0,0,0);
            const b = new Date(dateStr);
            if (isNaN(b)) return null;
            const month = b.getMonth();
            const day = b.getDate();
            let year = today.getFullYear();
            let next = new Date(year, month, day);
            next.setHours(0,0,0,0);
            if (next < today) {
                next = new Date(year + 1, month, day);
                next.setHours(0,0,0,0);
            }
            const diff = Math.ceil((next - today) / (1000 * 60 * 60 * 24));
            return diff;
        }

        const voluntariosFiltrados = voluntariosRaw
            .filter(v => isValidDateString(v.data_nascimento))
            .map(v => ({ ...v, _dias_para_aniversario: daysUntil(v.data_nascimento) }))
            .filter(v => typeof v._dias_para_aniversario === 'number' && v._dias_para_aniversario >= 0)
            .sort((a, b) => a._dias_para_aniversario - b._dias_para_aniversario)
            .slice(0, 50);

        renderListagem(voluntariosFiltrados);

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
