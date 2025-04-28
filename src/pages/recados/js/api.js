class RecadosAPI {
    constructor(baseUrl) {
        if (!baseUrl) throw new Error('baseUrl é obrigatório');
        this.baseUrl = baseUrl;
        this.apiPath = `${baseUrl}/src/services/api/recados`;
    }

    async list(ministerio_id = null, showAll = false) {
        try {
            const params = new URLSearchParams({
                organizacao_id: window.USER.organizacao_id
            });

            // Só inclui ministerio_id se não estiver mostrando todos
            if (!showAll && ministerio_id) {
                params.append('ministerio_id', ministerio_id);
            }

            console.log('Parâmetros da listagem:', Object.fromEntries(params));

            const response = await fetch(`${this.apiPath}/get.php?${params}`);
            
            if (!response.ok) {
                throw new Error('Erro ao buscar recados');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw error;
        }
    }

    async create(data) {
        try {
            const payload = {
                titulo: data.titulo,
                texto: data.texto,
                organizacao_id: window.USER.organizacao_id
            };

            // Adiciona validade apenas se preenchida
            if (data.validade) {
                payload.validade = data.validade;
            }

            // Verifica se é superadmin e se a checkbox está marcada
            if (window.USER.nivel === 'superadmin' && data.enviar_todos === 'on') {
                payload.ministerio_id = null;
                payload.enviar_todos = true;
            } else {
                payload.ministerio_id = window.USER.ministerio_atual?.id;
                payload.enviar_todos = false;
            }

            console.log('Payload do create:', payload); // Debug

            const response = await fetch(`${this.apiPath}/create.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const responseData = await response.json();
            if (!response.ok) throw new Error(responseData.error || 'Erro ao criar recado');
            return responseData;
        } catch (error) {
            console.error('Erro ao criar:', error);
            throw error;
        }
    }

    async update(id, data) {
        try {
            const payload = {
                titulo: data.titulo,
                texto: data.texto,
                ministerio_id: window.USER.ministerio_atual?.id,
                organizacao_id: window.USER.organizacao_id
            };

            if (data.validade) {
                payload.validade = data.validade;
            }

            console.log('Enviando para atualização:', {
                id,
                payload
            });

            const response = await fetch(`${this.apiPath}/put.php?id=${id}`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const responseData = await response.json();
            console.log('Resposta da atualização:', responseData);

            if (!response.ok || responseData.error) {
                throw new Error(responseData.error || 'Erro ao atualizar recado');
            }

            return responseData;
        } catch (error) {
            console.error('Erro ao atualizar:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            console.log('Excluindo recado:', id);

            const response = await fetch(`${this.apiPath}/delete.php?id=${id}`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            const responseText = await response.text();
            console.log('Resposta bruta:', responseText);

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error('Erro ao parsear resposta:', e);
                throw new Error('Resposta inválida do servidor');
            }

            if (!response.ok || data.error) {
                throw new Error(data.error || 'Erro ao excluir recado');
            }

            return data.success;
        } catch (error) {
            console.error('Erro ao excluir:', error);
            throw error;
        }
    }
}

window.RecadosAPI = RecadosAPI;
