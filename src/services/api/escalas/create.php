<?php
// Carrega variáveis de ambiente simples (sem Composer)
require_once __DIR__ . '/../../../../config/load_env.php';
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

// Verifica método
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    returnError('Método não permitido', 405);
}

// Recebe e valida dados
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data || !isset($data['cabecalho']) || !isset($data['itens'])) {
    returnError('Dados inválidos ou incompletos');
}

// Recebe headers específicos
$ministerioId = $_SERVER['HTTP_MINISTERIO_ID'] ?? null;
$organizacaoId = $_SERVER['HTTP_ORGANIZACAO_ID'] ?? '1';

if (!$ministerioId) {
    returnError('Ministério não informado');
}

// Adiciona IDs ao payload
$data['ministerio_id'] = $ministerioId;
$data['organizacao_id'] = $organizacaoId;

// Configura requisição para API
$apiBase = $_ENV['API_BASE_URL'] ?? ($_SERVER['API_BASE_URL'] ?? null);
$apiUrl = rtrim($apiBase, '/') . '/escalas/v2/';
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $apiUrl,
    CURLOPT_POST => true,
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
