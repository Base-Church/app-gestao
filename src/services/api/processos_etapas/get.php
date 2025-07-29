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

// Verifica se o token existe
if (!SessionService::hasToken()) {
    returnError('Token de autenticação não encontrado', 401);
}

// Pega os parâmetros necessários
$organizacao_id = SessionService::getOrganizacaoId();
$ministerio_id = $_GET['ministerio_id'] ?? null;
$processo_etapa_id = $_GET['processo_etapa_id'] ?? null;

if (!$organizacao_id) {
    returnError('Organização não encontrada');
}
if (!$ministerio_id) {
    returnError('Ministério não informado');
}

$apiUrl = $_ENV['API_BASE_URL'] . '/processo_etapas';

// Monta os parâmetros da query
$params = [
    'organizacao_id' => $organizacao_id,
    'ministerio_id' => $ministerio_id
];

// Se for busca de uma etapa específica, adiciona o id
if ($processo_etapa_id) {
    $params['processo_etapa_id'] = $processo_etapa_id;
}

// Adiciona outros parâmetros de GET (paginação, search, etc)
foreach ($_GET as $key => $value) {
    if (!isset($params[$key])) {
        $params[$key] = $value;
    }
}

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
    returnError('Erro na conexão com a API: ' . curl_error($ch));
}

curl_close($ch);

// Processa a resposta
$data = json_decode($response, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    returnError('Resposta inválida da API');
}

// Retorna a resposta
http_response_code($httpCode);
echo $response;