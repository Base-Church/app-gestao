import { atualizarOrdemCelulas } from './colunasManager.js';

export function tornarColunasArrastaveis(tabela) {
    const cabecalho = tabela.querySelector('thead tr');
    const colunas = Array.from(cabecalho.children);
    
    let colunaArrastada = null;
    let colunasOriginais = null;
    
    colunas.forEach((coluna, index) => {
        if (index > 1 && index < colunas.length - 1) {
            coluna.draggable = true;
            coluna.classList.add('cursor-move', 'transition-all', 'duration-200');
        }
    });

    // Remover todos os efeitos visuais
    const limparEfeitosVisuais = () => {
        tabela.querySelectorAll('.dragging').forEach(el => {
            el.classList.remove('dragging', 'opacity-50', 'bg-blue-50', 'dark:bg-blue-900');
        });
        tabela.querySelectorAll('.drag-hover').forEach(el => {
            el.classList.remove('drag-hover', 'bg-gray-50', 'dark:bg-gray-600');
        });
    };

    cabecalho.addEventListener('dragstart', (e) => {
        const coluna = e.target.closest('th');
        if (!coluna || !coluna.draggable) return;
        
        colunaArrastada = coluna;
        const index = Array.from(cabecalho.children).indexOf(coluna);
        colunasOriginais = Array.from(tabela.querySelectorAll(`tr > :nth-child(${index + 1})`));
        
        // Adicionar classe temporária durante o arrasto
        colunasOriginais.forEach(cel => {
            cel.classList.add('dragging', 'opacity-50');
        });
    });

    cabecalho.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (!colunaArrastada) return;

        limparEfeitosVisuais();
        colunasOriginais.forEach(cel => cel.classList.add('dragging', 'opacity-50'));

        const coluna = e.target.closest('th');
        if (!coluna || coluna === colunaArrastada) return;

        const indexOrigem = Array.from(cabecalho.children).indexOf(colunaArrastada);
        const indexDestino = Array.from(cabecalho.children).indexOf(coluna);
        
        if (indexDestino <= 1 || indexDestino >= colunas.length - 1) return;

        // Adicionar efeito hover apenas na coluna alvo
        const colunaIndex = indexDestino + 1;
        tabela.querySelectorAll(`tr > :nth-child(${colunaIndex})`).forEach(cel => {
            if (!cel.classList.contains('dragging')) {
                cel.classList.add('drag-hover', 'bg-gray-50', 'dark:bg-gray-600');
            }
        });

        // Mover as células
        tabela.querySelectorAll('tr').forEach(linha => {
            const celulas = Array.from(linha.children);
            const celulaOrigem = celulas[indexOrigem];
            const celulaDestino = celulas[indexDestino];

            if (indexOrigem < indexDestino) {
                linha.insertBefore(celulaOrigem, celulaDestino.nextSibling);
            } else {
                linha.insertBefore(celulaOrigem, celulaDestino);
            }
        });
    });

    cabecalho.addEventListener('drop', (e) => {
        e.preventDefault();
        if (!colunaArrastada) return;

        limparEfeitosVisuais();
        atualizarOrdemCelulas(tabela);
    });

    cabecalho.addEventListener('dragend', () => {
        if (!colunaArrastada) return;
        limparEfeitosVisuais();
        colunaArrastada = null;
        colunasOriginais = null;
    });
}
