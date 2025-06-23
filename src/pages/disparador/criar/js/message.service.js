class MessageService {
    constructor() {
        this.messages = [];
        this.messageIdCounter = 0;
        this.init();
    }

    init() {
        // MessageService inicializado
    }

    createMessage(type) {
        const messageId = `msg_${++this.messageIdCounter}`;
        const message = {
            id: messageId,
            type: type,
            content: '',
            caption: '',
            file: null,
            fileName: '',
            fileSize: 0
        };

        this.messages.push(message);
        this.renderMessage(message);
        this.updateMessageCount();
        
        return message;
    }

    renderMessage(message) {
        const container = document.getElementById('mensagensContainer');
        if (!container) return;

        // Remover mensagem de "nenhuma mensagem" se existir
        const emptyMessage = container.querySelector('.text-center');
        if (emptyMessage) {
            emptyMessage.remove();
        }

        const messageElement = document.createElement('div');
        messageElement.id = `message-${message.id}`;
        messageElement.className = 'bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-600';
        
        messageElement.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-2">
                    <span class="px-2 py-1 text-xs font-medium rounded-full ${this.getTypeColor(message.type)}">
                        ${this.getTypeLabel(message.type)}
                    </span>
                    <span class="text-sm text-gray-500">Mensagem ${this.messages.length}</span>
                </div>
                <button class="text-red-500 hover:text-red-700" onclick="deleteMessage('${message.id}')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
            ${this.getMessageForm(message)}
        `;

        container.appendChild(messageElement);
    }

    getMessageForm(message) {
        switch (message.type) {
            case 'text':
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
                                onchange="updateMessageContent('${message.id}', 'content', this.value)"
                                required></textarea>
                        </div>
                    </div>
                `;
            
            case 'image':
                return `
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Imagem *
                            </label>
                            <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                                <input type="file" 
                                       class="hidden" 
                                       accept="image/*"
                                       onchange="handleFileUpload('${message.id}', this, 'image')">
                                <div class="file-upload-area cursor-pointer" onclick="this.previousElementSibling.click()">
                                    <svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                                    </svg>
                                    <p class="text-sm text-gray-500">Clique para selecionar uma imagem</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Legenda (opcional)
                            </label>
                            <textarea 
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                rows="2"
                                placeholder="Descrição da imagem..."
                                onchange="updateMessageContent('${message.id}', 'caption', this.value)"></textarea>
                        </div>
                    </div>
                `;
            
            case 'video':
                return `
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Vídeo *
                            </label>
                            <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                                <input type="file" 
                                       class="hidden" 
                                       accept="video/*"
                                       onchange="handleFileUpload('${message.id}', this, 'video')">
                                <div class="file-upload-area cursor-pointer" onclick="this.previousElementSibling.click()">
                                    <svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                                    </svg>
                                    <p class="text-sm text-gray-500">Clique para selecionar um vídeo</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Legenda (opcional)
                            </label>
                            <textarea 
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                rows="2"
                                placeholder="Descrição do vídeo..."
                                onchange="updateMessageContent('${message.id}', 'caption', this.value)"></textarea>
                        </div>
                    </div>
                `;
            
            case 'document':
                return `
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Documento *
                            </label>
                            <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                                <input type="file" 
                                       class="hidden" 
                                       accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
                                       onchange="handleFileUpload('${message.id}', this, 'document')">
                                <div class="file-upload-area cursor-pointer" onclick="this.previousElementSibling.click()">
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
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                rows="2"
                                placeholder="Descrição do documento..."
                                onchange="updateMessageContent('${message.id}', 'caption', this.value)"></textarea>
                        </div>
                    </div>
                `;
            
            case 'ptt':
                return `
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Mensagem de Voz (PTT) *
                            </label>
                            <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                                <input type="file" 
                                       class="hidden" 
                                       accept="audio/*"
                                       onchange="handleFileUpload('${message.id}', this, 'ptt')">
                                <div class="file-upload-area cursor-pointer" onclick="this.previousElementSibling.click()">
                                    <svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                                    </svg>
                                    <p class="text-sm text-gray-500">Clique para selecionar uma mensagem de voz</p>
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
                                placeholder="Descrição da mensagem de voz..."
                                onchange="updateMessageContent('${message.id}', 'caption', this.value)"></textarea>
                        </div>
                    </div>
                `;
            
            case 'sticker':
                return `
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Figurinha *
                            </label>
                            <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                                <input type="file" 
                                       class="hidden" 
                                       accept="image/*"
                                       onchange="handleFileUpload('${message.id}', this, 'sticker')">
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
                                onchange="updateMessageContent('${message.id}', 'caption', this.value)"></textarea>
                        </div>
                    </div>
                `;
            
            case 'contact':
                return `
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nome Completo *
                            </label>
                            <input type="text" 
                                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                   placeholder="Ex: João Silva"
                                   onchange="updateMessageContent('${message.id}', 'fullName', this.value)"
                                   required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Números de Telefone *
                            </label>
                            <input type="tel" 
                                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                   placeholder="Ex: 5511999999999,5511888888888"
                                   onchange="updateMessageContent('${message.id}', 'phoneNumber', this.value)"
                                   required>
                            <p class="text-xs text-gray-500 mt-1">Separe múltiplos números por vírgula (inclua o código 55)</p>
                        </div>
                    </div>
                `;
            
            case 'button':
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
                                onchange="window.messageService?.updateMessageContent('${message.id}', 'text', this.value)"
                                required></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Texto do Rodapé
                            </label>
                            <input type="text" 
                                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                   placeholder="Ex: Escolha uma das opções abaixo"
                                   onchange="window.messageService?.updateMessageContent('${message.id}', 'footerText', this.value)">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Botões *
                            </label>
                            <div id="buttons-container-${message.id}" class="space-y-2">
                                <div class="flex items-center space-x-2">
                                    <input type="text" 
                                           class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                           placeholder="Texto do botão"
                                           onchange="updateButtonText('${message.id}', 0, this.value)">
                                    <select class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            onchange="updateButtonType('${message.id}', 0, this.value)">
                                        <option value="url">Link</option>
                                        <option value="call">Ligação</option>
                                        <option value="copy">Copiar</option>
                                    </select>
                                    <input type="text" 
                                           class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                           placeholder="URL/Número"
                                           onchange="updateButtonValue('${message.id}', 0, this.value)">
                                </div>
                            </div>
                            <button type="button" 
                                    class="mt-2 px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                    onclick="addButton('${message.id}')">
                                + Adicionar Botão
                            </button>
                        </div>
                    </div>
                `;
            
            case 'list':
                return `
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Texto Principal *
                            </label>
                            <textarea 
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                rows="3"
                                placeholder="Ex: Catálogo de Produtos"
                                onchange="window.messageService?.updateMessageContent('${message.id}', 'text', this.value)"
                                required></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Texto do Botão da Lista *
                            </label>
                            <input type="text" 
                                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                   placeholder="Ex: Ver Catálogo"
                                   onchange="window.messageService?.updateMessageContent('${message.id}', 'listButton', this.value)"
                                   required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Texto do Rodapé
                            </label>
                            <input type="text" 
                                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                   placeholder="Ex: Preços sujeitos a alteração"
                                   onchange="window.messageService?.updateMessageContent('${message.id}', 'footerText', this.value)">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Seções e Itens *
                            </label>
                            <div id="list-container-${message.id}" class="space-y-3">
                                <div class="border border-gray-300 dark:border-gray-600 rounded-lg p-3">
                                    <input type="text" 
                                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white mb-2"
                                           placeholder="Nome da Seção"
                                           onchange="updateSectionName('${message.id}', 0, this.value)">
                                    <div class="space-y-2">
                                        <div class="flex items-center space-x-2">
                                            <input type="text" 
                                                   class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                   placeholder="Nome do item"
                                                   onchange="updateListItemName('${message.id}', 0, 0, this.value)">
                                            <input type="text" 
                                                   class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                   placeholder="Descrição (opcional)"
                                                   onchange="updateListItemDesc('${message.id}', 0, 0, this.value)">
                                        </div>
                                    </div>
                                    <button type="button" 
                                            class="mt-2 px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                            onclick="addListItem('${message.id}', 0)">
                                        + Adicionar Item
                                    </button>
                                </div>
                            </div>
                            <button type="button" 
                                    class="mt-2 px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                    onclick="addSection('${message.id}')">
                                + Adicionar Seção
                            </button>
                        </div>
                    </div>
                `;
            
            case 'poll':
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
                                onchange="window.messageService?.updateMessageContent('${message.id}', 'text', this.value)"
                                required></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Tipo de Seleção
                            </label>
                            <div class="flex space-x-4">
                                <label class="flex items-center">
                                    <input type="radio" 
                                           name="poll-type-${message.id}" 
                                           value="1" 
                                           checked
                                           onchange="window.messageService?.updateMessageContent('${message.id}', 'selectableCount', this.value)"
                                           class="mr-2">
                                    <span class="text-sm">Marcar uma</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" 
                                           name="poll-type-${message.id}" 
                                           value="2"
                                           onchange="window.messageService?.updateMessageContent('${message.id}', 'selectableCount', this.value)"
                                           class="mr-2">
                                    <span class="text-sm">Marcar várias</span>
                                </label>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Opções de Voto *
                            </label>
                            <div id="poll-options-${message.id}" class="space-y-2">
                                <input type="text" 
                                       class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                       placeholder="Opção 1"
                                       onchange="updatePollOption('${message.id}', 0, this.value)">
                                <input type="text" 
                                       class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                       placeholder="Opção 2"
                                       onchange="updatePollOption('${message.id}', 1, this.value)">
                            </div>
                            <button type="button" 
                                    class="mt-2 px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                    onclick="addPollOption('${message.id}')">
                                + Adicionar Opção
                            </button>
                        </div>
                    </div>
                `;
            
            case 'carousel':
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
                                onchange="window.messageService?.updateMessageContent('${message.id}', 'text', this.value)"
                                required></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Cartões do Carrossel *
                            </label>
                            <div id="carousel-cards-${message.id}" class="space-y-4">
                                <div class="border border-gray-300 dark:border-gray-600 rounded-lg p-3">
                                    <div class="space-y-2">
                                        <input type="text" 
                                               class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                               placeholder="Título do cartão"
                                               onchange="updateCarouselCardTitle('${message.id}', 0, this.value)">
                                        <textarea 
                                               class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                               rows="2"
                                               placeholder="Descrição do cartão"
                                               onchange="updateCarouselCardDesc('${message.id}', 0, this.value)"></textarea>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Imagem do Cartão
                                            </label>
                                            <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                                                <input type="file" 
                                                       class="hidden" 
                                                       accept="image/*"
                                                       onchange="handleCarouselImageUpload('${message.id}', 0, this)">
                                                <div class="file-upload-area cursor-pointer" onclick="this.previousElementSibling.click()">
                                                    <svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                                                    </svg>
                                                    <p class="text-sm text-gray-500">Clique para selecionar uma imagem</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="space-y-2">
                                            <div class="flex items-center space-x-2">
                                                <input type="text" 
                                                       class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                       placeholder="Texto do botão"
                                                       onchange="updateCarouselButtonText('${message.id}', 0, 0, this.value)">
                                                <select class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                        onchange="updateCarouselButtonType('${message.id}', 0, 0, this.value)">
                                                    <option value="url">Link</option>
                                                    <option value="call">Ligação</option>
                                                    <option value="copy">Copiar</option>
                                                </select>
                                                <input type="text" 
                                                       class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                       placeholder="URL/Número"
                                                       onchange="updateCarouselButtonValue('${message.id}', 0, 0, this.value)">
                                            </div>
                                        </div>
                                        <button type="button" 
                                                class="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                                onclick="addCarouselButton('${message.id}', 0)">
                                            + Adicionar Botão
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <button type="button" 
                                    class="mt-2 px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                    onclick="addCarouselCard('${message.id}')">
                                + Adicionar Cartão
                            </button>
                        </div>
                    </div>
                `;
            
            default:
                return '<p class="text-red-500">Tipo de mensagem não suportado</p>';
        }
    }

    getTypeColor(type) {
        const colors = {
            text: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            image: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            video: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            document: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
            ptt: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
            sticker: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            contact: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
            button: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
            list: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
            poll: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
            carousel: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    }

    getTypeLabel(type) {
        const labels = {
            text: 'Texto',
            image: 'Imagem',
            video: 'Vídeo',
            document: 'Documento',
            ptt: 'Mensagem de Voz',
            sticker: 'Figurinha',
            contact: 'Contato',
            button: 'Botões',
            list: 'Lista',
            poll: 'Enquete',
            carousel: 'Carrossel'
        };
        return labels[type] || 'Desconhecido';
    }

    updateMessageContent(messageId, field, value) {
        const message = this.messages.find(m => m.id === messageId);
        if (message) {
            message[field] = value;
        }
    }

    handleFileUpload(messageId, input, type) {
        const file = input.files[0];
        if (!file) return;

        const message = this.messages.find(m => m.id === messageId);
        if (!message) return;

        // Validar tamanho do arquivo (máximo 16MB)
        const maxSize = 16 * 1024 * 1024; // 16MB
        if (file.size > maxSize) {
            alert('Arquivo muito grande. Tamanho máximo: 16MB');
            input.value = '';
            return;
        }

        message.file = file;
        message.fileName = file.name;
        message.fileSize = file.size;

        // Mostrar preview do arquivo
        this.showFilePreview(messageId, file, type);
    }

    showFilePreview(messageId, file, type) {
        const messageElement = document.getElementById(`message-${messageId}`);
        if (!messageElement) return;

        const uploadArea = messageElement.querySelector('.file-upload-area');
        if (!uploadArea) return;

        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        
        uploadArea.innerHTML = `
            <div class="flex items-center space-x-3">
                <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div class="text-left">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">${file.name}</p>
                    <p class="text-xs text-gray-500">${fileSize} MB</p>
                </div>
            </div>
        `;
    }

    deleteMessage(messageId) {
        const messageIndex = this.messages.findIndex(m => m.id === messageId);
        if (messageIndex > -1) {
            this.messages.splice(messageIndex, 1);
            
            const messageElement = document.getElementById(`message-${messageId}`);
            if (messageElement) {
                messageElement.remove();
            }
            
            this.updateMessageCount();
            
            // Se não há mais mensagens, mostrar mensagem de "nenhuma mensagem"
            if (this.messages.length === 0) {
                this.showEmptyMessage();
            }
        }
    }

    showEmptyMessage() {
        const container = document.getElementById('mensagensContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="text-center py-8">
                <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Nenhuma mensagem criada</p>
                <p class="text-xs text-gray-500">Clique em "Adicionar Mensagem" para começar</p>
            </div>
        `;
    }

    updateMessageCount() {
        const count = this.messages.length;
        console.log(`Total de mensagens: ${count}`);
    }

    getMessages() {
        return this.messages.map(message => {
            const baseMessage = {
                type: message.type
            };

            switch (message.type) {
                case 'text':
                    baseMessage.content = message.content;
                    break;
                case 'image':
                case 'video':
                case 'document':
                case 'ptt':
                case 'sticker':
                    baseMessage.caption = message.caption;
                    if (message.file) {
                        baseMessage.file = message.file;
                        baseMessage.fileName = message.fileName;
                    }
                    break;
                case 'contact':
                    baseMessage.fullName = message.fullName;
                    baseMessage.phoneNumber = message.phoneNumber;
                    break;
                case 'button':
                case 'list':
                case 'poll':
                case 'carousel':
                    baseMessage.type = message.type;
                    baseMessage.text = message.text;
                    baseMessage.footerText = message.footerText;
                    baseMessage.choices = message.choices ? message.choices.split('\n').filter(choice => choice.trim()) : [];
                    if (message.listButton) baseMessage.listButton = message.listButton;
                    if (message.selectableCount) baseMessage.selectableCount = message.selectableCount;
                    break;
            }

            return baseMessage;
        });
    }

    buildMessagePayload(message) {
        const basePayload = {
            number: message.number,
            options: {
                delay: 1200,
                presence: "composing"
            }
        };

        switch (message.type) {
            case 'text':
                return {
                    ...basePayload,
                    text: message.content
                };

            case 'image':
                return {
                    ...basePayload,
                    image: {
                        link: message.content
                    },
                    caption: message.caption || ''
                };

            case 'video':
                return {
                    ...basePayload,
                    video: {
                        link: message.content
                    },
                    caption: message.caption || ''
                };

            case 'audio':
                return {
                    ...basePayload,
                    audio: {
                        link: message.content
                    }
                };

            case 'document':
                return {
                    ...basePayload,
                    document: {
                        link: message.content
                    },
                    caption: message.caption || ''
                };

            case 'sticker':
                return {
                    ...basePayload,
                    sticker: {
                        link: message.content
                    }
                };

            case 'contact':
                return {
                    ...basePayload,
                    contacts: [{
                        name: message.contactName,
                        phones: message.phones.map(phone => ({
                            phone: phone.startsWith('55') ? phone : `55${phone}`
                        }))
                    }]
                };

            case 'button':
                // Montar botões no formato da API
                const buttonChoices = [];
                if (message.buttons && message.buttons.length > 0) {
                    message.buttons.forEach(button => {
                        if (button.text && button.type && button.value) {
                            let choice = button.text;
                            switch (button.type) {
                                case 'response':
                                    choice += `|${button.value}`;
                                    break;
                                case 'url':
                                    choice += `|${button.value}`;
                                    break;
                                case 'call':
                                    choice += `|call:${button.value}`;
                                    break;
                                case 'copy':
                                    choice += `|copy:${button.value}`;
                                    break;
                            }
                            buttonChoices.push(choice);
                        }
                    });
                }
                
                return {
                    ...basePayload,
                    text: message.text || '',
                    footer: message.footerText || '',
                    buttons: {
                        title: message.text || '',
                        footer: message.footerText || '',
                        choices: buttonChoices
                    }
                };

            case 'list':
                // Montar lista no formato da API
                const listChoices = [];
                if (message.sections && message.sections.length > 0) {
                    message.sections.forEach(section => {
                        if (section.name) {
                            listChoices.push(`[${section.name}]`);
                            if (section.items && section.items.length > 0) {
                                section.items.forEach(item => {
                                    if (item.name) {
                                        let choice = item.name;
                                        if (item.id) choice += `|${item.id}`;
                                        if (item.description) choice += `|${item.description}`;
                                        listChoices.push(choice);
                                    }
                                });
                            }
                        }
                    });
                }
                
                return {
                    ...basePayload,
                    text: message.text || '',
                    footer: message.footerText || '',
                    list: {
                        title: message.text || '',
                        footer: message.footerText || '',
                        buttonText: message.listButton || 'Ver Opções',
                        choices: listChoices
                    }
                };

            case 'poll':
                // Montar enquete no formato da API
                const pollChoices = [];
                if (message.options && message.options.length > 0) {
                    message.options.forEach(option => {
                        if (option) {
                            pollChoices.push(option);
                        }
                    });
                }
                
                return {
                    ...basePayload,
                    poll: {
                        title: message.text || '',
                        choices: pollChoices,
                        selectableCount: message.selectableCount || 1
                    }
                };

            case 'carousel':
                // Montar carrossel no formato da API
                const carouselChoices = [];
                if (message.cards && message.cards.length > 0) {
                    message.cards.forEach(card => {
                        if (card.title) {
                            let choice = `[${card.title}`;
                            if (card.description) choice += `\n${card.description}`;
                            choice += ']';
                            
                            if (card.image) {
                                choice += `\n{${card.image}}`;
                            }
                            
                            if (card.buttons && card.buttons.length > 0) {
                                card.buttons.forEach(button => {
                                    if (button.text && button.type && button.value) {
                                        let buttonChoice = button.text;
                                        switch (button.type) {
                                            case 'url':
                                                buttonChoice += `|${button.value}`;
                                                break;
                                            case 'call':
                                                buttonChoice += `|call:${button.value}`;
                                                break;
                                            case 'copy':
                                                buttonChoice += `|copy:${button.value}`;
                                                break;
                                        }
                                        choice += `\n${buttonChoice}`;
                                    }
                                });
                            }
                            
                            carouselChoices.push(choice);
                        }
                    });
                }
                
                return {
                    ...basePayload,
                    text: message.text || '',
                    carousel: {
                        title: message.text || '',
                        choices: carouselChoices
                    }
                };

            default:
                return basePayload;
        }
    }

    async sendMessage(message) {
        try {
            const payload = this.buildMessagePayload(message);
            
            const response = await fetch('/src/services/api/send-message.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                console.log('Mensagem enviada com sucesso:', result);
                return { success: true, data: result };
            } else {
                console.error('Erro ao enviar mensagem:', result.error);
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            return { success: false, error: error.message };
        }
    }
}

// Funções globais
function deleteMessage(messageId) {
    if (window.messageService) {
        window.messageService.deleteMessage(messageId);
    }
}

function updateMessageContent(messageId, field, value) {
    if (window.messageService) {
        window.messageService.updateMessageContent(messageId, field, value);
    }
}

function handleFileUpload(messageId, input, type) {
    if (window.messageService) {
        window.messageService.handleFileUpload(messageId, input, type);
    }
}

// Funções para gerenciar botões
function addButton(messageId) {
    const container = document.getElementById(`buttons-container-${messageId}`);
    const buttonCount = container.children.length;
    
    const buttonDiv = document.createElement('div');
    buttonDiv.className = 'flex items-center space-x-2';
    buttonDiv.innerHTML = `
        <input type="text" 
               class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
               placeholder="Texto do botão"
               onchange="updateButtonText('${messageId}', ${buttonCount}, this.value)">
        <select class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                onchange="updateButtonType('${messageId}', ${buttonCount}, this.value)">
            <option value="url">Link</option>
            <option value="call">Ligação</option>
            <option value="copy">Copiar</option>
        </select>
        <input type="text" 
               class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
               placeholder="URL/Número"
               onchange="updateButtonValue('${messageId}', ${buttonCount}, this.value)">
    `;
    
    container.appendChild(buttonDiv);
}

function removeButton(messageId, buttonIndex) {
    const container = document.getElementById(`buttons-container-${messageId}`);
    const buttons = container.children;
    
    if (buttons.length > 1) {
        container.removeChild(buttons[buttonIndex]);
        // Reindexar os botões restantes
        for (let i = 0; i < buttons.length; i++) {
            const inputs = buttons[i].querySelectorAll('input, select');
            inputs[0].setAttribute('onchange', `updateButtonText('${messageId}', ${i}, this.value)`);
            inputs[1].setAttribute('onchange', `updateButtonType('${messageId}', ${i}, this.value)`);
            inputs[2].setAttribute('onchange', `updateButtonValue('${messageId}', ${i}, this.value)`);
            inputs[3].setAttribute('onclick', `removeButton('${messageId}', ${i})`);
        }
    }
}

function updateButtonText(messageId, buttonIndex, value) {
    const message = window.messageService?.messages.find(m => m.id === messageId);
    if (!message.buttons) message.buttons = [];
    if (!message.buttons[buttonIndex]) message.buttons[buttonIndex] = {};
    message.buttons[buttonIndex].text = value;
}

function updateButtonType(messageId, buttonIndex, value) {
    const message = window.messageService?.messages.find(m => m.id === messageId);
    if (!message.buttons) message.buttons = [];
    if (!message.buttons[buttonIndex]) message.buttons[buttonIndex] = {};
    message.buttons[buttonIndex].type = value;
}

function updateButtonValue(messageId, buttonIndex, value) {
    const message = window.messageService?.messages.find(m => m.id === messageId);
    if (!message.buttons) message.buttons = [];
    if (!message.buttons[buttonIndex]) message.buttons[buttonIndex] = {};
    message.buttons[buttonIndex].value = value;
}

// Funções para gerenciar listas
function addSection(messageId) {
    const container = document.getElementById(`list-container-${messageId}`);
    const sectionCount = container.children.length;
    
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'border border-gray-300 dark:border-gray-600 rounded-lg p-3';
    sectionDiv.innerHTML = `
        <input type="text" 
               class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white mb-2"
               placeholder="Nome da Seção"
               onchange="updateSectionName('${messageId}', ${sectionCount}, this.value)">
        <div class="space-y-2">
            <div class="flex items-center space-x-2">
                <input type="text" 
                       class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                       placeholder="Nome do item"
                       onchange="updateListItemName('${messageId}', ${sectionCount}, 0, this.value)">
                <input type="text" 
                       class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                       placeholder="Descrição (opcional)"
                       onchange="updateListItemDesc('${messageId}', ${sectionCount}, 0, this.value)">
            </div>
        </div>
        <button type="button" 
                class="mt-2 px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                onclick="addListItem('${messageId}', ${sectionCount})">
            + Adicionar Item
        </button>
        <button type="button" 
                class="mt-2 ml-2 px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                onclick="removeSection('${messageId}', ${sectionCount})">
            Remover Seção
        </button>
    `;
    
    container.appendChild(sectionDiv);
}

function removeSection(messageId, sectionIndex) {
    const container = document.getElementById(`list-container-${messageId}`);
    const sections = container.children;
    
    if (sections.length > 1) {
        container.removeChild(sections[sectionIndex]);
        // Reindexar as seções restantes
        for (let i = 0; i < sections.length; i++) {
            const inputs = sections[i].querySelectorAll('input');
            inputs[0].setAttribute('onchange', `updateSectionName('${messageId}', ${i}, this.value)`);
            inputs[1].setAttribute('onchange', `updateListItemName('${messageId}', ${i}, 0, this.value)`);
            inputs[2].setAttribute('onchange', `updateListItemDesc('${messageId}', ${i}, 0, this.value)`);
            
            const buttons = sections[i].querySelectorAll('button');
            buttons[0].setAttribute('onclick', `addListItem('${messageId}', ${i})`);
            buttons[1].setAttribute('onclick', `removeSection('${messageId}', ${i})`);
        }
    }
}

function addListItem(messageId, sectionIndex) {
    const container = document.getElementById(`list-container-${messageId}`);
    const section = container.children[sectionIndex];
    const itemsContainer = section.querySelector('.space-y-2');
    const itemCount = itemsContainer.children.length;
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'flex items-center space-x-2';
    itemDiv.innerHTML = `
        <input type="text" 
               class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
               placeholder="Nome do item"
               onchange="updateListItemName('${messageId}', ${sectionIndex}, ${itemCount}, this.value)">
        <input type="text" 
               class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
               placeholder="Descrição (opcional)"
               onchange="updateListItemDesc('${messageId}', ${sectionIndex}, ${itemCount}, this.value)">
        <button type="button" 
                class="px-2 py-2 text-red-600 hover:text-red-800 transition-colors"
                onclick="removeListItem('${messageId}', ${sectionIndex}, ${itemCount})">
            ✕
        </button>
    `;
    
    itemsContainer.appendChild(itemDiv);
}

function removeListItem(messageId, sectionIndex, itemIndex) {
    const container = document.getElementById(`list-container-${messageId}`);
    const section = container.children[sectionIndex];
    const itemsContainer = section.querySelector('.space-y-2');
    const items = itemsContainer.children;
    
    if (items.length > 1) {
        itemsContainer.removeChild(items[itemIndex]);
        // Reindexar os itens restantes
        for (let i = 0; i < items.length; i++) {
            const inputs = items[i].querySelectorAll('input');
            inputs[0].setAttribute('onchange', `updateListItemName('${messageId}', ${sectionIndex}, ${i}, this.value)`);
            inputs[1].setAttribute('onchange', `updateListItemDesc('${messageId}', ${sectionIndex}, ${i}, this.value)`);
            inputs[2].setAttribute('onclick', `removeListItem('${messageId}', ${sectionIndex}, ${i})`);
        }
    }
}

function updateSectionName(messageId, sectionIndex, value) {
    const message = window.messageService?.messages.find(m => m.id === messageId);
    if (!message.sections) message.sections = [];
    if (!message.sections[sectionIndex]) message.sections[sectionIndex] = {};
    message.sections[sectionIndex].name = value;
}

function updateListItemName(messageId, sectionIndex, itemIndex, value) {
    const message = window.messageService?.messages.find(m => m.id === messageId);
    if (!message.sections) message.sections = [];
    if (!message.sections[sectionIndex]) message.sections[sectionIndex] = {};
    if (!message.sections[sectionIndex].items) message.sections[sectionIndex].items = [];
    if (!message.sections[sectionIndex].items[itemIndex]) message.sections[sectionIndex].items[itemIndex] = {};
    message.sections[sectionIndex].items[itemIndex].name = value;
}

function updateListItemDesc(messageId, sectionIndex, itemIndex, value) {
    const message = window.messageService?.messages.find(m => m.id === messageId);
    if (!message.sections) message.sections = [];
    if (!message.sections[sectionIndex]) message.sections[sectionIndex] = {};
    if (!message.sections[sectionIndex].items) message.sections[sectionIndex].items = [];
    if (!message.sections[sectionIndex].items[itemIndex]) message.sections[sectionIndex].items[itemIndex] = {};
    message.sections[sectionIndex].items[itemIndex].description = value;
}

// Funções para gerenciar enquetes
function addPollOption(messageId) {
    const container = document.getElementById(`poll-options-${messageId}`);
    const optionCount = container.children.length;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white';
    input.placeholder = `Opção ${optionCount + 1}`;
    input.setAttribute('onchange', `updatePollOption('${messageId}', ${optionCount}, this.value)`);
    
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'ml-2 px-2 py-2 text-red-600 hover:text-red-800 transition-colors';
    removeBtn.textContent = '✕';
    removeBtn.setAttribute('onclick', `removePollOption('${messageId}', ${optionCount})`);
    
    const wrapper = document.createElement('div');
    wrapper.className = 'flex items-center';
    wrapper.appendChild(input);
    wrapper.appendChild(removeBtn);
    
    container.appendChild(wrapper);
}

function removePollOption(messageId, optionIndex) {
    const container = document.getElementById(`poll-options-${messageId}`);
    const options = container.children;
    
    if (options.length > 2) {
        container.removeChild(options[optionIndex]);
        // Reindexar as opções restantes
        for (let i = 0; i < options.length; i++) {
            const input = options[i].querySelector('input');
            const button = options[i].querySelector('button');
            input.setAttribute('onchange', `updatePollOption('${messageId}', ${i}, this.value)`);
            button.setAttribute('onclick', `removePollOption('${messageId}', ${i})`);
        }
    }
}

function updatePollOption(messageId, optionIndex, value) {
    const message = window.messageService?.messages.find(m => m.id === messageId);
    if (!message.options) message.options = [];
    message.options[optionIndex] = value;
}

// Função para upload de imagem do carrossel
function handleCarouselImageUpload(messageId, cardIndex, input) {
    const file = input.files[0];
    if (!file) return;

    const message = window.messageService?.messages.find(m => m.id === messageId);
    if (!message) return;

    // Validar tamanho do arquivo (máximo 16MB)
    const maxSize = 16 * 1024 * 1024; // 16MB
    if (file.size > maxSize) {
        alert('Arquivo muito grande. Tamanho máximo: 16MB');
        input.value = '';
        return;
    }

    // Mostrar preview do arquivo
    const container = document.getElementById(`carousel-cards-${messageId}`);
    const card = container.children[cardIndex];
    const uploadArea = card.querySelector('.file-upload-area');
    
    if (uploadArea) {
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        
        uploadArea.innerHTML = `
            <div class="flex items-center space-x-3">
                <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div class="text-left">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">${file.name}</p>
                    <p class="text-xs text-gray-500">${fileSize} MB</p>
                </div>
            </div>
        `;
    }

    // Salvar arquivo no objeto da mensagem
    if (!message.cards) message.cards = [];
    if (!message.cards[cardIndex]) message.cards[cardIndex] = {};
    message.cards[cardIndex].imageFile = file;
    message.cards[cardIndex].imageName = file.name;
}

// Funções para gerenciar carrossel
function addCarouselCard(messageId) {
    const container = document.getElementById(`carousel-cards-${messageId}`);
    const cardCount = container.children.length;
    
    const cardDiv = document.createElement('div');
    cardDiv.className = 'border border-gray-300 dark:border-gray-600 rounded-lg p-3';
    cardDiv.innerHTML = `
        <div class="space-y-2">
            <input type="text" 
                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                   placeholder="Título do cartão"
                   onchange="updateCarouselCardTitle('${messageId}', ${cardCount}, this.value)">
            <textarea 
                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                   rows="2"
                   placeholder="Descrição do cartão"
                   onchange="updateCarouselCardDesc('${messageId}', ${cardCount}, this.value)"></textarea>
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Imagem do Cartão
                </label>
                <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                    <input type="file" 
                           class="hidden" 
                           accept="image/*"
                           onchange="handleCarouselImageUpload('${messageId}', ${cardCount}, this)">
                    <div class="file-upload-area cursor-pointer" onclick="this.previousElementSibling.click()">
                        <svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                        </svg>
                        <p class="text-sm text-gray-500">Clique para selecionar uma imagem</p>
                    </div>
                </div>
            </div>
            <div class="space-y-2">
                <div class="flex items-center space-x-2">
                    <input type="text" 
                           class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                           placeholder="Texto do botão"
                           onchange="updateCarouselButtonText('${messageId}', ${cardCount}, 0, this.value)">
                    <select class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            onchange="updateCarouselButtonType('${messageId}', ${cardCount}, 0, this.value)">
                        <option value="url">Link</option>
                        <option value="call">Ligação</option>
                        <option value="copy">Copiar</option>
                    </select>
                    <input type="text" 
                           class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                           placeholder="URL/Número"
                           onchange="updateCarouselButtonValue('${messageId}', ${cardCount}, 0, this.value)">
                </div>
            </div>
            <button type="button" 
                    class="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    onclick="addCarouselButton('${messageId}', ${cardCount})">
                + Adicionar Botão
            </button>
            <button type="button" 
                    class="ml-2 px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    onclick="removeCarouselCard('${messageId}', ${cardCount})">
                Remover Cartão
            </button>
        </div>
    `;
    
    container.appendChild(cardDiv);
}

function removeCarouselCard(messageId, cardIndex) {
    const container = document.getElementById(`carousel-cards-${messageId}`);
    const cards = container.children;
    
    if (cards.length > 1) {
        container.removeChild(cards[cardIndex]);
        // Reindexar os cartões restantes
        for (let i = 0; i < cards.length; i++) {
            const inputs = cards[i].querySelectorAll('input, textarea, select');
            inputs[0].setAttribute('onchange', `updateCarouselCardTitle('${messageId}', ${i}, this.value)`);
            inputs[1].setAttribute('onchange', `updateCarouselCardDesc('${messageId}', ${i}, this.value)`);
            inputs[2].setAttribute('onchange', `handleCarouselImageUpload('${messageId}', ${i}, this)`);
            inputs[3].setAttribute('onchange', `updateCarouselButtonText('${messageId}', ${i}, 0, this.value)`);
            inputs[4].setAttribute('onchange', `updateCarouselButtonType('${messageId}', ${i}, 0, this.value)`);
            inputs[5].setAttribute('onchange', `updateCarouselButtonValue('${messageId}', ${i}, 0, this.value)`);
            
            const buttons = cards[i].querySelectorAll('button');
            buttons[0].setAttribute('onclick', `addCarouselButton('${messageId}', ${i})`);
            buttons[1].setAttribute('onclick', `removeCarouselCard('${messageId}', ${i})`);
        }
    }
}

function addCarouselButton(messageId, cardIndex) {
    const container = document.getElementById(`carousel-cards-${messageId}`);
    const card = container.children[cardIndex];
    const buttonsContainer = card.querySelector('.space-y-2');
    const buttonCount = buttonsContainer.children.length - 2; // -2 para excluir os botões de adicionar/remover
    
    const buttonDiv = document.createElement('div');
    buttonDiv.className = 'flex items-center space-x-2';
    buttonDiv.innerHTML = `
        <input type="text" 
               class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
               placeholder="Texto do botão"
               onchange="updateCarouselButtonText('${messageId}', ${cardIndex}, ${buttonCount}, this.value)">
        <select class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                onchange="updateCarouselButtonType('${messageId}', ${cardIndex}, ${buttonCount}, this.value)">
            <option value="url">Link</option>
            <option value="call">Ligação</option>
            <option value="copy">Copiar</option>
        </select>
        <input type="text" 
               class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
               placeholder="URL/Número"
               onchange="updateCarouselButtonValue('${messageId}', ${cardIndex}, ${buttonCount}, this.value)">
        <button type="button" 
                class="px-2 py-2 text-red-600 hover:text-red-800 transition-colors"
                onclick="removeCarouselButton('${messageId}', ${cardIndex}, ${buttonCount})">
            ✕
        </button>
    `;
    
    // Inserir antes dos botões de adicionar/remover
    const addButton = buttonsContainer.querySelector('button');
    buttonsContainer.insertBefore(buttonDiv, addButton);
}

function removeCarouselButton(messageId, cardIndex, buttonIndex) {
    const container = document.getElementById(`carousel-cards-${messageId}`);
    const card = container.children[cardIndex];
    const buttonsContainer = card.querySelector('.space-y-2');
    const buttonDivs = buttonsContainer.querySelectorAll('.flex.items-center.space-x-2');
    
    if (buttonDivs.length > 1) {
        buttonsContainer.removeChild(buttonDivs[buttonIndex]);
        // Reindexar os botões restantes
        for (let i = 0; i < buttonDivs.length; i++) {
            const inputs = buttonDivs[i].querySelectorAll('input, select');
            inputs[0].setAttribute('onchange', `updateCarouselButtonText('${messageId}', ${cardIndex}, ${i}, this.value)`);
            inputs[1].setAttribute('onchange', `updateCarouselButtonType('${messageId}', ${cardIndex}, ${i}, this.value)`);
            inputs[2].setAttribute('onchange', `updateCarouselButtonValue('${messageId}', ${cardIndex}, ${i}, this.value)`);
            inputs[3].setAttribute('onclick', `removeCarouselButton('${messageId}', ${cardIndex}, ${i})`);
        }
    }
}

function updateCarouselCardTitle(messageId, cardIndex, value) {
    const message = window.messageService?.messages.find(m => m.id === messageId);
    if (!message.cards) message.cards = [];
    if (!message.cards[cardIndex]) message.cards[cardIndex] = {};
    message.cards[cardIndex].title = value;
}

function updateCarouselCardDesc(messageId, cardIndex, value) {
    const message = window.messageService?.messages.find(m => m.id === messageId);
    if (!message.cards) message.cards = [];
    if (!message.cards[cardIndex]) message.cards[cardIndex] = {};
    message.cards[cardIndex].description = value;
}

function updateCarouselButtonText(messageId, cardIndex, buttonIndex, value) {
    const message = window.messageService?.messages.find(m => m.id === messageId);
    if (!message.cards) message.cards = [];
    if (!message.cards[cardIndex]) message.cards[cardIndex] = {};
    if (!message.cards[cardIndex].buttons) message.cards[cardIndex].buttons = [];
    if (!message.cards[cardIndex].buttons[buttonIndex]) message.cards[cardIndex].buttons[buttonIndex] = {};
    message.cards[cardIndex].buttons[buttonIndex].text = value;
}

function updateCarouselButtonType(messageId, cardIndex, buttonIndex, value) {
    const message = window.messageService?.messages.find(m => m.id === messageId);
    if (!message.cards) message.cards = [];
    if (!message.cards[cardIndex]) message.cards[cardIndex] = {};
    if (!message.cards[cardIndex].buttons) message.cards[cardIndex].buttons = [];
    if (!message.cards[cardIndex].buttons[buttonIndex]) message.cards[cardIndex].buttons[buttonIndex] = {};
    message.cards[cardIndex].buttons[buttonIndex].type = value;
}

function updateCarouselButtonValue(messageId, cardIndex, buttonIndex, value) {
    const message = window.messageService?.messages.find(m => m.id === messageId);
    if (!message.cards) message.cards = [];
    if (!message.cards[cardIndex]) message.cards[cardIndex] = {};
    if (!message.cards[cardIndex].buttons) message.cards[cardIndex].buttons = [];
    if (!message.cards[cardIndex].buttons[buttonIndex]) message.cards[cardIndex].buttons[buttonIndex] = {};
    message.cards[cardIndex].buttons[buttonIndex].value = value;
}

// Exportar para uso global
window.MessageService = MessageService;

// Criar instância global
window.messageService = new MessageService(); 