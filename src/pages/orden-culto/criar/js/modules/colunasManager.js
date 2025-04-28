export function adicionarColuna(nomeColuna, tabela) {
    if (!nomeColuna) {
        Swal.fire({
            title: 'Atenção',
            text: 'Por favor, informe um nome para a coluna',
            icon: 'warning'
        });
        return false;
    }
    
    // Adicionar ao cabeçalho
    const cabecalho = tabela.querySelector('thead tr');
    const novaColuna = document.createElement('th');
    novaColuna.scope = 'col';
    novaColuna.className = 'px-3 py-2';
    novaColuna.textContent = nomeColuna;
    novaColuna.draggable = true;
    novaColuna.classList.add('cursor-move');
    
    // Adicionar botão de remover
    const btnRemover = document.createElement('button');
    btnRemover.type = 'button';
    btnRemover.className = 'ml-2 text-red-400 hover:text-red-600';
    btnRemover.innerHTML = '×';
    btnRemover.onclick = (e) => {
        e.stopPropagation();
        removerColuna(Array.from(cabecalho.children).indexOf(novaColuna), tabela);
    };
    novaColuna.appendChild(btnRemover);
    
    // Inserir antes da coluna de "Remover"
    const colunaRemover = cabecalho.querySelector('th:last-child');
    cabecalho.insertBefore(novaColuna, colunaRemover);
    
    // Adicionar células vazias para todas as linhas existentes
    tabela.querySelectorAll('tbody tr').forEach(linha => {
        const novaCelula = document.createElement('td');
        novaCelula.className = 'px-3 py-2';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white';
        input.name = `coluna_${nomeColuna.toLowerCase()}_${linha.id.split('-')[1]}`;
        input.placeholder = `Digite ${nomeColuna.toLowerCase()}...`;
        novaCelula.appendChild(input);
        
        // Inserir antes da célula de "Remover"
        const celulaRemover = linha.querySelector('td:last-child');
        linha.insertBefore(novaCelula, celulaRemover);
    });
    
    return true;
}

export function removerColuna(index, tabela) {
    const cabecalho = tabela.querySelector('thead tr');
    const coluna = cabecalho.children[index];
    
    // Não permitir remover colunas fixas
    if (index <= 1 || index >= cabecalho.children.length - 1) {
        return;
    }
    
    // Remover coluna e células correspondentes
    tabela.querySelectorAll('tr').forEach(tr => {
        tr.children[index].remove();
    });
}

export function atualizarOrdemCelulas(tabela) {
    const cabecalho = tabela.querySelector('thead tr');
    const ordemColunas = Array.from(cabecalho.children).map((_, index) => index);
    
    tabela.querySelectorAll('tbody tr').forEach(linha => {
        const celulas = Array.from(linha.children);
        const novaOrdem = ordemColunas.map(index => celulas[index].cloneNode(true));
        
        // Preservar event listeners
        novaOrdem.forEach((novaCelula, index) => {
            const celulaOriginal = celulas[index];
            
            // Recriar listeners para botões de remover
            if (novaCelula.querySelector('button')) {
                const btnOriginal = celulaOriginal.querySelector('button');
                const btnNovo = novaCelula.querySelector('button');
                
                if (btnOriginal && btnNovo) {
                    const novoHandler = btnOriginal.onclick;
                    btnNovo.onclick = novoHandler;
                }
            }
            
            // Recriar listeners para inputs e selects
            ['input', 'select'].forEach(seletor => {
                const elementoOriginal = celulaOriginal.querySelector(seletor);
                const elementoNovo = novaCelula.querySelector(seletor);
                
                if (elementoOriginal && elementoNovo) {
                    elementoNovo.value = elementoOriginal.value;
                    
                    // Copiar event listeners
                    const eventoChange = elementoOriginal.onchange;
                    if (eventoChange) {
                        elementoNovo.onchange = eventoChange;
                    }
                }
            });
        });
        
        // Atualizar linha com nova ordem
        linha.innerHTML = '';
        novaOrdem.forEach(celula => linha.appendChild(celula));
    });
}
