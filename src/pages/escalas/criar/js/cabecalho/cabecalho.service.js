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
        const tipoSelect = document.getElementById('tipo-escala');
        const inputDataInicio = document.getElementById('data-inicio');
        const inputDataTermino = document.getElementById('data-termino');
        
        if (!tipoSelect || !inputDataInicio || !inputDataTermino) {
            console.error("Elementos não encontrados");
            return;
        }
        
        const hoje = new Date();
        const tipo = tipoSelect.value;
        
        if (!tipo) {
            inputDataInicio.value = "";
            inputDataTermino.value = "";
            // Atualiza estado
            window.escalaManagerService.estado.cabecalho.dataInicio = "";
            window.escalaManagerService.estado.cabecalho.dataTermino = "";
            return;
        }
        
        let dataInicio, dataTermino;
        
        switch (tipo) {
            case 'semanal':
                dataInicio = this.obterProximoDomingo(hoje);
                dataTermino = new Date(dataInicio);
                dataTermino.setDate(dataInicio.getDate() + 6);
                break;
                
            case 'mensal':
                dataInicio = new Date(hoje.getDate() > 15 ? 
                    new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1) :
                    new Date(hoje.getFullYear(), hoje.getMonth(), 1));
                dataTermino = new Date(dataInicio.getFullYear(), dataInicio.getMonth() + 1, 0);
                break;
                
            case 'avulso':
                dataInicio = this.obterProximoDiaSemana(hoje, 6);
                dataTermino = new Date(dataInicio);
                break;
        }
        
        // Atualiza inputs
        inputDataInicio.value = this.formatarDataParaInput(dataInicio);
        inputDataTermino.value = this.formatarDataParaInput(dataTermino);
        
        // Atualiza estado do escalaManagerService
        window.escalaManagerService.estado.cabecalho.dataInicio = this.formatarDataParaInput(dataInicio);
        window.escalaManagerService.estado.cabecalho.dataTermino = this.formatarDataParaInput(dataTermino);
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
