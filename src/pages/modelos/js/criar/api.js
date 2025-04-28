export class API {
    constructor(baseUrl) {
        this.baseUrl = `${baseUrl}/src/services/api`;
    }

    async getAtividades(ministerio_id) {
        try {
            const response = await fetch(`${this.baseUrl}/atividades/get.php?ministerio_id=${ministerio_id}`);
            if (!response.ok) throw new Error('Erro ao carregar atividades');
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async salvarModelo(dados) {
        try {
            const response = await fetch(`${this.baseUrl}/modelos/create.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dados)
            });
            
            if (!response.ok) {
                throw new Error('Erro ao salvar modelo');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async getCategorias(ministerio_id) {
        try {
            const response = await fetch(`${this.baseUrl}/categoria-atividade/get.php?ministerio_id=${ministerio_id}`);
            if (!response.ok) throw new Error('Erro ao carregar categorias');
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
}
