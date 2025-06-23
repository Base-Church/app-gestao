// Módulo de mensagem de figurinha
(function() {
    function createStickerMessage() {
        return {
            type: 'sticker',
            file: null,
            fileUrl: '',
            caption: ''
        };
    }

    function renderStickerMessageForm(message, onFileChange, onCaptionChange) {
        return `
            <div class="space-y-3">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Figurinha *
                    </label>
                    <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                        <input type="file" class="hidden" accept="image/*" onchange="${onFileChange}(this)">
                        <div class="file-upload-area cursor-pointer" onclick="this.previousElementSibling.click()">
                            <svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
                            <p class="text-sm text-gray-500">Clique para selecionar uma figurinha</p>
                        </div>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Descrição (opcional)
                    </label>
                    <textarea 
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        rows="2"
                        placeholder="Descrição da figurinha..."
                        onchange="${onCaptionChange}(this.value)"></textarea>
                </div>
            </div>
        `;
    }

    window.StickerMessage = {
        create: createStickerMessage,
        renderForm: renderStickerMessageForm
    };
})(); 