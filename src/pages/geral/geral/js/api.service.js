async function getRelatorioGeral(organizacao_id, limit = 8000) {
    const url = `${window.APP_CONFIG.baseUrl}/src/services/api/relatorios/get.php?organizacao_id=${organizacao_id}&limit=${limit}`;
    const response = await fetch(url, {
        headers: {
            'Accept': 'application/json'
        },
        credentials: 'include'
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Erro ao buscar relatório geral');
    }
    return response.json();
}