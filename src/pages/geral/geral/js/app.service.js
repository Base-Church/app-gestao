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

function renderAniversariantesChart(data) {
    const canvas = document.getElementById('aniversariantes-chart');
    if (!canvas) {
        console.error('Canvas aniversariantes-chart não encontrado');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Contexto 2D não disponível');
        return;
    }
    
    if (!data || !Array.isArray(data) || data.length === 0) {
        console.error('Dados de aniversariantes inválidos:', data);
        return;
    }
    
    // Tornar o canvas responsivo
    const container = canvas.parentElement;
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width - 32; // -32 para padding da div pai
    const canvasHeight = Math.min(300, window.innerWidth < 768 ? 250 : 300); // Menor em mobile
    
    // Definir tamanho físico do canvas
    canvas.width = containerWidth * window.devicePixelRatio;
    canvas.height = canvasHeight * window.devicePixelRatio;
    
    // Definir tamanho CSS para ocupar 100% do container
    canvas.style.width = '100%';
    canvas.style.height = canvasHeight + 'px';
    
    // Escalar o contexto para alta resolução
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const maxValue = Math.max(...data.map(item => item.quantidade));
    
    // Usar dimensões escaladas
    const chartWidth = containerWidth - 100;
    const chartHeight = canvasHeight - 100;
    const stepX = chartWidth / 11; // 11 intervalos para 12 pontos
    
    ctx.clearRect(0, 0, containerWidth, canvasHeight);
    
    // Configurar cores baseadas no tema  
    const isDarkMode = document.documentElement.classList.contains('dark');
    const textColor = isDarkMode ? '#E5E7EB' : '#374151';
    
    // Extrair cor primária do Tailwind usando elemento temporário
    const tempDiv = document.createElement('div');
    tempDiv.className = 'text-primary-500';
    document.body.appendChild(tempDiv);
    const primaryColor = getComputedStyle(tempDiv).color;
    document.body.removeChild(tempDiv);
    
    // Converter cor RGB para formato hexadecimal para usar no canvas
    const rgbToHex = (rgb) => {
        const match = rgb.match(/\d+/g);
        if (!match) return '#3B82F6'; // fallback
        const [r, g, b] = match.map(Number);
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    };
    
    const primaryHex = rgbToHex(primaryColor);
    
    // Criar pontos da curva
    const points = data.map((item, index) => ({
        x: 50 + index * stepX,
        y: canvasHeight - 50 - ((item.quantidade / maxValue) * chartHeight),
        value: item.quantidade
    }));
    
    // Desenhar área com gradiente (fade)
    const gradient = ctx.createLinearGradient(0, 50, 0, canvasHeight - 50);
    gradient.addColorStop(0, primaryHex + '40'); // 40 = 25% opacidade
    gradient.addColorStop(1, primaryHex + '00'); // 00 = transparente
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(points[0].x, canvasHeight - 50);
    
    // Desenhar linha suave (curva bezier)
    for (let i = 0; i < points.length; i++) {
        if (i === 0) {
            ctx.lineTo(points[i].x, points[i].y);
        } else {
            const prevPoint = points[i - 1];
            const currentPoint = points[i];
            
            // Pontos de controle para curva suave
            const cpx1 = prevPoint.x + stepX * 0.3;
            const cpy1 = prevPoint.y;
            const cpx2 = currentPoint.x - stepX * 0.3;
            const cpy2 = currentPoint.y;
            
            ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, currentPoint.x, currentPoint.y);
        }
    }
    
    // Fechar a área
    ctx.lineTo(points[points.length - 1].x, canvasHeight - 50);
    ctx.closePath();
    ctx.fill();
    
    // Desenhar linha da onda
    ctx.strokeStyle = primaryHex;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
        const prevPoint = points[i - 1];
        const currentPoint = points[i];
        
        const cpx1 = prevPoint.x + stepX * 0.3;
        const cpy1 = prevPoint.y;
        const cpx2 = currentPoint.x - stepX * 0.3;
        const cpy2 = currentPoint.y;
        
        ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, currentPoint.x, currentPoint.y);
    }
    ctx.stroke();
    
    // Desenhar pontos
    points.forEach((point, index) => {
        // Círculo de fundo branco
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
        ctx.fill();
        
        // Círculo principal
        ctx.fillStyle = primaryHex;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
        ctx.fill();
        
        // Labels dos meses
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.font = '12px system-ui, -apple-system, sans-serif';
        ctx.fillText(months[index], point.x, canvasHeight - 25);
        
        // Valores
        ctx.fillStyle = textColor;
        ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
        ctx.fillText(point.value.toString(), point.x, point.y - 15);
    });
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
    const verMaisCard = `
        <div class="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl border-2 border-dashed border-primary-300 dark:border-primary-600 p-6 flex flex-col items-center justify-center">
            <svg class="w-8 h-8 text-primary-500 dark:text-primary-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
            </svg>
            <h3 class="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-2">Ver Distribuição</h3>
            <p class="text-sm text-primary-600 dark:text-primary-400 text-center mb-4">Visualize a distribuição completa de voluntários por culto</p>
            <a href="/geral/escalas" class="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200">
                Ver Escalas
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </a>
        </div>
    `;
    
    container.innerHTML = cards + verMaisCard;
}

async function renderRelatorio() {
    try {
        console.log('Iniciando renderização do relatório...');
        
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
        
        console.log('Fazendo requisição para organização:', organizacao_id);
        const result = await getRelatorioGeral(organizacao_id);
        console.log('Resultado da API:', result);
        
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
        
        // Renderizar gráfico de aniversariantes (por último)
        console.log('Dados de aniversariantes recebidos:', d.total_aniversariantes);
        window.lastAniversariantesData = d.total_aniversariantes; // Salvar para redimensionamento
        
        if (d.total_aniversariantes && Array.isArray(d.total_aniversariantes)) {
            renderAniversariantesChart(d.total_aniversariantes);
        } else {
            console.error('Dados de aniversariantes inválidos ou não encontrados');
        }
        
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
    console.log('DOM carregado, iniciando renderização...');
    renderRelatorio();
});

// Redimensionar gráfico quando a janela mudar de tamanho
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const canvas = document.getElementById('aniversariantes-chart');
        if (canvas && window.lastAniversariantesData) {
            console.log('Redimensionando gráfico...');
            renderAniversariantesChart(window.lastAniversariantesData);
        }
    }, 250); // Debounce de 250ms
});

// Observador de redimensionamento para container do gráfico
if (typeof ResizeObserver !== 'undefined') {
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.target.id === 'aniversariantes-chart' && window.lastAniversariantesData) {
                setTimeout(() => {
                    renderAniversariantesChart(window.lastAniversariantesData);
                }, 100);
            }
        }
    });
    
    window.addEventListener('DOMContentLoaded', () => {
        const canvas = document.getElementById('aniversariantes-chart');
        if (canvas) {
            resizeObserver.observe(canvas.parentElement);
        }
    });
}