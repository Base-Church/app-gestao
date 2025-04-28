class LideresAPI {
    constructor(baseUrl) {
        if (!baseUrl) {
            throw new Error('baseUrl é obrigatório');
        }
        this.baseUrl = baseUrl;
        this.apiPath = `${baseUrl}/src/services/api/lideres`; // Caminho correto
    }

    async getImageUrl(foto) {
        if (!foto) return `${this.baseUrl}/assets/img/placeholder.jpg`;
        return foto.startsWith('http') ? foto : `${this.baseUrl}/assets/img/lideres/${foto}`;
    }

    async list(page = 1, limit = 12, search = '') {
        try {
            const params = new URLSearchParams({
                page,
                limit,
                search,
                organizacao_id: window.USER.organizacao_id
            });

            const url = `${this.apiPath}/get.php?${params}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao buscar líderes`);
            }

            const data = await response.json();
            
            if (!data || typeof data !== 'object') {
                throw new Error('Resposta inválida da API');
            }

            return data;
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao buscar líderes');
        }
    }

    async create(data) {
        try {
            console.group('Dados para API de Líderes');
            console.log('Dados recebidos:', data);

            // Pegando o nome do arquivo da imagem do preview
            const fotoPreview = document.getElementById('foto-preview');
            const fotoUrl = fotoPreview.src;
            const filename = fotoUrl.split('/').pop(); // Pega o último segmento da URL

            const payload = {
                nome: data.nome,
                whatsapp: data.whatsapp.replace(/\D/g, ''),
                foto: filename !== 'placeholder.jpg' ? filename : null,
                ministerio_id: data.ministerio_id,
                organizacao_id: window.USER.organizacao_id
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

            // Verifica se é um erro ou sucesso baseado no código
            if (responseData.code === 200 || responseData.code === 201) {
                return responseData;
            } else {
                throw new Error(responseData.message || 'Erro ao criar líder');
            }
        } catch (error) {
            console.error('Erro completo:', error);
            throw error;
        }
    }

    async update(id, data) {
        try {
            if (!id) throw new Error('ID é obrigatório');

            const payload = {
                id,
                nome: data.nome,
                whatsapp: data.whatsapp.replace(/\D/g, ''),
                foto: data.foto || null,
                ministerio_id: data.ministerio_id,
                organizacao_id: window.USER.organizacao_id
            };

            const response = await fetch(`${this.apiPath}/update.php`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const responseData = await response.json();
            
            if (!response.ok) {
                throw new Error(responseData.error || 'Erro ao atualizar líder');
            }

            return responseData;
        } catch (error) {
            console.error('Erro ao atualizar:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            if (!id) throw new Error('ID é obrigatório');

            const response = await fetch(`${this.apiPath}/delete.php?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 204) {
                return { success: true };
            }

            const responseData = await response.json();
            
            if (!response.ok) {
                throw new Error(responseData.error || 'Erro ao excluir líder');
            }

            return responseData;
        } catch (error) {
            console.error('Erro ao excluir:', error);
            throw error;
        }
    }

    async fetchProfilePicture(whatsapp) {
        try {
            const numero = whatsapp.replace(/\D/g, '');
            const numeroFormatado = numero.startsWith('55') ? numero : `55${numero}`;

            const response = await fetch(`${window.APP_CONFIG.whatsapp.apiUrl}/chat/fetchProfilePictureUrl/${window.APP_CONFIG.whatsapp.instance}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': window.APP_CONFIG.whatsapp.apiKey
                },
                body: JSON.stringify({ number: numeroFormatado })
            });

            if (!response.ok) throw new Error('Erro ao buscar foto do WhatsApp');

            const data = await response.json();
            if (!data.profilePictureUrl) throw new Error('Foto não encontrada');

            // Faz upload da foto para o servidor
            const uploadResponse = await fetch(`${this.baseUrl}/src/services/api/upload_whatsapp.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: data.profilePictureUrl,
                    whatsapp: data.wuid.split('@')[0] // Remove o @s.whatsapp.net
                })
            });

            if (!uploadResponse.ok) throw new Error('Erro ao salvar foto');
            
            const uploadData = await uploadResponse.json();
            return uploadData.filename;

        } catch (error) {
            console.error('Erro ao buscar foto:', error);
            return null;
        }
    }
}

// Exporta a classe globalmente
window.LideresAPI = LideresAPI;
