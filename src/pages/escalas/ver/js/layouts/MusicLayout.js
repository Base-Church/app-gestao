import { EscalaFormatter } from '../services/EscalaFormatter.js';
import { BaseLayout } from './BaseLayout.js';
import { EscalaApi } from '../services/EscalaApi.js';
import { RepertorioService } from '../services/RepertorioService.js';
import { MusicasModal } from '../components/MusicasModal.js';

export class MusicLayout extends BaseLayout {
    static vozesAtividades = new Set();

    static async render(data) {
        // Buscar e configurar atividades de voz primeiro
        try {
            const categoriaId = '21';
            const organizacaoId = window.ENV.ORGANIZACAO_ID;
            const atividadesResponse = await EscalaApi.fetchAtividadesByCategoria(categoriaId, organizacaoId);
            
            if (atividadesResponse?.data) {
                // Armazenar IDs das atividades que são vozes
                this.vozesAtividades = new Set(atividadesResponse.data.map(a => a.id));
                console.log('=== IDs de atividades de voz carregados ===', {
                    ids: [...this.vozesAtividades],
                    atividades: atividadesResponse.data
                });
            }
        } catch (error) {
            console.error('Erro ao buscar atividades por categoria:', error);
        }

        // Definir função showMusicasModal globalmente antes de renderizar
        window.showMusicasModal = (musicas, eventoInfo) => {
            const modal = new MusicasModal();
            modal.show(musicas, eventoInfo);
        };

        if (!data?.code || data.code !== 200) {
            throw new Error('Invalid response structure');
        }

        const { escala, eventos } = data.data;
        if (!escala || !eventos) {
            throw new Error('Invalid data structure: missing escala or eventos');
        }

        // Buscar repertórios da escala
        let repertorioData = null;
        try {
            const response = await RepertorioService.getByEscala(escala.id);
            repertorioData = response;
            
        } catch (error) {
        }

        const futureEventos = this.filterFutureEvents(eventos);
        const sortedEventos = this.sortEventosByDate(futureEventos);

        // Verifica modal automático
        this.checkAutoOpenModal(eventos, repertorioData?.original.data);

        return `
            <div class="bg-white dark:bg-zinc-900 rounded-lg shadow p-4 mb-6">
                ${this.renderHeader(escala)}
            </div>
            <div class="space-y-6">
                ${this.renderEventos(sortedEventos, repertorioData?.mapped || {})}
            </div>
        `;
    }

    static sortEventosByDate(eventos) {
        return eventos.slice().sort((a, b) => new Date(a.data_evento) - new Date(b.data_evento));
    }

    static groupAtividades(atividades) {
        const grupos = {
            vozes: [],
            outros: []
        };

        atividades.forEach(membro => {
            if (this.vozesAtividades.has(membro.atividade_id)) {
                grupos.vozes.push(membro);
            } else {
                grupos.outros.push(membro);
            }
        });

        return grupos;
    }

    static renderHeader(escala) {
        const dataInicio = EscalaFormatter.formatDate(escala.data_inicio);
        const dataFim = EscalaFormatter.formatDate(escala.data_fim);
        
        return `
            <!-- Background Image -->
            <div class="fixed top-0 left-0 right-0 h-64 -z-10">
            <img src="${window.ENV.URL_BASE}/assets/img/fundo-music-branco.png" 
                 alt=""
                 class="w-full h-full object-cover blur-[2px] dark:hidden">
            <img src="${window.ENV.URL_BASE}/assets/img/fundo-music-branco.png" 
                 alt=""
                 class="w-full h-full object-cover blur-[2px] hidden dark:block">
            </div>

            <!-- Content Container -->
            <div class="backdrop-blur-sm bg-white/60 dark:bg-zinc-900/60 rounded-xl">
            <div class="flex items-start gap-4">
                <!-- Logo -->
                <img src="${window.ENV.URL_BASE}/assets/img/logo-music.jpg" 
                 alt="Music Logo"
                 class="w-16 h-16 object-contain rounded-xl shadow-lg ring-1 ring-black/5 dark:ring-white/5 shrink-0">
                
                <!-- Text Content -->
                <div class="flex-1 pt-1">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                    ${escala.nome}
                </h1>
                <div class="mt-2 flex items-center gap-3">
                    <span class="text-base text-gray-600 dark:text-gray-400">
                    ${dataInicio}${dataInicio !== dataFim ? ` até ${dataFim}` : ''}
                    </span>
                    <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-zinc-800 dark:text-zinc-200">
                    ${escala.tipo}
                    </span>
                </div>
                </div>
            </div>
            </div>
        `;
    }

    static renderEventos(eventos, repertoriosMapped) {
        if (!eventos?.length) return '<div>Não há eventos para exibir</div>';

        // Adicionar função global para toggle de voluntários
        window.toggleVoluntarios = function(button) {
            const eventoId = button.getAttribute('data-evento-id');
            const voluntariosDiv = document.getElementById(`voluntarios-${eventoId}`);
            if (voluntariosDiv) {
                voluntariosDiv.classList.toggle('hidden');
                button.textContent = voluntariosDiv.classList.contains('hidden') ? 'Ver voluntários' : 'Ocultar voluntários';
            }
        };

        return `
            <div class="space-y-6">
                ${eventos.map(evento => {
                    const repertorio = repertoriosMapped[evento.escala_item_id];
                    const eventoInfo = {
                        evento_nome: evento.evento_nome,
                        data_evento: evento.data_evento,
                        hora: evento.hora
                    };

                    return `
                        <div class="bg-white dark:bg-zinc-900 rounded-lg shadow-sm overflow-hidden">
                            <div class="flex items-center gap-4 p-4">
                                <div class="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                                    <img src="${this.getImageUrl(evento.evento_foto, 'evento')}" 
                                         alt="${evento.evento_nome}"
                                         class="h-full w-full object-cover"
                                         onerror="this.src='${window.ENV.URL_BASE}/assets/img/placeholder.jpg'">
                                </div>
                                <div class="flex-1">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-2">
                                            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                                                ${evento.evento_nome}
                                            </h2>
                                            <div class="flex items-center gap-2">
                                                ${this.getStatusTag(evento.data_evento, evento.hora)}
                                                ${repertorio ? `
                                                    <svg class="w-5 h-5 text-blue-500 cursor-pointer" 
                                                         onclick='showMusicasModal(${JSON.stringify(repertorio.musicas)}, ${JSON.stringify(eventoInfo)})'
                                                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                                                    </svg>
                                                ` : ''}
                                            </div>
                                        </div>
                                        ${this.isEventPast(evento.data_evento, evento.hora) ? `
                                            <button 
                                                onclick="toggleVoluntarios(this)" 
                                                data-evento-id="${evento.escala_item_id}"
                                                class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-full transition-colors">
                                                Ver voluntários
                                            </button>
                                        ` : ''}
                                    </div>
                                    <div class="mt-1 flex items-center text-gray-600 dark:text-gray-400">
                                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span class="text-base">${EscalaFormatter.formatDate(evento.data_evento)} · ${EscalaFormatter.formatHorario(evento.hora)}</span>
                                    </div>
                                </div>
                            </div>
                            ${!this.isEventPast(evento.data_evento, evento.hora) ? `
                                <div class="p-4 border-t border-gray-100 dark:border-zinc-800">
                                    ${this.renderInstrumentosGroup(evento.atividades)}
                                </div>
                            ` : `
                                <div id="voluntarios-${evento.escala_item_id}" class="hidden">
                                    <div class="p-4 border-t border-gray-100 dark:border-zinc-800">
                                        ${this.renderInstrumentosGroup(evento.atividades)}
                                    </div>
                                </div>
                            `}
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    static renderVoluntarioFoto(membro) {
        return `
            <div class="relative inline-block">
                <div class="w-12 h-12 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                    ${membro.voluntario_foto ? `
                        <img src="${this.getImageUrl(membro.voluntario_foto)}" 
                             alt="${membro.voluntario_nome}"
                             class="w-full h-full object-cover"
                             onerror="this.onerror=null; this.src='${window.ENV.URL_BASE}/assets/img/placeholder.jpg'">
                    ` : `
                        <span class="text-xl font-semibold text-gray-500 dark:text-gray-400">
                            ${membro.voluntario_nome.charAt(0)}
                        </span>
                    `}
                </div>
                ${membro.atividade_foto ? `
                    <div class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full overflow-hidden border-2 border-white dark:border-zinc-800 bg-white dark:bg-zinc-800">
                        <img src="${this.getImageUrl(membro.atividade_foto, 'atividade')}" 
                             alt="${membro.atividade_nome}"
                             class="w-full h-full object-cover"
                             onerror="this.src='${window.ENV.URL_BASE}/assets/img/placeholder.jpg'">
                    </div>
                ` : ''}
            </div>
        `;
    }

    static renderInstrumentosGroup(atividades) {
        if (!atividades.length) return '';

        // Separar vozes e não-vozes
        const membrosVoz = atividades.filter(m => this.vozesAtividades.has(parseInt(m.atividade_id)));
        const outrosMembros = atividades.filter(m => !this.vozesAtividades.has(parseInt(m.atividade_id)));
        
        return `
            <div class="space-y-2">
                ${outrosMembros.map(membro => this.renderVoluntarioCard(membro, false)).join('')}
                
                ${membrosVoz.length > 0 ? `
                    <div class="flex items-center gap-2 text-blue-500 mt-6 mb-4">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                        <span class="font-medium">Vozes</span>
                    </div>
                    ${membrosVoz.map(membro => this.renderVoluntarioCard(membro, true)).join('')}
                ` : ''}
            </div>
        `;
    }

    static renderVoluntarioCard(membro, isVoz) {
        return `
            <div class="flex flex-col sm:flex-row sm:items-center p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg gap-2 transition-colors"
                 data-volunteer-id="${membro.voluntario_id}"
                 data-volunteer-name="${membro.voluntario_nome}"
                 data-volunteer-type="instrumento">
                <div class="flex items-center gap-3">
                    ${this.renderVoluntarioFoto(membro)}
                    <div class="flex flex-col sm:block">
                        <span class="text-base font-medium text-gray-900 dark:text-white">
                            ${membro.voluntario_nome}
                        </span>
                        ${!isVoz ? `
                            <span class="text-[1.05rem] sm:hidden text-gray-500 dark:text-gray-400">
                                ${membro.atividade_nome}
                            </span>
                        ` : ''}
                    </div>
                </div>
                ${!isVoz ? `
                    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-end sm:gap-3">
                        <span class="text-sm text-gray-500 dark:text-gray-400">
                            ${membro.atividade_nome}
                        </span>
                        <div class="w-6 h-6 rounded overflow-hidden flex-shrink-0">
                            <img src="${this.getImageUrl(membro.atividade_foto, 'atividade')}" 
                                 alt="${membro.atividade_nome}"
                                 class="w-full h-full object-cover"
                                 onerror="this.src='${window.ENV.URL_BASE}/assets/img/placeholder.jpg'">
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    static getImageUrl(path, type = 'placeholder') {
        if (!path) return `${window.ENV.URL_BASE}/assets/img/placeholder.jpg`;
        
        switch (type) {
            case 'evento':
                return `${window.ENV.URL_BASE}/assets/img/eventos/${path}`;
            case 'atividade':
                return `${window.ENV.URL_BASE}/assets/img/atividades/${path}`;
            default:
                return path.startsWith('http') ? path : `${window.ENV.URL_BASE}/assets/img/placeholder.jpg'`;
        }
    }

    static checkAutoOpenModal(eventos, repertorios) {
        const urlParams = new URLSearchParams(window.location.search);
        const autoOpenEventId = urlParams.get('rep');
        
        if (autoOpenEventId) {
            const evento = eventos.find(e => e.evento_id === parseInt(autoOpenEventId));
            if (evento) {
                const repertorio = repertorios?.find(r => r.id_eventos.includes(parseInt(autoOpenEventId)));
                if (repertorio?.id_musicas) {
                    setTimeout(() => {
                        window.showMusicasModal(repertorio.id_musicas, evento);
                    }, 500);
                }
            }
        }
    }
}
