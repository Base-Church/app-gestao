export class PinValidator {
    constructor(onSuccess, onError) {
        this.correctPin = '1234';
        this.onSuccess = onSuccess;
        this.onError = onError;
    }

    createUI() {
        return `
            <div id="pin-step" class="flex-1 overflow-y-auto p-4">
                <div class="flex flex-col items-center gap-4">
                    <p class="text-gray-600 dark:text-gray-400 text-center">
                        Digite o PIN de acesso para continuar
                    </p>
                    <div class="flex gap-2 my-4">
                        ${Array(4).fill().map(() => `
                            <input type="tel" 
                                   maxlength="1" 
                                   class="w-12 h-12 text-center text-2xl border rounded-lg bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                                   pattern="[0-9]*"
                                   inputmode="numeric">
                        `).join('')}
                    </div>
                    <p class="text-red-500 dark:text-red-400 text-sm hidden" id="pin-error">
                        PIN incorreto, tente novamente
                    </p>
                </div>
            </div>
        `;
    }

    validate() {
        const inputs = document.querySelectorAll('#pin-step input');
        const pin = Array.from(inputs).map(input => input.value).join('');
        const errorMessage = document.querySelector('#pin-error');

        if (pin === this.correctPin) {
            errorMessage.classList.add('hidden');
            this.onSuccess();
        } else {
            errorMessage.classList.remove('hidden');
            this.onError();
            // Limpa os inputs
            inputs.forEach(input => input.value = '');
            inputs[0].focus();
        }
    }

    bindEvents(container) {
        const inputs = container.querySelectorAll('input');
        
        inputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                
                if (e.target.value) {
                    if (index < inputs.length - 1) {
                        inputs[index + 1].focus();
                    } else {
                        this.validate();
                    }
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    inputs[index - 1].focus();
                }
            });
        });
    }
}
