<?php
require_once __DIR__ . '/../../../config/load_env.php';
require_once __DIR__ . '/../../../config/auth/session.service.php';

SessionService::start();
if (!SessionService::isLoggedIn()) {
    http_response_code(401);
    echo json_encode(['error' => 'Não autorizado']);
    exit;
}

header('Content-Type: application/json');

try {
    if (!isset($_FILES['file'])) {
        throw new Exception('Nenhum arquivo enviado. O campo deve se chamar "file".');
    }

    $file = $_FILES['file'];
    $fileName = $file['name'];
    $fileType = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    
    // Verifica o tipo de arquivo
    $allowedTypes = [
        'jpg', 'jpeg', 'png', 'gif', // Imagens
        'mp4', 'mov', 'avi', 'mkv', 'webm', // Vídeos
        'mp3', 'ogg', 'wav', 'm4a', 'aac', // Áudios
        'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx' // Documentos
    ];

    if (!in_array($fileType, $allowedTypes)) {
        throw new Exception('Tipo de arquivo não permitido. Use apenas: ' . implode(', ', $allowedTypes));
    }
    
    // Gera um nome único para o arquivo
    $newFileName = uniqid('disparo_', true) . '.' . $fileType;
    $uploadDir = __DIR__ . '/../../../assets/disparos/';
    $uploadPath = $uploadDir . $newFileName;
    
    // Garante que o diretório de upload existe
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0775, true);
    }
    
    // Move o arquivo para o diretório de destino
    if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
        throw new Exception('Erro ao mover o arquivo para o destino.');
    }
    
    // Constrói a URL completa
    $urlBase = $_ENV['URL_BASE'] ?? ($_SERVER['URL_BASE'] ?? '');
    $fileUrl = rtrim($urlBase, '/') . '/assets/disparos/' . $newFileName;
    
    // Retorna a URL completa do arquivo
    echo json_encode([
        'success' => true,
        'url' => $fileUrl
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
