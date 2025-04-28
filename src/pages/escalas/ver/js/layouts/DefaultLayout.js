import { EscalaFormatter } from '../services/EscalaFormatter.js';

export class DefaultLayout {
    static async render(data) {
        if (!data?.code || data.code !== 200) {
            throw new Error('Estrutura de resposta inválida');
        }

        const { escala, eventos } = data.data;
        if (!escala || !eventos) {
            console.error('Invalid data:', data);
            throw new Error('Estrutura de dados inválida: escala ou eventos ausentes');
        }
        
        const sortedEventos = this.sortEventosByDate(eventos);

        return `
            <div class="bg-white dark:bg-zinc-900 rounded-lg shadow p-4 mb-6">
                ${this.renderHeader(escala)}
            </div>
            <div class="space-y-6">
                ${this.renderEventos(sortedEventos)}
            </div>
        `;
    }

    static sortEventosByDate(eventos) {
        return eventos.slice().sort((a, b) => new Date(a.data_evento) - new Date(b.data_evento));
    }

    static renderHeader(escala) {
        const dataInicio = EscalaFormatter.formatDate(escala.data_inicio);
        const dataFim = EscalaFormatter.formatDate(escala.data_fim);
        
        return `
            <!-- Background Image -->
            <div class="fixed top-0 left-0 right-0 h-64 -z-10">
            <img src="${window.ENV.URL_BASE}/assets/img/fundo-crtv-branco.png" 
                 alt=""
                 class="w-full h-full object-cover blur-[2px] dark:hidden">
            <img src="${window.ENV.URL_BASE}/assets/img/fundo-crtv-branco.png" 
                 alt=""
                 class="w-full h-full object-cover blur-[2px] hidden dark:block">
            </div>

            <!-- Content Container -->
            <div class="backdrop-blur-sm bg-white/60 dark:bg-zinc-900/60 rounded-xl">
            <div class="flex items-start gap-4">
                <!-- Logo -->
                <img src="${window.ENV.URL_BASE}/assets/img/logo-crtv.jpg" 
                 alt="crtv Logo"
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

    static renderEventos(eventos) {
        return `
            <div class="space-y-6">
                ${eventos.map(evento => {
                    const dataEvento = EscalaFormatter.formatDate(evento.data_evento);
                    const horaEvento = EscalaFormatter.formatHorario(evento.hora);
                    const eventoImg = this.getImageUrl(evento.evento_foto, 'evento');

                    return `
                        <div class="bg-white dark:bg-zinc-900 rounded-lg shadow-sm overflow-hidden">
                            <div class="flex items-center gap-4 p-4 border-b border-gray-100 dark:border-zinc-800">
                                <div class="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                                    <img src="${eventoImg}" 
                                         alt="${evento.evento_nome}"
                                         class="h-full w-full object-cover"
                                         onerror="this.src='${window.ENV.URL_BASE}/assets/img/placeholder.jpg'">
                                </div>
                                <div class="flex-1">
                                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                                        ${evento.evento_nome}
                                    </h2>
                                    <div class="mt-1 flex items-center text-gray-600 dark:text-gray-400">
                                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span class="text-base">${dataEvento} · ${horaEvento}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="p-4">
                                <div class="space-y-6">
                                    ${this.renderVoluntarios(evento.atividades)}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    static renderVoluntarios(atividades) {
        if (!atividades?.length) return '';
        
        return `
            <div class="space-y-3">
                <div class="space-y-2">
                    ${atividades.map(membro => `
                        <div class="flex flex-col sm:flex-row sm:items-center p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg gap-2 transition-colors"
                             data-volunteer-id="${membro.voluntario_id}"
                             data-volunteer-name="${membro.voluntario_nome}">
                            <div class="flex items-center gap-3">
                                ${this.renderVoluntarioFoto(membro)}
                                <div class="flex flex-col sm:block">
                                    <span class="text-base font-medium text-gray-900 dark:text-white">
                                        ${membro.voluntario_nome}
                                    </span>
                                    <span class="text-[1.05rem] sm:hidden text-gray-500 dark:text-gray-400">
                                        ${membro.atividade_nome}
                                    </span>
                                </div>
                            </div>
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
                        </div>
                    `).join('')}
                </div>
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
}
