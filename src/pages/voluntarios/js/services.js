class VoluntariosServices {
    static async getAtividades() {
        try {
            const params = new URLSearchParams({
                organizacao_id: window.USER.organizacao_id,
                ministerio_id: window.USER.ministerio_atual,
                limit: 20
            });

            const response = await fetch(`${window.BASE_URL}/src/services/api/atividades/get.php?${params}`);
            if (!response.ok) throw new Error('Erro ao carregar atividades');
            
            const data = await response.json();
            // Mantém compatibilidade com o retorno atual da API
            return {
                data: data.data?.map(item => ({
                    ...item,
                    // Corrige a URL da imagem para não duplicar o caminho
                    foto: item.foto ? `/assets/img/atividades/${item.foto}` : '/assets/img/placeholder.jpg'
                })) || [],
                meta: data.meta
            };
        } catch (error) {
            console.error('Erro ao carregar atividades:', error);
            throw error;
        }
    }

    static async getMinisterios() {
        try {
            const params = new URLSearchParams({
                organizacao_id: window.USER.organizacao_id,
                limit: 20
            });

            const response = await fetch(`${window.BASE_URL}/src/services/api/ministerios/get.php?${params}`);
            if (!response.ok) throw new Error('Erro ao carregar ministérios');
            
            const data = await response.json();
            // Mantém compatibilidade com o retorno atual da API
            return {
                data: data.data?.map(item => ({
                    ...item,
                    foto: item.foto ? `${window.BASE_URL}/assets/img/ministerios/${item.foto}` : `${window.BASE_URL}/assets/img/placeholder.jpg`
                })) || [],
                meta: data.meta
            };
        } catch (error) {
            console.error('Erro ao carregar ministérios:', error);
            throw error;
        }
    }

    static async getCategorias() {
        try {
            const params = new URLSearchParams({
                organizacao_id: window.USER.organizacao_id,
                ministerio_id: window.USER.ministerio_atual
            });

            const response = await fetch(`${window.BASE_URL}/src/services/api/categoria-atividade/get.php?${params}`);
            if (!response.ok) throw new Error('Erro ao carregar categorias');
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
            throw error;
        }
    }
}

export default VoluntariosServices;
