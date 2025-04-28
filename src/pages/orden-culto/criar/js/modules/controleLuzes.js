export function criarControleLuzes(nome) {
    const container = document.createElement('div');
    container.className = 'flex justify-center gap-2';
    
    const estados = [
        { valor: 'on', icon: '🌕', title: 'Acesa' },
        { valor: 'dim', icon: '🌓', title: 'Meia luz' },
        { valor: 'off', icon: '🌑', title: 'Apagada' }
    ];
    
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = nome;
    input.value = '';
    
    estados.forEach(estado => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors';
        btn.title = estado.title;
        btn.innerHTML = estado.icon;
        btn.dataset.value = estado.valor;
        
        btn.onclick = function() {
            container.querySelectorAll('button').forEach(b => 
                b.classList.remove('ring-2', 'ring-primary-500'));
            btn.classList.add('ring-2', 'ring-primary-500');
            input.value = estado.valor;
        };
        
        container.appendChild(btn);
    });
    
    container.appendChild(input);
    return container;
}
