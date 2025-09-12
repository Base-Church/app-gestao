class FormulariosAPI {
    constructor() {
        this.baseUrl = window.APP_CONFIG?.baseUrl || window.URL_BASE || '';
        this.apiPath = `${this.baseUrl}/src/services/api/formularios`;
        this.processosEtapasPath = `${this.baseUrl}/src/services/api/processos_etapas`;
        this.checkinFormulariosPath = `${this.baseUrl}/src/services/api/checkin_formularios`;
        this.checkinItensPath = `${this.baseUrl}/src/services/api/checkin_formularios_itens`;
        this.checkinAcessosPath = `${this.baseUrl}/src/services/api/checkin_formularios_acessos`;
    }

    async createFormulario(data) {
        try {
            // Se tem ID, é uma atualização
            if (data.id) {
                return await this.updateFormulario(data.id, data);
            }
            
            const response = await fetch(`${this.apiPath}/create.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao criar formulário`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao criar formulário');
        }
    }

    async updateFormulario(id, data) {
        try {
            // Remove o ID dos dados para não enviar no body
            const { id: _, ...updateData } = data;
            
            const response = await fetch(`${this.apiPath}/put.php?id=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao atualizar formulário`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao atualizar formulário');
        }
    }

    async getProcessoEtapas(ministerio_id) {
        try {
            const params = new URLSearchParams({
                ministerio_id
            });
            
            const response = await fetch(`${this.processosEtapasPath}/get.php?${params}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao buscar etapas`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao buscar etapas do processo');
        }
    }

    async getFormularioById(id) {
        try {
            const ministerio_id = this.getMinisterioId();
            const params = new URLSearchParams({ formulario_id: id, ministerio_id });
            const response = await fetch(`${this.apiPath}/get-id.php?${params}`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao buscar formulário`);
            }
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao buscar formulário');
        }
    }

    getMinisterioId() {
        // Prioriza window.USER.ministerio_atual
        if (window.USER && window.USER.ministerio_atual) {
            return window.USER.ministerio_atual;
        }
        
        // Fallback para data-ministerio-id
        const element = document.querySelector('[data-ministerio-id]');
        if (element && element.dataset.ministerioId) {
            return element.dataset.ministerioId;
        }
        
        throw new Error('ID do ministério não encontrado');
    }

    // ========== CHECKIN FORMULÁRIOS ==========
    async createCheckinFormulario(data) {
        try {
            const response = await fetch(`${this.checkinFormulariosPath}/create.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao criar check-in formulário`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao criar check-in formulário');
        }
    }

    async getCheckinFormularios(ministerio_id, filters = {}) {
        try {
            const params = new URLSearchParams({
                ministerio_id,
                ...filters
            });
            
            const response = await fetch(`${this.checkinFormulariosPath}/get.php?${params}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao buscar check-in formulários`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao buscar check-in formulários');
        }
    }

    async getCheckinFormulario(formulario_id) {
        try {
            const ministerio_id = this.getMinisterioId();
            const params = new URLSearchParams({
                formulario_id,
                ministerio_id
            });
            
            const response = await fetch(`${this.checkinFormulariosPath}/get.php?${params}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao buscar check-in formulário`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao buscar check-in formulário');
        }
    }

    async updateCheckinFormulario(id, data) {
        try {
            const response = await fetch(`${this.checkinFormulariosPath}/put.php?id=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao atualizar check-in formulário`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao atualizar check-in formulário');
        }
    }

    async deleteCheckinFormulario(id) {
        try {
            const response = await fetch(`${this.checkinFormulariosPath}/delete.php?id=${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao deletar check-in formulário`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao deletar check-in formulário');
        }
    }

    // ========== CHECKIN ITENS ==========
    async createCheckinItem(data) {
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
                throw new Error(errorText || `Erro ${response.status} ao criar item de check-in`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao criar item de check-in');
        }
    }

    async getCheckinItens(checkin_formularios_id) {
        try {
            const params = new URLSearchParams({
                checkin_formularios_id
            });
            
            const response = await fetch(`${this.checkinItensPath}/get.php?${params}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao buscar itens de check-in`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao buscar itens de check-in');
        }
    }

    async updateCheckinItem(id, data) {
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
                throw new Error(errorText || `Erro ${response.status} ao atualizar item de check-in`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao atualizar item de check-in');
        }
    }

    async deleteCheckinItem(id) {
        try {
            const response = await fetch(`${this.checkinItensPath}/delete.php?id=${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao deletar item de check-in`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao deletar item de check-in');
        }
    }

    async reordenarItens(checkin_formularios_id, itens) {
        try {
            // Atualiza a ordem de cada item
            const promises = itens.map((item, index) => {
                return this.updateCheckinItem(item.id, {
                    ...item,
                    ordem: index + 1
                });
            });
            
            await Promise.all(promises);
            return { success: true };
        } catch (error) {
            console.error('Erro ao reordenar itens:', error);
            throw new Error(error.message || 'Erro ao reordenar itens');
        }
    }

    // ========== CHECKIN ACESSOS ==========
    async createCheckinAcesso(data) {
        try {
            const response = await fetch(`${this.checkinAcessosPath}/create.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao criar acesso de check-in`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao criar acesso de check-in');
        }
    }

    async getCheckinAcessos(checkin_formularios_id) {
        try {
            const params = new URLSearchParams({
                checkin_formularios_id
            });
            
            const response = await fetch(`${this.checkinAcessosPath}/get.php?${params}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao buscar acessos de check-in`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao buscar acessos de check-in');
        }
    }

    async updateCheckinAcesso(id, data) {
        try {
            const response = await fetch(`${this.checkinAcessosPath}/put.php?id=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao atualizar acesso de check-in`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao atualizar acesso de check-in');
        }
    }

    async deleteCheckinAcesso(id) {
        try {
            const response = await fetch(`${this.checkinAcessosPath}/delete.php?id=${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao deletar acesso de check-in`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao deletar acesso de check-in');
        }
    }

    // Métodos para Processos - usando o padrão existente
    async getProcessos(ministerioId = null) {
        try {
            if (!ministerioId) {
                ministerioId = this.getMinisterioId();
            }
            
            const response = await fetch(`${this.baseUrl}/src/services/api/processos_etapas/get.php?ministerio_id=${ministerioId}`);
            
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

    // Métodos para Eventos - usando o padrão existente
    async getEventos() {
        try {
            const response = await fetch(`${this.baseUrl}/src/services/api/eventos/get.php`);
            
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
}

// Instância global da API
window.formulariosAPI = new FormulariosAPI();
window.apiService = window.formulariosAPI; // Alias para compatibilidade