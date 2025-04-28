export class ModalBase {
    bindCloseEvents() {
        this.modal.querySelectorAll('.close-modal').forEach(button => {
            button.addEventListener('click', () => this.hide());
        });

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.hide();
        });
    }

    show() {
        this.modal.classList.remove('hidden');
    }

    hide() {
        this.modal.classList.add('hidden');
    }
}
