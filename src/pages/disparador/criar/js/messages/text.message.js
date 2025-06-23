// Módulo de mensagem de texto
(function() {
    function createTextMessage() {
        return {
            type: 'text',
            content: ''
        };
    }

    function renderTextMessageForm(message, onChange) {
        return `
            <div class="space-y-3">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Mensagem *
                    </label>
                    <textarea 
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        rows="3"
                        placeholder="Digite sua mensagem..."
                        onchange="${onChange}(this.value)"
                        required></textarea>
                </div>
            </div>
        `;
    }

    window.TextMessage = {
        create: createTextMessage,
        renderForm: renderTextMessageForm
    };
})(); 