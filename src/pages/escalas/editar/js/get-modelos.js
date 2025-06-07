let loadingModelos = false;
let modelosSalvos = [];

async function carregarModelos(ministerio_id) {
    if (loadingModelos) return;
    
    try {
        loadingModelos = true;
        console.group('📥 Requisição de Modelos');
        console.log('🎯 Ministério ID:', ministerio_id);

        const response = await fetch(`${window.APP_CONFIG.baseUrl}/src/services/api/modelos/get.php?ministerio_id=${ministerio_id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        console.log('📡 Status da resposta:', response.status);

        if (!response.ok) {
            throw new Error('Erro ao carregar modelos');
        }

        const data = await response.json();
        console.log('📦 Dados recebidos:', data);
        
        if (data.error) {
            throw new Error(data.error);
        }

        modelosSalvos = data.data || [];
        console.log('✅ Total de modelos:', modelosSalvos.length);
        console.groupEnd();
        return modelosSalvos;
    } catch (error) {
        console.error('❌ Erro ao carregar modelos:', error);
        console.groupEnd();
        throw error;
    } finally {
        loadingModelos = false;
    }
}

function adicionarSeletorModelo(eventoContainer, headerElement) {
    if (!headerElement) return;

    const btnRemover = headerElement.querySelector('.btn-remove-field');
    if (!btnRemover) return;

    // Criar select de modelos com estilo atualizado
    const seletorModelos = document.createElement('select');
    seletorModelos.className = 'ml-2 mr-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white px-2 py-1';
    seletorModelos.innerHTML = `
        <option value="">Usar Modelo</option>
        ${modelosSalvos.map(modelo => `
            <option value="${modelo.id}">${modelo.nome}</option>
        `).join('')}
    `;

    // Atualizar o evento de change
    seletorModelos.addEventListener('change', async (e) => {
        const modeloId = e.target.value;
        if (!modeloId) return;

        const modelo = modelosSalvos.find(m => m.id == modeloId);
        if (!modelo || !modelo.atividades) return;

        console.group('🎯 Aplicando Modelo');
        console.log('Modelo selecionado:', modelo);

        try {
            const atividadesContainer = eventoContainer.querySelector('.atividades-container');
            if (!atividadesContainer) {
                console.error('Container de atividades não encontrado');
                return;
            }

            // Usar o ministerio_id do modelo para buscar as atividades
            let todasAtividades = [];
            let page = 1;
            let hasMore = true;

            console.log('🔍 Buscando atividades para o ministério:', modelo.ministerio_id);

            while (hasMore) {
                const response = await fetch(`${window.APP_CONFIG.baseUrl}/src/services/api/atividades/get.php?ministerio_id=${modelo.ministerio_id}&page=${page}&limit=20`);
                const resultado = await response.json();
                
                console.log(`📦 Página ${page} - Resultado:`, resultado);
                
                if (resultado.code === 200 && resultado.data) {
                    todasAtividades = [...todasAtividades, ...resultado.data];
                    hasMore = page < resultado.meta.totalPages;
                    page++;
                } else {
                    console.error('❌ Erro ao buscar atividades:', resultado);
                    hasMore = false;
                }
            }

            console.log('✅ Total de atividades encontradas:', todasAtividades.length);

            // Para cada atividade do modelo
            for (const atividadeId of modelo.atividades) {
                const atividade = todasAtividades.find(a => a.id == atividadeId);
                if (!atividade) continue;

                // Usar a função existente do dynamic-fields-manager.js para adicionar atividade
                const btnAdicionar = eventoContainer.querySelector('.btn-adicionar-atividade');
                if (btnAdicionar) {
                    // Simular clique para criar estrutura base
                    btnAdicionar.click();
                    await new Promise(resolve => setTimeout(resolve, 100));

                    // Encontrar a última atividade adicionada
                    const ultimaAtividade = eventoContainer.querySelector('.atividades-container .dynamic-field:last-child');
                    if (ultimaAtividade) {
                        const atividadeSelector = ultimaAtividade.querySelector('.atividade-selector');
                        const fotoUrl = atividade.foto 
                            ? `${window.APP_CONFIG.baseUrl}/assets/img/atividades/${atividade.foto}` 
                            : `${window.APP_CONFIG.baseUrl}/assets/img/placeholder.jpg`;

                        // Atualizar conteúdo mantendo a estrutura existente
                        const seletorConteudo = atividadeSelector.querySelector('.cursor-pointer');
                        seletorConteudo.innerHTML = `
                            <div class="flex items-center space-x-3">
                                <img src="${fotoUrl}" class="w-12 h-12 rounded-full object-cover">
                                <div>
                                    <span class="text-gray-900 dark:text-white">${atividade.nome}</span>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">${atividade.categoria_nome || ''}</p>
                                </div>
                                <input type="hidden" name="atividade_id[]" value="${atividade.id}">
                            </div>
                        `;

                        // Disparar evento para inicializar funcionalidades
                        const event = new CustomEvent('atividade:selecionada', {
                            detail: { atividade },
                            bubbles: true
                        });
                        atividadeSelector.dispatchEvent(event);

                        // Atualizar estado interno do gerenciador de campos dinâmicos
                        if (typeof window.atualizarEstadoAtividade === 'function') {
                            window.atualizarEstadoAtividade(ultimaAtividade, atividade);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Erro detalhado:', error);
        } finally {
            console.groupEnd();
        }

        // Resetar o select
        e.target.value = '';
    });

    // Inserir o select antes do botão de remover
    btnRemover.parentNode.insertBefore(seletorModelos, btnRemover);
}

// Exportar funções para uso global
window.carregarModelos = carregarModelos;
window.adicionarSeletorModelo = adicionarSeletorModelo;
