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

// Pega os parâmetros da requisição
$organizacao_id = SessionService::getOrganizacaoId();
$voluntario_id = isset($_GET['voluntario_id']) ? $_GET['voluntario_id'] : null;
$mes = isset($_GET['mes']) ? $_GET['mes'] : null;
$ano = isset($_GET['ano']) ? $_GET['ano'] : null;

// Validações
if (!$organizacao_id) {
    returnError('ID da organização não encontrado');
}

if (!$voluntario_id) {
    returnError('ID do voluntário é obrigatório');
}

if (!$mes) {
    returnError('Mês é obrigatório');
}

if (!$ano) {
    returnError('Ano é obrigatório');
}

if ($mes < 1 || $mes > 12) {
    returnError('Mês inválido');
}

// Monta a URL da API
$apiBase = $_ENV['API_BASE_URL'] ?? ($_SERVER['API_BASE_URL'] ?? null);
$apiUrl = rtrim($apiBase, '/') . '/calendario/servindo/mes';
$params = http_build_query([
    'organizacao_id' => $organizacao_id,
    'voluntario_id' => $voluntario_id,
    'mes' => $mes,
    'ano' => $ano
]);

$url = "{$apiUrl}?{$params}";

// Configuração do cURL
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'Authorization: Bearer ' . SessionService::getToken()
    ]
]);

// Faz a requisição
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Verifica erros do cURL
if (curl_errno($ch)) {
    $error = curl_error($ch);
    curl_close($ch);
    returnError("Erro ao conectar com a API: {$error}", 500);
}

curl_close($ch);

// Verifica se a resposta é um JSON válido
$data = json_decode($response, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    returnError('Resposta inválida da API', 500);
}

// Retorna a resposta formatada
http_response_code($httpCode);
echo json_encode($data);