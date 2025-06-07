export async function getOrdensCulto() {
    try {
        const response = await fetch(`${window.APP_CONFIG.baseUrl}/src/services/api/ordens-culto/get.php`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar ordens de culto');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

export async function createOrdemCulto(dados) {
    try {
        const response = await fetch(`${window.APP_CONFIG.baseUrl}/src/services/api/ordens-culto/create.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Erro ao criar ordem de culto');
            }
            
            return data.data;
        } else {
            const text = await response.text();
            console.error('Resposta não-JSON:', text);
            throw new Error('Resposta inválida do servidor');
        }
    } catch (error) {
        console.error('Erro completo:', error);
        throw error;
    }
}

export async function deleteOrdemCulto(id) {
    try {
        const response = await fetch(`${window.APP_CONFIG.baseUrl}/src/services/api/ordens-culto/delete.php/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao excluir ordem de culto');
        }

        return true;
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

export async function getOrdemCulto(id) {
    try {
        const response = await fetch(`${window.APP_CONFIG.baseUrl}/src/services/api/ordens-culto/get-by-id.php?id=${id}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar ordem de culto');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}
