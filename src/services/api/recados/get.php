<?php
require_once __DIR__ . '/../../../../vendor/autoload.php';
require_once __DIR__ . '/../../SessionService.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../../');
$dotenv->load();

header('Content-Type: application/json');

// Verifica autenticação
SessionService::start();
if (!SessionService::isLoggedIn()) {
    http_response_code(401);
    echo json_encode(['error' => 'Não autorizado']);
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
        $url = $_ENV['API_BASE_URL'] . '/api/recados/ministerio/' . $ministerio_id;
    } else {
        // Para superadmin sem ministério específico, lista todos
        $url = $_ENV['API_BASE_URL'] . '/api/recados';
    }

    // Adiciona organizacao_id como query parameter
    $url .= '?organizacao_id=' . SessionService::getOrganizacaoId();

    // Faz requisição para API
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Authorization: ' . $_ENV['API_KEY']
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
