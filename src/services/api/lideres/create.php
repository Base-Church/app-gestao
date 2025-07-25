<?php
require_once __DIR__ . '/../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../config/auth/session.service.php';

// Carrega variáveis de ambiente
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

// Verifica método
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    returnError('Método não permitido', 405);
}

// Recebe dados
$data = json_decode(file_get_contents('php://input'), true);

// Validações básicas
if (!isset($data['nome']) || !isset($data['whatsapp']) || !isset($data['ministerio_id'])) {
    returnError('Dados incompletos');
}

$nome = $data['nome'];
$whatsapp = preg_replace('/\D/', '', $data['whatsapp']); // Remove não-dígitos
$ministerio_id = $data['ministerio_id'];
$foto = $data['foto'] ?? null;
$organizacao_id = SessionService::getOrganizacaoId();

// Validações específicas
if (strlen($whatsapp) !== 11) {
    returnError('Número de WhatsApp inválido');
}

// Prepara dados para API
$payload = [
    'nome' => $nome,
    'whatsapp' => $whatsapp,
    'foto' => $foto,
    'ministerio_id' => $ministerio_id,
    'organizacao_id' => $organizacao_id
];

// Configuração da requisição
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $_ENV['API_BASE_URL'] . '/lideres',
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Accept: application/json',
        'Authorization: Bearer ' . SessionService::getToken()
    ]
]);

// Executa requisição
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    curl_close($ch);
    returnError('Erro ao conectar com API: ' . curl_error($ch), 500);
}

curl_close($ch);

// Processa resposta
$responseData = json_decode($response, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    returnError('Resposta inválida da API', 500);
}

// Retorna resposta
http_response_code($httpCode);
echo json_encode([
    'code' => 200,
    'message' => 'Líder criado com sucesso',
    'data' => $responseData
]);
