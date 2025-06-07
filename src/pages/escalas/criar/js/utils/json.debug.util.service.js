(function() {
    function abrirModalJsonEscala() {
        let estado = {};
        if (window.escalaManagerService && typeof window.escalaManagerService.getEstadoAtual === 'function') {
            estado = window.escalaManagerService.getEstadoAtual();
            console.log('Debug - Estado obtido:', estado); // Adicionar log
        }

        // Cria o modal
        fetch(window.APP_CONFIG.baseUrl + '/src/pages/escalas/criar/components/json-debug-modal.php')
            .then(r => r.text())
            .then(html => {
                const modalDiv = document.createElement('div');
                modalDiv.innerHTML = html;
                document.body.appendChild(modalDiv);

                // Preenche o conteúdo JSON
                const pre = modalDiv.querySelector('#json-escala-debug-content');
                if (pre) {
                    pre.textContent = JSON.stringify(estado, null, 2);
                }

                // Evento de fechar
                modalDiv.querySelector('.fechar-modal-json-debug')?.addEventListener('click', () => {
                    modalDiv.remove();
                });

                // Fecha ao apertar ESC
                document.addEventListener('keydown', escListener);
            });
    }

    function fecharModalJsonEscala() {
        document.getElementById('modal-json-escala-debug')?.remove();
        document.removeEventListener('keydown', escListener);
    }

    function escListener(e) {
        if (e.key === 'Escape') {
            fecharModalJsonEscala();
        }
    }

    // Atalho: tecla "J" (não em inputs/textareas)
    document.addEventListener('keydown', function(e) {
        if (
            (e.key === 'j' || e.key === 'J')
        ) {
            const tag = (e.target.tagName || '').toLowerCase();
            if (tag !== 'input' && tag !== 'textarea' && !e.ctrlKey && !e.altKey && !e.metaKey) {
                e.preventDefault();
                const modalAberto = document.getElementById('modal-json-escala-debug');
                if (modalAberto) {
                    fecharModalJsonEscala();
                } else {
                    abrirModalJsonEscala();
                }
            }
        }
    });
})();
