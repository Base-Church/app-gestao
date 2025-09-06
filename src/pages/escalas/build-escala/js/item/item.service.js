/**
 * Serviço para gerenciar itens (cada item contém um evento, data, atividades, voluntários)
 */
class ItemService {
    constructor() {
        this.itens = [];
    }

    adicionarItem(item) {
        this.itens.push(item);
        window.escalaService.adicionarItem(item);
    }

    removerItem(itemId) {
        this.itens = this.itens.filter(i => i.id !== itemId);
        window.escalaService.removerItem(itemId);
    }

    getItens() {
        return this.itens;
    }

    /**
     * Atualiza a ordem dos itens no array local
     */
    reorderItems(oldIndex, newIndex) {
        const item = this.itens.splice(oldIndex, 1)[0];
        this.itens.splice(newIndex, 0, item);
    }
}

window.itemService = new ItemService();
// Nenhuma alteração necessária para alinhamento visual.
