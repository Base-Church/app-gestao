export async function getEscalas() {
    const searchParams = new URLSearchParams({
        organizacao_id: window.USER.organizacao_id,
        ministerio_id: localStorage.getItem('ministerio_atual') || ''
    });

    try {
        const response = await fetch(`${window.ENV.API_BASE_URL}/api/escalas?${searchParams}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${window.ENV.API_KEY}`
            },
            mode: 'cors'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erro ao carregar escalas');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

async function populateEscalasSelect() {
    try {
        const escalas = await getEscalas();
        const select = document.getElementById('escala-select');
        select.innerHTML = '<option value="">Selecione uma escala...</option>';

        escalas.data.forEach(escala => {
            const option = document.createElement('option');
            option.value = escala.id;
            option.textContent = escala.nome;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao popular select:', error);
    }
}

async function getEscalaDetails(escalaId) {
    try {
        const response = await fetch(`${window.ENV.API_BASE_URL}/api/escalas/${escalaId}?organizacao_id=${window.USER.organizacao_id}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${window.ENV.API_KEY}`
            },
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error('Falha ao buscar detalhes da escala');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

let atividadesCache = null;

async function getAtividades() {
    if (atividadesCache) return atividadesCache;

    try {
        const params = new URLSearchParams({
            organizacao_id: window.USER.organizacao_id,
            ministerio_id: localStorage.getItem('ministerio_atual') || '',
            limit: 100
        });

        const response = await fetch(`${window.ENV.API_BASE_URL}/api/atividades?${params}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${window.ENV.API_KEY}`
            },
            mode: 'cors'
        });

        if (!response.ok) throw new Error('Falha ao buscar atividades');
        const data = await response.json();
        atividadesCache = data;
        return data;
    } catch (error) {
        console.error('Erro ao buscar atividades:', error);
        return null;
    }
}

function ajustarHoraEnvio(dataEnvio) {
    const horaEnvio = dataEnvio.getHours();
    if (horaEnvio < 8) {
        dataEnvio.setHours(8, 0, 0); // Ajusta para 08:00
    } else if (horaEnvio >= 22) {
        dataEnvio.setHours(8, 0, 0); // Ajusta para 08:00 do próximo dia
        dataEnvio.setDate(dataEnvio.getDate() + 1);
    }
    return dataEnvio;
}

function displayEventos(eventos) {
    const container = document.getElementById('eventos-container');
    const eventosList = document.getElementById('eventos-list');
    eventosList.classList.add('h-[50vh]', 'overflow-y-auto', 'pr-2');
    eventosList.innerHTML = '';
    const currentDate = new Date();

    const processEvents = async () => {
        const atividadesResponse = await getAtividades();
        const atividades = atividadesResponse?.data || [];

        const futurosEventos = eventos
            .filter(evento => {
                const eventDateTime = new Date(`${evento.data_evento.split('T')[0]}T${evento.hora}`);
                return eventDateTime > currentDate;
            })
            .sort((a, b) => {
                const dateA = new Date(`${a.data_evento.split('T')[0]}T${a.hora}`);
                const dateB = new Date(`${b.data_evento.split('T')[0]}T${b.hora}`);
                return dateA - dateB;
            });

        futurosEventos.forEach(evento => {
            const eventDate = new Date(`${evento.data_evento.split('T')[0]}T${evento.hora}`);
            if (isNaN(eventDate.getTime())) return; // Skip invalid dates

            const data = new Date(evento.data_evento);
            const dataFormatada = data.toLocaleDateString('pt-BR');
            const hora = evento.hora.substring(0, 5);
            const turno = parseInt(hora) < 12 ? 'Manhã' : parseInt(hora) < 18 ? 'Tarde' : 'Noite';

            let dataEnvio = new Date(eventDate.getTime() - 12 * 60 * 60 * 1000);
            dataEnvio = ajustarHoraEnvio(dataEnvio); // Ajusta a hora de envio se necessário
            const dataEnvioFormatada = dataEnvio.toISOString().split('T')[0];
            const horaEnvioFormatada = dataEnvio.toTimeString().substring(0, 8);

            const voluntariosVoz = [];
            const voluntariosOutros = [];

            evento.atividades.forEach(ativ => {
                const atividadeInfo = atividades.find(a => a.id === ativ.atividade_id);
                if (atividadeInfo?.categoria_atividade_id === 21) {
                    voluntariosVoz.push(ativ);
                } else {
                    voluntariosOutros.push(ativ);
                }
            });

            const eventoDiv = document.createElement('div');
            eventoDiv.className = 'p-4 border dark:border-gray-700 rounded-lg mb-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 shadow-sm hover:shadow-md';
            eventoDiv.innerHTML = `
                <div class="flex flex-col lg:flex-row gap-6">
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-4">
                            <input type="checkbox" class="evento-checkbox" data-escala-item-id="${evento.escala_item_id}">
                            <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
                                ${evento.evento_nome}
                            </h4>
                            <span class="px-2.5 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300">
                                ${dataFormatada} ${hora} (${turno})
                            </span>
                        </div>
                        <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            Data e hora de notificação: ${dataEnvioFormatada} às ${horaEnvioFormatada}
                        </p>
                        <div class="grid lg:grid-cols-2 gap-6">
                            ${voluntariosOutros.length > 0 ? `
                                <div class="space-y-3">
                                    <div class="space-y-2">
                                        ${voluntariosOutros.map(ativ => `
                                            <div class="flex items-start gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600/50">
                                                <span class="flex-shrink-0 w-2 h-2 mt-2 rounded-full" style="background-color: ${atividades.find(a => a.id === ativ.atividade_id)?.cor_indicador || '#gray'}"></span>
                                                <div>
                                                    <span class="text-sm font-medium text-gray-900 dark:text-white">${ativ.voluntario_nome}</span>
                                                    <span class="block text-xs text-gray-500 dark:text-gray-400">${ativ.atividade_nome}</span>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                            
                            ${voluntariosVoz.length > 0 ? `
                                <div class="space-y-3">
                                    <h5 class="font-medium text-gray-700 dark:text-gray-300">Vozes</h5>
                                    <div class="space-y-2">
                                        ${voluntariosVoz.map(ativ => `
                                            <div class="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600/50">
                                                <span class="flex-shrink-0 w-2 h-2 rounded-full" style="background-color: ${atividades.find(a => a.id === ativ.atividade_id)?.cor_indicador || '#gray'}"></span>
                                                <span class="text-sm font-medium text-gray-900 dark:text-white">${ativ.voluntario_nome}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
            eventosList.appendChild(eventoDiv);
        });
    };

    processEvents();
    container.classList.remove('hidden');
}

document.getElementById('toggle-select-all').addEventListener('click', function() {
    const checkboxes = document.querySelectorAll('.evento-checkbox');
    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
    checkboxes.forEach(checkbox => checkbox.checked = !allChecked);
});

async function createNotificacoes() {
    const selectedEventos = Array.from(document.querySelectorAll('.evento-checkbox:checked')).map(checkbox => checkbox.dataset.escalaItemId);
    if (selectedEventos.length === 0) return;

    // Buscar atividades antes de processar
    const atividadesResponse = await getAtividades();
    const atividades = atividadesResponse?.data || [];

    const container = document.getElementById('eventos-container');
    const progressBarContainer = document.getElementById('progress-bar-container');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const createButton = document.querySelector('button[form="form-create"]');
    container.classList.add('hidden');
    progressBarContainer.classList.remove('hidden');
    createButton.classList.add('hidden'); // Oculta o botão "Criar Notificação"

    const escalaId = document.getElementById('escala-select').value;
    const escalaDetails = await getEscalaDetails(escalaId);
    const eventos = escalaDetails.data.eventos.filter(evento => selectedEventos.includes(evento.escala_item_id.toString()));

    let hasError = false;
    const totalEventos = eventos.length;
    let eventosProcessados = 0;

    for (const evento of eventos) {
        const eventDate = new Date(`${evento.data_evento.split('T')[0]}T${evento.hora}`);
        if (isNaN(eventDate.getTime())) continue; // Skip invalid dates

        let dataEnvio = new Date(eventDate.getTime() - 12 * 60 * 60 * 1000);
        dataEnvio = ajustarHoraEnvio(dataEnvio); // Ajusta a hora de envio se necessário
        const dataEnvioFormatada = dataEnvio.toISOString().split('T')[0];
        const horaEnvioFormatada = dataEnvio.toTimeString().substring(0, 8);

        const notificacao = {
            id_escala: escalaDetails.data.escala.id,
            nome_escala: escalaDetails.data.escala.nome,
            data_envio: dataEnvioFormatada,
            hora_envio: horaEnvioFormatada,
            evento_nome: evento.evento_nome,
            evento_turno: parseInt(evento.hora) < 12 ? 'manhã' : parseInt(evento.hora) < 18 ? 'tarde' : 'noite',
            ministerio_id: localStorage.getItem('ministerio_atual') || window.USER.ministerio_id,
            organizacao_id: window.USER.organizacao_id,
            voluntarios: evento.atividades.map(ativ => {
                const atividadeInfo = atividades.find(a => a.id === ativ.atividade_id);
                return {
                    nome: ativ.voluntario_nome,
                    atividade: atividadeInfo?.categoria_atividade_id === 21 ? 'vozes' : ativ.atividade_nome,
                    id_voluntario: ativ.voluntario_id
                };
            }),
            status: 'pendente',
            data_evento: evento.data_evento.split('T')[0],
            hora_evento: evento.hora
        };

        try {
            const params = new URLSearchParams({
                organizacao_id: window.USER.organizacao_id,
                ministerio_id: notificacao.ministerio_id
            });

            console.log('Notificação:', notificacao); // Adicionado para exibir o corpo da requisição

            const response = await fetch(`${window.ENV.API_BASE_URL}/api/notificacoes?${params}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.ENV.API_KEY}`
                },
                body: JSON.stringify(notificacao)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Erro ao criar notificação:', errorData.message);
                hasError = true;
            }
        } catch (error) {
            console.error('Erro ao criar notificação:', error);
            hasError = true;
        }

        // Atualiza a barra de progresso
        eventosProcessados++;
        const progressPercentage = (eventosProcessados / totalEventos) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        progressText.textContent = `Processando ${eventosProcessados} de ${totalEventos} eventos...`;

        // Aguarda 5 segundos antes de fazer a próxima requisição
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    progressBarContainer.classList.add('hidden');
    container.classList.remove('hidden');

    if (!hasError) {
        window.app.toggleModal(false);
        location.reload(true); // Recarrega a página e limpa o cache
    } else {
        createButton.classList.remove('hidden'); // Mostra o botão novamente em caso de erro
    }
}

document.getElementById('form-create').addEventListener('submit', async function(e) {
    e.preventDefault();
    await createNotificacoes();
});

document.getElementById('escala-select').addEventListener('change', async function(e) {
    const escalaId = e.target.value;
    if (!escalaId) {
        document.getElementById('eventos-container').classList.add('hidden');
        return;
    }

    try {
        const response = await getEscalaDetails(escalaId);
        if (response.data && response.data.eventos) {
            displayEventos(response.data.eventos);
        }
    } catch (error) {
        console.error('Erro ao buscar eventos:', error);
    }
});

document.addEventListener('DOMContentLoaded', populateEscalasSelect);
