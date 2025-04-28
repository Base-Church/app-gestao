<?php
require_once __DIR__ . '/../../../../vendor/autoload.php';
require_once __DIR__ . '/../../SessionService.php';

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
    error_log("Iniciando requisição DELETE");

    // Verifica autenticação
    SessionService::start();
    if (!SessionService::isLoggedIn()) {
        throw new Exception('Não autorizado');
    }

    // Pegar e validar ID
    $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
    if (!$id) {
        throw new Exception('ID inválido ou não fornecido');
    }

    error_log("Deletando recado ID: " . $id);

    // Fazer requisição para API externa
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $_ENV['API_BASE_URL'] . '/api/recados/' . $id . '?organizacao_id=' . SessionService::getOrganizacaoId(),
        CURLOPT_CUSTOMREQUEST => 'DELETE',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Authorization: ' . $_ENV['API_KEY']
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

    // Tratar resposta
    if ($httpCode === 204 || $httpCode === 200) {
        echo json_encode([
            'success' => true,
            'message' => 'Recado excluído com sucesso'
        ]);
        exit;
    }

    // Se chegou aqui, tenta decodificar a resposta da API
    $responseData = json_decode($response, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Resposta inválida da API');
    }

    http_response_code($httpCode);
    echo json_encode($responseData);

} catch (Exception $e) {
    error_log("Erro na exclusão: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'error' => $e->getMessage(),
        'details' => error_get_last()
    ]);
}
