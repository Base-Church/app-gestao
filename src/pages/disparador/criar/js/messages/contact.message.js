// Módulo de mensagem de contato (vCard)
(function() {
    function createContactMessage() {
        return {
            type: 'contact',
            fullName: '',
            phoneNumber: ''
        };
    }

    function renderContactMessageForm(message, onNameChange, onPhoneChange) {
        return `
            <div class="space-y-3">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nome Completo *
                    </label>
                    <input type="text" 
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Ex: João Silva"
                        onchange="${onNameChange}(this.value)"
                        required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Números de Telefone *
                    </label>
                    <input type="tel" 
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Ex: 5511999999999,5511888888888"
                        onchange="${onPhoneChange}(this.value)"
                        required>
                    <p class="text-xs text-gray-500 mt-1">Separe múltiplos números por vírgula (inclua o código 55)</p>
                </div>
            </div>
        `;
    }

    window.ContactMessage = {
        create: createContactMessage,
        renderForm: renderContactMessageForm
    };
})(); 