export class ProcessosAPI {
    constructor(baseUrl) {
        this.baseUrl = `${baseUrl}/src/services/api`;
    }

    async listarProcessos(ministerio_id) {
        const url = `${this.baseUrl}/processos/get.php?ministerio_id=${ministerio_id}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erro ao carregar processos');
        return await response.json();
    }

    async criarProcesso(dados) {
        const response = await fetch(`${this.baseUrl}/processos/create.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        if (!response.ok) throw new Error('Erro ao criar processo');
        return await response.json();
    }

    async atualizarProcesso(id, dados) {
        const response = await fetch(`${this.baseUrl}/processos/put.php?id=${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        if (!response.ok) throw new Error('Erro ao atualizar processo');
        return await response.json();
    }

    async deletarProcesso(id) {
        const response = await fetch(`${this.baseUrl}/processos/delete.php?id=${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Erro ao excluir processo');
        return await response.json();
    }

    async listarEtapas(processo_id, ministerio_id) {
        const url = `${this.baseUrl}/processos_etapas/get.php?processo_id=${processo_id}&ministerio_id=${ministerio_id}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erro ao carregar etapas');
        return await response.json();
    }

    async criarEtapa(dados) {
        const response = await fetch(`${this.baseUrl}/processos_etapas/create.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        if (!response.ok) throw new Error('Erro ao criar etapa');
        return await response.json();
    }

    async atualizarEtapa(id, dados) {
        // Garante que ministerio_id esteja sempre presente no payload
        const payload = {
            ...dados,
            ministerio_id: dados.ministerio_id
        };
        
        const response = await fetch(`${this.baseUrl}/processos_etapas/put.php?id=${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Erro ao atualizar etapa');
        return await response.json();
    }

    async deletarEtapa(id) {
        const response = await fetch(`${this.baseUrl}/processos_etapas/delete.php?id=${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Erro ao excluir etapa');
        return await response.json();
    }

    async reordenarEtapas(etapas) {
        try {
            // Atualiza cada etapa individualmente, enviando nome, orden e ministerio_id
            for (const etapa of etapas) {
                const payload = {
                    nome: etapa.nome,
                    orden: etapa.orden,
                    ministerio_id: etapa.ministerio_id
                };
                const response = await fetch(`${this.baseUrl}/processos_etapas/put.php?id=${etapa.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || errorData.error || `Erro HTTP ${response.status}`);
                }
            }
            return { success: true, message: 'Etapas reordenadas com sucesso' };
        } catch (error) {
            console.error('Erro ao reordenar etapas:', error);
            throw new Error(error.message || 'Erro ao reordenar etapas');
        }
    }
}
