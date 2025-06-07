<?php
require_once __DIR__ . '/../../../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../');
$dotenv->load();
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
                <img src="<?php echo $_ENV['URL_BASE']; ?>/assets/img/logo-preta.svg" alt="Logo" class="h-18 md:h-20 w-auto mx-auto">
                <p class="text-gray-600 mt-4">Recuperação de Senha</p>
            </div>

            <!-- Mensagens -->
            <div id="message-error" style="display:none;" class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p class="text-sm text-red-700" id="message-error-text"></p>
            </div>
            <div id="message-success" style="display:none;" class="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <p class="text-sm text-green-700" id="message-success-text"></p>
            </div>

            <!-- Step 1: Solicitar código -->
            <form id="step1-form" class="space-y-6">
                <div class="form-group">
                    <input type="text" id="whatsapp" class="form-input peer" inputmode="numeric" required>
                    <label for="whatsapp" class="form-label">WhatsApp</label>
                </div>
                <button type="submit" id="step1-btn" class="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 flex items-center justify-center gap-2">
                    <span>Solicitar Código</span>
                    <svg id="step1-spinner" class="animate-spin h-5 w-5 text-white" style="display:none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                </button>
            </form>

            <!-- Step 2: Atualizar senha -->
            <form id="step2-form" class="space-y-6" style="display:none;">
                <div class="form-group">
                    <input type="text" 
                           id="codigo" 
                           class="form-input peer" 
                           inputmode="numeric"
                           pattern="\d*"
                           maxlength="6"
                           required>
                    <label for="codigo" class="form-label">Código Recebido</label>
                </div>
                <div class="form-group">
                    <input type="password" id="nova_senha" class="form-input peer" required>
                    <label for="nova_senha" class="form-label">Nova Senha</label>
                </div>
                <button type="submit" id="step2-btn" class="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 flex items-center justify-center gap-2">
                    <span>Alterar Senha</span>
                    <svg id="step2-spinner" class="animate-spin h-5 w-5 text-white" style="display:none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                </button>
            </form>

            <p class="text-center text-sm text-gray-600">
                <a href="<?php echo $_ENV['URL_BASE']; ?>/login" class="font-medium text-primary-600 hover:text-primary-700">Voltar para o login</a>
            </p>
        </div>
    </div>

    <script>
        let savedWhatsapp = '';
        const step1Form = document.getElementById('step1-form');
        const step2Form = document.getElementById('step2-form');
        const whatsappInput = document.getElementById('whatsapp');
        const errorDiv = document.getElementById('message-error');
        const errorMsg = document.getElementById('message-error-text');
        const successDiv = document.getElementById('message-success');
        const successMsg = document.getElementById('message-success-text');
        const codigoInput = document.getElementById('codigo');
        
        // Máscara WhatsApp
        whatsappInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            if (value.length > 2) value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            if (value.length > 10) value = `${value.slice(0, 10)}-${value.slice(10)}`;
            e.target.value = value;
        });

        // Limitar apenas números e máximo 6 dígitos no código
        codigoInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 6) value = value.slice(0, 6);
            e.target.value = value;
        });

        // Step 1: Solicitar código
        step1Form.addEventListener('submit', function(e) {
            e.preventDefault();
            const spinner = document.getElementById('step1-spinner');
            const btn = document.getElementById('step1-btn');
            
            spinner.style.display = '';
            btn.disabled = true;
            errorDiv.style.display = 'none';
            successDiv.style.display = 'none';

            const whatsapp = whatsappInput.value.replace(/\D/g, '');
            savedWhatsapp = '55' + whatsapp;

            fetch('<?php echo $_ENV['URL_BASE']; ?>/config/auth/recuperar-senha.service.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    step: 'solicitar',
                    whatsapp: savedWhatsapp 
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.message === 'Código de recuperação enviado por WhatsApp') {
                    step1Form.style.display = 'none';
                    step2Form.style.display = 'block';
                    successMsg.textContent = 'Código enviado! Verifique seu WhatsApp.';
                    successDiv.style.display = 'block';
                } else {
                    errorMsg.textContent = data.error || data.message || 'Erro ao enviar código';
                    errorDiv.style.display = 'block';
                }
            })
            .catch(err => {
                errorMsg.textContent = 'Erro ao conectar com servidor';
                errorDiv.style.display = 'block';
            })
            .finally(() => {
                spinner.style.display = 'none';
                btn.disabled = false;
            });
        });

        // Step 2: Atualizar senha
        step2Form.addEventListener('submit', function(e) {
            e.preventDefault();
            const spinner = document.getElementById('step2-spinner');
            const btn = document.getElementById('step2-btn');
            
            spinner.style.display = '';
            btn.disabled = true;
            errorDiv.style.display = 'none';
            successDiv.style.display = 'none';

            fetch('<?php echo $_ENV['URL_BASE']; ?>/config/auth/recuperar-senha.service.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    step: 'atualizar',
                    whatsapp: savedWhatsapp,
                    codigo: document.getElementById('codigo').value,
                    nova_senha: document.getElementById('nova_senha').value
                })
            })
            .then(res => res.json())
            .then data => {
                if (data.message === 'Senha atualizada com sucesso' || data.success) {
                    successMsg.textContent = 'Senha alterada com sucesso! Redirecionando...';
                    successDiv.style.display = 'block';
                    setTimeout(() => {
                        window.location.href = '<?php echo $_ENV['URL_BASE']; ?>/login';
                    }, 2000);
                } else {
                    errorMsg.textContent = data.error || data.message || 'Erro ao alterar senha';
                    errorDiv.style.display = 'block';
                }
            })
            .catch(err => {
                errorMsg.textContent = 'Erro ao conectar com servidor';
                errorDiv.style.display = 'block';
            })
            .finally(() => {
                spinner.style.display = 'none';
                btn.disabled = false;
            });
        });
    </script>
</body>
</html>
