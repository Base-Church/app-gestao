import { PinValidator } from './modules/PinValidator.js';
import { EventSelector } from './modules/EventSelector.js';
import { MusicSelector } from './modules/MusicSelector.js';
import { ModalBase } from './modules/ModalBase.js';

export class RepertorioModal extends ModalBase {
    constructor(escalaData) {
        super();
     
        
        this.escalaData = {
            escala: escalaData?.escala,
            eventos: escalaData?.eventos || []
        };
        

        this.currentStep = 'pin';
        this.selectedEventId = null;
        // Corrigindo o acesso ao ID da escala - agora pegando diretamente do objeto
        this.escalaId = escalaData?.escala?.id;

        this.pinValidator = new PinValidator(
            () => this.showStep('eventos'),
            () => this.handlePinError()
        );
        this.eventSelector = new EventSelector(escalaData, (eventId) => this.handleEventSelect(eventId));
        this.musicSelector = new MusicSelector();
        this.modal = this.createModal();
        this.bindEvents();
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 hidden';
        modal.innerHTML = `
            <div class="absolute inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm"></div>
            <div class="absolute inset-0 flex items-center justify-center p-4">
                <div class="bg-white dark:bg-zinc-900 w-full rounded-xl shadow-xl flex flex-col transition-all duration-200" 
                     style="max-width: 32rem; ${this.currentStep === 'musicas' ? 'height: 80vh' : 'max-height: 85vh'}">
                    ${this.createHeader()}
                    ${this.pinValidator.createUI()}
                    ${this.eventSelector.createUI()}
                    ${this.musicSelector.createUI()}
                    ${this.createFooter()}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }

    createHeader() {
        return `
            <div class="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Adicionar Repertório
                </h3>
                <button class="close-modal p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
        `;
    }

    createFooter() {
        return `
            <div class="flex-shrink-0 flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-zinc-800">
                <button class="close-modal px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg">
                    Cancelar
                </button>
                <button id="next-step" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
                    Continuar
                </button>
            </div>
        `;
    }

    async saveRepertorio(data) {
        try {
            const url = `${window.ENV.API_BASE_URL}/api/repertorios`;
            
          

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': window.ENV.API_KEY
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
        
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
    
            return result;
        } catch (error) {
           
            throw error;
        }
    }

    bindEvents() {
        super.bindCloseEvents();
        
        this.modal.querySelector('#next-step').addEventListener('click', async () => {
            if (this.currentStep === 'pin') {
                this.pinValidator.validate();
            } else if (this.currentStep === 'eventos') {
                if (this.eventSelector.selectedEventId) {
                    this.handleEventSelect(this.eventSelector.selectedEventId);
                } else {
                    alert('Selecione um evento para continuar');
                }
            } else if (this.currentStep === 'musicas') {
                try {
                    const data = this.collectData();
                    if (data.eventos[0].musicas.length === 0) {
                        alert('Selecione pelo menos uma música');
                        return;
                    }
                    
                    await this.saveRepertorio(data);
                    alert('Repertório salvo com sucesso!');
                    this.hide();
                } catch (error) {
                    alert('Erro ao salvar repertório: ' + error.message);
                }
            }
        });
    }

    showStep(step) {
        
        
        ['pin', 'eventos', 'musicas'].forEach(s => {
            const element = this.modal.querySelector(`#${s}-step`);
            if (element) {
                element.classList.add('hidden');
            }
        });

        const currentElement = this.modal.querySelector(`#${step}-step`);
        if (currentElement) {
            currentElement.classList.remove('hidden');
            
            // Inicializa eventos específicos do step
            if (step === 'eventos') {
                this.eventSelector.bindEvents(currentElement);
            } else if (step === 'musicas') {
                this.musicSelector.bindEvents(currentElement);
            }
        }

        this.currentStep = step;

        const nextButton = this.modal.querySelector('#next-step');
        if (nextButton) {
            nextButton.textContent = step === 'musicas' ? 'Salvar' : 'Continuar';
        }

        // Atualizar altura do modal baseado no step
        const modalContent = this.modal.querySelector('.bg-white.dark\\:bg-zinc-900');
        if (modalContent) {
            if (step === 'musicas') {
                modalContent.style.height = '80vh';
                modalContent.style.maxHeight = '80vh';
            } else {
                modalContent.style.height = '';
                modalContent.style.maxHeight = '85vh';
            }
        }
    }

    handleEventSelect(eventId) {
        this.selectedEventId = eventId;
        this.showStep('musicas');
    }

    handlePinError() {
        const pinStep = this.modal.querySelector('#pin-step');
        if (pinStep) {
            const inputs = pinStep.querySelectorAll('input');
            inputs.forEach(input => input.value = '');
            inputs[0]?.focus();
        }
    }

    // Novo método para coletar todos os dados antes de salvar
    collectData() {
        const musicas = this.musicSelector.getSelectedMusicas();
        
        const escalaId = parseInt(this.escalaId, 10);
        if (!escalaId) {
            throw new Error('ID da escala inválido');
        }

        // Nova estrutura do payload
        const data = {
            nome: "Repertório",
            id_escala: escalaId,
            escala_item_id: parseInt(this.eventSelector.getSelectedEscalaItemId()), // Movido para o nível principal
            eventos: [
                {
                    id_evento: parseInt(this.selectedEventId),
                    musicas: musicas.map(musica => ({
                        id_musica: musica.id_musica ? parseInt(musica.id_musica) : null,
                        nome_musica: musica.nome_musica,
                        url: musica.url || '',
                        artista_banda: musica.artista_banda || '' // Adicionado artista_banda
                    }))
                }
            ]
        };

        return data;
    }

    show() {
        this.modal.classList.remove('hidden');
        this.showStep('pin');
        const pinStep = this.modal.querySelector('#pin-step');
        if (pinStep) {
            pinStep.classList.remove('hidden');
            this.pinValidator.bindEvents(pinStep);
            const firstInput = pinStep.querySelector('input');
            if (firstInput) {
                firstInput.value = '';
                firstInput.focus();
            }
        }
    }
}
