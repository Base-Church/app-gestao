<?php 
// Garantir que a sessão está iniciada
SessionService::start();
?>

<script>
// Configurações globais - Single source of truth
window.APP_CONFIG = {
    baseUrl: '<?php echo $_ENV['URL_BASE']; ?>',
    apiUrl: '<?php echo $_ENV['API_BASE_URL']; ?>',
    apiKey: '<?php echo $_ENV['API_KEY']; ?>'
};

// Dados do usuário
window.USER = {
    ministerios: <?php echo json_encode(SessionService::getMinisterios()); ?>,
    ministerio_atual: <?php echo json_encode(SessionService::getMinisterioAtual()); ?>,
    organizacao_id: <?php echo json_encode(SessionService::getOrganizacaoId()); ?>,
    nivel: <?php echo json_encode(SessionService::getNivel()); ?>,
    permissoes: <?php echo json_encode(SessionService::getPermissoes()); ?>
};

// Função de validação de ministério
window.validateMinisterio = function() {
    if (!window.USER?.ministerio_atual) {
        const message = 'Selecione um ministério para continuar';
        console.error(message);
        if (document.getElementById('error-message')) {
            document.getElementById('error-message').textContent = message;
            document.getElementById('error-container')?.classList.remove('hidden');
        }
        return false;
    }
    return true;
};

// Listener para mudanças de ministério
window.addEventListener('ministerio-changed', (event) => {
    if (event.detail?.ministerio_id) {
        window.USER.ministerio_atual = event.detail.ministerio_id;
        localStorage.setItem('ministerio_atual', event.detail.ministerio_id);
    }
});
</script>

</div>
</body>
</html>