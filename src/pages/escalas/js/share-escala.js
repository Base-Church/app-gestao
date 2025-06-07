export class ShareManager {
    constructor() {
        this.modal = document.getElementById('share-modal');
        this.confirmBtn = document.getElementById('share-modal-confirm');
        this.cancelBtn = document.getElementById('share-modal-cancel');
        this.cancelBtnFooter = document.getElementById('share-modal-cancel-btn');
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.confirmBtn?.addEventListener('click', () => {
            this.handleConfirm();
        });

        this.cancelBtn?.addEventListener('click', () => {
            this.close();
        });

        this.cancelBtnFooter?.addEventListener('click', () => {
            this.close();
        });
    }

    open(data) {
        this.shareData = data;
        this.modal.classList.remove('hidden');
    }

    close() {
        this.modal.classList.add('hidden');
        this.shareData = null;
    }

    async handleConfirm() {
        const confirmButton = this.confirmBtn;
        const originalText = confirmButton.textContent;
        
        try {
            confirmButton.textContent = 'Enviando...';
            confirmButton.disabled = true;

            const webhookUrl = window.APP_CONFIG?.webhookUrl || 'https://webhook.basechurchbr.com/webhook/EnviarGrupo';

            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.shareData)
            });

            const data = await response.json();

            if (data && data.code === '200') {
                alert('Escala compartilhada com sucesso!');
            } else {
                throw new Error(data.message || 'Falha ao compartilhar escala. Por favor, tente novamente.');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert(error.message || 'Ocorreu um erro ao tentar compartilhar a escala. Por favor, verifique sua conexão e tente novamente.');
        } finally {
            confirmButton.textContent = originalText;
            confirmButton.disabled = false;
            this.close();
        }
    }
}

export const shareEscala = async (url, nome, tipo, ministerio_id, data_fim) => {
    const shareManager = new ShareManager();
    shareManager.open({ url, nome, tipo, ministerio_id, data_fim });
};
