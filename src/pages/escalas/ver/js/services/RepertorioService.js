export class RepertorioService {
    static async getByEscala(escalaId, page = 1, limit = 50) {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString()
            });

            const response = await fetch(`${window.ENV.API_BASE_URL}/api/repertorios/escala/${escalaId}?${params}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': window.ENV.API_KEY // Removido o "Bearer"
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erro na API:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // Transforma a resposta em um formato mais fácil de usar
            return {
                original: data,
                mapped: this.transformResponse(data)
            };
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw error;
        }
    }

    static async create(data) {
        try {
            const response = await fetch(`${window.ENV.API_BASE_URL}/api/repertorios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': window.ENV.API_KEY
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao criar repertório:', error);
            throw error;
        }
    }

    static transformResponse(response) {
        if (!response?.data?.length) return {};
        
        const mapeamento = {};
        response.data.forEach(repertorio => {
            if (repertorio.escala_item_ids?.length > 0) {
                repertorio.escala_item_ids.forEach(escalaItemId => {
                    mapeamento[escalaItemId] = {
                        id: repertorio.id,
                        nome: repertorio.nome,
                        escala_id: repertorio.escala_id,
                        musicas: repertorio.id_musicas || [],
                        evento_id: repertorio.id_eventos?.[0]
                    };
                });
            }
        });

        // Log apenas do resultado final
        console.log('=== Mapeamento Final ===', mapeamento);
        return mapeamento;
    }
}
