import { FormulariosAPI } from './api.js';

// Função para carregar formulário para edição
window.loadFormForEdit = async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const formularioId = urlParams.get('id');
    if (!formularioId) return;

    const api = new FormulariosAPI();
    try {
        const response = await api.getFormularioById(formularioId);
        
        if (response.code === 200 && response.data) {
            // Preencher o título do formulário
            const titleInput = document.getElementById('form-title');
            if (titleInput && response.data.nome) {
                titleInput.value = response.data.nome;
            }
            
            // Carregar os dados do formulário no editor
            if (response.data.dados && window.formBuilder) {
                const formData = JSON.parse(response.data.dados);
                window.formBuilder.loadFormFromJson(formData);
            }
            
            console.log('Formulário carregado com sucesso:', response.data.nome);
        }
    } catch (error) {
        console.error('Erro ao buscar formulário:', error);
        alert('Erro ao carregar o formulário para edição.');
    }
};

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
