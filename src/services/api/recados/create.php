<?php 
require_once __DIR__ . '/../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../config/auth/session.service.php';

// Carrega as variáveis de ambiente
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../../');
$dotenv->load();

header('Content-Type: application/json');

// Verifica autenticação
SessionService::start();
if (!SessionService::isLoggedIn()) {
    http_response_code(401);
    echo json_encode(['error' => 'Não autorizado']);
    exit;
}

// Verifica método
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    exit;
}

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Debug
    error_log('Dados recebidos: ' . json_encode($data));
    
    // Validações básicas obrigatórias
    if (!isset($data['titulo']) || !isset($data['texto'])) {
        throw new Exception('Título e texto são obrigatórios');
    }

    // Define o ministério_id baseado no nível do usuário e checkbox
    $ministerio_id = null;
    if (SessionService::getNivel() === 'superadmin' && isset($data['enviar_todos']) && $data['enviar_todos'] === true) {
        // Se for superadmin e enviar_todos estiver marcado, mantém ministerio_id como null
        error_log('Superadmin - Enviando para todos os ministérios');
    } else {
        // Caso contrário, usa o ministério atual
        $ministerio_atual = SessionService::getMinisterioAtual();
        $ministerio_id = is_array($ministerio_atual) ? $ministerio_atual['id'] : $ministerio_atual;
        error_log('Enviando para ministério específico: ' . $ministerio_id);
    }

    // Prepara payload
    $payload = [
        'titulo' => $data['titulo'],
        'texto' => $data['texto'],
        'ministerio_id' => $ministerio_id,
        'organizacao_id' => SessionService::getOrganizacaoId()
    ];

    // Adiciona validade apenas se fornecida
    if (!empty($data['validade'])) {
        $payload['validade'] = $data['validade'];
    }

    // Faz requisição para API
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $_ENV['API_BASE_URL'] . '/api/recados',
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: ' . $_ENV['API_KEY']
        ]
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (curl_errno($ch)) {
        throw new Exception(curl_error($ch));
    }

    curl_close($ch);
    
    // Retorna resposta
    http_response_code($httpCode);
    echo $response;

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}
