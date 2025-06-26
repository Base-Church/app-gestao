// Módulo de mensagem de botões
(function() {
    function createButtonMessage() {
        return {
            type: 'button',
            text: '',
            footerText: '',
            buttons: []
        };
    }

    function renderButtonMessageForm(message, onTextChange, onFooterChange) {
        return `
            <div class="space-y-3">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Texto Principal *
                    </label>
                    <textarea 
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        rows="3"
                        placeholder="Ex: Como podemos ajudar?"
                        onchange="${onTextChange}(this.value)"
                        required></textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Texto do Rodapé
                    </label>
                    <input type="text" 
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Ex: Escolha uma das opções abaixo"
                        onchange="${onFooterChange}(this.value)">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Botões * (máximo 3)
                    </label>
                    <div id="buttons-container-${message.id}" class="space-y-2"></div>
                    <button type="button" 
                        class="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onclick="addButton('${message.id}')"
                        id="add-button-${message.id}">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                        Adicionar Botão
                    </button>
                </div>
            </div>
        `;
    }

    function renderButton(messageId, button, index) {
        return `
            <div class="button-item flex items-center gap-2 p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                <div class="flex-1">
                    <input type="text" 
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Texto do botão"
                        value="${button.text || ''}"
                        onchange="updateButtonText('${messageId}', ${index}, this.value)">
                </div>
                <button type="button" 
                    class="p-1 text-gray-400 hover:text-gray-500"
                    onclick="removeButton('${messageId}', ${index})">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
        `;
    }

    window.ButtonMessage = {
        create: createButtonMessage,
        renderForm: renderButtonMessageForm,
        renderButton: renderButton
    };
})(); 