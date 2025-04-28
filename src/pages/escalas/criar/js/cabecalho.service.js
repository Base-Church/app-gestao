/**
 * Serviço para controle do cabeçalho da escala
 */
class CabecalhoService {
    constructor() {
        this.init();
    }

    /**
     * Inicializa o serviço e configura os listeners
     */
    init() {
        this.configurarEventos();
    }

    /**
     * Configura os eventos dos elementos do cabeçalho
     */
    configurarEventos() {
        // Usar os IDs específicos em vez de seletores genéricos
        const tipoSelect = document.getElementById('tipo-escala');
        if (tipoSelect) {
            // Limpa o select inicialmente
            tipoSelect.selectedIndex = 0;
            
            // Adiciona o evento de mudança com log para debug
            tipoSelect.addEventListener('change', (event) => {
                this.ajustarDatasComBaseNoTipo();
            });
        } else {
            console.error("Elemento tipo-escala não encontrado!");
        }
    }

    /**
     * Ajusta as datas com base no tipo de escala selecionado
     */
    ajustarDatasComBaseNoTipo() {
        // Usar os IDs específicos para maior precisão
        const tipoSelect = document.getElementById('tipo-escala');
        const inputDataInicio = document.getElementById('data-inicio');
        const inputDataTermino = document.getElementById('data-termino');
        
        if (!tipoSelect || !inputDataInicio || !inputDataTermino) {
            console.error("Elementos não encontrados", {
                tipoSelect: !!tipoSelect,
                inputDataInicio: !!inputDataInicio,
                inputDataTermino: !!inputDataTermino
            });
            return;
        }
        
        const hoje = new Date();
        const tipo = tipoSelect.value;
        
        
        if (!tipo) {
            // Se nenhum tipo foi selecionado, limpa os campos de data
            inputDataInicio.value = "";
            inputDataTermino.value = "";
            return;
        }
        
        switch (tipo) {
            case 'semanal':
                // Para escala semanal:
                // - Início: próximo domingo (ou hoje se for domingo)
                // - Término: 6 dias após a data de início (de domingo a sábado)
                const proximoDomingo = this.obterProximoDomingo(hoje);
                inputDataInicio.value = this.formatarDataParaInput(proximoDomingo);
                
                const terminoSemanal = new Date(proximoDomingo);
                terminoSemanal.setDate(proximoDomingo.getDate() + 6);
                inputDataTermino.value = this.formatarDataParaInput(terminoSemanal);
                
                break;
                
            case 'mensal':
                // Para escala mensal
                let primeiroDiaMes;
                if (hoje.getDate() > 15) {
                    primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);
                } else {
                    primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
                }
                
                const ultimoDiaMes = new Date(primeiroDiaMes.getFullYear(), primeiroDiaMes.getMonth() + 1, 0);
                
                inputDataInicio.value = this.formatarDataParaInput(primeiroDiaMes);
                inputDataTermino.value = this.formatarDataParaInput(ultimoDiaMes);
                
                break;
                
            case 'avulso':
                // Para escala avulsa
                const proximoSabado = this.obterProximoDiaSemana(hoje, 6); // 6 = sábado
                
                inputDataInicio.value = this.formatarDataParaInput(proximoSabado);
                inputDataTermino.value = this.formatarDataParaInput(proximoSabado);
                
                break;
        }
    }
    
    /**
     * Obtém o próximo domingo a partir da data fornecida
     * Se hoje for domingo, retorna a data atual
     * @param {Date} data - A data de referência
     * @return {Date} - Data do próximo domingo
     */
    obterProximoDomingo(data) {
        const dataClone = new Date(data);
        const diaSemana = dataClone.getDay(); // 0 = domingo, 1 = segunda, ...
        
        if (diaSemana === 0) {
            // Se hoje já for domingo, retorna a data atual
            return dataClone;
        }
        
        // Calcula o próximo domingo
        const diasAteProximoDomingo = 7 - diaSemana;
        dataClone.setDate(dataClone.getDate() + diasAteProximoDomingo);
        return dataClone;
    }
    
    /**
     * Obtém o próximo dia da semana específico a partir da data fornecida
     * @param {Date} data - A data de referência
     * @param {number} diaSemanaAlvo - O dia da semana alvo (0 = domingo, 1 = segunda, ..., 6 = sábado)
     * @return {Date} - Data do próximo dia da semana especificado
     */
    obterProximoDiaSemana(data, diaSemanaAlvo) {
        const dataClone = new Date(data);
        const diaSemanaAtual = dataClone.getDay();
        
        // Se hoje for o dia alvo, avança para o próximo
        if (diaSemanaAtual === diaSemanaAlvo) {
            dataClone.setDate(dataClone.getDate() + 7);
            return dataClone;
        }
        
        // Calcula quanto falta para o próximo dia da semana alvo
        let diasParaAdicionar = diaSemanaAlvo - diaSemanaAtual;
        if (diasParaAdicionar <= 0) {
            diasParaAdicionar += 7;
        }
        
        dataClone.setDate(dataClone.getDate() + diasParaAdicionar);
        return dataClone;
    }
    
    /**
     * Formata uma data para o formato aceito pelo input type="date" (YYYY-MM-DD)
     * @param {Date} data - A data a ser formatada
     * @return {string} - Data formatada
     */
    formatarDataParaInput(data) {
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const dia = String(data.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`;
    }
}

// Certifique-se que o DOM esteja carregado antes de inicializar
document.addEventListener('DOMContentLoaded', () => {
    const cabecalhoService = new CabecalhoService();
});

// Alternativa: também verificar se há problema de timing
window.addEventListener('load', () => {
    if (!window.cabecalhoServiceInicializado) {
        window.cabecalhoServiceInicializado = true;
        const cabecalhoService = new CabecalhoService();
    }
});
