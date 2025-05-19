<?php
// Carrega o dotenv antes de qualquer operação
require_once __DIR__ . '/../../../../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../../');
$dotenv->load();

require_once __DIR__ . '/../../../../config/auth/session.service.php';

header('Content-Type: application/json');

function returnError($message, $code = 400) {
    http_response_code($code);
    echo json_encode(['error' => $message]);
    exit;
}

// Verifica autenticação
SessionService::start();
if (!SessionService::isLoggedIn()) {
    returnError('Não autorizado', 401);
}

// Verifica método
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    returnError('Método não permitido', 405);
}

// Recebe e valida dados
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data || !isset($data['id']) || !isset($data['nome']) || !isset($data['prefixo'])) {
    returnError('Dados inválidos ou incompletos');
}

// Adiciona organizacao_id se não existir
if (!isset($data['organizacao_id'])) {
    $data['organizacao_id'] = SessionService::getOrganizacaoId();
}

$id = $data['id'];
unset($data['id']);

// Processa imagem se existir
if (isset($data['foto'])) {
    if (strpos($data['foto'], 'data:image') === 0) {
        $uploadDir = __DIR__ . '/../../../../assets/img/ministerios/';
        $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $data['foto']));
        $filename = uniqid() . '.jpg';
        
        if (!file_put_contents($uploadDir . $filename, $imageData)) {
            returnError('Erro ao salvar imagem');
        }
        
        $data['foto'] = 'assets/img/ministerios/' . $filename;
    }
} else {
    // Se não houver foto, usa o placeholder
    $data['foto'] = 'assets/img/ministerios/placeholder.jpg';
}

// Configura requisição para API
$apiUrl = $_ENV['API_BASE_URL'] . '/api/ministerios/' . $id;
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $apiUrl,
    CURLOPT_CUSTOMREQUEST => 'PUT',
    CURLOPT_POSTFIELDS => json_encode($data),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Accept: application/json',
        'Authorization: ' . $_ENV['API_KEY']
    ]
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    returnError('Erro ao conectar com API: ' . curl_error($ch), 500);
}

curl_close($ch);

http_response_code($httpCode);
echo $response;
