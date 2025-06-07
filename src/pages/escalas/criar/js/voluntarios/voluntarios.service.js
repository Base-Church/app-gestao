// Serviço para buscar voluntários e abrir sidebar
class VoluntariosService {
    async abrirSidebarVoluntarios(params, onSelecionar) {
        // Fecha qualquer sidebar já aberto antes de buscar
        document.querySelectorAll('.voluntarios-offcanvas').forEach(el => el.remove());
        try {
            // Remove campos vazios/nulos para evitar erro 400
            const cleanParams = {};
            Object.keys(params).forEach(k => {
                if (
                    params[k] !== undefined &&
                    params[k] !== null &&
                    params[k] !== ''
                ) {
                    cleanParams[k] = params[k];
                }
            });
            // Garante uso dos dados do footer
            if (!cleanParams.organizacao_id) cleanParams.organizacao_id = window.USER.organizacao_id;
            if (!cleanParams.ministerio_id) cleanParams.ministerio_id = window.USER.ministerio_atual;
            const { sugestoes, todos } = await window.apiService.buscarVoluntariosSugestoes(cleanParams);
            window.voluntariosComponentesService.criarSidebar({ sugestoes, todos }, onSelecionar);
        } catch (err) {
            alert('Erro ao buscar voluntários');
        }
    }
}
window.voluntariosService = new VoluntariosService();
// Nenhuma redundância encontrada.
