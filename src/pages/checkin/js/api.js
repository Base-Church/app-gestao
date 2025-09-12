class CheckinAPI {
    constructor() {
        this.baseUrl = window.APP_CONFIG?.baseUrl || window.URL_BASE || '';
        this.checkinFormulariosPath = `${this.baseUrl}/src/services/api/checkin_formularios`;
        this.checkinItensPath = `${this.baseUrl}/src/services/api/checkin_formularios_itens`;
        this.checkinAcessosPath = `${this.baseUrl}/src/services/api/checkin_formularios_acessos`;
        this.processosPath = `${this.baseUrl}/src/services/api/processos_etapas`;
        this.eventosPath = `${this.baseUrl}/src/services/api/eventos`;
    }

    // Obter ID do ministério
    getMinisterioId() {
        if (window.USER && window.USER.ministerio_atual) {
            return window.USER.ministerio_atual;
        }
        
        const element = document.querySelector('[data-ministerio-id]');
        if (element && element.dataset.ministerioId) {
            return element.dataset.ministerioId;
        }
        
        throw new Error('ID do ministério não encontrado');
    }

    // ========== CHECKIN FORMULÁRIOS ==========
    async list(page = 1, limit = 50, search = '') {
        try {
            const ministerio_id = this.getMinisterioId();
            const params = new URLSearchParams({
                ministerio_id,
                page,
                limit,
                search
            });

            const url = `${this.checkinFormulariosPath}/get.php?${params}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao buscar check-ins`);
            }

            const data = await response.json();
            
            if (!data || typeof data !== 'object') {
                throw new Error('Resposta inválida da API');
            }

            return data;
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao buscar check-ins');
        }
    }

    async create(data) {
        try {
            const ministerio_id = this.getMinisterioId();
            
            const payload = {
                nome: data.nome,
                processo_etapa_id: data.processo_etapa_id || null,
                evento_id: data.evento_id || null,
                formulario_id: data.formulario_id || null,
                ministerio_id: ministerio_id
            };

            const response = await fetch(`${this.checkinFormulariosPath}/create.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erro ao criar check-in');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao criar check-in');
        }
    }

    async update(id, data) {
        try {
            if (!id) {
                throw new Error('ID é obrigatório');
            }

            const payload = {
                nome: data.nome,
                processo_etapa_id: data.processo_etapa_id || null,
                evento_id: data.evento_id || null,
                formulario_id: data.formulario_id || null
            };

            const response = await fetch(`${this.checkinFormulariosPath}/put.php?id=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erro ao atualizar check-in');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao atualizar check-in');
        }
    }

    async delete(id) {
        try {
            if (!id) {
                throw new Error('ID é obrigatório');
            }

            const response = await fetch(`${this.checkinFormulariosPath}/delete.php?id=${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erro ao excluir check-in');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao excluir check-in');
        }
    }

    async getById(id) {
        try {
            const ministerio_id = this.getMinisterioId();
            const params = new URLSearchParams({
                formulario_id: id,
                ministerio_id
            });
            
            const response = await fetch(`${this.checkinFormulariosPath}/get.php?${params}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao buscar check-in`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao buscar check-in');
        }
    }

    // ========== CHECKIN ITENS ==========
    async getItens(checkin_formularios_id) {
        try {
            const params = new URLSearchParams({
                checkin_formularios_id
            });
            
            const response = await fetch(`${this.checkinItensPath}/get.php?${params}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao buscar itens`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao buscar itens de check-in');
        }
    }

    async createItem(data) {
        try {
            const response = await fetch(`${this.checkinItensPath}/create.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao criar item`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao criar item de check-in');
        }
    }

    async updateItem(id, data) {
        try {
            const response = await fetch(`${this.checkinItensPath}/put.php?id=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao atualizar item`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao atualizar item de check-in');
        }
    }

    async deleteItem(id) {
        try {
            const response = await fetch(`${this.checkinItensPath}/delete.php?id=${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao deletar item`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao deletar item de check-in');
        }
    }

    // ========== CHECKIN ACESSOS ==========
    async getAcessos(checkin_formularios_id) {
        try {
            const params = new URLSearchParams({
                checkin_formularios_id
            });
            
            const response = await fetch(`${this.checkinAcessosPath}/get.php?${params}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao buscar acessos`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao buscar acessos de check-in');
        }
    }

    async createAcesso(data) {
        try {
            const payload = {
                nome: data.nome,
                cpf: data.cpf,
                checkin_formularios_id: data.checkin_formularios_id
            };

            const response = await fetch(`${this.checkinAcessosPath}/create.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao criar acesso`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao criar acesso de check-in');
        }
    }

    async updateAcesso(id, data) {
        try {
            const payload = {
                nome: data.nome,
                cpf: data.cpf
            };

            const response = await fetch(`${this.checkinAcessosPath}/put.php?id=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao atualizar acesso`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao atualizar acesso de check-in');
        }
    }

    async deleteAcesso(id) {
        try {
            const response = await fetch(`${this.checkinAcessosPath}/delete.php?id=${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao deletar acesso`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao deletar acesso de check-in');
        }
    }

    // ========== MÉTODOS AUXILIARES ==========
    async getProcessos() {
        try {
            const ministerio_id = this.getMinisterioId();
            const params = new URLSearchParams({
                ministerio_id
            });
            
            const response = await fetch(`${this.processosPath}/get.php?${params}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao buscar processos`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao buscar processos');
        }
    }

    async getEventos() {
        try {
            const ministerio_id = this.getMinisterioId();
            const params = new URLSearchParams({
                ministerio_id
            });
            
            const response = await fetch(`${this.eventosPath}/get.php?${params}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao buscar eventos`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao buscar eventos');
        }
    }

    async getFormularios() {
        try {
            const ministerio_id = this.getMinisterioId();
            const params = new URLSearchParams({
                ministerio_id
            });
            
            const response = await fetch(`${this.baseUrl}/src/services/api/formularios/get.php?${params}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao buscar formulários`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao buscar formulários');
        }
    }
}

// Instância global da API
window.CheckinAPI = CheckinAPI;