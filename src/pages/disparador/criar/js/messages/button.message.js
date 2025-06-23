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

    function renderButtonMessageForm(message, onTextChange, onFooterChange, onButtonAdd, onButtonChange) {
        // O onButtonAdd e onButtonChange são nomes de funções globais para adicionar/editar botões
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
                        Botões *
                    </label>
                    <div id="buttons-container" class="space-y-2"></div>
                    <button type="button" 
                        class="mt-2 px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        onclick="${onButtonAdd}()">
                        + Adicionar Botão
                    </button>
                </div>
            </div>
        `;
    }

    window.ButtonMessage = {
        create: createButtonMessage,
        renderForm: renderButtonMessageForm
    };
})(); 