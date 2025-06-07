class AniversariantesAPI {
    static async getAniversariantes(params = {}) {
        if (!window.USER.ministerio_atual) {
            throw new Error('Nenhum ministério selecionado');
        }
        const queryParams = new URLSearchParams({
            ministerio_id: window.USER.ministerio_atual,
            organizacao_id: window.USER.organizacao_id
        });
        const response = await fetch(`${window.APP_CONFIG.baseUrl}/src/services/api/voluntarios/aniversariantes.php?${queryParams}`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao carregar aniversariantes');
        }
        return await response.json();
    }
}
export default AniversariantesAPI;
