class ApiService {
    constructor() {
        this.baseUrl = window.APP_CONFIG.apiWhatsapp;
        this.token = window.APP_CONFIG.apiTokenWhatsapp;
    }

    async makeRequest(endpoint, method = 'GET', data = null) {
        try {
            const url = `${this.baseUrl}${endpoint}`;
            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': this.token
            };

            const options = {
                method,
                headers,
                body: data ? JSON.stringify(data) : undefined
            };

            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    // Obter lista de grupos com imagens
    async getGroupsWithImages() {
        const groups = await this.makeRequest('/group/list?force=false&noparticipants=true', 'GET');
        
        if (groups && groups.groups) {
            for (const group of groups.groups) {
                try {
                    const imageData = await this.makeRequest('/chat/GetNameAndImageURL', 'POST', { 
                        number: group.jid || group.JID,
                        preview: false 
                    });
                    if (imageData && imageData.image) {
                        group.image = imageData.image;
                    }
                } catch (error) {
                    // Erro silencioso ao carregar imagem
                }
            }
        }
        
        return groups;
    }

    // Obter lista de grupos
    async getGroups() {
        return await this.makeRequest('/group/list?force=false&noparticipants=true', 'GET');
    }

    // Obter nome e URL da imagem do chat
    async getChatNameAndImage(jid) {
        return await this.makeRequest('/chat/GetNameAndImageURL', 'POST', { 
            number: jid,
            preview: false 
        });
    }

    // Enviar campanha avançada
    async sendAdvancedCampaign(campaignData) {
        return await this.makeRequest('/sender/advanced', 'POST', campaignData);
    }

    // Upload de arquivo para o servidor
    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        const url = (window.APP_CONFIG && window.APP_CONFIG.URL_BASE ? window.APP_CONFIG.URL_BASE : '') + '/src/services/api/upload_whatsapp.php';
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Falha no upload');
        }
        return result.url;
    }
}

// Exportar para uso global
window.apiService = new ApiService(); 