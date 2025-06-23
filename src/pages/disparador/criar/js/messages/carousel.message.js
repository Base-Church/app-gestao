// Módulo de mensagem de carrossel
(function() {
    function createCarouselMessage() {
        return {
            type: 'carousel',
            text: '',
            cards: []
        };
    }

    function renderCarouselMessageForm(message, onTextChange, onCardAdd) {
        // O onCardAdd é nome de função global para adicionar cartões
        return `
            <div class="space-y-3">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Texto Principal *
                    </label>
                    <textarea 
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        rows="3"
                        placeholder="Ex: Conheça nossos produtos"
                        onchange="${onTextChange}(this.value)"
                        required></textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Cartões do Carrossel *
                    </label>
                    <div id="carousel-cards" class="space-y-4"></div>
                    <button type="button" 
                        class="mt-2 px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        onclick="${onCardAdd}()">
                        + Adicionar Cartão
                    </button>
                </div>
            </div>
        `;
    }

    window.CarouselMessage = {
        create: createCarouselMessage,
        renderForm: renderCarouselMessageForm
    };
})(); 