<?php
require_once __DIR__ . '/../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../config/auth/session.service.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../../');
$dotenv->load();

header('Content-Type: application/json');
header('Access-Control-Allow-Methods: PUT, OPTIONS');

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

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    returnError('Método não permitido', 405);
}

$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['id'])) {
    returnError('ID não fornecido');
}

// Validações e preparação dos dados
$id = $data['id'];
$nome = $data['nome'] ?? null;
$whatsapp = isset($data['whatsapp']) ? preg_replace('/\D/', '', $data['whatsapp']) : null;
$ministerio_id = $data['ministerio_id'] ?? null;
$foto = $data['foto'] ?? null;
$organizacao_id = SessionService::getOrganizacaoId();

if (!$nome || !$whatsapp || !$ministerio_id) {
    returnError('Dados incompletos');
}

if (strlen($whatsapp) !== 11) {
    returnError('Número de WhatsApp inválido');
}

$payload = [
    'nome' => $nome,
    'whatsapp' => $whatsapp,
    'foto' => $foto,
    'ministerio_id' => $ministerio_id,
    'organizacao_id' => $organizacao_id
];

// Configuração e execução da requisição
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $_ENV['API_BASE_URL'] . "/lideres/{$id}",
    CURLOPT_CUSTOMREQUEST => 'PUT',
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
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

$responseData = json_decode($response, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    returnError('Resposta inválida da API', 500);
}

http_response_code($httpCode);
echo json_encode([
    'code' => 200,
    'message' => 'Líder atualizado com sucesso',
    'data' => $responseData
]);
