class DadosState {
    constructor() {
        this.formularioId = null;
        this.formulario = null;
        this.preenchimentos = [];
        this.filteredPreenchimentos = [];
        this.searchTerm = '';
    this.filterDateFrom = null;
    this.filterDateTo = null;
    this.selectedIds = new Set();
    }

    setFormularioId(id) {
        this.formularioId = id;
    }

    setFormulario(formulario) {
        this.formulario = formulario;
    }

    setPreenchimentos(preenchimentos) {
        this.preenchimentos = preenchimentos;
        this.filteredPreenchimentos = [...preenchimentos];
    }

    setSearchTerm(term) {
        this.searchTerm = term;
        this.applyFilter();
    }

    setFilterDates(from, to) {
        this.filterDateFrom = from ? new Date(from) : null;
        this.filterDateTo = to ? new Date(to) : null;
        this.applyFilter();
    }

    applyFilter() {
        const term = this.searchTerm ? this.searchTerm.toLowerCase() : '';

        this.filteredPreenchimentos = this.preenchimentos.filter(p => {
            // Filtrar por termo de busca
            let matchesSearch = true;
            if (term) {
                matchesSearch = false;
                if (p.nome && p.nome.toLowerCase().includes(term)) matchesSearch = true;
                if (p.cpf && p.cpf.includes(term)) matchesSearch = true;
                if (p.whatsapp && p.whatsapp.includes(term)) matchesSearch = true;

                if (!matchesSearch && p.dados && typeof p.dados === 'object') {
                    matchesSearch = Object.values(p.dados).some(value => {
                        if (typeof value === 'string') {
                            return value.toLowerCase().includes(term);
                        }
                        return false;
                    });
                }
            }

            if (!matchesSearch) return false;

            // Filtrar por data (baseado em created_at)
            if (this.filterDateFrom || this.filterDateTo) {
                const created = p.created_at ? new Date(p.created_at) : null;
                if (!created) return false;
                if (this.filterDateFrom && created < this.filterDateFrom) return false;
                if (this.filterDateTo) {
                    // garantir que to inclua o dia inteiro
                    const end = new Date(this.filterDateTo);
                    end.setHours(23,59,59,999);
                    if (created > end) return false;
                }
            }

            return true;
        });
    }

    getFormularioId() {
        return this.formularioId;
    }

    getFormulario() {
        return this.formulario;
    }

    getPreenchimentos() {
        return this.preenchimentos;
    }

    getFilteredPreenchimentos() {
        return this.filteredPreenchimentos;
    }

    getPreenchimentoById(id) {
        return this.preenchimentos.find(p => p.id == id);
    }

    removePreenchimento(id) {
        this.preenchimentos = this.preenchimentos.filter(p => p.id != id);
        this.filteredPreenchimentos = this.filteredPreenchimentos.filter(p => p.id != id);
    this.selectedIds.delete(Number(id));
    }

    reset() {
        this.formularioId = null;
        this.formulario = null;
        this.preenchimentos = [];
        this.filteredPreenchimentos = [];
        this.searchTerm = '';
        this.filterDateFrom = null;
        this.filterDateTo = null;
        this.selectedIds.clear();
    }

    // seleção
    toggleSelection(id, checked) {
        const numId = Number(id);
        if (checked) this.selectedIds.add(numId); else this.selectedIds.delete(numId);
    }

    isSelected(id) {
        return this.selectedIds.has(Number(id));
    }

    selectAllCurrent() {
        this.filteredPreenchimentos.forEach(p => this.selectedIds.add(Number(p.id)));
    }

    clearSelection() {
        this.selectedIds.clear();
    }

    getSelectedIds() {
        return Array.from(this.selectedIds);
    }
}

window.DadosState = DadosState;
