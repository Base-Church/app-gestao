<?php
// Serviço global de upload de arquivos
// Permite upload flexível com diferentes configurações de rota

// Carregar variáveis de ambiente se não estiverem carregadas
if (!isset($_ENV['URL_BASE'])) {
    require_once __DIR__ . '/../vendor/autoload.php';
    if (file_exists(__DIR__ . '/../.env')) {
        $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
        $dotenv->load();
    }
}

// Verificar se é uma requisição POST para upload
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES)) {
    handleFileUpload();
    exit;
}

/**
 * Função principal para lidar com upload de arquivos
 * Suporta diferentes tipos de upload baseado nos parâmetros enviados
 */
function handleFileUpload() {
    header('Content-Type: application/json');
    
    try {
        // Obter configurações do upload via POST
        $uploadType = $_POST['upload_type'] ?? 'default';
        $uploadPath = $_POST['upload_path'] ?? 'assets/uploads';
        $filePrefix = $_POST['file_prefix'] ?? 'file';
        $allowedTypes = isset($_POST['allowed_types']) ? explode(',', $_POST['allowed_types']) : ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        $maxSize = isset($_POST['max_size']) ? (int)$_POST['max_size'] : 10 * 1024 * 1024; // 10MB padrão
        
        // Determinar qual arquivo foi enviado
        $fileKey = null;
        foreach ($_FILES as $key => $file) {
            if ($file['error'] === UPLOAD_ERR_OK) {
                $fileKey = $key;
                break;
            }
        }
        
        if (!$fileKey || !isset($_FILES[$fileKey])) {
            throw new Exception('Nenhum arquivo válido foi enviado');
        }
        
        $file = $_FILES[$fileKey];
        
        // Validar tipo de arquivo
        if (!in_array($file['type'], $allowedTypes)) {
            throw new Exception('Tipo de arquivo não permitido. Tipos aceitos: ' . implode(', ', $allowedTypes));
        }
        
        // Validar tamanho
        if ($file['size'] > $maxSize) {
            $maxSizeMB = round($maxSize / (1024 * 1024), 1);
            throw new Exception("Arquivo muito grande. Tamanho máximo: {$maxSizeMB}MB");
        }
        
        // Gerar nome único para o arquivo
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = $filePrefix . '_' . uniqid() . '.' . $extension;
        
        // Construir caminho completo
        $fullUploadPath = __DIR__ . '/../' . $uploadPath . '/' . $filename;
        
        // Criar diretório se não existir
        $uploadDir = dirname($fullUploadPath);
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        
        // Mover arquivo temporário
        if (!move_uploaded_file($file['tmp_name'], $fullUploadPath)) {
            throw new Exception('Erro ao salvar o arquivo');
        }
        
        // Retornar sucesso com informações do arquivo
        echo json_encode([
            'success' => true,
            'filename' => $filename,
            'url' => $_ENV['URL_BASE'] . '/' . $uploadPath . '/' . $filename,
            'path' => $uploadPath . '/' . $filename,
            'size' => $file['size'],
            'type' => $file['type']
        ]);
        
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
}

/**
 * Função auxiliar para upload de imagens de formulários
 * Mantém compatibilidade com código existente
 */
function uploadFormImage($file, $uploadPath = 'assets/img/forms', $prefix = 'form') {
    $_FILES['form_image'] = $file;
    $_POST['upload_type'] = 'form_image';
    $_POST['upload_path'] = $uploadPath;
    $_POST['file_prefix'] = $prefix;
    $_POST['allowed_types'] = 'image/jpeg,image/png,image/gif,image/webp';
    $_POST['max_size'] = '10485760'; // 10MB
    
    return handleFileUpload();
}
?>