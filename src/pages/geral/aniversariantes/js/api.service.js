// Inline getRelatorioGeral to avoid external fetch returning HTML (Unexpected token '<')
async function getRelatorioGeral(organizacao_id, ano, limit = 8000) {
    const url = `${window.APP_CONFIG.baseUrl}/src/services/api/relatorios/get-aniversariantes.php?organizacao_id=${organizacao_id}&ano=${ano}&limit=${limit}`;
    const headers = {
        'Accept': 'application/json'
    };
    if (window.APP_CONFIG && window.APP_CONFIG.apiToken) {
        headers['Authorization'] = `Bearer ${window.APP_CONFIG.apiToken}`;
    }

    const response = await fetch(url, {
        headers,
        credentials: 'include'
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Erro ao buscar relatório geral');
    }
    return response.json();
}