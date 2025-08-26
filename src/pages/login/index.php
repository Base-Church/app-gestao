<?php
// Carrega variáveis de ambiente sem Composer
require_once __DIR__ . '/../../../config/load_env.php';
require_once __DIR__ . '/../../../config/auth/session.service.php';

SessionService::start();

// Redireciona se já estiver logado
$urlBase = $_ENV['URL_BASE'] ?? ($_SERVER['URL_BASE'] ?? '');
if (SessionService::isLoggedIn()) {
    header('Location: ' . $urlBase . '/inicio');
    exit;
}

?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - <?php echo $_ENV['APP_NAME']; ?></title>
    <link href="<?php echo $_ENV['URL_BASE']; ?>/assets/css/output.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    <style>
        body{
            font-family: 'Inter', sans-serif;
        }
    /* ===== Scrollbar CSS ===== */
  /* Firefox */
  * {
    scrollbar-width: none;
    scrollbar-color: #8b5cf6 #ffffff;
  }

  /* Chrome, Edge, and Safari */
  *::-webkit-scrollbar {
    width: 16px;
  }

  *::-webkit-scrollbar-track {
    background: #ffffff;
  }

  *::-webkit-scrollbar-thumb {
    background-color: #8b5cf6;
    border-radius: 10px;
    border: 3px solid #ffffff;
  }
</style>
</head>
<body class="bg-gradient-to-br from-primary-50 to-primary-100 min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
        <div class="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <div class="text-center">
                <img src="<?php echo $_ENV['URL_BASE']; ?>/assets/img/logo-preta.svg" alt="Logo" class="h-18 md:h-20 w-auto relative z-10 mx-auto transition-transform hover:scale-105">
                <p class="text-gray-600 mt-4">Faça login para acessar sua conta</p>
            </div>
            <?php if (isset($_GET['cadastro']) && $_GET['cadastro'] === 'success'): ?>
                <div class="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm text-green-700">
                                Cadastro realizado com sucesso! Faça login para continuar.
                            </p>
                        </div>
                    </div>
                </div>
            <?php endif; ?>

            <div id="login-error" style="display:none;" class="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-2">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-red-700" id="login-error-msg"></p>
                    </div>
                </div>
            </div>

            <form id="login-form" class="space-y-6" autocomplete="off">
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
                        id="login-btn"
                        class="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transform transition-all duration-150 hover:scale-[1.02] flex items-center justify-center gap-2">
                    <span id="login-btn-text">Entrar</span>
                    <svg id="login-btn-spinner" class="animate-spin h-5 w-5 text-white" style="display:none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
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
                Não tem uma conta? 
                <a href="<?php echo $_ENV['URL_BASE']; ?>/src/pages/cadastro" 
                   class="font-medium text-primary-600 hover:text-primary-700 hover:underline">
                    Cadastre-se
                </a>
            </p>
            <p class="text-center text-sm text-gray-600">
                <a href="<?php echo $_ENV['URL_BASE']; ?>/recuperar" 
                   class="font-medium text-primary-600 hover:text-primary-700 hover:underline">
                    Esqueceu sua senha?
                </a>
            </p>
        </div>

       
         <img src="<?php echo $_ENV['URL_BASE']; ?>/assets/img/rodape-login.png" class="mt-8 h-22 pm-8 mx-auto">

          <p class="mt-8 text-center text-sm text-gray-500">
            Copyright © <?php echo date('Y'); ?> <?php echo $_ENV['APP_NAME']; ?> | Desenvolvido com ♥ por 
            <a href="https://wa.me/5563984193411" target="_blank" class="text-primary-600 hover:text-primary-700">
              Triks
            </a>
          
        </p>
    </div>
    <script>
        // Adiciona máscara ao campo WhatsApp
        const whatsappInput = document.getElementById('whatsapp');
        const senhaInput = document.getElementById('senha');
        const form = document.getElementById('login-form');
        const errorDiv = document.getElementById('login-error');
        const errorMsg = document.getElementById('login-error-msg');
        const loginBtn = document.getElementById('login-btn');
        const loginBtnText = document.getElementById('login-btn-text');
        const loginBtnSpinner = document.getElementById('login-btn-spinner');

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
            errorDiv.style.display = 'none';
            loginBtn.disabled = true;
            loginBtnSpinner.style.display = '';
            loginBtnText.textContent = 'Entrando...';

            const whatsapp = whatsappInput.value.replace(/\D/g, '');
            const formattedWhatsapp = '55' + whatsapp;
            const senha = senhaInput.value;

            fetch('<?php echo $_ENV['URL_BASE']; ?>/config/auth/auth.service.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ whatsapp: formattedWhatsapp, senha: senha })
            })
            .then(res => res.json())
            .then(data => {
                loginBtn.disabled = false;
                loginBtnSpinner.style.display = 'none';
                loginBtnText.textContent = 'Entrar';
                if (data.success) {
                    window.location.href = "<?php echo $_ENV['URL_BASE']; ?>/inicio";
                } else {
                    errorMsg.textContent = data.message || 'Erro ao fazer login';
                    errorDiv.style.display = 'block';
                }
            })
            .catch(() => {
                loginBtn.disabled = false;
                loginBtnSpinner.style.display = 'none';
                loginBtnText.textContent = 'Entrar';
                errorMsg.textContent = 'Erro de conexão com o servidor.';
                errorDiv.style.display = 'block';
            });
        });
    </script>
</body>
</html>
