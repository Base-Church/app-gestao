import { createOrdemCulto } from '../../../js/api.js';

export function coletarDadosCulto(cultoContainer) {
    const tabela = cultoContainer.querySelector('.tabela-ordem-culto');
    const idEvento = cultoContainer.querySelector('input[name="evento"]').value;
    
    if (!idEvento) {
        throw new Error('Selecione um evento');
    }

    const linhas = tabela.querySelectorAll('tbody tr');
    if (linhas.length === 0) {
        throw new Error('Adicione pelo menos um momento ao culto');
    }

    const momentos = Array.from(linhas).map((tr, index) => {
        const dados = {};
        
        // Capturar tipo (obrigatório)
        const selectMomento = tr.querySelector('select[name^="momento_"]');
        if (!selectMomento || !selectMomento.value) {
            throw new Error('Tipo do momento é obrigatório');
        }

        dados.tipo = selectMomento.value === 'outro' 
            ? tr.querySelector(`input[name="${selectMomento.name}_outro"]`)?.value
            : selectMomento.value;

        if (!dados.tipo) {
            throw new Error('Tipo do momento é obrigatório');
        }

        // Capturar duração se existir
        const inputDuracao = tr.querySelector('input[name^="duracao_"]');
        if (inputDuracao?.value) {
            dados.duracao = inputDuracao.value;
        }

        // Capturar campos padrão
        ['responsavel', 'musica', 'telao'].forEach(campo => {
            const input = tr.querySelector(`input[name^="${campo}_"]`);
            if (input?.value) dados[campo] = input.value;
        });
        
        // Capturar luzes
        const inputLuzes = tr.querySelector('input[name^="luzes_"]');
        if (inputLuzes?.value) dados.luzes = inputLuzes.value;
        
        // Capturar colunas personalizadas
        tr.querySelectorAll('input[name^="coluna_"]').forEach(input => {
            if (input.value) {
                const nomeCampo = input.name.split('_')[1]; // Pega o nome da coluna
                dados[nomeCampo] = input.value;
            }
        });
        
        return {
            ordem: index + 1,
            dados: dados
        };
    });

    return {
        id_evento: idEvento,
        ordens_culto_momentos: momentos
    };
}

export async function salvarOrdemCulto(dados) {
    console.log('Preparando dados para envio:', dados);
    
    try {
        const dadosFormatados = {
            observacoes: dados.observacoes,
            ordens_culto_cultos: dados.cultos
        };

        console.log('Dados formatados para API:', dadosFormatados);
        const response = await createOrdemCulto(dadosFormatados);
        console.log('Resposta da API:', response);
        return response;
    } catch (error) {
        console.error('Erro ao salvar ordem de culto:', error);
        if (error.response) {
            const text = await error.response.text();
            console.error('Resposta de erro:', text);
        }
        throw new Error(error.message || 'Erro ao salvar ordem de culto');
    }
}
