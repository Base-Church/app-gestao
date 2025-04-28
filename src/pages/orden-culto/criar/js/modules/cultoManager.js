import { criarSelectComOutro } from './selectMomento.js';
import { criarControleLuzes } from './controleLuzes.js';
import { tornarColunasArrastaveis } from './dragAndDrop.js';
import { adicionarColuna } from './colunasManager.js';
import { duplicarCulto } from './duplicateManager.js';

let contadorLinhas = 0;

export function adicionarLinha(tabela) {
    const tbody = tabela.querySelector('.corpo-tabela');
    const cabecalho = tabela.querySelector('thead tr');
    const novaLinha = document.createElement('tr');
    contadorLinhas++;
    
    novaLinha.id = `linha-${contadorLinhas}`;
    novaLinha.className = 'bg-white border-b dark:bg-gray-800 dark:border-gray-700';
    
    // Obter TODAS as colunas atuais do cabeçalho
    const colunas = Array.from(cabecalho.children).map(th => ({
        nome: th.textContent.trim().split('\n')[0], // Remove ícones e botões
        tipo: th.dataset.tipo || 'texto'
    }));

    // Criar células para cada coluna existente
    colunas.forEach(coluna => {
        const td = document.createElement('td');
        td.className = 'px-3 py-2';

        switch(coluna.nome) {
            case 'Duração':
                td.appendChild(criarInputDuracao(contadorLinhas));
                break;
            case 'Momento':
                td.appendChild(criarSelectComOutro(`momento_${contadorLinhas}`));
                break;
            case 'Luzes':
                td.appendChild(criarControleLuzes(`luzes_${contadorLinhas}`));
                break;
            case 'Remover':
                td.className += ' text-center';
                td.appendChild(criarBotaoRemover(novaLinha));
                break;
            default:
                // Células de texto padrão (incluindo colunas personalizadas)
                td.appendChild(criarInputTexto(coluna.nome, contadorLinhas));
                break;
        }

        novaLinha.appendChild(td);
    });
    
    tbody.appendChild(novaLinha);
    return novaLinha;
}

// Funções auxiliares para criar elementos
function criarInputDuracao(contador) {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white';
    input.name = `duracao_${contador}`;
    input.placeholder = '00:00';
    input.pattern = '^([0-9]{1,2}:)?[0-5][0-9]$';
    
    // Validação do formato de tempo
    input.addEventListener('input', function(e) {
        let valor = e.target.value;
        valor = valor.replace(/[^0-9:]/g, '');
        
        if (valor.length > 5) valor = valor.substr(0, 5);
        
        // Formatar automaticamente
        if (valor.length === 2 && !valor.includes(':')) {
            valor += ':';
        }
        
        e.target.value = valor;
    });
    
    return input;
}

function criarInputTexto(nomeColuna, contador) {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white';
    input.name = `coluna_${nomeColuna.toLowerCase()}_${contador}`;
    input.placeholder = `Digite ${nomeColuna.toLowerCase()}...`;
    return input;
}

function criarBotaoRemover(linha) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'text-red-600 hover:text-red-900';
    btn.innerHTML = '<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>';
    btn.onclick = () => linha.remove();
    return btn;
}

export function criarNovoCulto() {
    const template = document.getElementById('template-culto');
    const clone = template.content.cloneNode(true);
    const container = document.getElementById('container-cultos');
    const cultoId = `culto-${Date.now()}`;
    
    // Definir ID no elemento culto-container antes de clonar
    clone.querySelector('.culto-container').id = cultoId;
    
    // Adicionar o novo culto antes do botão de adicionar
    container.insertBefore(clone, document.getElementById('adicionar-culto'));
    
    // Agora que o clone está no DOM, podemos selecionar o elemento pelo ID
    const novoCulto = document.getElementById(cultoId);
    if (!novoCulto) {
        console.error('Erro ao criar novo culto: elemento não encontrado');
        return null;
    }
    
    // Selecionar elementos dentro do novo culto
    const btnAdicionarColuna = novoCulto.querySelector('.adicionar-coluna');
    const inputNomeColuna = novoCulto.querySelector('input[placeholder="Nome da nova coluna"]');
    const btnAdicionarLinha = novoCulto.querySelector('.adicionar-linha');
    const btnToggleDuracao = novoCulto.querySelector('.toggle-duracao');
    const tabela = novoCulto.querySelector('.tabela-ordem-culto');
    
    // Verificar se todos os elementos necessários foram encontrados
    if (!tabela || !btnAdicionarLinha || !btnAdicionarColuna || !inputNomeColuna) {
        console.error('Erro ao criar novo culto: elementos necessários não encontrados');
        return null;
    }
    
    // Adicionar event listeners
    btnAdicionarColuna.addEventListener('click', () => {
        const nomeColuna = inputNomeColuna.value.trim();
        if (adicionarColuna(nomeColuna, tabela)) {
            inputNomeColuna.value = '';
            tornarColunasArrastaveis(tabela);
        }
    });

    btnAdicionarLinha.addEventListener('click', () => adicionarLinha(tabela));
    
    if (btnToggleDuracao) {
        btnToggleDuracao.addEventListener('click', () => toggleColunaDuracao(tabela, btnToggleDuracao));
    }
    
    // Adicionar event listener para o botão de duplicar
    const btnDuplicar = novoCulto.querySelector('.duplicar-culto');
    if (btnDuplicar) {
        btnDuplicar.addEventListener('click', function() {
            duplicarCulto(this.closest('.culto-container'));
        });
    }
    
    // Tornar colunas arrastáveis e adicionar primeira linha
    tornarColunasArrastaveis(tabela);
    adicionarLinha(tabela);
    
    return cultoId;
}

function toggleColunaDuracao(tabela, botao) {
    const cabecalho = tabela.querySelector('thead tr');
    const temColunaDuracao = cabecalho.querySelector('th[data-tipo="duracao"]');
    const iconClock = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
    
    if (temColunaDuracao) {
        // Remover coluna
        const index = Array.from(cabecalho.children).indexOf(temColunaDuracao);
        tabela.querySelectorAll('tr').forEach(tr => {
            tr.children[index].remove();
        });
        botao.innerHTML = `${iconClock}<span>Adicionar Duração</span>`;
        botao.classList.replace('bg-red-600', 'bg-blue-600');
        botao.classList.replace('hover:bg-red-700', 'hover:bg-blue-700');
    } else {
        // Adicionar coluna
        const novaTh = document.createElement('th');
        novaTh.scope = 'col';
        novaTh.className = 'px-3 py-2';
        novaTh.textContent = 'Duração';
        novaTh.dataset.tipo = 'duracao';
        
        // Inserir como primeira coluna
        cabecalho.insertBefore(novaTh, cabecalho.firstChild);
        
        // Adicionar células de duração para cada linha
        tabela.querySelectorAll('tbody tr').forEach(tr => {
            const td = document.createElement('td');
            td.className = 'px-3 py-2';
            
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white';
            input.name = `duracao_${tr.id.split('-')[1]}`;
            input.placeholder = '00:00';
            input.pattern = '^([0-9]{1,2}:)?[0-5][0-9]$';
            
            // Validação do formato de tempo
            input.addEventListener('input', function(e) {
                let valor = e.target.value;
                valor = valor.replace(/[^0-9:]/g, '');
                
                if (valor.length > 5) valor = valor.substr(0, 5);
                
                // Formatar automaticamente
                if (valor.length === 2 && !valor.includes(':')) {
                    valor += ':';
                }
                
                e.target.value = valor;
            });
            
            td.appendChild(input);
            tr.insertBefore(td, tr.firstChild);
        });
        
        botao.innerHTML = `${iconClock}<span>Remover Duração</span>`;
        botao.classList.replace('bg-blue-600', 'bg-red-600');
        botao.classList.replace('hover:bg-blue-700', 'hover:bg-red-700');
    }
}
