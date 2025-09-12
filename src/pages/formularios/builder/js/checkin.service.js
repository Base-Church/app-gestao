// Serviço de Check-in Formulários - Versão Simplificada
class CheckinService {
    constructor() {
        this.currentFormulario = null;
        this.init();
    }

    init() {
        window.checkinService = this;
    }

    // Método principal para abrir o fluxo de check-in
    async openCheckinFlow() {
        const formularioId = this.getFormularioId();
        
        if (!formularioId) {
            return;
        }

        // Mostrar loading
        window.checkinUI?.showLoading('Verificando check-in...');

        // Verificar se já existe checkin
        try {
            const response = await window.formulariosAPI.getCheckinFormulario(formularioId);
            
            if ((response.success || response.code === 200) && response.data && response.data.length > 0) {
                // Já existe checkin, abrir modal principal diretamente
                window.checkinUI?.hideLoading();
                window.checkinUI?.openMainModal();
            } else {
                // Não existe checkin, abrir mini modal primeiro
                window.checkinUI?.hideLoading();
                window.checkinUI?.openMiniModal();
            }
        } catch (error) {
            window.checkinUI?.hideLoading();
            window.checkinUI?.openMiniModal();
        }
    }
        
    // Criar checkin a partir do mini modal
    async createCheckinFromMiniModal(nome) {
        if (!nome || !nome.trim()) {
            window.checkinUI?.showNotification('Por favor, digite um nome para o check-in', 'error');
            return false;
        }

        try {
            const success = await this.createCheckinWithName(nome.trim());
            
            if (success) {
                // Fechar mini modal e abrir modal principal
                window.checkinUI?.closeMiniModal();
                setTimeout(() => {
                    window.checkinUI?.openMainModal();
                }, 300);
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    // Obter formulario_id da URL
    getFormularioId() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        return id;
    }

    // Obter ministerio_id
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

    // Carregar dados quando modal abrir
    async loadData() {
        const formularioId = this.getFormularioId();
        
        if (!formularioId || formularioId === '' || formularioId === null) {
            this.resetForm();
            return;
        }

        try {
            // Primeiro, popular o campo formulario_id
            this.populateFormularioId(formularioId);
            
            // Tentar carregar checkin existente (mas não criar se não existir)
            await this.loadExistingCheckinOnly(formularioId);
            
            // Carregar selects
            await this.loadProcessos();
            await this.loadEventos();
            
            // Carregar itens e acessos se existe checkin
            if (this.currentFormulario && this.currentFormulario.id) {
                await this.loadItens();
                await this.loadAcessos();
            }
            
            // Configurar listeners para mudanças nos selects
            this.setupSelectListeners();
            
        } catch (error) {
            window.checkinUI?.showNotification('Erro ao carregar dados', 'error');
        }
    }

    // Apenas carregar checkin existente, sem criar novo
    async loadExistingCheckinOnly(formularioId) {
        try {
            const response = await window.formulariosAPI.getCheckinFormulario(formularioId);
            
            // Verificar se tem dados válidos
            if ((response.success || response.code === 200) && response.data && response.data.length > 0) {
                // Se é um array, pegar o primeiro item
                const checkinData = Array.isArray(response.data) ? response.data[0] : response.data;
                this.fillFormWithData(checkinData);
                this.currentFormulario = checkinData;
            } else {
                this.resetForm();
            }
        } catch (error) {
            this.resetForm();
        }
    }

    // Criar checkin com nome específico (chamado pelo mini modal)
    async createCheckinWithName(nome) {
        try {
            const formularioId = this.getFormularioId();
            const ministerioId = this.getMinisterioId();
            
            if (!formularioId || !ministerioId) {
                throw new Error('FormularioId ou MinisterioId não encontrado');
            }

            const data = {
                nome: nome,
                formulario_id: formularioId,
                ministerio_id: ministerioId,
                processo_etapa_id: null,
                evento_id: null
            };
            const response = await window.formulariosAPI.createCheckinFormulario(data);
            
            if (response.success || response.code === 200 || response.code === 201) {
                this.currentFormulario = response.data;
                window.checkinUI?.showNotification('Check-in criado com sucesso', 'success');
                return true;
            } else {
                throw new Error(response.message || 'Erro ao criar check-in');
            }
        } catch (error) {
            window.checkinUI?.showNotification('Erro ao criar check-in: ' + error.message, 'error');
            return false;
        }
    }

    // Preencher formulário com dados
    fillFormWithData(data) {
        const nomeField = document.getElementById('checkin-nome');
        if (nomeField && data.nome) {
            nomeField.value = data.nome;
        }
        
        const processoField = document.getElementById('checkin-processo-id');
        if (processoField && data.processo_etapa_id) {
            processoField.value = data.processo_etapa_id;
        }
        
        const eventoField = document.getElementById('checkin-evento-id');
        if (eventoField && data.evento_id) {
            eventoField.value = data.evento_id;
        }
    }

    // Popular campo formulario_id
    populateFormularioId(formularioId) {
        const field = document.getElementById('checkin-formulario-id');
        if (field) {
            field.value = formularioId;
        }
    }

    // Resetar formulário
    resetForm() {
        const fields = ['checkin-nome', 'checkin-formulario-id', 'checkin-processo-id', 'checkin-evento-id'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) field.value = '';
        });
        
        this.currentFormulario = null;
    }

    // Configurar listeners para mudanças nos selects
    setupSelectListeners() {
        const processoSelect = document.getElementById('checkin-processo-id');
        const eventoSelect = document.getElementById('checkin-evento-id');
        const nomeField = document.getElementById('checkin-nome');

        if (processoSelect) {
            processoSelect.addEventListener('change', async (e) => {
                await this.updateCheckinField('processo_etapa_id', e.target.value);
            });
        }

        if (eventoSelect) {
            eventoSelect.addEventListener('change', async (e) => {
                await this.updateCheckinField('evento_id', e.target.value);
            });
        }

        if (nomeField) {
            // Debounce para evitar muitas chamadas
            let timeout;
            nomeField.addEventListener('input', (e) => {
                clearTimeout(timeout);
                timeout = setTimeout(async () => {
                    if (e.target.value.trim()) {
                        await this.updateCheckinField('nome', e.target.value.trim());
                    }
                }, 1000); // Aguarda 1 segundo após parar de digitar
            });
        }
    }

    // Atualizar campo específico do checkin
    async updateCheckinField(field, value) {
        if (!this.currentFormulario || !this.currentFormulario.id) {
            return;
        }

        try {
            const data = { [field]: value || null };
            
            const response = await window.formulariosAPI.updateCheckinFormulario(this.currentFormulario.id, data);
            
            if (response.success || response.code === 200) {
                // Atualizar dados locais
                this.currentFormulario[field] = value;
                if (field === 'nome') {
                    window.checkinUI?.showNotification('Nome atualizado', 'success');
                } else {
                    window.checkinUI?.showNotification(`${field === 'processo_etapa_id' ? 'Processo' : 'Evento'} atualizado com sucesso`, 'success');
                }
            } else {
                throw new Error(response.message || 'Erro ao atualizar campo');
            }
        } catch (error) {
            if (field === 'nome') {
                window.checkinUI?.showNotification('Erro ao atualizar nome', 'error');
            } else {
                window.checkinUI?.showNotification(`Erro ao atualizar ${field === 'processo_etapa_id' ? 'processo' : 'evento'}`, 'error');
            }
        }
    }

    // Carregar processos
    async loadProcessos() {
        try {
            const ministerioId = this.getMinisterioId();
            const response = await window.formulariosAPI.getProcessos(ministerioId);
            
            const select = document.getElementById('checkin-processo-id');
            if (select && (response.success || response.code === 200) && response.data) {
                select.innerHTML = '<option value="">Selecione um processo</option>';
                const processos = Array.isArray(response.data) ? response.data : [];
                processos.forEach(processo => {
                    select.innerHTML += `<option value="${processo.id}">${processo.nome}</option>`;
                });
            }
        } catch (error) {
        }
    }

    // Carregar eventos
    async loadEventos() {
        try {
            const response = await window.formulariosAPI.getEventos();
            
            const select = document.getElementById('checkin-evento-id');
            if (select && (response.success || response.code === 200) && response.data) {
                select.innerHTML = '<option value="">Selecione um evento</option>';
                const eventos = Array.isArray(response.data) ? response.data : [];
                eventos.forEach(evento => {
                    select.innerHTML += `<option value="${evento.id}">${evento.nome}</option>`;
                });
            }
        } catch (error) {
        }
    }

    // Salvar
    async save() {
        try {
            const data = this.getFormData();
            
            if (this.currentFormulario && this.currentFormulario.id) {
                // Atualizar existente
                const response = await window.formulariosAPI.updateCheckinFormulario(this.currentFormulario.id, data);
                if (response.success || response.code === 200) {
                    window.checkinUI?.showNotification('Check-in atualizado com sucesso', 'success');
                }
            } else {
                // Criar novo
                const response = await window.formulariosAPI.createCheckinFormulario(data);
                if (response.success || response.code === 200) {
                    this.currentFormulario = response.data;
                    window.checkinUI?.showNotification('Check-in salvo com sucesso', 'success');
                }
            }
        } catch (error) {
            window.checkinUI?.showNotification('Erro ao salvar check-in', 'error');
        }
    }

    // Carregar itens existentes
    async loadItens() {
        if (!this.currentFormulario?.id) return;

        try {
            const response = await window.formulariosAPI.getCheckinItens(this.currentFormulario.id);
            
            if ((response.success || response.code === 200) && response.data) {
                const itens = Array.isArray(response.data) ? response.data : [];
                window.checkinUI?.populateItens(itens);
            }
        } catch (error) {
        }
    }

    // Carregar acessos existentes
    async loadAcessos() {
        if (!this.currentFormulario?.id) return;

        try {
            window.checkinUI?.showAcessosLoading(true);
            const response = await window.formulariosAPI.getCheckinAcessos(this.currentFormulario.id);
            
            if ((response.success || response.code === 200) && response.data) {
                const acessos = Array.isArray(response.data) ? response.data : [];
                window.checkinUI?.populateAcessos(acessos);
            }
        } catch (error) {
        } finally {
            window.checkinUI?.showAcessosLoading(false);
        }
    }

    // Obter dados do formulário
    getFormData() {
        const formularioId = this.getFormularioId();
        const ministerioId = this.getMinisterioId();
        
        return {
            nome: document.getElementById('checkin-nome')?.value || '',
            formulario_id: formularioId,
            ministerio_id: ministerioId,
            processo_etapa_id: document.getElementById('checkin-processo-id')?.value || null,
            evento_id: document.getElementById('checkin-evento-id')?.value || null
        };
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    new CheckinService();
});