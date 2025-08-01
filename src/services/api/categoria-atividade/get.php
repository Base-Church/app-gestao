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

// Verifica se o token existe
if (!SessionService::hasToken()) {
    returnError('Token de autenticação não encontrado', 401);
}

// Pega os parâmetros da requisição
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
$search = isset($_GET['search']) ? trim($_GET['search']) : '';
$organizacao_id = SessionService::getOrganizacaoId();
$ministerio_id = SessionService::getMinisterioAtual();

// Log dos parâmetros
error_log('Parâmetros da requisição de categorias:');
error_log('organizacao_id: ' . $organizacao_id);
error_log('ministerio_id: ' . $ministerio_id);
error_log('page: ' . $page);
error_log('limit: ' . $limit);
error_log('search: ' . $search);

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

// Monta a URL da API
$apiUrl = $_ENV['API_BASE_URL'] . '/categoria-atividade';
$params = http_build_query([
    'organizacao_id' => $organizacao_id,
    'ministerio_id' => $ministerio_id,
    'page' => $page,
    'limit' => $limit,
    'search' => $search
]);
$url = "{$apiUrl}?{$params}";

error_log('URL completa da API de categorias: ' . $url);

// Configuração do cURL
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'Authorization: Bearer ' . SessionService::getToken()
    ]
]);

// Faz a requisição
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

error_log('Resposta da API de categorias - HTTP Code: ' . $httpCode);
error_log('Resposta bruta da API de categorias: ' . $response);

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
    error_log('Erro ao decodificar JSON da API de categorias: ' . json_last_error_msg());
    returnError('Resposta inválida da API', 500);
}

error_log('Dados decodificados da API de categorias: ' . print_r($data, true));

// Retorna a resposta
http_response_code($httpCode);
echo json_encode([
    'code' => 200,
    'data' => $data['data'] ?? [],
    'meta' => [
        'page' => $page,
        'total' => $data['total'] ?? 0,
        'totalPages' => ceil(($data['total'] ?? 0) / $limit)
    ]
]);
