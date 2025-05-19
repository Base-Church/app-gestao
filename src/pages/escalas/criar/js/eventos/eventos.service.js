/**
 * Serviço para listar e selecionar eventos e data
 */
class EventosService {
    constructor() {
        this.eventosDisponiveis = [];
        this.eventoSelecionadoId = null;
    }

    async buscarEventos() {
        this.eventosDisponiveis = await window.apiService.buscarEventos();
        return this.eventosDisponiveis;
    }

    abrirSeletorEventos(containerId, onEventoSelecionado) {
        // containerId: id do container onde inserir o seletor
        // onEventoSelecionado: callback(evento)
        const container = document.getElementById(containerId);
        if (!container) return;

        this.buscarEventos().then(eventos => {
            const seletorId = `seletor-eventos-${Date.now()}`;
            const html = window.eventosComponentesService.criarSeletorEventos(
                eventos,
                seletorId
            );
            container.innerHTML = html;
            this.configurarEventosLista(seletorId, (evento) => {
                if (typeof onEventoSelecionado === 'function') {
                    onEventoSelecionado(evento, seletorId);
                }
            });
        });
    }

    configurarEventosLista(seletorId, onEventoSelecionado) {
        const listaEventos = document.getElementById(`lista-eventos-${seletorId}`);
        if (!listaEventos) return;

        const detalhesContainer = document.getElementById(`detalhes-evento-${seletorId}`);
        const itensEvento = listaEventos.querySelectorAll('.evento-item');
        itensEvento.forEach(item => {
            item.addEventListener('click', () => {
                itensEvento.forEach(i => i.classList.remove('bg-primary-50', 'dark:bg-primary-900/20', 'border-l-4', 'border-primary-500'));
                item.classList.add('bg-primary-50', 'dark:bg-primary-900/20', 'border-l-4', 'border-primary-500');
                const eventoId = parseInt(item.dataset.eventoId);
                this.eventoSelecionadoId = eventoId;
                this.mostrarDetalhesEvento(eventoId, seletorId, detalhesContainer, (evento) => {
                    // Oculta apenas a lista lateral
                    listaEventos.style.display = 'none';
                    // Expande detalhes para ocupar o espaço
                    detalhesContainer.classList.remove('md:col-span-2', 'lg:col-span-3', 'p-0');
                    detalhesContainer.classList.add('col-span-full', 'p-2');
                    // Adiciona botão "Trocar evento" se não existir
                    let btnTrocar = detalhesContainer.querySelector('.btn-trocar-evento');
                    if (!btnTrocar) {
                        btnTrocar = document.createElement('button');
                        btnTrocar.type = 'button';
                        btnTrocar.className = 'btn-trocar-evento ml-4 px-3 py-1 bg-primary-100 hover:bg-primary-200 text-primary-700 rounded transition text-xs font-semibold';
                        btnTrocar.innerText = 'Trocar evento';
                        btnTrocar.title = 'Trocar evento';
                        btnTrocar.onclick = (e) => {
                            e.stopPropagation();
                            // Apenas exibe a lista lateral e ajusta layout, sem resetar detalhe
                            listaEventos.style.display = '';
                            detalhesContainer.classList.remove('col-span-full', 'p-2');
                            detalhesContainer.classList.add('md:col-span-2', 'lg:col-span-3', 'p-0');
                            btnTrocar.remove();
                        };
                        // Insere o botão no header do detalhe
                        const header = detalhesContainer.querySelector('.evento-detalhado-header');
                        if (header) {
                            header.appendChild(btnTrocar);
                        }
                    }
                    if (typeof onEventoSelecionado === 'function') {
                        onEventoSelecionado(evento, seletorId);
                    }
                });
            });
        });
    }

    mostrarDetalhesEvento(eventoId, seletorId, detalhesContainer, onEventoSelecionado) {
        if (!detalhesContainer) return;
        const evento = this.eventosDisponiveis.find(ev => ev.id === eventoId);
        if (!evento) return;
        detalhesContainer.innerHTML = window.eventosComponentesService.criarCardEventoDetalhado(
            evento,
            seletorId
        );
        // Nenhuma lógica de sincronização de data aqui
        if (typeof onEventoSelecionado === 'function') {
            onEventoSelecionado(evento, seletorId);
        }
    }
}

window.eventosService = new EventosService();
// Nenhuma redundância encontrada.
