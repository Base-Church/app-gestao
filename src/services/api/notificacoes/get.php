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
$organizacao_id = isset($_GET['organizacao_id']) ? (int)$_GET['organizacao_id'] : null;
$ministerio_id = isset($_GET['ministerio_id']) ? (int)$_GET['ministerio_id'] : null;

// Validações
if (!$organizacao_id) {
    returnError('ID da organização é obrigatório');
}

if (!$ministerio_id) {
    returnError('ID do ministério é obrigatório');
}

// Monta a URL da API externa
$apiUrl = rtrim($_ENV['API_BASE_URL'], '/') . '/api/notificacoes';
$params = http_build_query([
    'organizacao_id' => $organizacao_id,
    'ministerio_id' => $ministerio_id
]);
$url = "{$apiUrl}?{$params}";

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

// Retorna a resposta no formato esperado
http_response_code($httpCode);
echo json_encode([
    'code' => 200,
    'message' => 'Notificações recuperadas com sucesso',
    'data' => $data['data'] ?? [],
    'meta' => [
        'total' => count($data['data'] ?? []),
        'page' => 1,
        'totalPages' => 1
    ]
]);
