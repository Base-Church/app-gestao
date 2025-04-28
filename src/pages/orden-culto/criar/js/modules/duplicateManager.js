import { tornarColunasArrastaveis } from './dragAndDrop.js';
import { adicionarLinha } from './cultoManager.js';
import { adicionarColuna } from './colunasManager.js';

export function duplicarCulto(cultoContainer) {
    // Cria uma cópia profunda do container
    const clone = cultoContainer.cloneNode(true);
    
    // Gerar novo ID único para o clone
    const novoId = `culto-${Date.now()}`;
    clone.id = novoId;
    
    // Atualizar IDs e names dos elementos internos
    const timestamp = Date.now();
    
    // Atualizar IDs das linhas da tabela
    clone.querySelectorAll('tbody tr').forEach((tr, index) => {
        const novoLinhaId = `linha-${timestamp}-${index}`;
        tr.id = novoLinhaId;
        
        // Atualizar names dos inputs/selects
        tr.querySelectorAll('input, select').forEach(element => {
            if (element.name) {
                element.name = element.name.replace(/\d+$/, `${timestamp}-${index}`);
            }
        });
    });
    
    // Recriar event listeners
    
    // Recriar event listeners para duplicação recursiva
    const btnDuplicar = clone.querySelector('.duplicar-culto');
    if (btnDuplicar) {
        btnDuplicar.addEventListener('click', function() {
            duplicarCulto(this.closest('.culto-container'));
        });
    }

    // 1. Botão de remover culto
    const btnRemover = clone.querySelector('button[onclick*="remove"]');
    if (btnRemover) {
        btnRemover.onclick = () => clone.remove();
    }
    
    // 2. Botão de adicionar linha
    const btnAdicionarLinha = clone.querySelector('.adicionar-linha');
    if (btnAdicionarLinha) {
        btnAdicionarLinha.onclick = () => adicionarLinha(clone.querySelector('.tabela-ordem-culto'));
    }
    
    // 3. Botão de adicionar coluna
    const btnAdicionarColuna = clone.querySelector('.adicionar-coluna');
    const inputNomeColuna = clone.querySelector('input[placeholder="Nome da nova coluna"]');
    if (btnAdicionarColuna && inputNomeColuna) {
        btnAdicionarColuna.onclick = () => {
            const nomeColuna = inputNomeColuna.value.trim();
            if (adicionarColuna(nomeColuna, clone.querySelector('.tabela-ordem-culto'))) {
                inputNomeColuna.value = '';
                tornarColunasArrastaveis(clone.querySelector('.tabela-ordem-culto'));
            }
        };
    }
    
    // 4. Recriar drag and drop nas colunas
    tornarColunasArrastaveis(clone.querySelector('.tabela-ordem-culto'));
    
    // 5. Recriar controles de luzes
    clone.querySelectorAll('.flex.justify-center.gap-2 button').forEach(btn => {
        btn.onclick = function() {
            const container = btn.parentElement;
            container.querySelectorAll('button').forEach(b => 
                b.classList.remove('ring-2', 'ring-primary-500'));
            btn.classList.add('ring-2', 'ring-primary-500');
            container.querySelector('input[type="hidden"]').value = btn.dataset.value;
        };
    });
    
    // 6. Recriar evento do seletor de evento
    const btnEvento = clone.querySelector('.select-evento');
    if (btnEvento) {
        btnEvento.onclick = () => {
            document.getElementById('eventos-modal').classList.remove('hidden');
        };
    }

    // Recriar event listeners para todos os botões principais
    const btnToggleDuracao = clone.querySelector('.toggle-duracao');
    const tabela = clone.querySelector('.tabela-ordem-culto');
    
    if (btnToggleDuracao) {
        btnToggleDuracao.addEventListener('click', function() {
            const iconClock = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
            const cabecalho = tabela.querySelector('thead tr');
            const temColunaDuracao = cabecalho.querySelector('th[data-tipo="duracao"]');
            
            if (temColunaDuracao) {
                // Remover coluna
                const index = Array.from(cabecalho.children).indexOf(temColunaDuracao);
                tabela.querySelectorAll('tr').forEach(tr => {
                    tr.children[index].remove();
                });
                this.innerHTML = `${iconClock}<span>Adicionar Duração</span>`;
                this.classList.replace('bg-red-600', 'bg-blue-600');
                this.classList.replace('hover:bg-red-700', 'hover:bg-blue-700');
            } else {
                // Adicionar coluna
                const novaTh = document.createElement('th');
                novaTh.scope = 'col';
                novaTh.className = 'px-3 py-2';
                novaTh.textContent = 'Duração';
                novaTh.dataset.tipo = 'duracao';
                
                cabecalho.insertBefore(novaTh, cabecalho.firstChild);
                
                tabela.querySelectorAll('tbody tr').forEach(tr => {
                    const td = document.createElement('td');
                    td.className = 'px-3 py-2';
                    
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.className = 'w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white';
                    input.name = `duracao_${tr.id.split('-')[1]}`;
                    input.placeholder = '00:00';
                    input.pattern = '^([0-9]{1,2}:)?[0-5][0-9]$';
                    
                    input.addEventListener('input', function(e) {
                        let valor = e.target.value;
                        valor = valor.replace(/[^0-9:]/g, '');
                        if (valor.length > 5) valor = valor.substr(0, 5);
                        if (valor.length === 2 && !valor.includes(':')) {
                            valor += ':';
                        }
                        e.target.value = valor;
                    });
                    
                    td.appendChild(input);
                    tr.insertBefore(td, tr.firstChild);
                });
                
                this.innerHTML = `${iconClock}<span>Remover Duração</span>`;
                this.classList.replace('bg-blue-600', 'bg-red-600');
                this.classList.replace('hover:bg-blue-700', 'hover:bg-red-700');
            }
        });
    }
    
    // Inserir o clone após o culto original
    cultoContainer.after(clone);
    
    return clone;
}
