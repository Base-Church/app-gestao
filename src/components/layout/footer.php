<?php 
// Garantir que a sessão está iniciada
require_once __DIR__ . '/../../../config/auth/session.service.php';
SessionService::start();
?>

<script>
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