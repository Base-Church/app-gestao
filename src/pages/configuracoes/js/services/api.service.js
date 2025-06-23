class ApiService {
    constructor() {
        this.baseUrl = window.APP_CONFIG.baseUrl;
    }

    // Usuários
    async getUsuarios() {
        try {
            const response = await fetch(`${this.baseUrl}/src/services/api/usuarios/get.php`);
            const data = await response.json();
            if (data.code === 200) {
                return data.data;
            }
            throw new Error(data.message || 'Erro ao carregar usuários');
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            throw error;
        }
    }

    async createUsuario(userData) {
        try {
            const response = await fetch(`${this.baseUrl}/src/services/api/usuarios/registro.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            if (data.code === 200) {
                return data;
            }
            throw new Error(data.message || 'Erro ao criar usuário');
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            throw error;
        }
    }

    async updateUsuario(id, userData) {
        try {
            const response = await fetch(`${this.baseUrl}/src/services/api/usuarios/update.php?id=${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            if (data.code === 200) {
                return data;
            }
            throw new Error(data.message || 'Erro ao atualizar usuário');
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            throw error;
        }
    }

    // Ministérios
    async getMinisterios() {
        try {
            const response = await fetch(`${this.baseUrl}/src/services/api/ministerios/get.php`);
            const data = await response.json();
            if (data.code === 200) {
                return data.data;
            }
            throw new Error(data.message || 'Erro ao carregar ministérios');
        } catch (error) {
            console.error('Erro ao carregar ministérios:', error);
            throw error;
        }
    }
}

export const apiService = new ApiService(); 
