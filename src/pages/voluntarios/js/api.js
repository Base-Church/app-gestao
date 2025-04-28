class VoluntariosAPI {
    static async getVoluntarios(params = {}) {
        if (!window.USER.ministerio_atual) {
            throw new Error('Nenhum ministério selecionado');
        }

        const queryParams = new URLSearchParams({
            ministerio_id: window.USER.ministerio_atual,
            organizacao_id: window.USER.organizacao_id,
            limit: 100 // Aumentado para pegar todos os voluntários
        });

        try {
            const response = await fetch(`${window.BASE_URL}/src/services/api/voluntarios/get.php?${queryParams}`);
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Erro ao carregar voluntários');
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
            console.error('Erro ao carregar voluntários:', error.message);
            throw error;
        }
    }

    static async updateVoluntario(id, data) {
        try {
            console.log('Dados enviados para atualização:', data);

            const response = await fetch(`${window.BASE_URL}/src/services/api/voluntarios/update.php`, {
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
            
            const response = await fetch(`${window.BASE_URL}/src/services/api/notificacoes/disparos/preenchimento.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-api-key': window.API_KEY
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
}

export default VoluntariosAPI;
