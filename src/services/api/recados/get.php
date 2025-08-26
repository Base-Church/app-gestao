<?php

require_once __DIR__ . '/../../../../config/load_env.php';
require_once __DIR__ . '/../../../../config/auth/session.service.php';

header('Content-Type: application/json');

// Verifica autenticação
SessionService::start();
if (!SessionService::isLoggedIn()) {
    http_response_code(401);
    echo json_encode(['error' => 'Não autorizado']);
    exit;
}

// Verifica se o token existe
if (!SessionService::hasToken()) {
    http_response_code(401);
    echo json_encode(['error' => 'Token de autenticação não encontrado']);
    exit;
}

try {
    // Se não for superadmin, ministério é obrigatório
    if (SessionService::getNivel() !== 'superadmin' || isset($_GET['ministerio_id'])) {
        $ministerio = SessionService::getMinisterioAtual();
        
        // Normaliza o ID do ministério
        $ministerio_id = null;
        if (is_array($ministerio)) {
            $ministerio_id = $ministerio['id'];
        } elseif (is_object($ministerio)) {
            $ministerio_id = $ministerio->id;
        } elseif (is_numeric($ministerio)) {
            $ministerio_id = $ministerio;
        }

        if (!$ministerio_id) {
            throw new Exception('Ministério não encontrado');
        }

        // Adiciona o ministério_id na URL da API
    $apiBase = $_ENV['API_BASE_URL'] ?? ($_SERVER['API_BASE_URL'] ?? null);
    $url = rtrim($apiBase, '/') . '/recados/ministerio/' . $ministerio_id;
    } else {
        // Para superadmin sem ministério específico, lista todos
    $apiBase = $_ENV['API_BASE_URL'] ?? ($_SERVER['API_BASE_URL'] ?? null);
    $url = rtrim($apiBase, '/') . '/recados';
    }

    // Adiciona organizacao_id como query parameter
    $url .= '?organizacao_id=' . SessionService::getOrganizacaoId();

    // Faz requisição para API
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . SessionService::getToken()
        ]
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (curl_errno($ch)) {
        throw new Exception(curl_error($ch));
    }

    curl_close($ch);

    // Retorna resposta
    http_response_code($httpCode);
    echo $response;

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}
