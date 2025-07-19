const loading = document.getElementById('relatorio-loading');
const erro = document.getElementById('relatorio-erro');
const relatorioDiv = document.getElementById('relatorio-geral');

// Função para animação numérica
function animateNumber(element, finalValue, duration = 1500, suffix = '') {
    if (!element) {
        console.warn('Elemento não encontrado para animação numérica');
        return;
    }
    
    const startValue = 0;
    const startTime = Date.now();
    
    function updateNumber() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Função de easing para suavizar a animação
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.round(startValue + (finalValue - startValue) * easeOutQuart);
        
        element.textContent = currentValue + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    updateNumber();
}

function getScoreColor(score) {
    // Lógica invertida: quanto maior a % de disponibilidade, melhor (mais verde)
    // 80%+ = Verde (muito bom), 50-79% = Amarelo (médio), <50% = Vermelho (ruim)
    if (score >= 80) return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
    return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
}

function renderMinisteriosCards(voluntarios, scores, novos) {
    const container = document.getElementById('ministerios-cards');
    
    const cards = voluntarios.map(ministerio => {
        const score = scores.find(s => s.ministerio_id === ministerio.ministerio_id);
        const novo = novos.find(n => n.ministerio_id === ministerio.ministerio_id);
        
        const scoreValue = score ? parseInt(score.score_indisponibilidade) : 0;
        const scoreColorClass = getScoreColor(scoreValue);
        
        return `
            <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 min-w-80">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${ministerio.ministerio_nome}</h3>
                    <span class="px-3 py-1 rounded-full text-sm font-medium ${scoreColorClass}">
                        ${scoreValue}% disponível
                    </span>
                </div>
                
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="text-gray-600 dark:text-gray-400">Total de Voluntários</span>
                        <span class="font-semibold text-gray-900 dark:text-white">${ministerio.total_voluntarios}</span>
                    </div>
                    
                    ${score ? `
                    <div class="flex justify-between">
                        <span class="text-gray-600 dark:text-gray-400">Disponibilidade Declarada</span>
                        <span class="font-semibold text-gray-900 dark:text-white">${score.declararam_indisponibilidade}</span>
                    </div>
                    ` : ''}
                    
                    ${novo ? `
                    <div class="flex justify-between">
                        <span class="text-gray-600 dark:text-gray-400">Novos no Mês</span>
                        <span class="font-semibold text-gray-900 dark:text-white">${novo.total}</span>
                    </div>
                    ` : ''}
                </div>
                
                <div class="mt-4 bg-gray-100 dark:bg-gray-700 rounded-lg h-2">
                    <div class="bg-primary-500 h-2 rounded-lg" style="width: ${(ministerio.total_voluntarios / Math.max(...voluntarios.map(m => m.total_voluntarios))) * 100}%"></div>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = cards;
}

function renderEscalasCards(escalas) {
    const container = document.getElementById('escalas-cards');
    
    const cards = escalas.map(escala => `
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${escala.evento_nome}</h3>
                <span class="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium">
                    ${escala.total_voluntarios} voluntários
                </span>
            </div>
            
            <div class="text-gray-600 dark:text-gray-400">
                <p class="text-sm">Data do Evento</p>
                <p class="font-semibold text-gray-900 dark:text-white">
                    ${new Date(escala.data_evento).toLocaleDateString('pt-BR')}
                </p>
            </div>
        </div>
    `).join('');
    
    // Adicionar card "Ver mais" com mesmo tamanho
    const BASE_URL = window.BASE_URL || '';
    const verMaisCard = `
        <div class="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl border-2 border-dashed border-primary-300 dark:border-primary-600 p-6 flex flex-col items-center justify-center">
            <svg class="w-8 h-8 text-primary-500 dark:text-primary-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
            </svg>
            <h3 class="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-2">Ver Distribuição</h3>
            <p class="text-sm text-primary-600 dark:text-primary-400 text-center mb-4">Visualize a distribuição completa de voluntários por culto, <b>Clique em Escalas e Eventos</b></p>
            
        </div>
    `;
    
    container.innerHTML = cards + verMaisCard;
}

async function renderRelatorio() {
    try {
        
        // Aguardar que o DOM esteja completamente carregado
        if (document.readyState !== 'complete') {
            await new Promise(resolve => {
                window.addEventListener('load', resolve);
            });
        }
        
        const organizacao_id = window.USER?.organizacao_id;
        if (!organizacao_id) {
            console.error('USER ou organizacao_id não encontrados:', window.USER);
            throw new Error('Organização não encontrada');
        }
        
        const result = await getRelatorioGeral(organizacao_id);
        
        if (!result?.data) throw new Error('Dados não encontrados');
        
        const d = result.data;
        
        // Atualizar métricas principais com animação
        animateNumber(document.getElementById('total-voluntarios'), d.total_voluntarios);
        animateNumber(document.getElementById('percentual-escalados'), d.percentual_voluntarios_escalados, 1500, '%');
        
        // Total escalados sem animação
        const totalEscaladosElement = document.getElementById('total-escalados');
        if (totalEscaladosElement) {
            totalEscaladosElement.textContent = d.total_escalados;
        }
        
        // Calcular total de novos voluntários
        const totalNovosVoluntarios = d.novos_voluntarios_por_ministerio_mes?.reduce((total, item) => total + item.total, 0) || 0;
        animateNumber(document.getElementById('novos-voluntarios'), totalNovosVoluntarios);
        
        // Renderizar cards de ministérios
        renderMinisteriosCards(
            d.voluntarios_por_ministerio,
            d.score_indisponibilidades_por_ministerio,
            d.novos_voluntarios_por_ministerio_mes
        );
        
        // Renderizar cards de escalas
        renderEscalasCards(d.escalas_mes_atual);
        
        // Adicionar funcionalidade de scroll com setas para ministérios
        setupMinisteriosScroll();
        
        loading.classList.add('hidden');
        erro.classList.add('hidden');
        relatorioDiv.classList.remove('hidden');
        
    } catch (e) {
        console.error('Erro detalhado ao carregar relatório:', e);
        console.error('Stack trace:', e.stack);
        
        loading.classList.add('hidden');
        erro.classList.remove('hidden');
        relatorioDiv.classList.add('hidden');
        
        // Mostrar erro mais detalhado no elemento de erro
        const erroElement = document.querySelector('#relatorio-erro span');
        if (erroElement) {
            erroElement.textContent = `Erro ao carregar relatório: ${e.message}`;
        }
    }
}

function setupMinisteriosScroll() {
    const leftBtn = document.getElementById('ministerios-scroll-left');
    const rightBtn = document.getElementById('ministerios-scroll-right');
    const scrollContainer = document.getElementById('ministerios-cards');
    
    if (!leftBtn || !rightBtn || !scrollContainer) {
        console.warn('Elementos de scroll não encontrados');
        return;
    }
    
    leftBtn.addEventListener('click', () => {
        scrollContainer.scrollBy({ left: -320, behavior: 'smooth' });
    });
    
    rightBtn.addEventListener('click', () => {
        scrollContainer.scrollBy({ left: 320, behavior: 'smooth' });
    });
    
}

window.addEventListener('DOMContentLoaded', () => {
    renderRelatorio();
});