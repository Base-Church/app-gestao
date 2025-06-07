/**
 * Serviço para gerenciar o envio/submit da escala
 */
class SubmitEscalaService {
    constructor() {
        this.init();
    }

    init() {
        // Configura o botão de salvar escala
        document.querySelector('[data-action="salvar-escala"]')?.addEventListener('click', () => {
            this.confirmarESalvarEscala();
        });
    }

    /**
     * Abre modal de confirmação e salva escala
     */
    async confirmarESalvarEscala() {
        try {
            const response = await fetch(`${window.APP_CONFIG.baseUrl}/src/pages/escalas/criar/components/salvar-escala-modal.php`);
            const html = await response.text();
            
            const modalDiv = document.createElement('div');
            modalDiv.innerHTML = html;
            document.body.appendChild(modalDiv);

            const fecharModal = () => modalDiv.remove();
            modalDiv.querySelectorAll('.fechar-modal-salvar').forEach(btn => 
                btn.addEventListener('click', fecharModal)
            );

            // Evento de confirmação
            const btnConfirmar = modalDiv.querySelector('#btn-confirmar-salvar');
            btnConfirmar.onclick = async () => {
                try {
                    // Adiciona loading no botão
                    btnConfirmar.disabled = true;
                    btnConfirmar.innerHTML = `
                        <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        <span>Salvando...</span>
                    `;

                    const estado = window.escalaManagerService.getEstadoAtual();
                    await this.salvarEscala(estado);

                    // Mostra mensagem de sucesso
                    modalDiv.querySelector('#modal-content-salvar').classList.add('hidden');
                    modalDiv.querySelector('#modal-success-salvar').classList.remove('hidden');

                } catch (error) {
                    console.error('Erro ao salvar:', error);
                    alert('Erro ao salvar escala. Tente novamente.');
                    btnConfirmar.disabled = false;
                    btnConfirmar.innerHTML = '<span>Confirmar</span>';
                }
            };

        } catch (error) {
            console.error('Erro ao abrir modal:', error);
        }
    }

    /**
     * Salva a escala na API
     */
    async salvarEscala(estado) {
        try {
            const response = await fetch(`${window.APP_CONFIG.baseUrl}/src/services/api/escalas/create.php`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'ministerio-id': window.USER.ministerio_atual,
                    'organizacao-id': window.USER.organizacao_id || '1'
                },
                body: JSON.stringify({
                    ...estado,
                    ministerio_id: window.USER.ministerio_atual,
                    organizacao_id: window.USER.organizacao_id || '1'
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Erro ao salvar escala: ${errorData.error || response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao salvar escala:', error);
            throw error;
        }
    }
}

window.submitEscalaService = new SubmitEscalaService();
