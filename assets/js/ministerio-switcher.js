async function alterarMinisterio(ministerioId) {
    try {
        const response = await fetch(`${window.URL_BASE}/config/alterar.ministerio.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            },
            body: JSON.stringify({ ministerio_id: ministerioId }),
            credentials: 'same-origin',
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            console.log('Ministério alterado com sucesso:', data);
            // Força recarregamento sem cache
            window.location.href = window.location.href.split('?')[0] + '?t=' + new Date().getTime();
        } else {
            console.error('Erro ao alterar ministério:', data.error);
            alert('Erro ao alterar ministério. Por favor, tente novamente.');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao alterar ministério. Por favor, tente novamente.');
    }
}
