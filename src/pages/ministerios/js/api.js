export class MinisteriosAPI {
    constructor(baseUrl) {
        if (!baseUrl) {
            throw new Error('baseUrl é obrigatório');
        }
        this.baseUrl = baseUrl;
        this.apiPath = `${baseUrl}/src/services/api/ministerios`; // Adicionar /src ao caminho
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
                throw new Error(errorText || `Erro ${response.status} ao buscar ministérios`);
            }

            const data = await response.json();
            
            if (!data || typeof data !== 'object') {
                throw new Error('Resposta inválida da API');
            }

            return data;
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao buscar ministérios');
        }
    }

    async handleImageUpload(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                resolve(null);
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    async create(data) {
        try {
            if (!data) {
                throw new Error('Dados são obrigatórios');
            }

            // Se houver arquivo de imagem, converte para base64
            const foto = data.foto instanceof File ? await this.handleImageUpload(data.foto) : null;
            
            const payload = {
                ...data,
                foto: foto || 'assets/img/ministerios/placeholder.jpg',
                cor: data.cor || '#000000' // Valor padrão para cor
            };

            const response = await fetch(`${this.apiPath}/create.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao criar ministério`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao criar ministério');
        }
    }

    async update(id, data) {
        try {
            if (!id) {
                throw new Error('ID é obrigatório');
            }
            if (!data) {
                throw new Error('Dados são obrigatórios');
            }

            // Se houver arquivo de imagem, converte para base64
            const foto = data.foto instanceof File ? await this.handleImageUpload(data.foto) : data.foto;
            
            const payload = {
                ...data,
                id,
                foto: foto || data.foto || 'assets/img/ministerios/placeholder.jpg',
                cor: data.cor || '#000000' // Valor padrão para cor
            };

            const response = await fetch(`${this.apiPath}/put.php`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao atualizar ministério`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao atualizar ministério');
        }
    }

    async delete(id) {
        try {
            if (!id) {
                throw new Error('ID é obrigatório');
            }

            const response = await fetch(`${this.apiPath}/delete.php`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao excluir ministério`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao excluir ministério');
        }
    }

    async fetchWhatsAppGroups() {
        try {
            const config = window.APP_CONFIG.whatsapp;
            const baseApiUrl = 'https://evolution.basechurchbr.com';
            
            // Adiciona o parâmetro getParticipants=false na URL
            const url = `${baseApiUrl}/group/fetchAllGroups/${config.instance}?getParticipants=false`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'apikey': config.apiKey
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao buscar grupos`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar grupos:', error);
            throw new Error('Erro ao buscar grupos do WhatsApp');
        }
    }
}
