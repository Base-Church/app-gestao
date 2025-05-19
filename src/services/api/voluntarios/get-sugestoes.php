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

// Pega os parâmetros da requisição
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100;
$organizacao_id = isset($_GET['organizacao_id']) ? $_GET['organizacao_id'] : SessionService::getOrganizacaoId();
$ministerio_id = isset($_GET['ministerio_id']) ? $_GET['ministerio_id'] : null;
$data = isset($_GET['data']) ? $_GET['data'] : null;
$data_evento = isset($_GET['data_evento']) ? $_GET['data_evento'] : null;
$atividade_id = isset($_GET['atividade_id']) ? $_GET['atividade_id'] : null;
$evento_id = isset($_GET['evento_id']) ? $_GET['evento_id'] : null;

// Validações
if (!$ministerio_id) {
    returnError('Nenhum ministério selecionado');
}
if (!$organizacao_id) {
    returnError('ID da organização não encontrado');
}
if ($page < 1) {
    returnError('Página inválida');
}
if ($limit < 1 || $limit > 100) {
    returnError('Limite inválido');
}

// Monta a URL da API externa
$apiUrl = $_ENV['API_BASE_URL'] . '/api/voluntarios-sugestoes';
$params = [
    'organizacao_id' => $organizacao_id,
    'ministerio_id' => $ministerio_id,
    'page' => $page,
    'limit' => $limit
];
if ($data) $params['data'] = $data;
if ($data_evento) $params['data_evento'] = $data_evento;
if ($atividade_id) $params['atividade_id'] = $atividade_id;
if ($evento_id) $params['evento_id'] = $evento_id;

$url = $apiUrl . '?' . http_build_query($params);

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
        'page' => (int)($data['meta']['page'] ?? $page),
        'total' => (int)($data['meta']['total'] ?? 0),
        'limit' => (int)($data['meta']['limit'] ?? $limit),
        'totalPages' => (int)($data['meta']['totalPages'] ?? 1)
    ]
]);
