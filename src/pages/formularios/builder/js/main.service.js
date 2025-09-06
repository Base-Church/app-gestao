// Arquivo principal do construtor de formulários

// Array para armazenar etapas selecionadas
let selectedEtapas = [];

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    loadProcessoEtapas();
});

// Função para carregar as etapas do processo
async function loadProcessoEtapas() {
    try {
        const ministerioId = window.formulariosAPI.getMinisterioId();
        const data = await window.formulariosAPI.getProcessoEtapas(ministerioId);
        const etapasList = document.getElementById('etapas-list');
        
        if (etapasList && data.data) {
            etapasList.innerHTML = '';
            
            data.data.forEach(etapa => {
                const item = document.createElement('div');
                item.className = 'flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer dark:text-gray-300 dark:hover:bg-gray-600';
                item.dataset.etapaId = etapa.id;
                
                item.innerHTML = `
                    <input type="checkbox" class="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" id="etapa-${etapa.id}">
                    <label for="etapa-${etapa.id}" class="flex-1 cursor-pointer">${etapa.nome}</label>
                `;
                
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const checkbox = item.querySelector('input[type="checkbox"]');
                    checkbox.checked = !checkbox.checked;
                    updateSelectedEtapas();
                });
                
                const checkbox = item.querySelector('input[type="checkbox"]');
                checkbox.addEventListener('change', () => {
                    updateSelectedEtapas();
                });
                
                etapasList.appendChild(item);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar etapas do processo:', error);
    }
}

// Função para atualizar as etapas selecionadas
function updateSelectedEtapas() {
    const checkboxes = document.querySelectorAll('#etapas-list input[type="checkbox"]:checked');
    selectedEtapas = Array.from(checkboxes).map(cb => {
        const item = cb.closest('div');
        return {
            id: item.dataset.etapaId,
            nome: cb.nextElementSibling.textContent
        };
    });
    
    const buttonText = document.getElementById('selected-etapas-text');
    const hiddenInput = document.getElementById('processo-etapa-select');
    
    if (buttonText && hiddenInput) {
        if (selectedEtapas.length === 0) {
            buttonText.textContent = 'Selecione as etapas';
            hiddenInput.value = '';
        } else if (selectedEtapas.length === 1) {
            buttonText.textContent = selectedEtapas[0].nome;
            hiddenInput.value = selectedEtapas[0].id;
        } else {
            buttonText.textContent = `${selectedEtapas.length} etapas selecionadas`;
            hiddenInput.value = selectedEtapas.map(e => e.id).join(',');
        }
    }
}

// Torna as funções disponíveis globalmente
window.FormBuilderMain = {
    loadProcessoEtapas,
    updateSelectedEtapas
};