<?php
require_once __DIR__ . '/../../../vendor/autoload.php';
require_once __DIR__ . '/../../../config/auth/session.service.php';

header('Content-Type: application/json');

try {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!isset($data['url']) || !isset($data['whatsapp'])) {
        throw new Exception('Dados inválidos');
    }

    // Download da imagem
    $imageContent = file_get_contents($data['url']);
    if (!$imageContent) {
        throw new Exception('Erro ao baixar imagem');
    }

    // Gera nome único
    $filename = uniqid() . '_' . $data['whatsapp'] . '.jpg';
    $path = __DIR__ . '/../../../assets/img/lideres/' . $filename;

    // Salva a imagem
    if (!file_put_contents($path, $imageContent)) {
        throw new Exception('Erro ao salvar imagem');
    }

    echo json_encode([
        'success' => true,
        'filename' => $filename
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
