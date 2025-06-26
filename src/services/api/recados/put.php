<?php
require_once __DIR__ . '/../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../config/auth/session.service.php';

// IMPORTANTE: Primeira coisa antes de qualquer output
header('Content-Type: application/json');

// Carregar dotenv e configurações
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../../');
$dotenv->load();

// Habilitar log de erros mas não exibir
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../../../../logs/php-error.log');

try {
    // Log do início da requisição
    error_log("Iniciando requisição PUT");

    // Verifica autenticação
    SessionService::start();
    if (!SessionService::isLoggedIn()) {
        throw new Exception('Não autorizado');
    }

    // Verifica se o token existe
    if (!SessionService::hasToken()) {
        throw new Exception('Token de autenticação não encontrado');
    }

    // Pegar e validar ID
    $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
    if (!$id) {
        throw new Exception('ID inválido ou não fornecido');
    }

    // Pegar e validar dados do POST
    $input = file_get_contents('php://input');
    error_log("Dados recebidos: " . $input);
    
    $data = json_decode($input, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('JSON inválido: ' . json_last_error_msg());
    }

    // Validar campos obrigatórios
    if (empty($data['titulo']) || empty($data['texto'])) {
        throw new Exception('Título e texto são obrigatórios');
    }

    // Preparar payload
    $payload = [
        'titulo' => $data['titulo'],
        'texto' => $data['texto'],
        'ministerio_id' => $data['ministerio_id'],
        'organizacao_id' => $data['organizacao_id']
    ];

    // Adicionar validade se existir
    if (!empty($data['validade'])) {
        $payload['validade'] = $data['validade'];
    }

    error_log("Payload preparado: " . json_encode($payload));

    // Fazer requisição para API externa
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $_ENV['API_BASE_URL'] . '/recados/' . $id,
        CURLOPT_CUSTOMREQUEST => 'PUT',
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . SessionService::getToken()
        ]
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    error_log("Resposta da API: " . $response);
    error_log("HTTP Code: " . $httpCode);

    if (curl_errno($ch)) {
        throw new Exception('Erro CURL: ' . curl_error($ch));
    }

    curl_close($ch);

    // Validar resposta da API
    $responseData = json_decode($response, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Resposta inválida da API');
    }

    // Enviar resposta
    http_response_code($httpCode);
    echo json_encode($responseData);

} catch (Exception $e) {
    error_log("Erro na atualização: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'error' => $e->getMessage(),
        'details' => error_get_last()
    ]);
}
