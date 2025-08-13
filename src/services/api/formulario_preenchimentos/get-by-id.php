<?php
require_once __DIR__ . '/../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../config/auth/session.service.php';

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

// Verifica se o token existe
if (!SessionService::hasToken()) {
    returnError('Token de autenticação não encontrado', 401);
}

// Pega os parâmetros necessários
$organizacao_id = SessionService::getOrganizacaoId();
$ministerio_id = $_GET['ministerio_id'] ?? SessionService::getMinisterioAtual();
$preenchimento_id = $_GET['id'] ?? null;

if (!$organizacao_id) {
    returnError('Organização não encontrada');
}
if (!$ministerio_id) {
    returnError('Ministério não informado');
}
if (!$preenchimento_id) {
    returnError('ID do preenchimento não informado');
}

// Monta a URL para buscar o preenchimento específico
$apiUrl = $_ENV['API_BASE_URL'] . '/formulario_preenchimentos/' . urlencode($preenchimento_id);

// Monta os parâmetros da query
$params = [
    'organizacao_id' => $organizacao_id,
    'ministerio_id' => $ministerio_id
];

$url = $apiUrl . '?' . http_build_query($params);

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'Authorization: Bearer ' . SessionService::getToken()
    ]
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    curl_close($ch);
    returnError('Erro ao conectar com API: ' . curl_error($ch), 500);
}

curl_close($ch);

$data = json_decode($response, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    returnError('Resposta inválida da API', 500);
}

// Se a API retornou erro, propaga o erro
if ($httpCode >= 400) {
    http_response_code($httpCode);
    echo $response;
    exit;
}

http_response_code($httpCode);
echo json_encode([
    'code' => 200,
    'message' => 'Preenchimento recuperado com sucesso',
    'data' => $data['data'] ?? $data
]);
?>