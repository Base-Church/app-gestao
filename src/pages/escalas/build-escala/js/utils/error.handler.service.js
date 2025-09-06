/**
 * Serviço para tratamento de erros da API
 */
class ErrorHandlerService {
    /**
     * Extrai a mensagem de erro da resposta da API
     * @param {Error|string|Object} error - Erro da API
     * @returns {string} - Mensagem formatada para o usuário
     */
    static extractErrorMessage(error) {
        try {
            // Se for string, tentar fazer parse do JSON
            if (typeof error === 'string') {
                // Verificar se contém JSON no final da string
                const jsonMatch = error.match(/\{.*\}$/);
                if (jsonMatch) {
                    const jsonPart = jsonMatch[0];
                    const parsedError = JSON.parse(jsonPart);
                    return this.formatErrorMessage(parsedError);
                }
                return error;
            }

            // Se for objeto de erro
            if (error && typeof error === 'object') {
                // Se tem message, usar ela
                if (error.message) {
                    // Verificar se a message contém JSON
                    const jsonMatch = error.message.match(/\{.*\}$/);
                    if (jsonMatch) {
                        const jsonPart = jsonMatch[0];
                        const parsedError = JSON.parse(jsonPart);
                        return this.formatErrorMessage(parsedError);
                    }
                    return error.message;
                }
                
                // Se é resposta direta da API
                if (error.code && error.message) {
                    return this.formatErrorMessage(error);
                }
            }

            return 'Erro inesperado';
        } catch (parseError) {
            // Se falhar o parse, retornar mensagem original
            return error?.message || error || 'Erro inesperado';
        }
    }

    /**
     * Formatar mensagens de erro específicas
     * @param {Object} errorData - Dados do erro parseados
     * @returns {string} - Mensagem formatada
     */
    static formatErrorMessage(errorData) {
        // Retornar apenas a mensagem principal, sem detalhes dos campos
        return errorData.message || 'Erro inesperado';
    }

    /**
     * Exibe erro em modal elegante
     * @param {Error|string|Object} error - Erro da API
     * @param {string} titulo - Título do modal (opcional)
     */
    static showErrorModal(error, titulo = 'Erro') {
        const errorMessage = this.extractErrorMessage(error);
        
        // Remove modal anterior se existir
        document.getElementById('error-modal')?.remove();
        
        // Criar modal
        const modalDiv = document.createElement('div');
        modalDiv.id = 'error-modal';
        modalDiv.className = 'fixed inset-0 z-[5000] flex items-center justify-center bg-black/50 backdrop-blur-sm';
        
        modalDiv.innerHTML = `
            <div class="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4 p-6 animate-fade-in">
                <div class="flex items-center gap-3 mb-4">
                    <div class="flex items-center justify-center h-10 w-10 rounded-full bg-red-100 dark:bg-red-900">
                        <svg class="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${titulo}</h3>
                </div>
                
                <p class="text-gray-600 dark:text-gray-300 mb-6">${errorMessage}</p>
                
                <div class="flex justify-end">
                    <button id="error-modal-close" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
                        Entendi
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalDiv);
        
        // Configurar fechamento
        const closeBtn = modalDiv.querySelector('#error-modal-close');
        const closeModal = () => modalDiv.remove();
        
        closeBtn.addEventListener('click', closeModal);
        modalDiv.addEventListener('click', (e) => {
            if (e.target === modalDiv) closeModal();
        });
        
        // Fechar com ESC
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }
}

window.ErrorHandlerService = ErrorHandlerService;