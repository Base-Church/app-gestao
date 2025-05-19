<?php
require_once __DIR__ . '/../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../config/auth/session.service.php';

// Carrega as variáveis de ambiente
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../../');
$dotenv->load();

// Define o header da resposta como JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Origin: *');

// Se for uma requisição OPTIONS, retorna sucesso
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Função para retornar erro
function returnError($message, $code = 400) {
    http_response_code($code);
    echo json_encode(['error' => $message]);
    exit;
}

// Verifica se o usuário está autenticado
SessionService::start();
if (!SessionService::isLoggedIn()) {
    returnError('Não autorizado', 401);
}

// Verifica método HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    returnError('Método não permitido', 405);
}

// Obtém o ID da organização da sessão
$organizacao_id = SessionService::getOrganizacaoId();
if (!$organizacao_id) {
    returnError('ID da organização não encontrado');
}

// Obtém o ID do evento da URL
$id = $_GET['id'] ?? null;
if (!$id) {
    returnError('ID do evento não fornecido');
}

// Monta a URL da API
$apiUrl = $_ENV['API_BASE_URL'] . '/api/eventos/' . $id;

// Adiciona o organizacao_id como query parameter
$apiUrl .= '?organizacao_id=' . $organizacao_id;

// Configuração do cURL
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $apiUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST => 'DELETE',
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Accept: application/json',
        'Authorization: ' . $_ENV['API_KEY']
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
$responseData = json_decode($response, true);
if (json_last_error() !== JSON_ERROR_NONE && $httpCode !== 204) {
    returnError('Resposta inválida da API', 500);
}

// Se o código for 204 (No Content) ou 200, considera sucesso
if ($httpCode === 204 || $httpCode === 200) {
    echo json_encode([
        'success' => true,
        'message' => 'Evento excluído com sucesso'
    ]);
} else {
    // Se houver erro, retorna a mensagem da API
    $message = isset($responseData['error']) ? $responseData['error'] : 'Erro ao excluir evento';
    returnError($message, $httpCode);
}
