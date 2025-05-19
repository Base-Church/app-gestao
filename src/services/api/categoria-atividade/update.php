<?php
require_once __DIR__ . '/../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../config/auth/session.service.php';

// Carrega as variáveis de ambiente
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../../');
$dotenv->load();

// Define o header da resposta como JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Se for uma requisição OPTIONS, retorna sucesso
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Função para retornar erro
function returnError($message, $code = 400) {
    http_response_code($code);
    echo json_encode(['error' => $message]);
    exit;
}

// Verifica se o usuário está autenticado
SessionService::start();
if (!SessionService::isLoggedIn()) {
    returnError('Não autorizado', 401);
}

// Verifica método HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    returnError('Método não permitido', 405);
}

// Obtém dados do corpo da requisição
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validações
if (!$data || !isset($data['id']) || !isset($data['nome']) || !isset($data['cor'])) {
    returnError('Dados inválidos ou incompletos');
}

// Obtém dados da sessão
$organizacao_id = SessionService::getOrganizacaoId();
$ministerio_id = SessionService::getMinisterioAtual();

if (!$organizacao_id || !$ministerio_id) {
    returnError('Dados da sessão inválidos');
}

// Monta a URL da API
$apiUrl = $_ENV['API_BASE_URL'] . '/api/categoria-atividade/' . $data['id'];

// Prepara os dados
$putData = [
    'nome' => $data['nome'],
    'cor' => $data['cor'],
    'organizacao_id' => intval($organizacao_id),
    'ministerio_id' => intval($ministerio_id)
];

// Configuração do cURL
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $apiUrl,
    CURLOPT_CUSTOMREQUEST => 'PUT',
    CURLOPT_POSTFIELDS => json_encode($putData),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Accept: application/json',
        'Authorization: ' . $_ENV['API_KEY']
    ]
]);

// Executa a requisição
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Verifica erros do cURL
if (curl_errno($ch)) {
    curl_close($ch);
    returnError('Erro ao conectar com a API');
}

curl_close($ch);

// Retorna a resposta
http_response_code(200);
echo json_encode([
    'code' => 200,
    'message' => 'Categoria atualizada com sucesso',
    'data' => json_decode($response, true)
]);