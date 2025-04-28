export class AtividadesAPI {
    constructor(baseUrl) {
        if (!baseUrl) {
            throw new Error('baseUrl é obrigatório');
        }
        // Corrige o caminho da API
        this.baseUrl = `${baseUrl}/src/services/api/atividades`;
    }

    async list(ministerio_id, page = 1, limit = 20, search = '', categoria_id = '') {
        try {
            if (!ministerio_id) {
                throw new Error('ministerio_id é obrigatório');
            }

            const params = new URLSearchParams({
                ministerio_id: String(ministerio_id),
                page: String(page),
                limit: String(limit),
                search
            });

            if (categoria_id) {
                params.append('categoria_id', String(categoria_id));
            }

            console.group('API Request Parameters');
            console.log('URL Params:', Object.fromEntries(params));
            console.groupEnd();

            const url = `${this.baseUrl}/get.php?${params}`;
            const response = await fetch(url);
            console.log('API Response Status:', response.status);
            
            const data = await response.json();
            console.log('API Response Data:', data);
            
            if (!data || typeof data !== 'object') {
                throw new Error('Resposta inválida da API');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw new Error(error.message || 'Erro ao buscar atividades');
        }
    }

    async create(data) {
        try {
            console.log('Create API Request:', data);
            const response = await fetch(`${this.baseUrl}/create.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao criar atividade');
            }

            const responseData = await response.json();
            console.log('Create API Response:', responseData);
            
            return responseData;
        } catch (error) {
            console.error('Create API Error:', error);
            throw error;
        }
    }

    async update(data) {
        try {
            console.log('Update API Request:', data);
            if (!data || !data.id) {
                throw new Error('ID da atividade é obrigatório');
            }

            if (!data.ministerio_id) {
                throw new Error('ministerio_id é obrigatório');
            }

            // Preparar payload base
            const payload = {
                id: Number(data.id),
                ministerio_id: Number(data.ministerio_id),
                nome: data.nome,
                categoria_atividade_id: data.categoria_atividade_id ? Number(data.categoria_atividade_id) : null,
                cor_indicador: data.cor_indicador || '#33ccad'
            };

            // Tratar a foto apenas se for uma string base64 nova
            if (data.foto && data.foto.startsWith('data:image')) {
                payload.foto = data.foto;
            }
            // Se for um nome de arquivo existente, manter
            else if (data.foto && !data.foto.startsWith('data:image')) {
                delete payload.foto;
            }

            console.log('Enviando payload:', payload);

            const response = await fetch(`${this.baseUrl}/put.php`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const responseData = await response.json();
            console.log('Update API Response:', responseData);
            
            if (!response.ok) {
                throw new Error(responseData.message || responseData.error || 'Erro ao atualizar atividade');
            }

            return responseData;
        } catch (error) {
            console.error('Update API Error:', error);
            throw new Error(error.message || 'Erro ao atualizar atividade');
        }
    }

    async get(id) {
        try {
            console.log('Buscando atividade:', id);
            const url = `${this.baseUrl}/getById.php?id=${id}`;
            console.log('URL da requisição:', url);
            
            const response = await fetch(url);
            console.log('Status da resposta:', response.status);
            
            const responseText = await response.text();
            console.log('Resposta bruta:', responseText);
            
            // Tenta converter para JSON
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error('Erro ao fazer parse do JSON:', e);
                throw new Error('Resposta inválida do servidor');
            }
            
            if (!response.ok) {
                throw new Error(data.message || data.error || 'Erro ao buscar atividade');
            }

            console.log('Dados processados:', data);
            return data;
        } catch (error) {
            console.error('Erro na API:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            console.log('Delete API Request:', id);
            const response = await fetch(`${this.baseUrl}/delete.php`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao excluir atividade');
            }

            const responseData = await response.json();
            console.log('Delete API Response:', responseData);
            
            return responseData;
        } catch (error) {
            console.error('Delete API Error:', error);
            throw error;
        }
    }

    async getCategorias() {
        try {
            const response = await fetch(`${this.baseUrl.replace('/atividades', '')}/categoria-atividade/get.php`);
            if (!response.ok) {
                throw new Error('Erro ao buscar categorias');
            }
            return await response.json();
        } catch (error) {
            console.error('Get Categorias Error:', error);
            throw error;
        }
    }
}
