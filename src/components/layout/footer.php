<script>
document.addEventListener('DOMContentLoaded', () => {
    const sessionData = <?php 
        require_once __DIR__ . '/../../../config/auth/session.service.php';
        SessionService::start();
        $userData = SessionService::getUser();
        echo json_encode($userData ?? []);
    ?>;
    // Adicionar dados ao localStorage e sessionStorage para debug
    if (sessionData) {
        localStorage.setItem('ministerio_atual', sessionData.ministerio_atual);
        sessionStorage.setItem('ministerio_atual', sessionData.ministerio_atual);
        // Adicionar evento personalizado para mudança de ministério
        window.dispatchEvent(new CustomEvent('ministerio-changed', {
            detail: {
                ministerio_id: sessionData.ministerio_atual
            }
        }));
    }
});
</script>

</div> <!-- Fechamento do layout principal -->
</body>
</html>