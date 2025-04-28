async function carregarOrdemCulto() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
        mostrarErro('ID da ordem não fornecido');
        return;
    }

    try {
        const response = await fetch(`${window.ENV.URL_BASE}/src/services/api/ordens-culto/get-by-id.php?id=${id}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Erro ao carregar dados');
        
        const responseData = await response.json();
        // Acessar os dados aninhados corretamente
        const dados = responseData.data.data;
        if (!dados) throw new Error('Dados não encontrados');

        renderizarDados(dados);
        
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('content').classList.remove('hidden');
    } catch (error) {
        mostrarErro(error.message);
    }
}

function renderizarDados(dados) {
    document.getElementById('ordem-id').textContent = dados.ordem_culto_id;
    
    // Renderizar cultos (agora usando ordens_culto_cultos)
    renderizarCultos(dados.ordens_culto_cultos);
}

function renderizarCultos(cultos) {
    const cores = [
        'header-color-1',
        'header-color-2',
        'header-color-3',
        'header-color-4',
        'header-color-5',
        'header-color-6'
    ];

    if (!cultos || !Array.isArray(cultos) || cultos.length === 0) {
        console.warn('Nenhum culto encontrado');
        return;
    }

    const container = document.getElementById('cultos-container');
    container.innerHTML = cultos.map((culto, index) => {
        const corIndex = index % cores.length;
        const eventoInfo = renderizarInfoEvento(culto.evento);
        const tabelaMomentos = renderizarTabelaMomentos(culto.ordens_culto_momentos, cores[corIndex]);
        
        // Adicionar título apenas na primeira página
        const titulo = index === 0 ? `
            <div class="mb-4 print-only">
                <h1 class="text-2xl font-bold">Ordem de Culto #${document.getElementById('ordem-id').textContent}</h1>
            </div>
        ` : '';
        
        return `
            <div class="space-y-4">
                ${titulo}
                ${eventoInfo}
                ${tabelaMomentos}
                ${index < cultos.length - 1 ? '<div class="page-break-after"></div>' : ''}
            </div>
        `;
    }).join('');
}

function renderizarInfoEvento(evento) {
    if (!evento) return '';
    
    return `
        <div class="bg-black rounded-lg shadow p-4 border border-gray-800">
            <div class="flex items-center gap-4">
                <img src="${window.ENV.URL_BASE}/assets/img/eventos/${evento.foto}" 
                     alt="${evento.nome}"
                     onerror="this.src='${window.ENV.URL_BASE}/assets/img/placeholder.jpg'"
                     class="w-16 h-16 rounded-lg object-cover">
                <div>
                    <h2 class="text-xl font-semibold text-white">
                        ${evento.nome}
                    </h2>
                    <p class="text-gray-400">
                        ${evento.dia_semana} às ${evento.hora.substring(0, 5)}
                    </p>
                </div>
            </div>
        </div>
    `;
}

// Adicionar função normalizarNomeColuna
function normalizarNomeColuna(nome) {
    const mapa = {
        'responsável': 'Responsável',
        'música': 'Música',
        'telão': 'Telão',
        'tipo': 'Momento',
        'luzes': 'Luzes'
    };
    return mapa[nome] || nome.charAt(0).toUpperCase() + nome.slice(1);
}

function renderizarTabelaMomentos(momentos, corCabecalho) {
    if (!momentos || !Array.isArray(momentos) || momentos.length === 0) {
        return `
            <div class="bg-white dark:bg-black shadow p-4">
                <p class="text-gray-500 dark:text-gray-400 text-center">Nenhum momento cadastrado</p>
            </div>
        `;
    }

    // Reorganizar colunas (luzes sempre por último)
    const dados = momentos[0]?.dados || {};
    const colunas = Object.keys(dados).filter(col => col !== 'luzes');
    if (dados.luzes !== undefined) {
        colunas.push('luzes');
    }

    return `
        <div class="bg-black rounded-lg overflow-hidden border border-gray-800">
            <div class="overflow-x-auto">
                <table class="tabela-moderna">
                    <thead>
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-16 ${corCabecalho}">
                                Nº
                            </th>
                            ${colunas.map(coluna => `
                                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${corCabecalho}">
                                    ${normalizarNomeColuna(coluna)}
                                </th>
                            `).join('')}
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-800">
                        ${momentos.map((momento, index) => `
                            <tr class="transition-colors">
                                <td class="px-4 py-3 whitespace-nowrap">
                                    <span class="ordem-numero text-sm font-medium text-white">
                                        ${index + 1}º
                                    </span>
                                </td>
                                ${colunas.map(coluna => `
                                    <td class="px-4 py-3 whitespace-nowrap text-sm text-white">
                                        ${formatarValorEspecial(coluna, momento.dados[coluna] || '')}
                                    </td>
                                `).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function formatarValorEspecial(chave, valor) {
    if (!valor) return '-';
    
    switch(chave) {
        case 'luzes':
            if (valor === 'on') return '🌕';
            if (valor === 'dim') return '🌓';
            if (valor === 'off') return '🌑';
            return valor;
            
        case 'tipo':
            // Capitalizar primeira letra
            return valor.charAt(0).toUpperCase() + valor.slice(1);
            
        default:
            return valor;
    }
}

function mostrarErro(mensagem) {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('error').classList.remove('hidden');
    console.error(mensagem);
}

// Iniciar carregamento
document.addEventListener('DOMContentLoaded', carregarOrdemCulto);
