import { criarNovoCulto } from './modules/cultoManager.js';
import { coletarDadosCulto, salvarOrdemCulto } from './modules/dataManager.js';
import { setupEventosModal } from './modules/eventosManager.js';

document.addEventListener('DOMContentLoaded', function() {
    // Event listener para adicionar novo culto
    document.getElementById('adicionar-culto').addEventListener('click', criarNovoCulto);

    // Event listener para salvar formulário
    document.getElementById('form-ordem-culto').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const spinner = document.getElementById('spinner-submit');
        const btnText = document.getElementById('btn-text');
        
        spinner.classList.remove('hidden');
        btnText.textContent = 'Salvando...';

        try {
            const cultos = Array.from(document.querySelectorAll('.culto-container')).map(cultoContainer => {
                try {
                    return coletarDadosCulto(cultoContainer);
                } catch (error) {
                    console.error('Erro ao coletar dados do culto:', error);
                    throw new Error(`Erro ao coletar dados: ${error.message}`);
                }
            });

            const observacoes = document.getElementById('observacoes').value;
            
            console.log('Dados a serem enviados:', { cultos, observacoes });

            await salvarOrdemCulto({
                cultos,
                observacoes
            });

            Swal.fire({
                title: 'Sucesso!',
                text: 'Ordem de culto salva com sucesso!',
                icon: 'success'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = `${window.ENV.URL_BASE}/src/pages/orden-culto/`;
                }
            });
        } catch (error) {
            console.error('Erro detalhado:', error);
            Swal.fire({
                title: 'Erro!',
                text: error.message || 'Ocorreu um erro ao salvar.',
                icon: 'error'
            });
        } finally {
            spinner.classList.add('hidden');
            btnText.textContent = 'Salvar Ordem de Culto';
        }
    });

    // Configurar modal de eventos
    setupEventosModal();

    // Adicionar primeiro culto por padrão
    criarNovoCulto();
});
