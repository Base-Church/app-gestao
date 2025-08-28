<?php 
// Garantir que a sessão está iniciada
require_once __DIR__ . '/../../../config/auth/session.service.php';
SessionService::start();
?>

<script>
// Configurações globais para compatibilidade com códigos antigos
window.APP_CONFIG = window.APP_CONFIG || {
    baseUrl: <?php echo json_encode($_ENV['URL_BASE'] ?? ''); ?>,
    apiBaseUrl: <?php echo json_encode($_ENV['API_BASE_URL'] ?? ''); ?>,
    apiWhatsapp: <?php echo json_encode($_ENV['API_WHATSAPP'] ?? ''); ?>,
    apiTokenWhatsapp: <?php echo json_encode($_ENV['API_TOKEN_WHATSAPP'] ?? ''); ?>
};

// Alias para compatibilidade
window.ENV = window.ENV || window.APP_CONFIG;

// Dados do usuário (compatível com header.php)
window.USER = window.USER || <?php
    $user = SessionService::getUser();
    $sessionId = session_id() ?: 'session_' . uniqid();
    echo json_encode([
      'id' => $user['id'] ?? $sessionId,
      'name' => $user['nome'] ?? 'Usuário',
      'organizacao_id' => $user['organizacao_id'] ?? null,
      'ministerios' => $user['ministerios'] ?? [],
      'ministerio_atual' => $user['ministerio_atual'] ?? null,
      'nivel' => $user['nivel'] ?? null,
      'permissoes' => $user['permissoes'] ?? [],
      'token' => $user['token'] ?? null
    ]);
  ?>;

// Garantir que existe uma meta tag base-url para compatibilidade
if (!document.querySelector('meta[name="base-url"]')) {
    const meta = document.createElement('meta');
    meta.name = 'base-url';
    meta.content = window.APP_CONFIG.baseUrl;
    document.head.appendChild(meta);
}

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