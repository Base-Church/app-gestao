<?php
require_once __DIR__ . '/../../../vendor/autoload.php';
require_once __DIR__ . '/../../services/SessionService.php';

// Prevenir cache
header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');
header('Expires: Sat, 26 Jul 1997 05:00:00 GMT');

// Inicia ou resume a sessão
SessionService::start();

// Verifica se é uma requisição POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    exit;
}

// Obtém o corpo da requisição
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['ministerio_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'ID do ministério não fornecido']);
    exit;
}

$ministerioId = $data['ministerio_id'];

// Verifica se o usuário está logado
if (!SessionService::isLoggedIn()) {
    http_response_code(401);
    echo json_encode(['error' => 'Usuário não autenticado']);
    exit;
}

// Verifica se o ministério pertence ao usuário
$ministerios = SessionService::getMinisterios();
$ministerioValido = false;
foreach ($ministerios as $ministerio) {
    if ($ministerio['id'] == $ministerioId) {
        $ministerioValido = true;
        break;
    }
}

if (!$ministerioValido) {
    http_response_code(403);
    echo json_encode(['error' => 'Ministério não autorizado']);
    exit;
}

try {
    // Atualiza apenas o ministério atual
    SessionService::setMinisterioAtual($ministerioId);
    
    echo json_encode([
        'success' => true,
        'message' => 'Ministério alterado com sucesso',
        'data' => [
            'ministerio_id' => $ministerioId,
            'session_id' => session_id()
        ]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Erro ao alterar ministério',
        'message' => $e->getMessage()
    ]);
}
