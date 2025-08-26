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

// Pega os dados do formulário
$id_musica = isset($_POST['id_musica']) ? (int)$_POST['id_musica'] : 0;
$nome_musica = isset($_POST['nome_musica']) ? trim($_POST['nome_musica']) : '';
$artista_banda = isset($_POST['artista_banda']) ? trim($_POST['artista_banda']) : '';
$url = isset($_POST['url']) ? trim($_POST['url']) : '';
$letra = isset($_POST['letra']) ? trim($_POST['letra']) : '';
$organizacao_id = $_POST['organizacao_id'] ?? SessionService::getOrganizacaoId();
$ministerio_id = $_POST['ministerio_id'] ?? SessionService::getMinisterioAtual();

// Validações
if (!$id_musica) {
    returnError('ID da música não informado');
}
if (!$nome_musica) {
    returnError('Nome da música é obrigatório');
}
if (!$artista_banda) {
    returnError('Artista/Banda é obrigatório');
}
if (!$organizacao_id) {
    returnError('ID da organização não encontrado');
}
if (!$ministerio_id) {
    returnError('Nenhum ministério selecionado');
}

// Monta a URL da API
$apiBase = $_ENV['API_BASE_URL'] ?? ($_SERVER['API_BASE_URL'] ?? null);
$apiUrl = rtrim($apiBase, '/') . '/musicas/' . $id_musica;

// Dados para enviar
$postData = [
    'nome_musica' => $nome_musica,
    'artista_banda' => $artista_banda,
    'url' => $url,
    'letra' => $letra,
    'organizacao_id' => $organizacao_id,
    'ministerios' => $ministerio_id
];

// Configuração do cURL
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $apiUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST => 'PUT',
    CURLOPT_POSTFIELDS => json_encode($postData),
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
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

// Retorna a resposta
http_response_code($httpCode);
echo json_encode([
    'data' => $data['data'] ?? $data,
    'meta' => $data['meta'] ?? [],
    'message' => 'Música atualizada com sucesso'
]); 