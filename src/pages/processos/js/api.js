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
        const response = await fetch(`${this.baseUrl}/processos_etapas/put.php?id=${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
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
        // Atualiza cada etapa individualmente, enviando apenas nome e orden
        for (const etapa of etapas) {
            const payload = {
                nome: etapa.nome,
                orden: etapa.orden
            };
            const response = await fetch(`${this.baseUrl}/processos_etapas/put.php?id=${etapa.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Erro ao reordenar etapas');
            }
        }
        return { success: true };
    }
}
