<?php
// Mapeamento de URLs amigáveis para arquivos reais
return [
    // Página inicial
    '/inicio' => '/src/pages/inicio/index.php',

    // Geral
    '/geral/voluntarios'                    => '/src/pages/geral/voluntarios/index.php',
    '/geral/escalas'                        => '/src/pages/geral/escalas/index.php',
    '/geral/indisponibilidades'             => '/src/pages/geral/indisponibilidades/index.php',
    '/geral/aniversariantes'                => '/src/pages/geral/aniversariantes/index.php',
    '/geral'                                => '/src/pages/geral/geral/index.php',

    // Formularios
    '/formularios'                          => '/src/pages/formularios/index.php',
    '/formularios/preenchimentos'           => '/src/pages/preenchimentos/index.php',
    '/formularios/preenchimentos/dados'     => '/src/pages/preenchimentos/dados/index.php',

    '/formularios/criar'                    => '/src/pages/formularios/builder/index.php',
    '/formularios/editar'                   => '/src/pages/formularios/builder/index.php',

    // Escalas
    '/escalas'                              => '/src/pages/escalas/index.php',
    '/escalas/criar'                        => '/src/pages/escalas/build-escala/index.php',
    '/escalas/editar'                       => '/src/pages/escalas/build-escala/index.php',

    '/musicas'                              => '/src/pages/musicas/index.php',
    '/musica'                               => '/src/pages/musicas/detalhes/index.php',

    // Modelos
    '/modelos'                              => '/src/pages/modelos/index.php',
    '/modelos/criar'                        => '/src/pages/modelos/criar.php',

    // Ministérios
    '/ministerios'                          => '/src/pages/ministerios/index.php',

    // Solicitações
    '/solicitacoes'                         => '/src/pages/solicitacoes/index.php',

    // Liderança
    '/lideres'                              => '/src/pages/lideres/index.php',

        // processos
    '/processos'                              => '/src/pages/processos/index.php',

    // Atividades
    '/categoria-atividade'                  => '/src/pages/categoria-atividade/index.php',
    '/atividades'                           => '/src/pages/atividades/index.php',

    // Eventos
    '/eventos'                              => '/src/pages/eventos/index.php',

    // Recados
    '/recados'                              => '/src/pages/recados/index.php',

    // Voluntários
    '/voluntarios'                          => '/src/pages/voluntarios/index.php',
    '/calendario'                           => '/src/pages/calendario/index.php',
    '/observacoes'                          => '/src/pages/observacoes/index.php',

    // Ordem de culto
    '/orden-culto'                          => '/src/pages/orden-culto/index.php',

    // Disparador de Mensagens
    '/disparador'                           => '/src/pages/disparador/index.php',
    '/disparador/criar'                     => '/src/pages/disparador/criar/index.php',
    '/disparador/historico'                 => '/src/pages/disparador/historico.php',

    // Configurações
    '/configuracoes'                        => '/src/pages/configuracoes/index.php',

    // Páginas públicas
    '/login'                                => '/src/pages/login/index.php',
    '/cadastro'                             => '/src/pages/cadastro/index.php',
    '/recuperar'                            => '/src/pages/recuperar-senha/index.php',
    '/logout'                               => '/config/auth/login.logout.php',

    // Sem ministério
    '/sem-ministerio'                       => '/src/pages/sem-ministerio/index.php',

    // Aniversariantes
    '/aniversariantes'                      => '/src/pages/aniversariantes/index.php',
];
