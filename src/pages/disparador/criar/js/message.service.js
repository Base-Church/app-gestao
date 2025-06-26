class MessageService {
    constructor() {
        this.messages = new Map();
        this.messageIdCounter = 0;
        this.init();
    }

    init() {
        // MessageService inicializado
    }

    createMessage(type) {
        this.messageIdCounter++;
        const messageId = `msg_${this.messageIdCounter}`;
        let message;
        // Usar o módulo correto para criar a mensagem
        switch (type) {
            case 'text':
                message = { id: messageId, ...window.TextMessage.create() };
                break;
            case 'image':
                message = { id: messageId, ...window.ImageMessage.create() };
                break;
            case 'video':
                message = { id: messageId, ...window.VideoMessage.create() };
                break;
            case 'document':
                message = { id: messageId, ...window.DocumentMessage.create() };
                break;
            case 'ptt':
                message = { id: messageId, ...window.PTTMessage.create() };
                break;
            case 'sticker':
                message = { id: messageId, ...window.StickerMessage.create() };
                break;
            case 'contact':
                message = { id: messageId, ...window.ContactMessage.create() };
                break;
            case 'button':
                message = { id: messageId, ...window.ButtonMessage.create() };
                break;
            case 'poll':
                message = { id: messageId, ...window.PollMessage.create() };
                break;
            default:
                throw new Error(`Tipo de mensagem '${type}' não suportado`);
        }
        this.messages.set(messageId, message);
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
                    <span class="text-sm text-gray-500">Mensagem ${this.messages.size}</span>
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

        // Conectar eventos de upload/caption para tipos de mídia
        if (message.type === 'image' && window.ImageMessage.connectEvents) {
            window.ImageMessage.connectEvents(
                message,
                (fileInput) => this.handleFileUpload(message.id, fileInput, 'image'),
                (value) => this.updateMessageContent(message.id, 'caption', value)
            );
        }
        if (message.type === 'video' && window.VideoMessage.connectEvents) {
            window.VideoMessage.connectEvents(
                message,
                (fileInput) => this.handleFileUpload(message.id, fileInput, 'video'),
                (value) => this.updateMessageContent(message.id, 'caption', value)
            );
        }
        if (message.type === 'document' && window.DocumentMessage.connectEvents) {
            window.DocumentMessage.connectEvents(
                message,
                (fileInput) => this.handleFileUpload(message.id, fileInput, 'document'),
                (value) => this.updateMessageContent(message.id, 'caption', value)
            );
        }
        if (message.type === 'ptt' && window.PTTMessage.connectEvents) {
            window.PTTMessage.connectEvents(
                message,
                (fileInput) => this.handleFileUpload(message.id, fileInput, 'ptt'),
                (value) => this.updateMessageContent(message.id, 'caption', value)
            );
        }
    }

    getMessageForm(message) {
        // Delegar para o módulo correto
        switch (message.type) {
            case 'text':
                return window.TextMessage.renderForm(
                    message,
                    `updateMessageContent('${message.id}', 'content', this.value)`
                );
            case 'image':
                return window.ImageMessage.renderForm(message);
            case 'video':
                return window.VideoMessage.renderForm(message);
            case 'document':
                return window.DocumentMessage.renderForm(message);
            case 'ptt':
                return window.PTTMessage.renderForm(message);
            case 'sticker':
                return window.StickerMessage.renderForm(
                    message,
                    `handleFileUpload('${message.id}', this, 'sticker')`,
                    `updateMessageContent('${message.id}', 'caption', this.value)`
                );
            case 'contact':
                return window.ContactMessage.renderForm(
                    message,
                    `updateMessageContent('${message.id}', 'fullName', this.value)`,
                    `updateMessageContent('${message.id}', 'phoneNumber', this.value)`
                );
            case 'button':
                return window.ButtonMessage.renderForm(
                    message,
                    `updateMessageContent('${message.id}', 'text', this.value)`,
                    `updateMessageContent('${message.id}', 'footerText', this.value)`
                );
            case 'poll':
                return window.PollMessage.renderForm(
                    message,
                    `updateMessageContent('${message.id}', 'text', this.value)`,
                    `updateMessageContent('${message.id}', 'selectableCount', this.value)`
                );
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
            poll: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
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
            poll: 'Enquete'
        };
        return labels[type] || 'Desconhecido';
    }

    updateMessageContent(messageId, field, value) {
        const message = this.messages.get(messageId);
        if (message) {
            message[field] = value;
        }
    }

    async handleFileUpload(messageId, input, type) {
        const file = input.files[0];
        if (!file) return;

        const message = this.messages.get(messageId);
        if (!message) return;

        // Validar tamanho do arquivo
        const maxSize = 16 * 1024 * 1024; // 16MB
        if (file.size > maxSize) {
            alert('Arquivo muito grande. Tamanho máximo: 16MB');
            input.value = '';
            return;
        }

        const messageElement = document.getElementById(`message-${message.id}`);
        if (!messageElement) return;

        const uploadAreaContainer = messageElement.querySelector('.border-2.border-dashed');
        
        if (uploadAreaContainer) {
             uploadAreaContainer.innerHTML = `
                <div class="flex items-center justify-center space-x-3 p-4">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <div class="text-left">
                        <p class="text-sm font-medium text-gray-900 dark:text-white">Enviando ${file.name}...</p>
                        <p class="text-xs text-gray-500">Aguarde...</p>
                    </div>
                </div>
            `;
        }

        try {
            const url = await window.apiService.uploadFile(file);

            message.file = null;
            message.fileName = file.name;
            message.fileSize = file.size;
            message.fileUrl = url; // Store the URL returned by the API

            this.showFilePreview(messageId, file);

        } catch (error) {
            console.error('Erro no upload:', error);
            alert(`Falha no upload do arquivo ${file.name}: ${error.message}`);
            
            if (uploadAreaContainer) {
                 const originalUploadArea = `
                    <input type="file" class="hidden" accept="${input.accept}" onchange="handleFileUpload('${message.id}', '${type}', this)">
                    <div class="file-upload-area cursor-pointer" onclick="this.previousElementSibling.click()">
                        <svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                        <p class="text-sm text-gray-500 text-red-500">Falha no envio. Clique para tentar novamente.</p>
                    </div>
                `;
                uploadAreaContainer.innerHTML = originalUploadArea;
            }
        }
    }

    showFilePreview(messageId, file) {
        const messageElement = document.getElementById(`message-${messageId}`);
        if (!messageElement) return;

        const uploadAreaContainer = messageElement.querySelector('.border-2.border-dashed');
        if (!uploadAreaContainer) return;

        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        
        uploadAreaContainer.className = uploadAreaContainer.className.replace('border-dashed', '');
        uploadAreaContainer.innerHTML = `
            <div class="flex items-center justify-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20">
                <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div class="text-left">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate" title="${file.name}">${file.name}</p>
                    <p class="text-xs text-gray-500">${fileSize} MB - Carregado!</p>
                </div>
            </div>
        `;
    }

    deleteMessage(messageId) {
        this.messages.delete(messageId);
        
        const messageElement = document.getElementById(`message-${messageId}`);
        if (messageElement) {
            messageElement.remove();
        }
        
        this.updateMessageCount();
        
        // Se não há mais mensagens, mostrar mensagem de "nenhuma mensagem"
        if (this.messages.size === 0) {
            this.showEmptyMessage();
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
        const count = this.messages.size;
    }

    getMessages() {
        return Array.from(this.messages.values()).map(message => {
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
                    baseMessage.type = message.type;
                    baseMessage.text = message.text;
                    baseMessage.footerText = message.footerText;
                    baseMessage.choices = message.choices ? message.choices.split('\n').filter(choice => choice.trim()) : [];
                    break;
                case 'poll':
                    baseMessage.type = message.type;
                    baseMessage.text = message.text;
                    baseMessage.footerText = message.footerText;
                    baseMessage.choices = message.choices ? message.choices.split('\n').filter(choice => choice.trim()) : [];
                    // Converter selectableCount para inteiro
                    baseMessage.selectableCount = parseInt(message.selectableCount) || 1;
                    break;
            }

            return baseMessage;
        });
    }

    buildAdvancedPayload(message) {
        const basePayload = {
            number: message.number
        };

        switch (message.type) {
            case 'text':
                return {
                    ...basePayload,
                    type: 'text',
                    text: message.content
                };

            case 'image':
                return {
                    ...basePayload,
                    type: 'image',
                    file: message.fileUrl,
                    text: message.caption
                };

            case 'video':
                return {
                    ...basePayload,
                    type: 'video',
                    file: message.fileUrl,
                    text: message.caption
                };

            case 'document':
                return {
                    ...basePayload,
                    type: 'document',
                    file: message.fileUrl,
                    text: message.caption,
                    docName: message.fileName
                };

            case 'ptt':
                return {
                    ...basePayload,
                    type: 'ptt',
                    file: message.fileUrl,
                    text: message.caption
                };

            case 'sticker':
                return {
                    ...basePayload,
                    type: 'sticker',
                    file: message.fileUrl
                };

            case 'contact':
                return {
                    ...basePayload,
                    type: 'contact',
                    fullName: message.fullName,
                    phoneNumber: message.phoneNumber
                };

            case 'button':
                return {
                    ...basePayload,
                    type: 'button',
                    text: message.text,
                    footerText: message.footerText,
                    choices: message.buttons.map(btn => btn.text)
                };

            case 'poll':
                return {
                    ...basePayload,
                    type: 'poll',
                    text: message.text,
                    selectableCount: parseInt(message.selectableCount) || 1,
                    choices: message.options.map(opt => opt.text)
                };

            default:
                return basePayload;
        }
    }

    getMessage(messageId) {
        const message = this.messages.get(messageId);
        if (!message) {
            throw new Error(`Mensagem com ID '${messageId}' não encontrada`);
        }
        return message;
    }

    getAllMessages() {
        return Array.from(this.messages.values());
    }

    clearMessages() {
        this.messages.clear();
        this.messageIdCounter = 0;
    }
}

// Exportar para uso global
window.messageService = new MessageService();

// Função global para atualizar conteúdo da mensagem
function updateMessageContent(messageId, field, value) {
    if (window.messageService) {
        window.messageService.updateMessageContent(messageId, field, value);
    } else {
        console.error('MessageService não está disponível');
    }
}

// Função global para deletar mensagem
function deleteMessage(messageId) {
    if (window.messageService) {
        window.messageService.deleteMessage(messageId);
    } else {
        console.error('MessageService não está disponível');
    }
}

// Função global para upload de arquivo
function handleFileUpload(messageId, input, type) {
    if (window.messageService) {
        window.messageService.handleFileUpload(messageId, input, type);
    } else {
        console.error('MessageService não está disponível');
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