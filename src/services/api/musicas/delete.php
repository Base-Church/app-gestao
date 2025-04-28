<?php
require_once __DIR__ . '/../../../../vendor/autoload.php';
require_once __DIR__ . '/../../SessionService.php';

// Carrega as variáveis de ambiente
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../../');
$dotenv->load();

header('Content-Type: application/json');

function returnError($message, $code = 400) {
    http_response_code($code);
    echo json_encode(['error' => $message]);
    exit;
}

// Verifica autenticação
SessionService::start();
if (!SessionService::isLoggedIn()) {
    returnError('Não autorizado', 401);
}

// Verifica método
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    returnError('Método não permitido', 405);
}

// Recebe e valida os dados
$data = json_decode(file_get_contents('php://input'), true);
if (!$data || !isset($data['id'])) {
    returnError('ID não fornecido');
}

try {
    // Configura a requisição para a API externa
    $apiUrl = $_ENV['API_BASE_URL'] . '/api/musicas/' . $data['id'];
    
    if (!isset($_ENV['API_BASE_URL']) || !isset($_ENV['API_KEY'])) {
        throw new Exception('Configuração da API ausente no arquivo .env');
    }

    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $apiUrl,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => 'DELETE',
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

    // Retorna a resposta da API
    http_response_code($httpCode);
    echo $response;
} catch (Exception $e) {
    returnError($e->getMessage(), 500);
}
