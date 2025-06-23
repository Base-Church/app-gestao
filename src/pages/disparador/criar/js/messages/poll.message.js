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

    function renderPollMessageForm(message, onTextChange, onSelectableChange, onOptionAdd) {
        // O onOptionAdd é nome de função global para adicionar opções
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
                            <input type="radio" name="poll-type" value="1" checked onchange="${onSelectableChange}(1)" class="mr-2">
                            <span class="text-sm">Marcar uma</span>
                        </label>
                        <label class="flex items-center">
                            <input type="radio" name="poll-type" value="2" onchange="${onSelectableChange}(2)" class="mr-2">
                            <span class="text-sm">Marcar várias</span>
                        </label>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Opções de Voto *
                    </label>
                    <div id="poll-options" class="space-y-2"></div>
                    <button type="button" 
                        class="mt-2 px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        onclick="${onOptionAdd}()">
                        + Adicionar Opção
                    </button>
                </div>
            </div>
        `;
    }

    window.PollMessage = {
        create: createPollMessage,
        renderForm: renderPollMessageForm
    };
})(); 