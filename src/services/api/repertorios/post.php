<?php
require_once __DIR__ . '/../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../config/auth/session.service.php';

// Carrega as variáveis de ambiente
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../../');
$dotenv->load();

// Recebe e valida os dados
$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Dados inválidos']);
    exit;
}

// Validações básicas
if (empty($data['nome'])) {
    returnError('Nome do repertório é obrigatório');
}

if (empty($data['id_escala'])) {
    returnError('ID da escala é obrigatório');
}

if (empty($data['eventos'])) {
    returnError('É necessário incluir ao menos um evento');
}

// Configura a requisição para a API externa
$apiUrl = $_ENV['API_BASE_URL'] . '/api/repertorios';

try {
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $apiUrl,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: ' . $_ENV['API_KEY'] // Removido o "Bearer" conforme seu teste
        ]
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (curl_errno($ch)) {
        throw new Exception(curl_error($ch));
    }

    curl_close($ch);

    // Retorna a resposta
    http_response_code($httpCode);
    header('Content-Type: application/json');
    echo $response;

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}
