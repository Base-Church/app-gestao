async function alterarMinisterio(ministerioId) {
    try {
        if (!ministerioId) {
            console.error('ID do ministério não fornecido');
            return;
        }

        const response = await fetch(`${window.APP_CONFIG.baseUrl}/config/alterar.ministerio.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ministerio_id: ministerioId }),
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok && data.success) {
            window.USER.ministerio_atual = ministerioId;
            // Dispatch event for other components
            window.dispatchEvent(new CustomEvent('ministerio-changed', { 
                detail: { ministerio_id: ministerioId }
            }));
            window.location.reload();
        } else {
            console.error('Erro ao alterar ministério:', data.error);
            if (data.error === 'Usuário não autenticado') {
                window.location.href = `${window.APP_CONFIG.baseUrl}/login`;
            } else {
                alert(data.error || 'Erro ao alterar ministério');
            }
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao alterar ministério. Por favor, tente novamente.');
    }
}
