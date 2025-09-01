/**
 * Serviço para gerenciar histórico de indisponibilidade de voluntários
 */
class HistoricoIndisponibilidadeService {
    constructor() {
        this.URL_BASE = window.APP_CONFIG.baseUrl || '';
    }

    /**
     * Busca o histórico de indisponibilidade de um voluntário
     * @param {number} voluntarioId - ID do voluntário
     * @param {number} mes - Mês (1-12)
     * @param {number} ano - Ano
     * @returns {Promise<Object>} - Dados do histórico
     */
    async buscarHistorico(voluntarioId, mes = null, ano = null) {
        try {
            const dataAtual = new Date();
            const mesAtual = mes || (dataAtual.getMonth() + 1);
            const anoAtual = ano || dataAtual.getFullYear();

            const params = new URLSearchParams({
                organizacao_id: window.USER.organizacao_id,
                voluntario_id: voluntarioId,
                mes: mesAtual,
                ano: anoAtual
            });

            const response = await fetch(`${this.URL_BASE}/src/services/api/voluntarios/historico-indisponibilidade.php?${params}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }

            const resultado = await response.json();
            return resultado.data || resultado;
        } catch (error) {
            console.error('Erro ao buscar histórico de indisponibilidade:', error);
            throw error;
        }
    }

    /**
     * Abre o offcanvas do histórico de indisponibilidade
     * @param {Object} voluntario - Dados do voluntário {id, nome, img}
     */
    async abrirHistoricoIndisponibilidade(voluntario) {
        // Fecha qualquer offcanvas de histórico já aberto
        document.querySelectorAll('.historico-indisponibilidade-offcanvas').forEach(el => el.remove());

        try {
            // Busca dados iniciais (mês atual)
            const dataAtual = new Date();
            const mesAtual = dataAtual.getMonth() + 1;
            const anoAtual = dataAtual.getFullYear();

            const historico = await this.buscarHistorico(voluntario.id, mesAtual, anoAtual);
            
            // Cria o offcanvas
            this.criarOffcanvasHistorico(voluntario, historico, mesAtual, anoAtual);
        } catch (error) {
            alert('Erro ao carregar histórico de indisponibilidade');
            console.error(error);
        }
    }

    /**
     * Cria o offcanvas com o histórico de indisponibilidade
     * @param {Object} voluntario - Dados do voluntário
     * @param {Object} historico - Dados do histórico
     * @param {number} mes - Mês atual
     * @param {number} ano - Ano atual
     */
    criarOffcanvasHistorico(voluntario, historico, mes, ano) {
        const offcanvas = document.createElement('div');
        offcanvas.className = 'historico-indisponibilidade-offcanvas fixed top-0 right-0 w-full max-w-md h-full bg-white dark:bg-gray-900 shadow-2xl z-[2001] transition-transform duration-300 translate-x-full';
        offcanvas.style.maxWidth = '380px';

        offcanvas.innerHTML = `
            <div class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div class="flex items-center space-x-3">
                    <button type="button" class="btn-voltar text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                    </button>
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Histórico de Indisponibilidade</h3>
                </div>
                <button type="button" class="fechar-historico text-gray-400 hover:text-red-500">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>

            <!-- Informações do voluntário -->
            <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex-shrink-0">
                        <img src="${voluntario.img}" alt="${voluntario.nome}" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='${this.URL_BASE}/assets/img/placeholder.jpg'">
                    </div>
                    <div>
                        <h4 class="text-sm font-semibold text-gray-800 dark:text-white">${voluntario.nome}</h4>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Histórico de Indisponibilidade</p>
                    </div>
                </div>
            </div>

            <!-- Controles do mês/ano -->
            <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div class="flex items-center justify-between">
                    <button type="button" class="btn-mes-anterior p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                    </button>
                    <h4 class="mes-ano-atual text-lg font-semibold text-gray-800 dark:text-white">${this.getNomeMes(mes)} ${ano}</h4>
                    <button type="button" class="btn-mes-proximo p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Loading -->
            <div class="loading-historico p-4 text-center hidden">
                <div class="inline-flex items-center space-x-2">
                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                    <span class="text-sm text-gray-600 dark:text-gray-400">Carregando...</span>
                </div>
            </div>

            <!-- Calendário -->
            <div class="calendario-container overflow-y-auto max-h-[calc(100vh-250px)] p-4">
                ${this.criarCalendario(mes, ano, historico)}
            </div>
        `;

        // Event listeners
        this.configurarEventos(offcanvas, voluntario, mes, ano);

        // Exibe o offcanvas
        document.body.appendChild(offcanvas);
        setTimeout(() => offcanvas.classList.remove('translate-x-full'), 10);
    }

    /**
     * Configura os eventos do offcanvas
     */
    configurarEventos(offcanvas, voluntario, mesInicial, anoInicial) {
        let mesAtual = mesInicial;
        let anoAtual = anoInicial;

        // Fechar offcanvas
        offcanvas.querySelector('.fechar-historico').onclick = () => {
            offcanvas.classList.add('translate-x-full');
            setTimeout(() => offcanvas.remove(), 300);
        };

        // Voltar para lista de voluntários
        offcanvas.querySelector('.btn-voltar').onclick = () => {
            offcanvas.classList.add('translate-x-full');
            setTimeout(() => offcanvas.remove(), 300);
        };

        // Navegação de meses
        offcanvas.querySelector('.btn-mes-anterior').onclick = async () => {
            mesAtual--;
            if (mesAtual < 1) {
                mesAtual = 12;
                anoAtual--;
            }
            await this.atualizarCalendario(offcanvas, voluntario, mesAtual, anoAtual);
        };

        offcanvas.querySelector('.btn-mes-proximo').onclick = async () => {
            mesAtual++;
            if (mesAtual > 12) {
                mesAtual = 1;
                anoAtual++;
            }
            await this.atualizarCalendario(offcanvas, voluntario, mesAtual, anoAtual);
        };
    }

    /**
     * Atualiza o calendário com novos dados
     */
    async atualizarCalendario(offcanvas, voluntario, mes, ano) {
        const loadingEl = offcanvas.querySelector('.loading-historico');
        const calendarioEl = offcanvas.querySelector('.calendario-container');
        const mesAnoEl = offcanvas.querySelector('.mes-ano-atual');

        try {
            // Mostra loading
            loadingEl.classList.remove('hidden');
            calendarioEl.style.opacity = '0.5';

            // Busca novos dados
            const historico = await this.buscarHistorico(voluntario.id, mes, ano);

            // Atualiza o título
            mesAnoEl.textContent = `${this.getNomeMes(mes)} ${ano}`;

            // Atualiza o calendário
            calendarioEl.innerHTML = this.criarCalendario(mes, ano, historico);

        } catch (error) {
            console.error('Erro ao atualizar calendário:', error);
            calendarioEl.innerHTML = '<p class="text-center text-red-500 text-sm">Erro ao carregar dados</p>';
        } finally {
            // Esconde loading
            loadingEl.classList.add('hidden');
            calendarioEl.style.opacity = '1';
        }
    }

    /**
     * Cria o HTML do calendário
     */
    criarCalendario(mes, ano, historico) {
        const diasIndisponiveis = this.extrairDiasIndisponiveis(historico, mes, ano);
        
        // Extrai observações da estrutura correta: data.historico.ano.mes.observacoes
        let observacoes = null;
        if (historico?.data?.historico?.[ano]?.[mes]) {
            observacoes = historico.data.historico[ano][mes].observacoes;
        } else if (historico?.historico?.[ano]?.[mes]) {
            observacoes = historico.historico[ano][mes].observacoes;
        }

        const primeiroDia = new Date(ano, mes - 1, 1);
        const ultimoDia = new Date(ano, mes, 0);
        const diasNoMes = ultimoDia.getDate();
        const diaSemanaInicio = primeiroDia.getDay();

        let html = `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <!-- Cabeçalho dos dias da semana -->
                <div class="grid grid-cols-7 gap-1 p-2 border-b border-gray-200 dark:border-gray-700">
                    ${['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(dia => 
                        `<div class="text-center text-xs font-semibold text-gray-600 dark:text-gray-400 py-2">${dia}</div>`
                    ).join('')}
                </div>
                
                <!-- Dias do calendário -->
                <div class="grid grid-cols-7 gap-1 p-2">
        `;

        // Células vazias antes do primeiro dia do mês
        for (let i = 0; i < diaSemanaInicio; i++) {
            html += '<div class="h-8"></div>';
        }

        // Dias do mês
        for (let dia = 1; dia <= diasNoMes; dia++) {
            const dataCompleta = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
            const isIndisponivel = diasIndisponiveis.includes(dataCompleta);
            const isHoje = this.isDataHoje(ano, mes, dia);
            
            let classes = 'h-8 flex items-center justify-center text-sm rounded-md cursor-default transition-colors ';
            
            if (isIndisponivel) {
                classes += 'bg-red-500 text-white font-semibold ';
            } else if (isHoje) {
                classes += 'bg-primary-100 text-primary-800 font-semibold border-2 border-primary-300 ';
            } else {
                classes += 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ';
            }

            html += `<div class="${classes}" title="${isIndisponivel ? 'Indisponível' : ''}">${dia}</div>`;
        }

        html += `
                </div>
            </div>
        `;

        // Adiciona observações se existirem
        if (observacoes) {
            html += `
                <div class="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <h5 class="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Observações:</h5>
                    <p class="text-sm text-yellow-700 dark:text-yellow-300">${observacoes}</p>
                </div>
            `;
        }

        // Adiciona legenda
        html += `
            <div class="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h5 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Legenda:</h5>
                <div class="flex flex-wrap gap-3 text-xs">
                    <div class="flex items-center gap-2">
                        <div class="w-4 h-4 bg-red-500 rounded"></div>
                        <span class="text-gray-600 dark:text-gray-400">Indisponível</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-4 h-4 bg-primary-100 border-2 border-primary-300 rounded"></div>
                        <span class="text-gray-600 dark:text-gray-400">Hoje</span>
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    /**
     * Extrai os dias indisponíveis do JSON de resposta
     */
    extrairDiasIndisponiveis(historico, mes, ano) {
        console.log('Histórico recebido:', historico);
        
        // Estrutura real da API: data.historico.ano.mes.datas
        if (historico?.data?.historico?.[ano]?.[mes]) {
            const datas = historico.data.historico[ano][mes].datas || [];
            console.log('Datas indisponíveis encontradas:', datas);
            return datas;
        }
        
        // Fallback para estrutura direta
        if (historico?.historico?.[ano]?.[mes]) {
            const datas = historico.historico[ano][mes].datas || [];
            console.log('Datas indisponíveis encontradas (fallback):', datas);
            return datas;
        }

        console.log('Nenhuma data indisponível encontrada para', ano, mes);
        return [];
    }

    /**
     * Verifica se uma data é hoje
     */
    isDataHoje(ano, mes, dia) {
        const hoje = new Date();
        return hoje.getFullYear() === ano && 
               hoje.getMonth() + 1 === mes && 
               hoje.getDate() === dia;
    }

    /**
     * Retorna o nome do mês
     */
    getNomeMes(mes) {
        const meses = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        return meses[mes - 1] || '';
    }
}

// Inicializa o serviço globalmente
window.historicoIndisponibilidadeService = new HistoricoIndisponibilidadeService();
