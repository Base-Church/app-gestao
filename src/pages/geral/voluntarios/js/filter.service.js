import { UXService } from './ux.service.js';
export class FilterService {
    constructor() {
        this.originalData = [];
        this.filteredData = [];
        this.ministerios = [];
        this.currentFilters = {
            search: '',
            ministerio: '',
            status: 'all'
        };
        
        this.initEventListeners();
    }

    setData(voluntarios, ministerios = []) {
        this.originalData = voluntarios;
        this.filteredData = [...voluntarios];
        this.ministerios = ministerios;
        
        // Configura os ministérios no UXService para mapeamento de nomes
        UXService.setMinisterios(ministerios);
        
        this.applyFilters();
    }

    initEventListeners() {
        // Busca por texto
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value.toLowerCase().trim();
                this.applyFilters();
            });
        }

        // Filtro por ministério
        const ministerioSelect = document.getElementById('ministerio-filter');
        if (ministerioSelect) {
            ministerioSelect.addEventListener('change', (e) => {
                this.currentFilters.ministerio = e.target.value;
                this.applyFilters();
            });
        }

        // Filtro por status
        const statusSelect = document.getElementById('status-filter');
        if (statusSelect) {
            statusSelect.addEventListener('change', (e) => {
                this.currentFilters.status = e.target.value;
                this.applyFilters();
            });
        }
    }

    applyFilters() {
        let filtered = [...this.originalData];

        // Filtro por texto (nome ou CPF)
        if (this.currentFilters.search) {
            const searchTerm = this.currentFilters.search.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
            filtered = filtered.filter(voluntario => {
                const nome = (voluntario.nome || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
                const cpf = (voluntario.cpf || '').replace(/\D/g, '');
                // Busca por nome (corrigido) e CPF
                return nome.includes(searchTerm) || cpf.includes(searchTerm.replace(/\D/g, ''));
            });
        }

        // Filtro por ministério
        if (this.currentFilters.ministerio && this.currentFilters.ministerio !== '') {
            const ministerioId = parseInt(this.currentFilters.ministerio);
            filtered = filtered.filter(voluntario => {
                return voluntario.ministerios && 
                       voluntario.ministerios.includes(ministerioId);
            });
        }

        // Filtro por status
        if (this.currentFilters.status !== 'all') {
            filtered = filtered.filter(voluntario => {
                switch (this.currentFilters.status) {
                    case 'ativo':
                        return voluntario.status && voluntario.onboarding;
                    case 'pendente':
                        return voluntario.status && !voluntario.onboarding;
                    case 'inativo':
                        return !voluntario.status;
                    default:
                        return true;
                }
            });
        }

        // Ordena por nome (alfabético)
        filtered.sort((a, b) => {
            const nomeA = (a.nome || '').toLowerCase();
            const nomeB = (b.nome || '').toLowerCase();
            return nomeA.localeCompare(nomeB);
        });

        this.filteredData = filtered;
        this.updateUI();
        this.updateResultsCount();
    }

    updateUI() {
        UXService.renderVoluntarios(this.filteredData);
    }

    updateResultsCount() {
        const totalCount = this.originalData.length;
        const filteredCount = this.filteredData.length;
        
        const resultCounter = document.getElementById('results-counter');
        if (resultCounter) {
            if (filteredCount === totalCount) {
                resultCounter.textContent = `${totalCount} voluntário${totalCount !== 1 ? 's' : ''}`;
            } else {
                resultCounter.textContent = `${filteredCount} de ${totalCount} voluntário${totalCount !== 1 ? 's' : ''}`;
            }
        }
    }

    populateMinisterioFilter() {
        const ministerioSelect = document.getElementById('ministerio-filter');
        if (!ministerioSelect || !this.ministerios.length) return;

        // Limpa opções existentes (exceto a primeira)
        ministerioSelect.innerHTML = '<option value="">Todos os ministérios</option>';

        // Adiciona opções dos ministérios
        this.ministerios.forEach(ministerio => {
            const option = document.createElement('option');
            option.value = ministerio.id;
            option.textContent = ministerio.nome || `Ministério ${ministerio.id}`;
            ministerioSelect.appendChild(option);
        });
    }

    clearFilters() {
        this.currentFilters = {
            search: '',
            ministerio: '',
            status: 'all'
        };

        // Reset dos campos
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = '';

        const ministerioSelect = document.getElementById('ministerio-filter');
        if (ministerioSelect) ministerioSelect.value = '';

        const statusSelect = document.getElementById('status-filter');
        if (statusSelect) statusSelect.value = 'all';

        this.applyFilters();
    }

    getFilteredData() {
        return this.filteredData;
    }

    getCurrentFilters() {
        return { ...this.currentFilters };
    }
}
