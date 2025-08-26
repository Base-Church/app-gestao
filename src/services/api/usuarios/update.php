
<?php
require_once __DIR__ . '/../../../../config/load_env.php';
require_once __DIR__ . '/../../../../config/auth/session.service.php';

// Ativa logs de erro para debug
ini_set('display_errors', 1);
ini_set('log_errors', 1);
error_reporting(E_ALL);

// Define o header da resposta como JSON
header('Content-Type: application/json');

// Log inicial da requisição
error_log("=== INÍCIO DA REQUISIÇÃO UPDATE USUÁRIO ===");
error_log("Método: " . $_SERVER['REQUEST_METHOD']);
error_log("Headers: " . json_encode(getallheaders()));

function returnError($message, $code = 400) {
    http_response_code($code);
    echo json_encode(['error' => $message]);
    exit;
}

// Adiciona informações de debug na resposta
function returnResponse($data, $code = 200) {
    $debug = [
        'request' => [
            'method' => $_SERVER['REQUEST_METHOD'],
            'headers' => getallheaders(),
            'userId' => isset($_GET['id']) ? $_GET['id'] : null,
            'rawData' => file_get_contents('php://input'),
        ],
        'processed' => [
            'data' => $data,
            'code' => $code
        ]
    ];

    http_response_code($code);
    echo json_encode([
        'code' => $code,
        'data' => $data,
        'debug' => $debug // Inclui informações de debug na resposta
    ]);
    exit;
}

SessionService::start();
if (!SessionService::isLoggedIn()) {
    returnError('Não autorizado', 401);
}

// Verifica se o token existe
if (!SessionService::hasToken()) {
    returnError('Token de autenticação não encontrado', 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    returnError('Método não permitido', 405);
}

// Log do ID do usuário
$userId = isset($_GET['id']) ? (int)$_GET['id'] : null;
error_log("ID do usuário: " . $userId);

if (!$userId) {
    returnError('ID do usuário não fornecido');
}

// Log dos dados recebidos
$rawData = file_get_contents('php://input');
error_log("Dados brutos recebidos: " . $rawData);

// Decodifica JSON
$data = json_decode($rawData, true);
error_log("Dados decodificados: " . print_r($data, true));

if (!$data || !is_array($data)) {
    error_log("Erro: Dados inválidos");
    returnError('Dados inválidos');
}

// Debug
error_log('Dados recebidos: ' . print_r($data, true));

// Garante que os arrays sejam arrays
if (isset($data['ministerios'])) {
    error_log("Ministérios recebidos: " . json_encode($data['ministerios']));
    if (!is_array($data['ministerios'])) {
        error_log("Erro: Formato inválido para ministérios");
        returnError('Formato inválido para ministérios');
    }
}

if (isset($data['permissoes'])) {
    error_log("Permissões recebidas: " . json_encode($data['permissoes']));
    if (!is_array($data['permissoes'])) {
        error_log("Erro: Formato inválido para permissões");
        returnError('Formato inválido para permissões');
    }
}

// Converte todos os valores para string
if (isset($data['ministerios'])) {
    $data['ministerios'] = array_map('strval', $data['ministerios']);
}

if (isset($data['permissoes'])) {
    $data['permissoes'] = array_map('strval', $data['permissoes']);
}

// Validate required fields if they exist in the request
if (isset($data['nome']) && empty($data['nome'])) {
    returnError('Nome é obrigatório');
}

// Validate nivel if present
if (isset($data['nivel']) && !in_array($data['nivel'], ['gestão', 'admin', 'superadmin'])) {
    returnError('Nível inválido');
}

// Clean up data before sending to API
$updateData = array_filter([
    'nome' => $data['nome'] ?? null,
    'whatsapp' => $data['whatsapp'] ?? null,
    'ministerios' => $data['ministerios'] ?? null,
    'status' => $data['status'] ?? null,
    'nivel' => $data['nivel'] ?? null,
    'permissoes' => $data['permissoes'] ?? null
], function($value) { 
    return !is_null($value) && (!is_array($value) || !empty($value)); 
});

// Log da URL da API
$apiBaseUrl = isset($_ENV['API_BASE_URL']) ? $_ENV['API_BASE_URL'] : (isset($_SERVER['API_BASE_URL']) ? $_SERVER['API_BASE_URL'] : '');
if (!$apiBaseUrl) {
    returnError('API_BASE_URL não configurado no ambiente', 500);
}
$apiUrl = $apiBaseUrl . "/usuarios/{$userId}";
error_log("URL da API: " . $apiUrl);

// Log dos dados que serão enviados
error_log("Dados que serão enviados para API: " . json_encode($updateData));

// Faz a requisição para a API
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $apiUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST => 'PUT',
    CURLOPT_POSTFIELDS => json_encode($updateData),
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Accept: application/json',
        'Authorization: Bearer ' . SessionService::getToken()
    ]
]);

// Executa a requisição e loga a resposta
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

error_log("Código de resposta HTTP: " . $httpCode);
error_log("Resposta da API: " . $response);

if (curl_errno($ch)) {
    error_log("Erro CURL: " . curl_error($ch));
    curl_close($ch);
    returnError("Erro ao conectar com a API: " . curl_error($ch), 500);
}

curl_close($ch);

// Log da resposta final
error_log("=== FIM DA REQUISIÇÃO UPDATE USUÁRIO ===");

$responseData = json_decode($response, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    error_log("Erro ao decodificar resposta: " . json_last_error_msg());
    returnError('Resposta inválida da API', 500);
}

http_response_code($httpCode);
returnResponse($responseData['data'] ?? null);
