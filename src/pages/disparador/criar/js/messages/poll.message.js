// Módulo de mensagem de enquete
(function() {
    function createPollMessage() {
        return {
            type: 'poll',
            text: '',
            selectableCount: 1,
            options: []
        };
    }

    function renderPollMessageForm(message, onTextChange, onSelectableChange) {
        return `
            <div class="space-y-3">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Pergunta *
                    </label>
                    <textarea 
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        rows="3"
                        placeholder="Ex: Qual horário prefere para atendimento?"
                        onchange="${onTextChange}(this.value)"
                        required></textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tipo de Seleção
                    </label>
                    <div class="flex space-x-4">
                        <label class="flex items-center">
                            <input type="radio" name="poll-type-${message.id}" value="1" checked onchange="${onSelectableChange}(1)" class="mr-2">
                            <span class="text-sm">Marcar uma</span>
                        </label>
                        <label class="flex items-center">
                            <input type="radio" name="poll-type-${message.id}" value="2" onchange="${onSelectableChange}(2)" class="mr-2">
                            <span class="text-sm">Marcar várias</span>
                        </label>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Opções de Voto * (mínimo 2, máximo 12)
                    </label>
                    <div id="poll-options-${message.id}" class="space-y-2"></div>
                    <button type="button" 
                        class="mt-2 px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        onclick="addPollOption('${message.id}')"
                        id="add-option-${message.id}">
                        + Adicionar Opção
                    </button>
                </div>
            </div>
        `;
    }

    function renderPollOption(messageId, option, index) {
        return `
            <div class="poll-option flex items-center gap-2">
                <input type="text" 
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                    placeholder="Opção de voto"
                    value="${option.text || ''}"
                    onchange="updatePollOption('${messageId}', ${index}, this.value)">
                <button type="button" 
                    class="p-1 text-red-600 hover:text-red-800"
                    onclick="removePollOption('${messageId}', ${index})">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
        `;
    }

    window.PollMessage = {
        create: createPollMessage,
        renderForm: renderPollMessageForm,
        renderOption: renderPollOption
    };
})(); 