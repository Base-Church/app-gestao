document.addEventListener('DOMContentLoaded', () => {
    // Função para abrir/fechar offcanvas de voluntários
    function toggleVoluntariosOffcanvas(atividadeElement) {
        const voluntariosOffcanvas = document.getElementById('voluntariosOffcanvas');
        if (voluntariosOffcanvas) {
            voluntariosOffcanvas.classList.remove('translate-x-full');
            voluntariosOffcanvas.classList.add('translate-x-0');
            carregarVoluntarios(atividadeElement);
        }
    }

    // Adicionar função global para fechar o offcanvas
    window.toggleVoluntariosOffcanvas = function() {
        const voluntariosOffcanvas = document.getElementById('voluntariosOffcanvas');
        if (voluntariosOffcanvas) {
            voluntariosOffcanvas.classList.remove('translate-x-0');
            voluntariosOffcanvas.classList.add('translate-x-full');
        }
    }

    // Inicializar gerenciador de eventos
    const eventosManager = new DynamicFieldsManager({
        containerSelector: '#eventos-container',
        addButtonSelector: '#btn-adicionar-evento',
        templateSelector: '#evento-template',
        onInitField: (eventoElement, eventoUniqueId) => {
            const eventoSelector = eventoElement.querySelector('.evento-selector .cursor-pointer');
            if (eventoSelector) {
                eventoSelector.addEventListener('click', (event) => {
                    const floatingSelection = eventoSelector.nextElementSibling;
                    if (floatingSelection && floatingSelection.classList.contains('floating-selection')) {
                        floatingSelection.classList.toggle('hidden');
                        if (!floatingSelection.classList.contains('hidden')) {
                            carregarEventos(eventoElement);
                        }
                    }
                });
            }

            // Inicializar gerenciador de atividades para cada evento
            const atividadesContainer = eventoElement.querySelector('.atividades-container');
            const btnAdicionarAtividade = eventoElement.querySelector('.btn-adicionar-atividade');

            if (atividadesContainer && btnAdicionarAtividade) {
                const atividadesManager = new DynamicFieldsManager({
                    containerSelector: atividadesContainer.querySelector('#atividades-lista-container'),
                    addButtonSelector: btnAdicionarAtividade,
                    templateSelector: '#atividade-template',
                    onInitField: (atividadeElement, atividadeUniqueId) => {
                        atividadeElement.setAttribute('data-atividade-id', atividadeUniqueId);

                        const atividadeSelector = atividadeElement.querySelector('.atividade-selector .cursor-pointer');
                        if (atividadeSelector) {
                            atividadeSelector.addEventListener('click', (event) => {
                                const floatingSelection = atividadeSelector.nextElementSibling;
                                if (floatingSelection && floatingSelection.classList.contains('floating-selection')) {
                                    floatingSelection.classList.toggle('hidden');
                                    if (!floatingSelection.classList.contains('hidden')) {
                                        carregarAtividades(atividadeElement);
                                    }
                                }
                            });
                        }

                        const voluntarioToggleBtn = atividadeElement.querySelector('.voluntario-toggle-btn');
                        if (voluntarioToggleBtn) {
                            voluntarioToggleBtn.addEventListener('click', (event) => {
                                event.stopPropagation();
                                const atividadeId = atividadeElement.querySelector('input[name="atividade_id[]"]')?.value;
                                if (!atividadeId) {
                                    alert('Por favor, selecione uma atividade primeiro');
                                    return;
                                }
                                toggleVoluntariosOffcanvas(atividadeElement);
                            });
                        }
                    }
                });
            }
        }
    });
});
