<?php
require_once __DIR__ . '/../../../vendor/autoload.php';
require_once __DIR__ . '/../../services/SessionService.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../');
$dotenv->load();

SessionService::start();

// Redireciona se não estiver logado
if (!SessionService::isLoggedIn()) {
    header('Location: ' . $_ENV['URL_BASE'] . '/src/pages/login');
    exit;
}

// Redireciona se tiver ministérios (segurança extra)
if (SessionService::hasMinisterios()) {
    header('Location: ' . $_ENV['URL_BASE'] . '/src/pages/inicio');
    exit;
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sem Ministério - <?php echo $_ENV['APP_NAME']; ?></title>
    <link href="<?php echo $_ENV['URL_BASE']; ?>/src/css/output.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-gradient-to-br from-primary-50 to-primary-100 min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
        <div class="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <div class="text-center">
                <img src="<?php echo $_ENV['URL_BASE']; ?>/assets/img/logo-preta.svg" alt="Logo" class="h-16 w-auto relative z-10 mx-auto">
                <h2 class="mt-4 text-xl font-semibold text-gray-900">Sem Acesso a Ministérios</h2>
                <p class="mt-2 text-gray-600">Sua conta ainda não está vinculada a nenhum ministério</p>
            </div>

            <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-yellow-700">
                            Entre em contato com o suporte.
                        </p>
                    </div>
                </div>
            </div>

            <div class="space-y-4">
                <?php if (isset($_ENV['SUPORTE_WHATSAPP']) && !empty($_ENV['SUPORTE_WHATSAPP'])): ?>
                    <a href="https://wa.me/<?php echo htmlspecialchars($_ENV['SUPORTE_WHATSAPP']); ?>?text=<?php echo urlencode('Olá! Preciso de ajuda para acessar minha conta no ' . $_ENV['APP_NAME'] . '. Acabei de me cadastrar mas não tenho acesso a nenhum ministério.'); ?>" 
                       target="_blank"
                       class="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform transition-all duration-150 hover:scale-[1.02] flex items-center justify-center gap-2">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                        </svg>
                        Falar com o Suporte
                    </a>
                <?php else: ?>
                    <p class="text-center text-sm text-red-600">
                        Contato do suporte não configurado
                    </p>
                <?php endif; ?>

                <form action="<?php echo $_ENV['URL_BASE']; ?>/src/services/auth/logout.php" method="POST" class="pt-4">
                    <button type="submit" 
                            class="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform transition-all duration-150">
                        Sair
                    </button>
                </form>
            </div>
        </div>

        <p class="mt-8 text-center text-sm text-gray-500">
            Copyright © <?php echo date('Y'); ?> <?php echo $_ENV['APP_NAME']; ?> | Desenvolvido com ♥ por 
            <a href="https://wa.me/5563984193411" target="_blank" class="text-primary-600 hover:text-primary-700">
              Triks
            </a>
        </p>
    </div>
</body>
</html>
