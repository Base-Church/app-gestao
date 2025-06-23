// Módulo de mensagem de lista
(function() {
    function createListMessage() {
        return {
            type: 'list',
            text: '',
            listButton: '',
            footerText: '',
            sections: []
        };
    }

    function renderListMessageForm(message, onTextChange, onButtonTextChange, onFooterChange) {
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
                        Texto do Botão *
                    </label>
                    <input type="text" 
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Ex: Ver Catálogo"
                        onchange="${onButtonTextChange}(this.value)"
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
                    <div id="list-sections-${message.id}" class="space-y-4"></div>
                    <button type="button" 
                        class="mt-2 px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        onclick="addListSection('${message.id}')"
                        id="add-section-${message.id}">
                        + Adicionar Seção
                    </button>
                </div>
            </div>
        `;
    }

    function renderListSection(messageId, section, sectionIndex) {
        return `
            <div class="list-section border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                <div class="flex items-center gap-2 mb-2">
                    <input type="text" 
                        class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                        placeholder="Título da Seção"
                        value="${section.title || ''}"
                        onchange="updateSectionTitle('${messageId}', ${sectionIndex}, this.value)">
                    <button type="button" 
                        class="p-1 text-red-600 hover:text-red-800"
                        onclick="removeListSection('${messageId}', ${sectionIndex})">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                    </button>
                </div>
                <div id="list-items-${messageId}-${sectionIndex}" class="space-y-2"></div>
                <button type="button" 
                    class="mt-2 px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    onclick="addListItem('${messageId}', ${sectionIndex})"
                    id="add-item-${messageId}-${sectionIndex}">
                    + Adicionar Item
                </button>
            </div>
        `;
    }

    function renderListItem(messageId, sectionIndex, item, itemIndex) {
        return `
            <div class="list-item flex items-center gap-2">
                <div class="flex-1 grid grid-cols-2 gap-2">
                    <input type="text" 
                        class="col-span-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded"
                        placeholder="Texto do item"
                        value="${item.text || ''}"
                        onchange="updateListItemText('${messageId}', ${sectionIndex}, ${itemIndex}, this.value)">
                    <input type="text" 
                        class="col-span-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded"
                        placeholder="Descrição (opcional)"
                        value="${item.description || ''}"
                        onchange="updateListItemDescription('${messageId}', ${sectionIndex}, ${itemIndex}, this.value)">
                </div>
                <button type="button" 
                    class="p-1 text-red-600 hover:text-red-800"
                    onclick="removeListItem('${messageId}', ${sectionIndex}, ${itemIndex})">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
        `;
    }

    window.ListMessage = {
        create: createListMessage,
        renderForm: renderListMessageForm,
        renderSection: renderListSection,
        renderItem: renderListItem
    };
})(); 