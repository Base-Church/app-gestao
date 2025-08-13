// Variáveis globais
let currentFormularioId = null;
let isEditMode = false;
let originalFormData = null;

// Função para carregar formulário para edição
window.loadFormForEdit = async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const formularioId = urlParams.get('id');
    if (!formularioId) return;

    currentFormularioId = formularioId;
    isEditMode = true;
    
    // Tornar o ID disponível globalmente
    window.currentFormularioId = formularioId;
    
    try {
        const response = await window.formulariosAPI.getFormularioById(formularioId);
        
        if (response.code === 200 && response.data) {
            originalFormData = response.data;
            
            // Preencher o título do formulário (ID correto)
            const titleInput = document.getElementById('form-title-input');
            if (titleInput && response.data.nome) {
                titleInput.value = response.data.nome;
            }
            
            // Carregar etapas selecionadas
            if (response.data.processo_etapa_id && window.FormBuilderMain) {
                // Aguardar as etapas serem carregadas
                setTimeout(() => {
                    loadSelectedEtapas(response.data.processo_etapa_id);
                }, 500);
            }
            
            // Carregar os dados do formulário no editor
            if (response.data.dados && window.formBuilder) {
                try {
                    // Parse duplo para lidar com string JSON escapada
                    let formData = JSON.parse(response.data.dados);
                    if (typeof formData === 'string') {
                        formData = JSON.parse(formData);
                    }
                    window.formBuilder.loadFormFromJson(formData);
                } catch (parseError) {
                    window.formBuilder.loadFormFromJson({ elements: [] });
                }
            }
            
            // Preencher os campos de configuração do modal
            populateConfigFields(response.data);
        }
    } catch (error) {
        console.error('Erro ao buscar formulário:', error);
        // Usar notificação se FormBuilder estiver disponível, senão usar alert
        if (window.formBuilder && window.formBuilder.showNotification) {
            window.formBuilder.showNotification('Erro ao carregar o formulário para edição.', 'error');
        } else {
            alert('Erro ao carregar o formulário para edição.');
        }
    }
};

// Função para preencher campos do modal de configuração
function populateConfigFields(data) {
    // Aguardar um pouco para garantir que os elementos estejam disponíveis
    setTimeout(() => {
        if (data.slug) {
            const slugField = document.getElementById('form-slug');
            if (slugField) slugField.value = data.slug;
        }
        if (data.descricao) {
            const descricaoField = document.getElementById('form-descricao');
            if (descricaoField) descricaoField.value = data.descricao;
        }
        if (data.redirect_url) {
            const redirectField = document.getElementById('form-redirect-url');
            if (redirectField) redirectField.value = data.redirect_url;
        }
        if (data.cor_active) {
            const corField = document.getElementById('form-cor-active');
            const corTextField = document.getElementById('form-cor-active-text');
            if (corField) corField.value = data.cor_active;
            if (corTextField) corTextField.value = data.cor_active;
        }
        if (data.img_url) {
            const imgField = document.getElementById('form-img-url');
            if (imgField) imgField.value = data.img_url;
        }
    }, 100);
}

// Função para carregar etapas selecionadas
function loadSelectedEtapas(etapaIds) {
    if (!etapaIds) return;
    
    const ids = Array.isArray(etapaIds) ? etapaIds : [etapaIds];
    
    ids.forEach(id => {
        const checkbox = document.querySelector(`#etapas-list input[type="checkbox"][id="etapa-${id}"]`);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
    
    // Atualizar o display das etapas selecionadas
    if (window.FormBuilderMain && window.FormBuilderMain.updateSelectedEtapas) {
        window.FormBuilderMain.updateSelectedEtapas();
    }
}

// Aguardar o FormBuilder estar disponível antes de carregar
function waitForFormBuilder() {
    if (window.formBuilder) {
        window.loadFormForEdit();
    } else {
        setTimeout(waitForFormBuilder, 100);
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    waitForFormBuilder();
});
