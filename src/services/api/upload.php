<?php
require_once __DIR__ . '/../../../vendor/autoload.php';
require_once __DIR__ . '/../SessionService.php';

// Carrega as variáveis de ambiente
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../');
$dotenv->load();

// Verifica a autenticação (corrigido para usar isLoggedIn)
SessionService::start();
if (!SessionService::isLoggedIn()) {
    http_response_code(401);
    echo json_encode(['error' => 'Não autorizado']);
    exit;
}

header('Content-Type: application/json');

try {
    if (!isset($_FILES['foto'])) {
        throw new Exception('Nenhum arquivo enviado');
    }

    $file = $_FILES['foto'];
    $fileName = $file['name'];
    $fileType = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    
    // Verifica o tipo de arquivo
    $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
    if (!in_array($fileType, $allowedTypes)) {
        throw new Exception('Tipo de arquivo não permitido. Use apenas: ' . implode(', ', $allowedTypes));
    }
    
    // Gera um nome único para o arquivo
    $newFileName = uniqid() . '.' . $fileType;
    $uploadPath = __DIR__ . '/../../../assets/img/eventos/' . $newFileName;
    
    // Move o arquivo para o diretório de destino
    if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
        throw new Exception('Erro ao mover o arquivo');
    }
    
    // Retorna o nome do arquivo
    echo json_encode([
        'success' => true,
        'filename' => $newFileName
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
