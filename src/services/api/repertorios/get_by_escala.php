<?php
require_once __DIR__ . '/../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../config/auth/session.service.php';

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
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    returnError('Método não permitido', 405);
}

// Verifica e obtém o ID da escala
$id_escala = isset($_GET['id_escala']) ? (int)$_GET['id_escala'] : null;
if (!$id_escala) {
    returnError('ID da escala não fornecido');
}

$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;

// Monta a URL da API
$apiUrl = $_ENV['API_BASE_URL'] . "/api/repertorios/escala/{$id_escala}";
$params = [
    'page' => $page,
    'limit' => $limit
];

$queryString = http_build_query($params);
$url = "{$apiUrl}?{$queryString}";

// Configuração do cURL
try {
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Accept: application/json',
            'Authorization: Bearer ' . $_ENV['API_KEY']
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
    echo $response;

} catch (Exception $e) {
    returnError($e->getMessage(), 500);
}
