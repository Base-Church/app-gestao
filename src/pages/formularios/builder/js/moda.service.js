// Variáveis globais
let cropper = null;
let currentFile = null;

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    initConfigModal();
});

// Função para inicializar o modal de configuração
function initConfigModal() {
    // Eventos das tabs
    document.querySelectorAll('.config-tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            switchTab(tabName);
        });
    });
    
    // Eventos dos botões do modal
    document.getElementById('close-config').addEventListener('click', closeConfigModal);
    document.getElementById('cancel-config-btn').addEventListener('click', closeConfigModal);
    document.getElementById('save-config-btn').addEventListener('click', saveFormConfig);
    
    // Eventos de upload de imagem
    document.getElementById('form-image-upload').addEventListener('change', handleImageSelect);
    document.getElementById('remove-image').addEventListener('click', removeImage);
    
    // Sincronizar cor
    document.getElementById('form-cor-active').addEventListener('change', function() {
        document.getElementById('form-cor-active-text').value = this.value;
    });
    
    document.getElementById('form-cor-active-text').addEventListener('input', function() {
        if (/^#[0-9A-F]{6}$/i.test(this.value)) {
            document.getElementById('form-cor-active').value = this.value;
        }
    });
    
    // Sincronizar cor do fundo
    document.getElementById('form-cor-bc').addEventListener('change', function() {
        document.getElementById('form-cor-bc-text').value = this.value;
    });
    
    document.getElementById('form-cor-bc-text').addEventListener('input', function() {
        if (/^#[0-9A-F]{6}$/i.test(this.value)) {
            document.getElementById('form-cor-bc').value = this.value;
        }
    });
    
    // Eventos da área de crop
    document.getElementById('cancel-crop-btn').addEventListener('click', closeCropArea);
    document.getElementById('apply-crop-btn').addEventListener('click', applyCrop);
}

// Função para alternar entre tabs
function switchTab(tabName) {
    // Remover classe active de todos os botões
    document.querySelectorAll('.config-tab-btn').forEach(btn => {
        btn.classList.remove('active', 'border-primary-500', 'text-primary-600', 'dark:text-primary-400');
        btn.classList.add('border-transparent', 'text-gray-500', 'dark:text-gray-400');
    });
    
    // Adicionar classe active ao botão clicado
    const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
    activeBtn.classList.add('active', 'border-primary-500', 'text-primary-600', 'dark:text-primary-400');
    activeBtn.classList.remove('border-transparent', 'text-gray-500', 'dark:text-gray-400');
    
    // Esconder todos os conteúdos
    document.querySelectorAll('.config-tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    // Mostrar conteúdo da tab ativa
    document.getElementById(`tab-${tabName}`).classList.remove('hidden');
}

// Função para abrir o modal de configuração
function openConfigModal(formData = null) {
    // Popular campos se dados forem fornecidos
    if (formData) {
        populateFormFields(formData);
    }
    document.getElementById('config-modal').classList.remove('hidden');
}

// Função para popular os campos do modal com dados do formulário
function populateFormFields(data) {
    if (data.slug) {
        const slugField = document.getElementById('form-slug');
        if (slugField) slugField.value = data.slug;
    }
    if (data.descricao) {
        const descricaoField = document.getElementById('form-descricao');
        if (descricaoField) descricaoField.value = data.descricao;
    }
    if (data.redirect_url) {
        const redirectField = document.getElementById('form-redirect-url');
        if (redirectField) redirectField.value = data.redirect_url;
    }
    if (data.cor_active) {
        const corField = document.getElementById('form-cor-active');
        const corTextField = document.getElementById('form-cor-active-text');
        if (corField) corField.value = data.cor_active;
        if (corTextField) corTextField.value = data.cor_active;
    }
    if (data.cor_bc) {
        const corBcField = document.getElementById('form-cor-bc');
        const corBcTextField = document.getElementById('form-cor-bc-text');
        if (corBcField) corBcField.value = data.cor_bc;
        if (corBcTextField) corBcTextField.value = data.cor_bc;
    }
    if (data.modo) {
        const modoField = document.getElementById('form-modo');
        if (modoField) modoField.value = data.modo;
    }
    if (data.img_url) {
        const imgField = document.getElementById('form-img-url');
        if (imgField) imgField.value = data.img_url;
        showImagePreview(data.img_url);
    }
}

// Função para mostrar preview da imagem
function showImagePreview(imageUrl) {
    const previewImg = document.getElementById('preview-img');
    const imagePreview = document.getElementById('image-preview');
    const uploadArea = document.getElementById('upload-area');
    
    previewImg.src = imageUrl;
    imagePreview.classList.remove('hidden');
    uploadArea.classList.add('hidden');
}

// Função para fechar o modal de configuração
function closeConfigModal() {
    document.getElementById('config-modal').classList.add('hidden');
}

// Função para lidar com seleção de imagem
function handleImageSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
        if (window.formBuilder && window.formBuilder.showNotification) {
            window.formBuilder.showNotification('Por favor, selecione apenas arquivos de imagem.', 'error');
        } else {
            alert('Por favor, selecione apenas arquivos de imagem.');
        }
        return;
    }
    
    // Validar tamanho (10MB)
    if (file.size > 10 * 1024 * 1024) {
        if (window.formBuilder && window.formBuilder.showNotification) {
            window.formBuilder.showNotification('A imagem deve ter no máximo 10MB.', 'error');
        } else {
            alert('A imagem deve ter no máximo 10MB.');
        }
        return;
    }
    
    currentFile = file;
    
    // Mostrar área de crop
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('crop-image').src = e.target.result;
        showCropArea();
    };
    reader.readAsDataURL(file);
}

// Função para mostrar a área de crop
function showCropArea() {
    const uploadArea = document.getElementById('upload-area');
    const cropArea = document.getElementById('crop-area');
    const imagePreview = document.getElementById('image-preview');
    
    uploadArea.classList.add('hidden');
    imagePreview.classList.add('hidden');
    cropArea.classList.remove('hidden');
    
    // Inicializar cropper
    const image = document.getElementById('crop-image');
    if (cropper) {
        cropper.destroy();
    }
    
    cropper = new Cropper(image, {
        aspectRatio: 650 / 270, // Proporção recomendada
        viewMode: 1,
        autoCropArea: 1,
        responsive: true,
        background: false
    });
}

// Função para fechar a área de crop
function closeCropArea() {
    const uploadArea = document.getElementById('upload-area');
    const cropArea = document.getElementById('crop-area');
    
    cropArea.classList.add('hidden');
    uploadArea.classList.remove('hidden');
    
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
    
    // Limpar input de arquivo
    document.getElementById('form-image-upload').value = '';
    currentFile = null;
}

// Função para aplicar o crop
function applyCrop() {
    if (!cropper) return;
    
    // Obter dados do crop
    const canvas = cropper.getCroppedCanvas({
        width: 650,
        height: 270,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
    });
    
    // Converter para blob e fazer upload
    canvas.toBlob(function(blob) {
        const formData = new FormData();
        formData.append('form_image', blob, currentFile.name);
        formData.append('upload_type', 'form_image');
        formData.append('upload_path', 'assets/img/forms/');
        formData.append('file_prefix', 'form_');
        formData.append('allowed_types', 'jpg,jpeg,png,gif');
        formData.append('max_size', '10485760'); 
        
        uploadImage(formData);
    }, 'image/jpeg', 0.9);
}

// Função para fazer upload da imagem
function uploadImage(formData) {
    // Adicionar parâmetros de configuração do upload
    formData.append('upload_type', 'form_image');
    formData.append('upload_path', 'assets/img/forms');
    formData.append('file_prefix', 'form');
    formData.append('allowed_types', 'image/jpeg,image/png,image/gif,image/webp');
    formData.append('max_size', '10485760');
    
    // Usar o serviço global de upload
    const uploadUrl = `${window.URL_BASE || ''}/config/upload.service.php`;
    
    fetch(uploadUrl, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Salvar URL da imagem
            document.getElementById('form-img-url').value = data.url;
            
            // Mostrar preview
            showImagePreview(data.url);
            
            // Fechar área de crop
            closeCropArea();
            
            if (window.formBuilder && window.formBuilder.showNotification) {
                window.formBuilder.showNotification('Imagem enviada com sucesso!', 'success');
            } else {
                alert('Imagem enviada com sucesso!');
            }
        } else {
            if (window.formBuilder && window.formBuilder.showNotification) {
                window.formBuilder.showNotification('Erro ao fazer upload: ' + data.error, 'error');
            } else {
                alert('Erro ao fazer upload: ' + data.error);
            }
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        if (window.formBuilder && window.formBuilder.showNotification) {
            window.formBuilder.showNotification('Erro ao fazer upload da imagem.', 'error');
        } else {
            alert('Erro ao fazer upload da imagem.');
        }
    });
}

// Função para remover imagem
function removeImage() {
    const imagePreview = document.getElementById('image-preview');
    const uploadArea = document.getElementById('upload-area');
    const cropArea = document.getElementById('crop-area');
    
    document.getElementById('form-img-url').value = '';
    document.getElementById('preview-img').src = '';
    
    imagePreview.classList.add('hidden');
    cropArea.classList.add('hidden');
    uploadArea.classList.remove('hidden');
    
    // Limpar cropper se existir
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
    
    // Limpar input de arquivo
    document.getElementById('form-image-upload').value = '';
    currentFile = null;
}

// Função para abrir modal com dados do formulário atual
async function openConfigModalWithData() {
    // Adicionar loading no botão de configurações
    const configBtn = document.getElementById('config-form-btn');
    let originalText = '';
    
    if (configBtn) {
        originalText = configBtn.innerHTML;
        configBtn.innerHTML = '<svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-700 dark:text-gray-300 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Carregando...';
        configBtn.disabled = true;
    }

    let formData = null;
    
    try {
        // Se estiver em modo de edição, buscar dados da API
        if (window.currentFormularioId) {
            const response = await window.formulariosAPI.getFormularioById(window.currentFormularioId);
            if (response.code === 200 && response.data) {
                formData = {
                    slug: response.data.slug || '',
                    descricao: response.data.descricao || '',
                    redirect_url: response.data.redirect_url || '',
                    cor_active: response.data.cor_active || '#3B82F6',
                    cor_bc: response.data.cor_bc || '#ffffff',
                    modo: response.data.modo || 'list',
                    img_url: response.data.img_url || ''
                };
            }
        }
    } catch (error) {
        console.error('Erro ao buscar dados do formulário:', error);
    } finally {
        // Restaurar botão
        if (configBtn) {
            configBtn.innerHTML = originalText;
            configBtn.disabled = false;
        }
    }
    
    openConfigModal(formData);
}

// Função para salvar configurações do formulário
async function saveFormConfig() {
    // Adicionar loading no botão
    const saveBtn = document.getElementById('save-config-btn');
    if (!saveBtn) {
        console.error('Botão de salvar não encontrado');
        return;
    }
    
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Salvando...';
    saveBtn.disabled = true;

    const formData = {
        nome: document.getElementById('form-title-input')?.value || '',
        slug: document.getElementById('form-slug')?.value || '',
        descricao: document.getElementById('form-descricao')?.value || '',
        redirect_url: document.getElementById('form-redirect-url')?.value || '',
        cor_active: document.getElementById('form-cor-active')?.value || '#7c00c4ff',
        cor_bc: document.getElementById('form-cor-bc')?.value || '#ffffff',
        img_url: document.getElementById('preview-img')?.src || '',
        processo_etapa_id: document.getElementById('processo-etapa-select')?.value || '',
        modo: document.getElementById('form-modo')?.value || 'list',
        dados: window.formBuilder.getFormJson()
    };
    
    // Verificar se é edição ou criação e fazer a requisição real
    setTimeout(async () => {
        try {
            // Verificar se é edição ou criação
            const urlParams = new URLSearchParams(window.location.search);
            const formularioId = urlParams.get('id');

            if (!formularioId) {
                // Se não tem ID, apenas fechar o modal sem salvar
                if (window.formBuilder && window.formBuilder.showNotification) {
                    window.formBuilder.showNotification('Configurações aplicadas! Use o botão "Salvar" para salvar o formulário.', 'info');
                }
                closeConfigModal();
                return;
            }

            // Preparar dados para atualização
            const ministerioId = window.formulariosAPI.getMinisterioId();
            const processoEtapaInput = document.getElementById('processo-etapa-select');
            const processoEtapaValue = processoEtapaInput ? processoEtapaInput.value.trim() : '';
            const processoEtapaIds = processoEtapaValue ? processoEtapaValue.split(',').filter(id => id.trim()).map(id => parseInt(id.trim())) : [];

            const updateData = {
                id: formularioId,
                nome: document.getElementById('form-title-input')?.value || 'Formulário Personalizado',
                slug: document.getElementById('form-slug')?.value || null,
                descricao: document.getElementById('form-descricao')?.value || null,
                redirect_url: document.getElementById('form-redirect-url')?.value || null,
                cor_active: document.getElementById('form-cor-active')?.value || null,
                cor_bc: document.getElementById('form-cor-bc')?.value || null,
                img_url: document.getElementById('form-img-url')?.value ? document.getElementById('form-img-url')?.value.split('/').pop() : null,
                processo_etapa_id: processoEtapaIds.length > 0 ? processoEtapaIds[0] : null,
                modo: document.getElementById('form-modo')?.value || 'list',
                ministerio_id: ministerioId,
                dados: JSON.stringify({
                    elements: window.formBuilder ? window.formBuilder.formElements.map(element => {
                        const properties = { ...element.props };
                        // Substituir helpText por placeholder no JSON final
                        if (properties.helpText !== undefined) {
                            properties.placeholder = properties.helpText;
                            delete properties.helpText;
                        }
                        // Garante que options de radio/select/checkbox são [{id,label}]
                        if (["radio","select","checkbox"].includes(element.type) && Array.isArray(properties.options)) {
                            properties.options = properties.options.map(opt =>
                                typeof opt === 'object' && opt !== null && 'id' in opt && 'label' in opt
                                    ? opt
                                    : { id: 'op' + Math.random().toString(36).substr(2, 6), label: String(opt) }
                            );
                        }
                        
                        // Inclui allowOther se definido para elementos de seleção
                        if (["radio","select","checkbox"].includes(element.type) && element.props.allowOther !== undefined) {
                            properties.allowOther = element.props.allowOther;
                        }
                        
                        return {
                            id: element.id,
                            type: element.type,
                            properties: properties
                        };
                    }) : []
                })
            };

            // Fazer a requisição de atualização
            const result = await window.formulariosAPI.updateFormulario(formularioId, updateData);
            
            if (result && result.code === 200) {
                // Configurações salvas com sucesso
                closeConfigModal();
                
                if (window.formBuilder && window.formBuilder.showNotification) {
                    window.formBuilder.showNotification('Configurações salvas com sucesso!', 'success');
                }
            } else {
                throw new Error(result?.message || 'Erro ao salvar configurações');
            }

        } catch (error) {
            console.error('Erro ao salvar configurações:', error);
            if (window.formBuilder && window.formBuilder.showNotification) {
                window.formBuilder.showNotification('Erro ao salvar configurações: ' + error.message, 'error');
            }
        } finally {
            // Restaurar botão
            if (saveBtn) {
                saveBtn.innerHTML = originalText;
                saveBtn.disabled = false;
            }
        }
    }, 100);
}

// Expor função para uso externo
window.openConfigModal = openConfigModal;
window.openConfigModalWithData = openConfigModalWithData;