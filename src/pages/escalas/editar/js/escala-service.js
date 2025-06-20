class EscalaService {
    static #logs = [];

    static downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    static logInfo(stage, data) {
        const log = {
            tipo: 'INFO',
            timestamp: new Date().toISOString(),
            stage,
            data
        };
        this.#logs.push(log);
        console.log(`[${stage}]`, log);
    }

    static logError(stage, error, context = {}) {
        const log = {
            tipo: 'ERROR',
            timestamp: new Date().toISOString(),
            stage,
            error: {
                message: error.message,
                stack: error.stack,
                name: error.name
            },
            context
        };
        this.#logs.push(log);
        console.error(`[ERROR: ${stage}]`, log);
    }

    static imprimirResumo() {
        console.group('📋 RESUMO DA OPERAÇÃO');
        console.log('Timestamp:', new Date().toISOString());
        
        // Resumo geral
        console.group('📊 Estatísticas');
        const totalLogs = this.#logs.length;
        const totalErros = this.#logs.filter(log => log.tipo === 'ERROR').length;
        const totalInfo = this.#logs.filter(log => log.tipo === 'INFO').length;
        
        console.table({
            'Total de Operações': totalLogs,
            'Operações com Sucesso': totalInfo,
            'Operações com Erro': totalErros,
            'Taxa de Sucesso': `${((totalInfo/totalLogs) * 100).toFixed(2)}%`
        });
        console.groupEnd();

        // Timeline de eventos
        console.group('⏱️ Timeline');
        this.#logs.forEach((log, index) => {
            const icon = log.tipo === 'ERROR' ? '❌' : '✅';
            console.log(`${icon} [${log.timestamp}] ${log.stage}`);
        });
        console.groupEnd();

        // Detalhes dos erros
        if (totalErros > 0) {
            console.group('🚨 Detalhes dos Erros');
            const erros = this.#logs.filter(log => log.tipo === 'ERROR');
            erros.forEach((erro, index) => {
                console.group(`Erro ${index + 1}`);
                console.log('Stage:', erro.stage);
                console.log('Mensagem:', erro.error.message);
                console.log('Contexto:', erro.context);
                console.groupEnd();
            });
            console.groupEnd();
        }

        // Payload final
        const payloadLog = this.#logs.find(log => log.stage === 'PAYLOAD_FINAL');
        if (payloadLog) {
            console.group('📦 Payload Final');
            console.log(payloadLog.data);
            console.groupEnd();
        }

        // Resposta da API
        const respostaLog = this.#logs.find(log => log.stage === 'RESPOSTA_API');
        if (respostaLog) {
            console.group('🔄 Resposta da API');
            console.log('Status:', respostaLog.data.status);
            console.log('Corpo:', respostaLog.data.body);
            console.groupEnd();
        }

        console.groupEnd();
    }

    static async criar(dadosEscala) {
        let payload;
        try {
            this.logInfo('INÍCIO', 'Iniciando criação de escala');
            this.logInfo('DADOS_RECEBIDOS', dadosEscala);

            // Validar dados de entrada
            if (!dadosEscala.eventos || !Array.isArray(dadosEscala.eventos)) {
                throw new Error('Eventos inválidos ou não fornecidos');
            }

            // Processar eventos
            this.logInfo('PROCESSANDO_EVENTOS', 'Iniciando processamento dos eventos');
            const eventosProcessados = dadosEscala.eventos.map((evento, index) => {
                this.logInfo('PROCESSANDO_EVENTO', { index, evento });

                if (!evento.id || !evento.data || !Array.isArray(evento.atividades)) {
                    this.logError('VALIDAÇÃO_EVENTO', new Error('Dados do evento incompletos'), evento);
                    throw new Error('Dados do evento incompletos');
                }

                const atividadesProcessadas = evento.atividades.map((atividade, atividadeIndex) => {
                    this.logInfo('PROCESSANDO_ATIVIDADE', { eventoIndex: index, atividadeIndex, atividade });

                    if (!atividade.id || !atividade.voluntario_id) {
                        this.logError('VALIDAÇÃO_ATIVIDADE', new Error('Dados da atividade incompletos'), atividade);
                        throw new Error('Dados da atividade incompletos');
                    }

                    return {
                        id: parseInt(atividade.id),
                        voluntario_id: parseInt(atividade.voluntario_id)
                    };
                });

                return {
                    id: parseInt(evento.id),
                    data: evento.data,
                    atividades: atividadesProcessadas
                };
            });

            // Montar payload
            payload = {
                nome: dadosEscala.nome,
                tipo: dadosEscala.tipo,
                data_inicio: dadosEscala.data_inicio,
                data_fim: dadosEscala.data_fim,
                organizacao_id: parseInt(window.USER.organizacao_id),
                ministerio_id: parseInt(window.USER.ministerio_atual),
                eventos: eventosProcessados
            };

            this.logInfo('PAYLOAD_FINAL', payload);

            // Enviar requisição
            this.logInfo('ENVIANDO_REQUISIÇÃO', {
                url: `${window.APP_CONFIG.apiUrl}/api/escalas`,
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ****' // Ocultando token por segurança
                }
            });

            const response = await fetch(`${window.APP_CONFIG.apiUrl}/api/escalas`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.APP_CONFIG.apiKey}`
                },
                body: JSON.stringify(payload)
            });

            // Log da resposta da API
            const responseData = await response.text();
            this.logInfo('RESPOSTA_API', {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries([...response.headers]),
                body: responseData
            });

            // Tentar fazer parse do JSON
            let resultado;
            try {
                resultado = JSON.parse(responseData);
                this.logInfo('RESPOSTA_PROCESSADA', resultado);
            } catch (e) {
                this.logError('PARSE_RESPOSTA', e, { responseData });
                throw new Error('Erro ao processar resposta da API');
            }

            if (!response.ok) {
                this.logError('RESPOSTA_NAO_OK', new Error(resultado.message), resultado);
                throw new Error(resultado.message || 'Erro ao criar escala');
            }

            if (resultado.code === 201) {
                Swal.fire({
                    toast: true,
                    position: 'bottom',
                    icon: 'success',
                    title: resultado.message,
                    showConfirmButton: false,
                    timer: 3000
                }).then(() => {
                    window.location.href = `${window.APP_CONFIG.baseUrl}/src/pages/escalas/`;
                });
            }

            // Após processar tudo, imprimir resumo
            this.imprimirResumo();

            return resultado;
        } catch (error) {
            this.logError('ERRO_FINAL', error, {
                dadosOriginais: dadosEscala,
                dadosProcessados: payload
            });

            // Imprimir resumo mesmo em caso de erro
            this.imprimirResumo();

            console.error('Erro ao criar escala:', {
                mensagem: error.message,
                dadosOriginais: dadosEscala,
                dadosProcessados: payload,
                stackTrace: error.stack
            });

            // Baixar backup dos dados
            const backupData = {
                timestamp: new Date().toISOString(),
                erro: {
                    mensagem: error.message,
                    stack: error.stack
                },
                dadosOriginais: dadosEscala,
                dadosProcessados: payload
            };

            this.downloadJSON(backupData, `escala_backup_${Date.now()}.json`);

            // Notificar usuário
            Swal.fire({
                title: 'Erro ao criar escala',
                text: 'Um arquivo de backup foi baixado com os dados. Verifique os dados e tente novamente.',
                icon: 'warning',
                confirmButtonText: 'Ok'
            });

            throw error;
        }
    }
}

// Exportar para uso global
window.EscalaService = EscalaService;
