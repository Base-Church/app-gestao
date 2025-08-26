<?php
require_once __DIR__ . '/../../../../config/load_env.php';
require_once __DIR__ . '/../../../../config/auth/session.service.php';

header('Content-Type: application/json');

// Função para retornar erro
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

// Verifica se o token existe
if (!SessionService::hasToken()) {
    returnError('Token de autenticação não encontrado', 401);
}

// Pega os parâmetros necessários
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
$organizacao_id = SessionService::getOrganizacaoId();
$ministerio_id = $_GET['ministerio_id'] ?? null;

// Log dos parâmetros
error_log('Parâmetros da requisição de atividades:');
error_log('organizacao_id: ' . $organizacao_id);
error_log('ministerio_id: ' . $ministerio_id);
error_log('page: ' . $page);
error_log('limit: ' . $limit);

// Validações básicas
if (!$ministerio_id) {
    returnError('Ministério não informado');
}

if (!$organizacao_id) {
    returnError('Organização não encontrada');
}

// Configura a URL da API
$apiBase = $_ENV['API_BASE_URL'] ?? ($_SERVER['API_BASE_URL'] ?? null);
$apiUrl = rtrim($apiBase, '/') . '/atividades';

// Monta os parâmetros da query
$params = [
    'organizacao_id' => $organizacao_id,
    'ministerio_id' => $ministerio_id,
    'page' => $page,
    'limit' => $limit
];

// Configura o CURL
$url = $apiUrl . '?' . http_build_query($params);
error_log('URL completa da API de atividades: ' . $url);

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'Authorization: Bearer ' . SessionService::getToken()
    ]
]);

// Executa a requisição
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

error_log('Resposta da API de atividades - HTTP Code: ' . $httpCode);
error_log('Resposta bruta da API de atividades: ' . $response);

// Verifica erros do CURL
if (curl_errno($ch)) {
    curl_close($ch);
    returnError('Erro na conexão com a API: ' . curl_error($ch));
}

curl_close($ch);

// Processa a resposta
$data = json_decode($response, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    error_log('Erro ao decodificar JSON da API de atividades: ' . json_last_error_msg());
    returnError('Resposta inválida da API');
}

error_log('Dados decodificados da API de atividades: ' . print_r($data, true));

// Retorna a resposta
http_response_code($httpCode);
echo json_encode([
    'code' => 200,
    'data' => $data['data'] ?? []
]);
