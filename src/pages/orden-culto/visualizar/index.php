<!DOCTYPE html>
<html lang="pt-BR" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visualização da Ordem de Culto</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    <style>
        body { 
            font-family: 'Inter', sans-serif; 
        }
        @media print {
            .no-print { 
                display: none !important; 
            }
            .print-only h1 {
                color: black !important;
                margin-bottom: 1.5rem;
                text-align: center;
            }
            .print-only {
                display: block !important;
            }
            @page {
                size: landscape;
                margin: 1cm;
            }
            @page :first {
                margin-top: 2cm;
            }
            .page-header {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                padding: 1cm;
                text-align: center;
                display: none;
            }
            .page-header:first-of-type {
                display: block;
            }
            .titulo-ordem {
                display: none !important;
            }
            .content-wrapper {
                margin-top: 0 !important;
            }
            body {
                background: white !important;
            }
            * {
                color: black !important;
                background-color: transparent !important;
            }
            .page-break-after {
                page-break-after: always;
            }
            .page-break-before {
                page-break-before: always;
            }
        }
        .print-only {
            display: none;
        }
        /* Estilo moderno para tabela */
        .tabela-moderna {
            border-spacing: 0;
            border-collapse: separate;
            border-radius: 8px;
            overflow: hidden;
            width: 100%;
        }
        .tabela-moderna th {
            font-weight: 500;
            letter-spacing: 0.05em;
            color: white !important;
        }
        .tabela-moderna th {
            background: transparent !important; /* Remove o fundo preto padrão */
            font-weight: 500;
            letter-spacing: 0.05em;
            border-right: 1px solid #333333;
        }
        .tabela-moderna th:last-child {
            border-right: none;
        }
        .tabela-moderna tr {
            background: #0a0a0a;
        }
        .tabela-moderna td {
            border-right: 1px solidrgb(100, 100, 100);
            border-bottom: 1px solidrgb(133, 133, 133);
        }
        .tabela-moderna td:last-child {
            border-right: none;
        }
        .tabela-moderna tr:last-child td {
            border-bottom: none;
        }
        .tabela-moderna tr:hover td {
            background: #1a1a1a;
        }
        /* Cores dos cabeçalhos - Aumentar especificidade e remover background preto padrão */
        .tabela-moderna thead tr th.header-color-1 { background-color: #E63946 !important; }
        .tabela-moderna thead tr th.header-color-2 { background-color: #457B9D !important; }
        .tabela-moderna thead tr th.header-color-3 { background-color: #2A9D8F !important; }
        .tabela-moderna thead tr th.header-color-4 { background-color: #8338EC !important; }
        .tabela-moderna thead tr th.header-color-5 { background-color: #FB8500 !important; }
        .tabela-moderna thead tr th.header-color-6 { background-color: #06D6A0 !important; }

        @media print {
            .tabela-moderna th {
                border-right: 1px solid #666666 !important;
            }
            .tabela-moderna td {
                border-right: 1px solid #666666 !important;
                border-bottom: 1px solid #666666 !important;
            }
            .tabela-moderna th:last-child,
            .tabela-moderna td:last-child {
                border-right: none !important;
            }
            .tabela-moderna tr:last-child td {
                border-bottom: none !important;
            }
            /* Garantir que as cores sejam mantidas na impressão */
            .tabela-moderna thead tr th.header-color-1 { background-color: #E63946 !important; -webkit-print-color-adjust: exact !important; }
            .tabela-moderna thead tr th.header-color-2 { background-color: #457B9D !important; -webkit-print-color-adjust: exact !important; }
            .tabela-moderna thead tr th.header-color-3 { background-color: #2A9D8F !important; -webkit-print-color-adjust: exact !important; }
            .tabela-moderna thead tr th.header-color-4 { background-color: #8338EC !important; -webkit-print-color-adjust: exact !important; }
            .tabela-moderna thead tr th.header-color-5 { background-color: #FB8500 !important; -webkit-print-color-adjust: exact !important; }
            .tabela-moderna thead tr th.header-color-6 { background-color: #06D6A0 !important; -webkit-print-color-adjust: exact !important; }
        }
        .ordem-numero {
            font-feature-settings: "tnum";
            font-variant-numeric: tabular-nums;
        }
        /* Cores para impressão */
        @media print {
            .bg-[#E63946] { background-color: #E63946 !important; }
            .bg-[#457B9D] { background-color: #457B9D !important; }
            .bg-[#2A9D8F] { background-color: #2A9D8F !important; }
            .bg-[#8338EC] { background-color: #8338EC !important; }
            .bg-[#FB8500] { background-color: #FB8500 !important; }
            .bg-[#06D6A0] { background-color: #06D6A0 !important; }
            
            .tabela-moderna th {
                color: white !important;
            }
        }
        /* Cores de cabeçalho */
        .header-color-1 { background-color: #E63946 !important; }
        .header-color-2 { background-color: #457B9D !important; }
        .header-color-3 { background-color: #2A9D8F !important; }
        .header-color-4 { background-color: #8338EC !important; }
        .header-color-5 { background-color: #FB8500 !important; }
        .header-color-6 { background-color: #06D6A0 !important; }

        @media print {
            .header-color-1 { background-color: #E63946 !important; }
            .header-color-2 { background-color: #457B9D !important; }
            .header-color-3 { background-color: #2A9D8F !important; }
            .header-color-4 { background-color: #8338EC !important; }
            .header-color-5 { background-color: #FB8500 !important; }
            .header-color-6 { background-color: #06D6A0 !important; }
        }
    </style>
</head>
<body class="bg-black text-white">
    <!-- Loading State -->
    <div id="loading" class="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>

    <!-- Error State -->
    <div id="error" class="hidden fixed inset-0 bg-black flex items-center justify-center z-50">
        <div class="text-center">
            <div class="text-red-600 text-xl mb-4">Erro ao carregar ordem de culto</div>
            <button onclick="window.close()" class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                Fechar
            </button>
        </div>
    </div>

    <!-- Content -->
    <div id="content" class="hidden max-w-[1200px] mx-auto p-6">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6 no-print titulo-ordem">
            <h1 class="text-2xl font-bold text-white">Ordem de Culto #<span id="ordem-id"></span></h1>
            <button onclick="window.print()" class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
                Imprimir
            </button>
        </div>

        <div class="content-wrapper">
            <!-- Evento Info -->
            <div id="evento-info" class="mb-8">
                <!-- Preenchido via JavaScript -->
            </div>

            <!-- Cultos -->
            <div id="cultos-container" class="space-y-8">
                <!-- Preenchido via JavaScript -->
            </div>
        </div>

        <!-- Última página sempre em uma página separada -->
        <?php require_once __DIR__ . '/componentes/ultima-pagina.php'; ?>
    </div>

    <script>
        window.ENV = {
            URL_BASE: '<?= $_ENV['URL_BASE'] ?>',
            API_BASE_URL: '',
            API_KEY: ''
        };
    </script>
    <script src="<?= $_ENV['URL_BASE'] ?>/src/pages/orden-culto/visualizar/js/visualizar.js" type="module"></script>
</body>
</html>
