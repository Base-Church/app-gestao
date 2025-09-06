/**
 * Serviço para gerenciar a estrutura dinâmica de itens, atividades e voluntários na escala
 */
class EscalaService {
    constructor() {
        this.estrutura = new Map(); // {itemId => {item, conjuntos: [{atividade, voluntario}]}};
        this.itemOrder = []; // Array para manter a ordem dos itens
    }

    adicionarItem(item) {
        if (!this.estrutura.has(item.id)) {
            this.estrutura.set(item.id, {
                item: item,
                conjuntos: []
            });
            // Adiciona à ordem se não estiver presente
            if (!this.itemOrder.includes(item.id)) {
                this.itemOrder.push(item.id);
            }
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
        // Remove da ordem também
        const index = this.itemOrder.indexOf(itemId);
        if (index > -1) {
            this.itemOrder.splice(index, 1);
        }
    }

    /**
     * Callback para quando a ordem dos itens muda via drag & drop
     */
    onItemOrderChanged(oldIndex, newIndex) {
        // Atualiza a ordem dos itemIds
        const itemId = this.itemOrder.splice(oldIndex, 1)[0];
        this.itemOrder.splice(newIndex, 0, itemId);
        
        console.log('Ordem de itens atualizada:', this.itemOrder);
    }

    /**
     * Retorna a estrutura ordenada conforme a ordem definida
     */
    getEstrutura() {
        const estruturaOrdenada = [];
        
        // Primeiro adiciona os itens na ordem definida
        this.itemOrder.forEach(itemId => {
            const itemData = this.estrutura.get(itemId);
            if (itemData) {
                estruturaOrdenada.push(itemData);
            }
        });
        
        // Adiciona qualquer item que não esteja na ordem (fallback)
        this.estrutura.forEach((itemData, itemId) => {
            if (!this.itemOrder.includes(itemId)) {
                estruturaOrdenada.push(itemData);
                this.itemOrder.push(itemId); // Adiciona à ordem para próximas chamadas
            }
        });
        
        return estruturaOrdenada;
    }

    /**
     * Retorna a ordem atual dos itens
     */
    getItemOrder() {
        return [...this.itemOrder];
    }

    /**
     * Define uma nova ordem para os itens
     */
    setItemOrder(newOrder) {
        this.itemOrder = [...newOrder];
    }
}

window.escalaService = new EscalaService();