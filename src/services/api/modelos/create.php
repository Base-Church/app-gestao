<?php

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

// Verifica se é POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    returnError('Método não permitido', 405);
}

// Recebe e decodifica o JSON
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validações
if (!$data) {
    returnError('Dados inválidos');
}

if (empty($data['nome'])) {
    returnError('Nome é obrigatório');
}

if (empty($data['atividades']) || !is_array($data['atividades'])) {
    returnError('Atividades são obrigatórias');
}

// Prepara os dados
$payload = [
    'nome' => $data['nome'],
    'ministerio_id' => SessionService::getMinisterioAtual(),
    'organizacao_id' => SessionService::getOrganizacaoId(),
    'atividades' => $data['atividades']
];

// Configuração do cURL

$apiBase = $_ENV['API_BASE_URL'] ?? ($_SERVER['API_BASE_URL'] ?? null);
$ch = curl_init(rtrim($apiBase, '/') . '/modelos-escalas');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Accept: application/json',
        'Authorization: Bearer ' . SessionService::getToken()
    ]
]);

// Executa a requisição
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    curl_close($ch);
    returnError('Erro na conexão com a API: ' . curl_error($ch));
}

curl_close($ch);

// Retorna a resposta
http_response_code($httpCode);
echo $response;
