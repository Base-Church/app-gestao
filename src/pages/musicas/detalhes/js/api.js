class MusicaDetalhesAPI {
    static async getMusicaById(id) {
        if (!window.USER.ministerio_atual) {
            throw new Error('Nenhum ministério selecionado');
        }
        const queryParams = new URLSearchParams({
            ministerio_id: window.USER.ministerio_atual,
            organizacao_id: window.USER.organizacao_id
        });
        const response = await fetch(`${window.APP_CONFIG.baseUrl}/src/services/api/musicas/get-id.php?id=${id}&${queryParams}`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao carregar música');
        }
        return await response.json();
    }

    static async updateMusica(id, data) {
        if (!window.USER.ministerio_atual) {
            throw new Error('Nenhum ministério selecionado');
        }
        
        const formData = new FormData();
        formData.append('id_musica', id);
        formData.append('nome_musica', data.nome_musica);
        formData.append('artista_banda', data.artista_banda);
        formData.append('url', data.url || '');
        formData.append('letra', data.letra || '');
        formData.append('ministerio_id', window.USER.ministerio_atual);
        formData.append('organizacao_id', window.USER.organizacao_id);

        const response = await fetch(`${window.APP_CONFIG.baseUrl}/src/services/api/musicas/put.php`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao atualizar música');
        }
        return await response.json();
    }
}
export default MusicaDetalhesAPI; 