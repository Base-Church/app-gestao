<?php

require_once __DIR__ . '/../../../../config/load_env.php';
require_once __DIR__ . '/../../../../config/auth/session.service.php';

header('Content-Type: application/json');

function returnError($message, $code = 400) {
    http_response_code($code);
    echo json_encode(['error' => $message]);
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

// Usar o ID do usuário da sessão
$organizacao_id = SessionService::getOrganizacaoId();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    returnError('Método não permitido', 405);
}

$data = json_decode(file_get_contents('php://input'), true);

// Validações principais
if (!$organizacao_id) {
    returnError('ID da organização não encontrado');
}

if (!isset($data['ordens_culto_cultos']) || !is_array($data['ordens_culto_cultos']) || empty($data['ordens_culto_cultos'])) {
    returnError('Array de cultos é obrigatório e não pode estar vazio');
}

// Validar cada culto
foreach ($data['ordens_culto_cultos'] as $culto) {
    if (!isset($culto['id_evento'])) {
        returnError('ID do evento é obrigatório para cada culto');
    }

    if (!isset($culto['ordens_culto_momentos']) || !is_array($culto['ordens_culto_momentos']) || empty($culto['ordens_culto_momentos'])) {
        returnError('Array de momentos é obrigatório para cada culto e não pode estar vazio');
    }

    // Validar cada momento
    foreach ($culto['ordens_culto_momentos'] as $momento) {
        if (!isset($momento['ordem'])) {
            returnError('Ordem é obrigatória para cada momento');
        }

        if (!isset($momento['dados']) || !is_array($momento['dados'])) {
            returnError('Dados são obrigatórios para cada momento');
        }

        if (!isset($momento['dados']['tipo'])) {
            returnError('Tipo é obrigatório nos dados do momento');
        }
    }
}

// Prepara os dados
$postData = [
    'observacoes' => $data['observacoes'] ?? '',
    'organizacao_id' => $organizacao_id,
    'ordens_culto_cultos' => array_map(function($culto) {
        return [
            'id_evento' => $culto['id_evento'],
            'ordens_culto_momentos' => array_map(function($momento) {
                return [
                    'ordem' => $momento['ordem'],
                    'dados' => array_merge([
                        'tipo' => $momento['dados']['tipo']
                    ], array_diff_key($momento['dados'], ['tipo' => true]))
                ];
            }, $culto['ordens_culto_momentos'])
        ];
    }, $data['ordens_culto_cultos'])
];

// Monta a URL da API
$apiBase = $_ENV['API_BASE_URL'] ?? ($_SERVER['API_BASE_URL'] ?? null);
$apiUrl = rtrim($apiBase, '/') . '/ordens-culto';

// Configuração do cURL
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $apiUrl,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($postData),
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
    $error = curl_error($ch);
    curl_close($ch);
    returnError("Erro ao conectar com a API: {$error}", 500);
}

curl_close($ch);

$responseData = json_decode($response, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    returnError('Resposta inválida da API', 500);
}

http_response_code($httpCode);
echo json_encode([
    'code' => 200,
    'message' => 'Ordem de culto criada com sucesso',
    'data' => $responseData
]);
