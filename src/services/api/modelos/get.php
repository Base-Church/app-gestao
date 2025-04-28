<?php
require_once __DIR__ . '/../../../../vendor/autoload.php';
require_once __DIR__ . '/../../SessionService.php';

// Carrega as variáveis de ambiente
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../../');
$dotenv->load();

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

// Pega os parâmetros necessários
$organizacao_id = SessionService::getOrganizacaoId();
$ministerio_id = $_GET['ministerio_id'] ?? null;

// Log dos parâmetros
error_log('Parâmetros da requisição:');
error_log('organizacao_id: ' . $organizacao_id);
error_log('ministerio_id: ' . $ministerio_id);

// Validações básicas
if (!$ministerio_id) {
    returnError('Ministério não informado');
}

if (!$organizacao_id) {
    returnError('Organização não encontrada');
}

// Configura a URL da API
$apiUrl = $_ENV['API_BASE_URL'] . '/api/modelos-escalas';

// Monta os parâmetros da query
$params = [
    'organizacao_id' => $organizacao_id,
    'ministerio_id' => $ministerio_id
];

// Configura o CURL
$url = $apiUrl . '?' . http_build_query($params);
error_log('URL completa da requisição: ' . $url);

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'Authorization: ' . $_ENV['API_KEY']
    ]
]);

// Executa a requisição
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Verifica erros do CURL
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
