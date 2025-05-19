<?php
require_once __DIR__ . '/../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../config/auth/session.service.php';

// Carrega as variáveis de ambiente
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../../');
$dotenv->load();

// Define o header da resposta como JSON
header('Content-Type: application/json');

// Função para retornar erro
function returnError($message, $code = 400) {
    http_response_code($code);
    echo json_encode(['error' => $message]);
    exit;
}

// Verifica se o usuário está autenticado
SessionService::start();
if (!SessionService::isLoggedIn()) {
    returnError('Não autorizado', 401);
}

// Verifica se é uma requisição GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    returnError('Método não permitido', 405);
}

// Pega os parâmetros da requisição
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100; // Aumentado o limite padrão
$search = isset($_GET['search']) ? trim($_GET['search']) : '';

// Validações básicas
if ($page < 1) {
    returnError('Página inválida');
}

if ($limit < 1 || $limit > 1000) { // Aumentado o limite máximo permitido
    returnError('Limite inválido');
}

// Monta a URL da API
$apiUrl = $_ENV['API_BASE_URL'] . '/api/musicas';
$params = [
    'page' => $page,
    'limit' => $limit
];

if (!empty($search)) {
    $params['search'] = $search;
}

$queryString = http_build_query($params);
$url = "{$apiUrl}?{$queryString}";

// Configuração do cURL
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'Authorization: ' . $_ENV['API_KEY']
    ]
]);

// Faz a requisição
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
$data = json_decode($response, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    returnError('Resposta inválida da API', 500);
}

// Retorna a resposta formatada
http_response_code($httpCode);
echo json_encode([
    'data' => $data['data'] ?? [],
    'meta' => [
        'page' => $page,
        'total' => $data['meta']['total'] ?? 0,
        'totalPages' => $data['meta']['totalPages'] ?? 0,
        'limit' => $limit
    ]
]);
