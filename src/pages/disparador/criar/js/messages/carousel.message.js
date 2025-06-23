// Módulo de mensagem de carrossel
(function() {
    function createCarouselMessage() {
        return {
            type: 'carousel',
            text: '',
            carousel: []
        };
    }

    function renderCarouselMessageForm(message, onTextChange) {
        return `
            <div class="space-y-3">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Texto Principal *
                    </label>
                    <textarea 
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        rows="3"
                        placeholder="Ex: Nossos Produtos em Destaque"
                        onchange="${onTextChange}(this.value)"
                        required></textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Cartões * (mínimo 1, máximo 10)
                    </label>
                    <div id="carousel-cards-${message.id}" class="space-y-4"></div>
                    <button type="button" 
                        class="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onclick="addCarouselCard('${message.id}')"
                        id="add-card-${message.id}">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                        Adicionar Cartão
                    </button>
                </div>
            </div>
        `;
    }

    function renderCarouselCard(messageId, card, cardIndex) {
        return `
            <div class="carousel-card border border-gray-200 dark:border-gray-600 rounded-lg p-4 relative">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Texto do Cartão *
                        </label>
                        <textarea 
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            rows="2"
                            placeholder="Ex: Smartphone XYZ\nO mais avançado smartphone da linha"
                            onchange="updateCardText('${messageId}', ${cardIndex}, this.value)">${card.text || ''}</textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Imagem *
                        </label>
                        <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                            <input id="file-carousel-${messageId}-${cardIndex}" type="file" class="hidden" accept="image/*">
                            <div class="file-upload-area cursor-pointer" id="file-upload-area-carousel-${messageId}-${cardIndex}">
                                <svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                                </svg>
                                <p class="text-sm text-gray-500">Clique para selecionar uma imagem</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Botões * (máximo 3)
                        </label>
                        <div id="card-buttons-${messageId}-${cardIndex}" class="space-y-2"></div>
                        <button type="button" 
                            class="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onclick="addCardButton('${messageId}', ${cardIndex})"
                            id="add-button-${messageId}-${cardIndex}">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                            </svg>
                            Adicionar Botão
                        </button>
                    </div>
                </div>
                <button type="button" 
                    class="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-500"
                    onclick="removeCarouselCard('${messageId}', ${cardIndex})">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
        `;
    }

    function renderCardButton(messageId, cardIndex, button, buttonIndex) {
        return `
            <div class="button-item flex items-center gap-2 p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                <div class="flex-1 grid grid-cols-2 gap-2">
                    <input type="text" 
                        class="col-span-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Texto do botão"
                        value="${button.text || ''}"
                        onchange="updateCardButtonText('${messageId}', ${cardIndex}, ${buttonIndex}, this.value)">
                    <select
                        class="col-span-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        onchange="updateCardButtonType('${messageId}', ${cardIndex}, ${buttonIndex}, this.value)">
                        <option value="URL">Link</option>
                        <option value="COPY">Copiar Texto</option>
                        <option value="CALL">Chamada</option>
                    </select>
                </div>
                <button type="button" 
                    class="p-1 text-gray-400 hover:text-gray-500"
                    onclick="removeCardButton('${messageId}', ${cardIndex}, ${buttonIndex})">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
        `;
    }

    function connectCarouselCardEvents(messageId, cardIndex) {
        var fileInput = document.getElementById(`file-carousel-${messageId}-${cardIndex}`);
        var uploadArea = document.getElementById(`file-upload-area-carousel-${messageId}-${cardIndex}`);
        
        if (uploadArea && fileInput) {
            uploadArea.addEventListener('click', function() { 
                fileInput.click(); 
            });
        }
        
        if (fileInput) {
            fileInput.addEventListener('change', async function() {
                if (fileInput.files && fileInput.files[0]) {
                    const formData = new FormData();
                    formData.append('file', fileInput.files[0]);

                    try {
                        const response = await fetch('/src/services/api/upload_whatsapp.php', {
                            method: 'POST',
                            body: formData
                        });

                        const data = await response.json();
                        if (data.success) {
                            updateCardImage(messageId, cardIndex, data.url);
                            // Atualizar visual do upload
                            uploadArea.innerHTML = `
                                <img src="${data.url}" alt="Imagem carregada" class="max-h-32 mx-auto">
                                <p class="text-sm text-gray-500 mt-2">Clique para trocar a imagem</p>
                            `;
                        } else {
                            alert('Erro ao fazer upload da imagem: ' + data.message);
                        }
                    } catch (error) {
                        console.error('Erro ao fazer upload:', error);
                        alert('Erro ao fazer upload da imagem');
                    }
                }
            });
        }
    }

    window.CarouselMessage = {
        create: createCarouselMessage,
        renderForm: renderCarouselMessageForm,
        renderCard: renderCarouselCard,
        renderButton: renderCardButton,
        connectEvents: connectCarouselCardEvents
    };
})(); 