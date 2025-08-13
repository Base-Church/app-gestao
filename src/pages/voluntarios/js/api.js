class VoluntariosAPI {
    static async getVoluntarios(params = {}) {
        if (!window.USER?.ministerio_atual) {
            throw new Error('Nenhum ministério selecionado');
        }

        try {
            const queryParams = new URLSearchParams({
                ministerio_id: window.USER.ministerio_atual,
                organizacao_id: window.USER.organizacao_id,
                limit: 100
            });

            const response = await fetch(`${window.APP_CONFIG.baseUrl}/src/services/api/voluntarios/get.php?${queryParams}`, {
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erro ao carregar voluntários');
            }

            const data = await response.json();
            
            // Adiciona inGroup como undefined para indicar que ainda não foi sincronizado
            const formattedData = Array.isArray(data.data) ? data.data.map(v => ({
                ...v,
                inGroup: undefined // undefined significa que não foi sincronizado ainda
            })) : [];
            
            return {
                data: formattedData,
                meta: data.meta || {}
            };
        } catch (error) {
            console.error('Erro ao carregar voluntários:', error);
            throw error;
        }
    }

    static async updateVoluntario(id, data) {
        try {
            console.log('Dados enviados para atualização:', data);

            const response = await fetch(`${window.APP_CONFIG.baseUrl}/src/services/api/voluntarios/update.php`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            console.log('Resposta da atualização:', responseData);

            if (!response.ok) {
                throw new Error(responseData.error || 'Erro ao atualizar voluntário');
            }

            return responseData;
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw error;
        }
    }

    static async enviarNotificacoes(dados) {
        try {
            console.log('Dados enviados:', dados);
            
            const response = await fetch(`${window.APP_CONFIG.baseUrl}/src/services/api/notificacoes/disparos/preenchimento.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-api-key': window.APP_CONFIG.apiKey
                },
                body: JSON.stringify(dados)
            });

            // Log da resposta bruta
            const rawResponse = await response.text();
            console.log('Resposta bruta:', rawResponse);

            try {
                const responseData = JSON.parse(rawResponse);
                
                if (!response.ok) {
                    throw new Error(responseData.error || 'Erro ao enviar notificações');
                }

                return responseData;
            } catch (parseError) {
                console.error('Erro ao parsear resposta:', parseError);
                console.error('Resposta recebida:', rawResponse);
                throw new Error('Resposta inválida do servidor');
            }
        } catch (error) {
            console.error('Erro detalhado:', error);
            throw error;
        }
    }

    static async getHistoricoIndisponibilidade(voluntarioId, mes, ano) {
        try {
            const params = new URLSearchParams({
                organizacao_id: window.USER.organizacao_id,
                voluntario_id: voluntarioId,
                mes: mes,
                ano: ano
            });

            const response = await fetch(`${window.APP_CONFIG.baseUrl}/src/services/api/voluntarios/historico-indisponibilidade.php?${params}`, {
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erro ao carregar histórico de indisponibilidade');
            }

            const data = await response.json();
            // Processa a estrutura específica do histórico de indisponibilidade
            if (data && data.data && data.data.historico) {
                const historico = data.data.historico;
                const datas = [];
                
                // Extrai todas as datas de todos os anos e meses
                Object.keys(historico).forEach(ano => {
                    Object.keys(historico[ano]).forEach(mes => {
                        if (historico[ano][mes].datas) {
                            historico[ano][mes].datas.forEach(data => {
                                datas.push({ data: data });
                            });
                        }
                    });
                });
                
                return datas;
            }
            return [];
        } catch (error) {
            console.error('Erro ao carregar histórico de indisponibilidade:', error);
            return [];
        }
    }

    static async getServicosMes(voluntarioId, mes, ano) {
        try {
            const params = new URLSearchParams({
                organizacao_id: window.USER.organizacao_id,
                voluntario_id: voluntarioId,
                mes: mes,
                ano: ano
            });

            const response = await fetch(`${window.APP_CONFIG.baseUrl}/src/services/api/voluntarios/servicos-mes.php?${params}`, {
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erro ao carregar serviços do mês');
            }

            const data = await response.json();
            // Processa a estrutura específica dos serviços do mês
            if (data && data.data && Array.isArray(data.data.servicos)) {
                return data.data.servicos.map(servico => ({
                    data: servico.data,
                    atividade: servico.atividade ? servico.atividade.nome : 'Atividade não especificada',
                    ministerio: servico.atividade ? servico.atividade.ministerio : '',
                    evento: servico.evento ? servico.evento.nome : 'Evento não especificado',
                    hora: servico.evento ? servico.evento.hora : '',
                    cor: servico.atividade ? servico.atividade.cor : '#cccccc'
                }));
            }
            return [];
        } catch (error) {
            console.error('Erro ao carregar serviços do mês:', error);
            return [];
        }
    }
}

export default VoluntariosAPI;
