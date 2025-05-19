/**
 * Serviço para gerenciar a estrutura dinâmica de itens, atividades e voluntários na escala
 */
class EscalaService {
    constructor() {
        this.estrutura = new Map(); // {itemId => {item, conjuntos: [{atividade, voluntario}]}};
    }

    adicionarItem(item) {
        if (!this.estrutura.has(item.id)) {
            this.estrutura.set(item.id, {
                item: item,
                conjuntos: []
            });
        }
        return this.estrutura.get(item.id);
    }

    getConjuntosDoItem(itemId) {
        return this.estrutura.get(itemId)?.conjuntos || [];
    }

    adicionarConjuntoAoItem(itemId, conjunto) {
        const itemAtual = this.estrutura.get(itemId);
        if (itemAtual) {
            itemAtual.conjuntos.push(conjunto);
        }
    }

    removerConjuntoDoItem(itemId, conjuntoId) {
        const itemAtual = this.estrutura.get(itemId);
        if (itemAtual) {
            itemAtual.conjuntos = itemAtual.conjuntos.filter(c => c.atividade.id !== conjuntoId);
        }
    }

    setVoluntarioNaAtividade(itemId, atividadeId, voluntario) {
        const itemAtual = this.estrutura.get(itemId);
        if (itemAtual) {
            const atividadeObj = itemAtual.conjuntos.find(a => a.atividade.id === atividadeId);
            if (atividadeObj) {
                atividadeObj.voluntario = voluntario;
            }
        }
    }

    removerItem(itemId) {
        this.estrutura.delete(itemId);
    }

    getEstrutura() {
        return Array.from(this.estrutura.values());
    }
}

window.escalaService = new EscalaService();