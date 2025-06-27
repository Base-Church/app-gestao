class EscalaEditService {
    static async buscarEscala(id) {
        try {
            const organizacao_id = window.USER.organizacao_id;
            const ministerio_id = window.USER.ministerio_atual;
            const url = `${window.APP_CONFIG.baseUrl}/src/services/api/escalas/get-by-id.php?escala_id=${id}&organizacao_id=${organizacao_id}&ministerio_id=${ministerio_id}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Erro ao buscar escala');
            }

            return data;
        } catch (error) {
            console.error('Erro ao buscar escala:', error);
            throw error;
        }
    }

    static async atualizar(id, dadosEscala) {
        try {
            // Formatar dados para o formato esperado pela API
            const payload = {
                id: parseInt(id),
                nome: dadosEscala.nome,
                tipo: dadosEscala.tipo,
                data_inicio: dadosEscala.data_inicio,
                data_fim: dadosEscala.data_fim,
                ministerio_id: parseInt(dadosEscala.ministerio_id),
                organizacao_id: parseInt(dadosEscala.organizacao_id),
                eventos: dadosEscala.eventos.map(evento => ({
                    evento_id: parseInt(evento.evento_id),
                    data_evento: evento.data_evento,
                    atividades: evento.atividades.map(atividade => ({
                        atividade_id: parseInt(atividade.atividade_id),
                        voluntario_id: parseInt(atividade.voluntario_id)
                    }))
                }))
            };

            console.log('Payload sendo enviado:', JSON.stringify(payload, null, 2));

            const response = await fetch(`${window.APP_CONFIG.baseUrl}/src/services/api/escalas/put.php`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Ministerio-Id': window.USER.ministerio_atual,
                    'Organizacao-Id': window.USER.organizacao_id
                },
                body: JSON.stringify(payload)
            });

            const data = await response.text(); // Primeiro capturar como texto
            console.log('Resposta bruta da API:', data);

            let jsonData;
            try {
                jsonData = JSON.parse(data);
            } catch (e) {
                console.error('Erro ao parsear resposta JSON:', e);
                throw new Error(`Erro no formato da resposta: ${data}`);
            }

            if (!response.ok) {
                console.error('Detalhes do erro:', {
                    status: response.status,
                    statusText: response.statusText,
                    headers: Object.fromEntries([...response.headers]),
                    body: jsonData
                });
                throw new Error(jsonData.error || `Erro ${response.status}: ${response.statusText}`);
            }

            return jsonData;
        } catch (error) {
            console.error('Erro detalhado ao atualizar escala:', {
                message: error.message,
                stack: error.stack,
                // Se for um erro de rede
                isNetworkError: error instanceof TypeError && error.message === 'Failed to fetch',
                // Dados originais que estavam sendo enviados
                dadosOriginais: dadosEscala
            });
            throw error;
        }
    }
}

window.EscalaEditService = EscalaEditService;
