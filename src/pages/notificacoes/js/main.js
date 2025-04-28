window.app = {
    toggleModal: function(show) {
        const modal = document.getElementById('modal-create');
        if (show) {
            modal.classList.remove('hidden');
        } else {
            modal.classList.add('hidden');
        }
    },
    changePage: function(page) {
        state.setPage(page);
        fetchNotificacoes();
    },
    deleteNotificacao: async function(id) {
        try {
            const response = await fetch(`${window.ENV.API_BASE_URL}/api/notificacoes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': '*/*',
                    'Authorization': `Bearer ${window.ENV.API_KEY}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao apagar notificação');
            }

            fetchNotificacoes();
        } catch (error) {
            console.error('Erro ao apagar notificação:', error);
            ui.showToast(error.message, 'error');
        }
    }
};

import { NotificacoesAPI } from './api.js';
import { UI } from './ui.js';
import { State } from './state.js';

const api = new NotificacoesAPI(window.ENV.API_BASE_URL);
const ui = new UI();
const state = new State();

async function fetchNotificacoes() {
    ui.toggleElements(true, false, false);
    state.setLoading(true);

    try {
        const params = state.getQueryParams();
        const response = await api.list(params.page, 40, params.search); // Limite aumentado para 40
        const { data, meta } = response;

        if (data.length === 0) {
            ui.toggleElements(false, false, true);
        } else {
            ui.toggleElements(false, false, false);
            renderNotificacoes(data);
            renderPagination(meta);
        }
    } catch (error) {
        ui.toggleElements(false, true, false);
        ui.showToast(error.message, 'error');
    } finally {
        state.setLoading(false);
    }
}

function renderNotificacoes(notificacoes) {
    const list = document.getElementById('notificacoes-list');
    list.innerHTML = '';

    notificacoes.forEach(notificacao => {
        const listItem = document.createElement('li');
        listItem.className = 'bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow duration-300 p-6 mb-4';

        // Formata as datas - removendo o T e Z da string ISO
        const dataEnvio = new Date(notificacao.data_envio.replace('T', ' ').replace('Z', ''));
        const dataFormatada = dataEnvio.toLocaleDateString('pt-BR');
        const horaFormatada = notificacao.hora_envio.substring(0, 5); // Exibe apenas HH:mm

        const dataEvento = new Date(notificacao.data_evento.replace('T', ' ').replace('Z', ''));
        const dataEventoFormatada = dataEvento.toLocaleDateString('pt-BR');
        const horaEventoFormatada = notificacao.hora_evento.substring(0, 5); // Exibe apenas HH:mm

        listItem.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    ${notificacao.nome_escala}
                </h3>
                <button class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600" onclick="window.app.deleteNotificacao(${notificacao.id})">
                    Apagar
                </button>
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-300 mb-4">
                <p class="mb-1 flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                    </svg>
                    <span class="font-medium">Notificação enviada:</span>
                </p>
                <p>${dataFormatada} às ${horaFormatada}</p>
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-300 mb-4">
                <p class="mb-1 flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <span class="font-medium">Data do evento:</span>
                </p>
                <p>${dataEventoFormatada} às ${horaEventoFormatada}</p>
                <p class="mt-1 flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span class="font-medium">Turno:</span> ${notificacao.evento_turno}
                </p>
            </div>
            <button class="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-600" onclick="toggleVoluntarios(${notificacao.id})">
                Mostrar Voluntários
            </button>
            <div id="voluntarios-${notificacao.id}" class="hidden mt-4">
                <div class="space-y-2">
                    ${(notificacao.voluntario || []).map(vol => `
                        <div>
                            <p class="text-sm font-medium text-gray-900 dark:text-white">${vol.nome}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">${vol.atividade}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        list.appendChild(listItem);
    });
}

function toggleVoluntarios(id) {
    const voluntariosDiv = document.getElementById(`voluntarios-${id}`);
    voluntariosDiv.classList.toggle('hidden');
}

function startProgressBar(id, duration) {
    const progressBar = document.getElementById(id);
    const progressText = document.getElementById(`${id}-text`);
    let timeLeft = duration;
    const totalDuration = duration;

    const interval = setInterval(() => {
        timeLeft--;
        const percentage = (timeLeft / totalDuration) * 100;
        
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(interval);
            progressText.textContent = 'Expirado';
        }
    }, 1000);
}

function renderPagination(meta) {
    const container = document.getElementById('pagination-container');
    container.innerHTML = ui.renderPagination(meta);
}

// Remove search event listener since we removed the search input
fetchNotificacoes();
