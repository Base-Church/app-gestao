// Módulo de mensagem de documento
(function() {
    function createDocumentMessage() {
        return {
            type: 'document',
            file: null,
            fileUrl: '',
            caption: '',
            fileName: ''
        };
    }

    function renderDocumentMessageForm(message) {
        return `
            <div class="space-y-3">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Documento *
                    </label>
                    <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                        <input id="file-document-${message.id}" type="file" class="hidden" accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx">
                        <div class="file-upload-area cursor-pointer" id="file-upload-area-document-${message.id}">
                            <svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
                            <p class="text-sm text-gray-500">Clique para selecionar um documento</p>
                        </div>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Descrição (opcional)
                    </label>
                    <textarea 
                        id="caption-document-${message.id}"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        rows="2"
                        placeholder="Descrição do documento..."></textarea>
                </div>
            </div>
        `;
    }

    function connectDocumentMessageEvents(message, onFile, onCaption) {
        var fileInput = document.getElementById(`file-document-${message.id}`);
        var uploadArea = document.getElementById(`file-upload-area-document-${message.id}`);
        var captionInput = document.getElementById(`caption-document-${message.id}`);
        if (uploadArea && fileInput) {
            uploadArea.addEventListener('click', function() { fileInput.click(); });
        }
        if (fileInput) {
            fileInput.addEventListener('change', function() { onFile(fileInput); });
        }
        if (captionInput) {
            captionInput.addEventListener('input', function() { onCaption(captionInput.value); });
        }
    }

    window.DocumentMessage = {
        create: createDocumentMessage,
        renderForm: renderDocumentMessageForm,
        connectEvents: connectDocumentMessageEvents
    };
})(); 