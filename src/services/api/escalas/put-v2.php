<?php
require_once __DIR__ . '/../../../../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../../');
$dotenv->load();

require_once __DIR__ . '/../../../../config/auth/session.service.php';

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

// Permite apenas PUT
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    returnError('Método não permitido', 405);
}

// Recebe e valida dados
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validação da estrutura correta da escala
if (!$data || !isset($data['id']) || !isset($data['nome']) || !isset($data['tipo']) || 
    !isset($data['data_inicio']) || !isset($data['data_fim']) || !isset($data['eventos'])) {
    returnError('Dados inválidos ou incompletos. Campos obrigatórios: id, nome, tipo, data_inicio, data_fim, eventos');
}

// Recebe headers específicos
$ministerioId = $_SERVER['HTTP_MINISTERIO_ID'] ?? null;
$organizacaoId = $_SERVER['HTTP_ORGANIZACAO_ID'] ?? '1';

if (!$ministerioId) {
    returnError('Ministério não informado');
}

$escalaId = $data['id'];

// Adiciona IDs ao payload se não estiverem presentes
if (!isset($data['ministerio_id'])) {
    $data['ministerio_id'] = $ministerioId;
}
if (!isset($data['organizacao_id'])) {
    $data['organizacao_id'] = $organizacaoId;
}

// Monta URL da API principal para update
$apiUrl = $_ENV['API_BASE_URL'] . "/escalas/v2/{$escalaId}";
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $apiUrl,
    CURLOPT_CUSTOMREQUEST => 'PUT',
    CURLOPT_POSTFIELDS => json_encode($data),
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
    returnError('Erro ao conectar com API: ' . curl_error($ch), 500);
}

curl_close($ch);

http_response_code($httpCode);
echo $response;
