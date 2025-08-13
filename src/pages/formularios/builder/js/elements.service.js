// Definições dos elementos disponíveis no construtor de formulários
class FormElements {
    constructor() {
        this.elementTypes = {
            text: {
                type: 'text',
                label: 'Campo de Texto',
                icon: 'text',
                defaultProps: {
                    label: 'Campo de Texto',
                    placeholder: 'Digite aqui...',
                    required: false,
                    helpText: ''
                },
                template: (props, id) => `
                    <div class="mb-2">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            ${props.label}
                            ${props.required ? '<span class="text-red-500">*</span>' : ''}
                        </label>
                        <input type="text" 
                               name="${id}"
                               class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                               placeholder="${props.placeholder}"
                               ${props.required ? 'required' : ''}>
                        ${props.helpText ? `<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">${props.helpText}</p>` : ''}
                    </div>
                `
            },
            
            number: {
                type: 'number',
                label: 'Campo Numérico',
                icon: 'number',
                defaultProps: {
                    label: 'Campo Numérico',
                    placeholder: '0',
                    required: false,
                    helpText: ''
                },
                template: (props, id) => `
                    <div class="mb-2">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            ${props.label}
                            ${props.required ? '<span class="text-red-500">*</span>' : ''}
                        </label>
                        <input type="number" 
                               name="${id}"
                               class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                               placeholder="${props.placeholder}"
                               ${props.required ? 'required' : ''}>
                        ${props.helpText ? `<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">${props.helpText}</p>` : ''}
                    </div>
                `
            },
            
            email: {
                type: 'email',
                label: 'Campo de Email',
                icon: 'email',
                defaultProps: {
                    label: 'Email',
                    placeholder: 'exemplo@email.com',
                    required: false,
                    helpText: ''
                },
                template: (props, id) => `
                    <div class="mb-2">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            ${props.label}
                            ${props.required ? '<span class="text-red-500">*</span>' : ''}
                        </label>
                        <input type="email" 
                               name="${id}"
                               class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                               placeholder="${props.placeholder}"
                               ${props.required ? 'required' : ''}>
                        ${props.helpText ? `<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">${props.helpText}</p>` : ''}
                    </div>
                `
            },
            
            radio: {
                type: 'radio',
                label: 'Botão de Rádio',
                icon: 'radio',
                defaultProps: {
                    label: 'Escolha uma opção',
                    required: false,
                    options: Array.from({length: 3}).map((_, i) => ({
                        id: 'opt_' + Math.random().toString(36).substr(2, 9),
                        label: `Opção ${i + 1}`
                    })),
                    helpText: ''
                },
                template: (props, id) => `
                    <div class="mb-2">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            ${props.label}
                            ${props.required ? '<span class="text-red-500">*</span>' : ''}
                        </label>
                        <div class="space-y-2">
                            ${(props.options && Array.isArray(props.options) ? props.options : []).map((option, index) => `
                                <div class="flex items-center">
                                    <input type="radio" 
                                           id="${id}_option_${index}" 
                                           name="${id}" 
                                           value="${option.id || option.value || ''}"
                                           class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600">
                                    <label for="${id}_option_${index}" class="ml-2 text-sm text-gray-700 dark:text-gray-300">${option.label || option.text || 'Opção'}</label>
                                </div>
                            `).join('')}
                        </div>
                        ${props.helpText ? `<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">${props.helpText}</p>` : ''}
                    </div>
                `
            },
            
            select: {
                type: 'select',
                label: 'Lista Suspensa',
                icon: 'select',
                defaultProps: {
                    label: 'Selecione uma opção',
                    required: false,
                    options: Array.from({length: 3}).map((_, i) => ({
                        id: 'opt_' + Math.random().toString(36).substr(2, 9),
                        label: `Opção ${i + 1}`
                    })),
                    placeholder: 'Escolha...',
                    helpText: ''
                },
                template: (props, id) => `
                    <div class="mb-2">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            ${props.label}
                            ${props.required ? '<span class="text-red-500">*</span>' : ''}
                        </label>
                        <select name="${id}"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                                ${props.required ? 'required' : ''}>
                            <option value="">${props.placeholder}</option>
                            ${(props.options && Array.isArray(props.options) ? props.options : []).map(option => `<option value="${option.id || option.value || ''}">${option.label || option.text || 'Opção'}</option>`).join('')}
                        </select>
                        ${props.helpText ? `<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">${props.helpText}</p>` : ''}
                    </div>
                `
            },
            
            checkbox: {
                type: 'checkbox',
                label: 'Caixa de Seleção',
                icon: 'checkbox',
                defaultProps: {
                    label: 'Marque as opções',
                    required: false,
                    options: Array.from({length: 3}).map((_, i) => ({
                        id: 'opt_' + Math.random().toString(36).substr(2, 9),
                        label: `Opção ${i + 1}`
                    })),
                    helpText: ''
                },
                template: (props, id) => `
                    <div class="mb-2">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            ${props.label}
                            ${props.required ? '<span class="text-red-500">*</span>' : ''}
                        </label>
                        <div class="space-y-2">
                            ${(props.options && Array.isArray(props.options) ? props.options : []).map((option, index) => `
                                <div class="flex items-center">
                                    <input type="checkbox" 
                                           id="${id}_option_${index}" 
                                           name="${id}[]" 
                                           value="${option.id || option.value || ''}"
                                           class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded">
                                    <label for="${id}_option_${index}" class="ml-2 text-sm text-gray-700 dark:text-gray-300">${option.label || option.text || 'Opção'}</label>
                                </div>
                            `).join('')}
                        </div>
                        ${props.helpText ? `<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">${props.helpText}</p>` : ''}
                    </div>
                `
            },
            
            title: {
                type: 'title',
                label: 'Título',
                icon: 'title',
                defaultProps: {
                    text: 'Título do Formulário',
                    description: '',
                    alignment: 'left'
                },
                template: (props, id) => `
                    <div class="mb-2">
                        <h2 class="font-bold text-gray-900 dark:text-white text-${props.alignment}">${props.text}</h2>
                        ${props.description ? `<p class="text-sm text-gray-600 dark:text-gray-400 mt-1 text-${props.alignment}">${props.description}</p>` : ''}
                    </div>
                `
            },
            
            description: {
                type: 'description',
                label: 'Descrição',
                icon: 'description',
                defaultProps: {
                    text: 'Descrição ou instruções para o formulário.',
                    alignment: 'left'
                },
                template: (props, id) => `
                    <div class="mb-2">
                        <p class="text-gray-700 dark:text-gray-300 text-${props.alignment}">${props.text}</p>
                    </div>
                `
            },
            
            separator: {
                type: 'separator',
                label: 'Separador',
                icon: 'separator',
                defaultProps: {
                    style: 'solid',
                    thickness: '1',
                    color: 'gray'
                },
                template: (props, id) => `
                    <div class="mb-4">
                        <hr class="border-${props.color}-300 dark:border-${props.color}-600" style="border-style: ${props.style}; border-width: ${props.thickness}px;">
                    </div>
                `
            },
            
            cpf: {
                type: 'cpf',
                label: 'CPF',
                icon: 'cpf',
                defaultProps: {
                    label: 'CPF',
                    placeholder: '000.000.000-00',
                    required: false,
                    helpText: ''
                },
                template: (props, id) => `
                    <div class="mb-2">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            ${props.label}
                            ${props.required ? '<span class="text-red-500">*</span>' : ''}
                        </label>
                        <input type="text" 
                               name="${id}"
                               class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                               placeholder="${props.placeholder}"
                               maxlength="14"
                               pattern="[0-9]{3}\\.[0-9]{3}\\.[0-9]{3}-[0-9]{2}"
                               ${props.required ? 'required' : ''}>
                        ${props.helpText ? `<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">${props.helpText}</p>` : ''}
                    </div>
                `
            },
            
            birthdate: {
                type: 'birthdate',
                label: 'Data de Nascimento',
                icon: 'birthdate',
                defaultProps: {
                    label: 'Data de Nascimento',
                    required: false,
                    helpText: ''
                },
                template: (props, id) => `
                    <div class="mb-2">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            ${props.label}
                            ${props.required ? '<span class="text-red-500">*</span>' : ''}
                        </label>
                        <input type="date" 
                               name="${id}"
                               class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                               ${props.required ? 'required' : ''}>
                        ${props.helpText ? `<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">${props.helpText}</p>` : ''}
                    </div>
                `
            },
            
            datetime: {
                type: 'datetime',
                label: 'Data e Hora',
                icon: 'datetime',
                defaultProps: {
                    label: 'Data e Hora',
                    dateType: 'datetime-local',
                    required: false,
                    helpText: ''
                },
                template: (props, id) => `
                    <div class="mb-2">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            ${props.label}
                            ${props.required ? '<span class="text-red-500">*</span>' : ''}
                        </label>
                        <input type="${props.dateType}" 
                               name="${id}"
                               class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                               ${props.required ? 'required' : ''}>
                        ${props.helpText ? `<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">${props.helpText}</p>` : ''}
                    </div>
                `
            },
            
            nome: {
                type: 'nome',
                label: 'Nome Completo',
                icon: 'nome',
                defaultProps: {
                    label: 'Nome Completo',
                    placeholder: 'Digite seu nome completo',
                    required: false,
                    helpText: ''
                },
                template: (props, id) => `
                    <div class="mb-2">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            ${props.label}
                            ${props.required ? '<span class="text-red-500">*</span>' : ''}
                        </label>
                        <input type="text" 
                               name="${id}"
                               class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                               placeholder="${props.placeholder}"
                               minlength="2"
                               maxlength="100"
                               pattern="[A-Za-zÀ-ÿ\\s]+$"
                               title="Digite apenas letras e espaços"
                               ${props.required ? 'required' : ''}>
                        ${props.helpText ? `<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">${props.helpText}</p>` : ''}
                    </div>
                `
            },
            
            whatsapp: {
                type: 'whatsapp',
                label: 'WhatsApp',
                icon: 'whatsapp',
                defaultProps: {
                    label: 'WhatsApp',
                    placeholder: '(00) 00000-0000',
                    required: false,
                    helpText: ''
                },
                template: (props, id) => `
                    <div class="mb-2">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            ${props.label}
                            ${props.required ? '<span class="text-red-500">*</span>' : ''}
                        </label>
                        <input type="tel" 
                               name="${id}"
                               class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                               placeholder="${props.placeholder}"
                               maxlength="15"
                               pattern="\\([0-9]{2}\\)\\s[0-9]{4,5}-[0-9]{4}"
                               title="Digite no formato (00) 00000-0000"
                               ${props.required ? 'required' : ''}>
                        ${props.helpText ? `<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">${props.helpText}</p>` : ''}
                    </div>
                `
            }
        };
    }

    // Retorna a definição de um tipo de elemento
    getElementType(type) {
        return this.elementTypes[type] || null;
    }

    // Retorna todos os tipos de elementos disponíveis
    getAllElementTypes() {
        return this.elementTypes;
    }

    // Retorna os tipos de elementos para a sidebar
    getElementTypes() {
        return Object.values(this.elementTypes).map(element => ({
            type: element.type,
            label: element.label,
            icon: this.getElementIcon(element.type),
            description: this.getElementDescription(element.type)
        }));
    }

    // Retorna o ícone do elemento
    getElementIcon(type) {
        const icons = {
            text: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/></svg>',
            number: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/></svg>',
            email: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/></svg>',
            radio: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
            select: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/></svg>',
            checkbox: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
            title: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2"/></svg>',
            description: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
            separator: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/></svg>',
            cpf: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
            birthdate: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',
            datetime: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
            nome: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>',
            whatsapp: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>'
        };
        return icons[type] || icons.text;
    }

    // Retorna a descrição do elemento
    getElementDescription(type) {
        const descriptions = {
            text: 'Campo de entrada de texto',
            number: 'Campo numérico',
            email: 'Campo de email',
            radio: 'Opções de escolha única',
            select: 'Lista suspensa',
            checkbox: 'Opções de múltipla escolha',
            title: 'Título ou cabeçalho',
            description: 'Texto descritivo',
            separator: 'Linha divisória',
            cpf: 'Campo para CPF',
            birthdate: 'Campo de data de nascimento',
            datetime: 'Campo de data e/ou hora',
            nome: 'Campo para nome completo',
            whatsapp: 'Campo para número do WhatsApp'
        };
        return descriptions[type] || 'Elemento de formulário';
    }


}

// Exporta a classe globalmente
window.FormElements = FormElements;