import { ProcessosAPI } from './api.js';
import { UI } from './ui.js';

// Import SortableJS
// SortableJS será carregado via CDN, usar global Sortable

const baseUrl = window.APP_CONFIG.baseUrl;
if (!baseUrl) console.warn('Base URL não encontrada');
const api = new ProcessosAPI(baseUrl);
const ui = new UI();

let ministerio_id = window.USER?.ministerio_atual;
let organizacao_id = window.USER?.organizacao_id;

async function carregarProcessos() {
    try {
        const processosResp = await api.listarProcessos(ministerio_id);
        const processos = processosResp.data || [];
        const etapasPorProcesso = {};
        for (const processo of processos) {
            const etapasResp = await api.listarEtapas(processo.id, ministerio_id);
            etapasPorProcesso[processo.id] = etapasResp.data || [];
        }
        ui.renderProcessos(processos, etapasPorProcesso);
        setupEtapasSortable(processos);
    } catch (err) {
        ui.processosContainer.innerHTML = `<div class='text-red-500'>${err.message}</div>`;
    }
}

function setupEtapasSortable(processos) {
    processos.forEach(processo => {
        const container = document.getElementById(`etapasContainer-${processo.id}`);
        if (container) {
            Sortable.create(container, {
                animation: 200,
                direction: 'horizontal',
                ghostClass: 'bg-primary-100',
                onEnd: async function (evt) {
                    // Atualiza orden das etapas
                    const etapas = Array.from(container.querySelectorAll('.draggableEtapa')).map((el, idx) => ({ id: el.dataset.id, orden: idx + 1 }));
                    await api.reordenarEtapas(etapas);
                    await carregarProcessos();
                }
            });
        }
    });
}

// Modal Novo Processo
const btnNovoProcesso = document.getElementById('btnNovoProcesso');
const modalNovoProcesso = document.getElementById('modalNovoProcesso');
const btnCancelarProcesso = document.getElementById('btnCancelarProcesso');
const formNovoProcesso = document.getElementById('formNovoProcesso');

btnNovoProcesso.addEventListener('click', () => ui.showModalNovoProcesso(true));
btnCancelarProcesso.addEventListener('click', () => ui.showModalNovoProcesso(false));
formNovoProcesso.addEventListener('submit', async e => {
    e.preventDefault();
    const nome = document.getElementById('nomeProcesso').value;
    const status = document.getElementById('statusProcesso').value;
    const errorMsg = document.getElementById('processoErrorMsg');
    errorMsg.classList.add('hidden');
    errorMsg.textContent = '';
    try {
        await api.criarProcesso({ nome, status, ministerio_id, organizacao_id });
        ui.showModalNovoProcesso(false);
        await carregarProcessos();
    } catch (err) {
        errorMsg.textContent = err.message;
        errorMsg.classList.remove('hidden');
    }
});

// Delegação para adicionar/excluir etapas/processos
ui.processosContainer.addEventListener('click', async e => {
    if (e.target.classList.contains('btnDeleteProcesso')) {
        const id = e.target.dataset.processoId;
        if (confirm('Excluir este processo?')) {
            await api.deletarProcesso(id);
            await carregarProcessos();
        }
    }
    if (e.target.classList.contains('btnAddEtapa')) {
        const processo_id = e.target.dataset.processoId;
        const nome = prompt('Nome da nova etapa:');
        if (nome) {
            // Busca etapas atuais para calcular orden
            const etapasContainer = document.getElementById(`etapasContainer-${processo_id}`);
            const etapasCount = etapasContainer ? etapasContainer.querySelectorAll('.draggableEtapa').length : 0;
            const orden = etapasCount + 1;
            await api.criarEtapa({ nome, ministerio_id, processo_id, orden });
            await carregarProcessos();
        }
    }
    if (e.target.classList.contains('btnDeleteEtapa')) {
        const id = e.target.dataset.etapaId;
        if (confirm('Excluir esta etapa?')) {
            await api.deletarEtapa(id);
            await carregarProcessos();
        }
    }
});

carregarProcessos();
