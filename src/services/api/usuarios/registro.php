<?php
require_once __DIR__ . '/../../../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../../');
$dotenv->load();

header('Content-Type: application/json');

function returnError($message, $code = 400) {
    http_response_code($code);
    echo json_encode(['error' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    returnError('Método não permitido', 405);
}

// Pega e valida o corpo da requisição
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validações simplificadas
if (!isset($data['nome']) || !isset($data['whatsapp']) || !isset($data['senha']) || !isset($data['organizacao_id'])) {
    returnError('Campos obrigatórios não fornecidos');
}

// Valida formato do whatsapp
$whatsapp = preg_replace('/[^0-9]/', '', $data['whatsapp']);
if (strlen($whatsapp) < 10 || strlen($whatsapp) > 11) {
    returnError('Formato de WhatsApp inválido');
}

// Adiciona código do país 55 (Brasil)
$whatsapp = '55' . $whatsapp;

// Prepara o payload simplificado
$payload = [
    'nome' => trim($data['nome']),
    'whatsapp' => $whatsapp,
    'senha' => $data['senha'],
    'organizacao_id' => (int)$data['organizacao_id']
];

// Faz a requisição para a API
$apiUrl = $_ENV['API_BASE_URL'] . '/usuarios/registro';

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $apiUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Accept: application/json'
    ]
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    $error = curl_error($ch);
    curl_close($ch);
    returnError("Erro ao conectar com a API: {$error}", 500);
}

curl_close($ch);

$responseData = json_decode($response, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    returnError('Resposta inválida da API', 500);
}

// Retorna a resposta
http_response_code($httpCode);
echo json_encode([
    'code' => 200,
    'message' => 'Usuário criado com sucesso',
    'data' => $responseData['data'] ?? null
]);
