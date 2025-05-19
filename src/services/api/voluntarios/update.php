<?php
require_once __DIR__ . '/../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../config/auth/session.service.php';

// Carrega as variáveis de ambiente
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../../');
$dotenv->load();

header('Content-Type: application/json');
header('Access-Control-Allow-Methods: PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Se for uma requisição OPTIONS, retorna sucesso
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

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

// Verifica método HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    returnError('Método não permitido', 405);
}

// Obtém e valida os dados da requisição
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || !isset($data['id'])) {
    returnError('Dados inválidos');
}

try {
    // Monta a URL da API
    $apiUrl = $_ENV['API_BASE_URL'] . '/api/voluntarios/' . $data['id'];

    // Configuração do cURL
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $apiUrl,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => 'PUT',
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Accept: application/json',
            'Authorization: ' . $_ENV['API_KEY']
        ]
    ]);

    // Executa a requisição
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // Verifica erros do cURL
    if (curl_errno($ch)) {
        $error = curl_error($ch);
        curl_close($ch);
        returnError("Erro ao conectar com a API: {$error}", 500);
    }

    curl_close($ch);

    // Verifica se a resposta é um JSON válido
    $responseData = json_decode($response, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        returnError('Resposta inválida da API', 500);
    }

    // Retorna a resposta
    http_response_code($httpCode);
    echo json_encode($responseData);

} catch (Exception $e) {
    returnError('Erro ao processar a requisição: ' . $e->getMessage(), 500);
}
