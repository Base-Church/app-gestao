export const opcoesSelect = [
    { valor: '', texto: 'Selecione...' },
    { valor: 'cronometro', texto: 'Cronômetro' },
    { valor: 'abertura', texto: 'Abertura' },
    { valor: 'louvor', texto: 'Louvor' },
    { valor: 'oracao', texto: 'Oração' },
    { valor: 'oferta', texto: 'Oferta' },
    { valor: 'palavra', texto: 'Palavra' },
    { valor: 'apelo', texto: 'Apelo' },
    { valor: 'ceia', texto: 'Santa Ceia' },
    { valor: 'comunicado', texto: 'Comunicados' },
    { valor: 'posso-orar', texto: 'Posso Orar' },
    { valor: 'batismo', texto: 'Batimos' },
    { valor: 'apresentacao-criancas', texto: 'Apresentação de crianças' },
    { valor: 'outro', texto: 'Outro...' }
];

export function criarSelectComOutro(nome, dataColuna) {
    const container = document.createElement('div');
    container.className = 'relative';
    
    const select = document.createElement('select');
    select.className = 'w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white';
    select.name = nome;
    select.dataset.coluna = dataColuna || '';
    
    opcoesSelect.forEach(opcao => {
        const option = document.createElement('option');
        option.value = opcao.valor;
        option.textContent = opcao.texto;
        select.appendChild(option);
    });
    
    const inputOutro = document.createElement('input');
    inputOutro.type = 'text';
    inputOutro.className = 'mt-1 w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white hidden';
    inputOutro.name = `${nome}_outro`;
    inputOutro.placeholder = 'Especifique...';
    
    select.addEventListener('change', function() {
        if (select.value === 'outro') {
            inputOutro.classList.remove('hidden');
            inputOutro.focus();
        } else {
            inputOutro.classList.add('hidden');
        }
    });
    
    container.appendChild(select);
    container.appendChild(inputOutro);
    
    return container;
}
