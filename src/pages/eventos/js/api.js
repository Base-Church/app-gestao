class EventosAPI {
    constructor(baseUrl) {
        if (!baseUrl) {
            throw new Error('baseUrl é obrigatório');
        }
        this.baseUrl = baseUrl;
        this.apiPath = `${baseUrl}/src/services/api/eventos`; // Caminho base para os endpoints
    }

    async list(page = 1, limit = 50, search = '') {
        try {
            const params = new URLSearchParams({
                page,
                limit,
                search
            });

            const url = `${this.apiPath}/get.php?${params}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao buscar eventos`);
            }

            const data = await response.json();
            
            if (!data || typeof data !== 'object') {
                throw new Error('Resposta inválida da API');
            }

            return data;
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao buscar eventos');
        }
    }

    async create(data) {
        try {
            console.group('Dados para API de Eventos');
            console.log('Dados recebidos:', data);

            const payload = {
                nome: data.nome,
                dia_semana: data.dia_semana,
                hora: this.formatTime(data.hora),
                foto: data.foto || null,
                tipo: data.tipo,
                valido: data.tipo === 'evento' ? this.formatDate(data.valido) : null,
                visibilidade: data.visibilidade || 'interno' // Adicionar valor padrão aqui
            };

            console.log('Payload formatado:', payload);

            const response = await fetch(`${this.apiPath}/create.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const responseData = await response.json();
            console.log('Resposta da API:', responseData);
            console.groupEnd();

            if (!response.ok) {
                throw new Error(responseData.message || 'Erro ao criar evento');
            }

            return responseData;
        } catch (error) {
            console.error('Erro completo:', error);
            throw error;
        }
    }

    // Helpers para formatação
    formatTime(time) {
        if (!time) return null;
        // Garante o formato HH:MM:SS
        return time.includes(':') ? 
               (time.split(':').length === 2 ? `${time}:00` : time) : 
               `${time}:00:00`;
    }

    formatDate(date) {
        if (!date) return null;
        // Garante o formato YYYY-MM-DD
        return date.split('T')[0];
    }

    async update(id, data) {
        try {
            // Log dos dados recebidos
            console.group('Atualizando Evento - Dados Recebidos');
            console.log('ID:', id);
            console.log('Dados brutos:', data);

            if (!id) {
                throw new Error('ID é obrigatório');
            }

            // Validações adicionais para eventos
            if (data.tipo === 'evento' && !data.valido) {
                throw new Error('Data e hora são obrigatórios para eventos');
            }

            // Formata a hora para o formato correto (HH:MM:SS)
            if (data.hora && !data.hora.includes(':')) {
                data.hora = data.hora + ':00';
            } else if (data.hora && data.hora.split(':').length === 2) {
                data.hora = data.hora + ':00';
            }

            // Se a foto for uma URL completa, extrai apenas o nome do arquivo
            if (data.foto && data.foto.includes('/')) {
                data.foto = data.foto.split('/').pop();
            }

            // Validações e preparação do payload
            const payload = {
                ...data,
                id,
                valido: data.tipo === 'evento' ? data.valido : null,
                organizacao_id: window.USER.organizacao_id
            };

            // Log do payload final
            console.log('Payload preparado para envio:', payload);
            console.groupEnd();

            const response = await fetch(`${this.apiPath}/update.php`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const responseData = await response.json();

            // Log da resposta
            console.group('Resposta da API');
            console.log('Status:', response.status);
            console.log('Dados:', responseData);
            console.groupEnd();

            if (!response.ok) {
                console.error('Erro na resposta:', responseData);
                throw new Error(responseData.error || 'Erro ao atualizar evento');
            }

            return responseData;
        } catch (error) {
            console.error('Erro completo:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            if (!id) {
                throw new Error('ID é obrigatório');
            }

            const response = await fetch(`${this.apiPath}/delete.php?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            let responseData;
            try {
                responseData = await response.json();
            } catch (e) {
                // Se não for JSON e for sucesso, retorna objeto padrão
                if (response.status === 204) {
                    return { success: true, message: 'Evento excluído com sucesso' };
                }
                throw new Error('Resposta inválida do servidor');
            }

            if (!response.ok) {
                throw new Error(responseData.error || 'Erro ao excluir evento');
            }

            return responseData;
        } catch (error) {
            console.error('Erro ao excluir evento:', error);
            throw error;
        }
    }
}

// Exporta a classe globalmente
window.EventosAPI = EventosAPI;
