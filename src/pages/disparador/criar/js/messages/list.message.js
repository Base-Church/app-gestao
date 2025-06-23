// Módulo de mensagem de lista
(function() {
    function createListMessage() {
        return {
            type: 'list',
            text: '',
            footerText: '',
            listButton: '',
            sections: []
        };
    }

    function renderListMessageForm(message, onTextChange, onFooterChange, onButtonChange, onSectionAdd) {
        // O onSectionAdd e onButtonChange são nomes de funções globais para adicionar/editar seções/itens
        return `
            <div class="space-y-3">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Texto Principal *
                    </label>
                    <textarea 
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        rows="3"
                        placeholder="Ex: Catálogo de Produtos"
                        onchange="${onTextChange}(this.value)"
                        required></textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Texto do Botão da Lista *
                    </label>
                    <input type="text" 
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Ex: Ver Catálogo"
                        onchange="${onButtonChange}(this.value)"
                        required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Texto do Rodapé
                    </label>
                    <input type="text" 
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Ex: Preços sujeitos a alteração"
                        onchange="${onFooterChange}(this.value)">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Seções e Itens *
                    </label>
                    <div id="list-container" class="space-y-3"></div>
                    <button type="button" 
                        class="mt-2 px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        onclick="${onSectionAdd}()">
                        + Adicionar Seção
                    </button>
                </div>
            </div>
        `;
    }

    window.ListMessage = {
        create: createListMessage,
        renderForm: renderListMessageForm
    };
})(); 