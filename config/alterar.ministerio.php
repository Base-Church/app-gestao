<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/auth/session.service.php';

header('Content-Type: application/json');
SessionService::start();

// Verifica autenticação
if (!SessionService::isLoggedIn()) {
    http_response_code(401);
    echo json_encode(['error' => 'Usuário não autenticado']);
    exit;
}

// Verifica método
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$ministerioId = $input['ministerio_id'] ?? null;

if (!$ministerioId) {
    http_response_code(400);
    echo json_encode(['error' => 'ID do ministério não fornecido']);
    exit;
}

// Verifica se o ministério existe na sessão do usuário
$ministerios = SessionService::getMinisterios();
$ministerioEncontrado = false;

foreach ($ministerios as $ministerio) {
    if ($ministerio['id'] == $ministerioId) {
        $ministerioEncontrado = true;
        break;
    }
}

if (!$ministerioEncontrado) {
    http_response_code(403);
    echo json_encode(['error' => 'Ministério não autorizado para este usuário']);
    exit;
}

// Atualiza o ministério atual
try {
    SessionService::setMinisterioAtual($ministerioId);
    echo json_encode([
        'success' => true,
        'message' => 'Ministério alterado com sucesso',
        'ministerio_id' => $ministerioId
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao alterar ministério: ' . $e->getMessage()]);
}
