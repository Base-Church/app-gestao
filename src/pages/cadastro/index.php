<?php
require_once __DIR__ . '/../../../vendor/autoload.php';
require_once __DIR__ . '/../../services/api/AuthService.php';
require_once __DIR__ . '/../../services/SessionService.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../');
$dotenv->load();

SessionService::start();

// Redireciona se já estiver logado
if (SessionService::isLoggedIn()) {
    header('Location: ' . $_ENV['URL_BASE'] . '/src/pages/inicio');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = $_POST['nome'] ?? '';
    $whatsapp = $_POST['whatsapp'] ?? '';
    $senha = $_POST['senha'] ?? '';

    $authService = new AuthService();
    $result = $authService->register($nome, $whatsapp, $senha);

    if ($result['status'] === 200 || $result['status'] === 201) {
        // Redireciona para o login após cadastro bem-sucedido
        header('Location: ' . $_ENV['URL_BASE'] . '/src/pages/login?cadastro=success');
        exit;
    } else {
        $error = $result['data']['message'] ?? 'Erro ao realizar cadastro';
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - <?php echo $_ENV['APP_NAME']; ?></title>
    <link href="<?php echo $_ENV['URL_BASE']; ?>/src/css/output.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    <style>
        body{
            font-family: 'Inter', sans-serif;
        }
    /* ===== Scrollbar CSS ===== */
  /* Firefox */
  * {
    scrollbar-width: none;
    scrollbar-color: #8f54a0 #ffffff;
  }

  /* Chrome, Edge, and Safari */
  *::-webkit-scrollbar {
    width: 16px;
  }

  *::-webkit-scrollbar-track {
    background: #ffffff;
  }

  *::-webkit-scrollbar-thumb {
    background-color: #8f54a0;
    border-radius: 10px;
    border: 3px solid #ffffff;
  }
</style>
<body class="bg-gradient-to-br from-primary-50 to-primary-100 min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
        <div class="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <div class="text-center">
                <img src="<?php echo $_ENV['URL_BASE']; ?>/assets/img/logo-preta.svg" alt="Logo" class="h-16 w-auto relative z-10 mx-auto">
                <p class="text-gray-600">Crie sua conta</p>
            </div>

            <?php if (isset($error)): ?>
                <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                            </svg>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm text-red-700">
                                <?php echo htmlspecialchars($error); ?>
                            </p>
                        </div>
                    </div>
                </div>
            <?php endif; ?>

            <form method="POST" class="space-y-6">
                <div class="form-group">
                    <input type="text" 
                           id="nome" 
                           name="nome" 
                           class="form-input peer" 
                           placeholder="Nome completo"
                           required>
                    <label for="nome" class="form-label">Nome completo</label>
                </div>

                <div class="form-group">
                    <input type="text" 
                           id="whatsapp" 
                           name="whatsapp" 
                           class="form-input peer" 
                           placeholder="WhatsApp"
                           inputmode="numeric"
                           required>
                    <label for="whatsapp" class="form-label">WhatsApp</label>
                </div>

                <div class="form-group">
                    <input type="password" 
                           id="senha" 
                           name="senha" 
                           class="form-input peer" 
                           placeholder="Senha"
                           required>
                    <label for="senha" class="form-label">Senha</label>
                </div>

                <button type="submit" 
                        class="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transform transition-all duration-150 hover:scale-[1.02]">
                    Cadastrar
                </button>
            </form>

            <div class="relative my-6">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-200"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-2 bg-white text-gray-500">ou</span>
                </div>
            </div>

            <p class="text-center text-sm text-gray-600">
                Já tem uma conta? 
                <a href="<?php echo $_ENV['URL_BASE']; ?>/src/pages/login" 
                   class="font-medium text-primary-600 hover:text-primary-700 hover:underline">
                    Fazer login
                </a>
            </p>
        </div>

        <p class="mt-8 text-center text-sm text-gray-500">
            &copy; <?php echo date('Y'); ?> <?php echo $_ENV['APP_NAME']; ?>. Todos os direitos reservados.
        </p>
    </div>

    <script>
        const whatsappInput = document.getElementById('whatsapp');
        const form = document.querySelector('form');

        whatsappInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            
            if (value.length > 2) {
                value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            }
            if (value.length > 10) {
                value = `${value.slice(0, 10)}-${value.slice(10)}`;
            }
            
            e.target.value = value;
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const whatsapp = whatsappInput.value.replace(/\D/g, '');
            const formattedWhatsapp = '55' + whatsapp;
            
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = 'whatsapp';
            hiddenInput.value = formattedWhatsapp;
            
            whatsappInput.removeAttribute('name');
            form.appendChild(hiddenInput);
            
            form.submit();
        });
    </script>
</body>
</html>
