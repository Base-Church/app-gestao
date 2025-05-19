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

// Obtém o ID da organização da sessão
$organizacao_id = SessionService::getOrganizacaoId();
if (!$organizacao_id) {
    returnError('ID da organização não encontrado');
}

// Obtém e valida os dados da requisição
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || !isset($data['id'])) {
    returnError('Dados inválidos');
}

$id = $data['id'];
$nome = $data['nome'] ?? null;
$dia_semana = $data['dia_semana'] ?? null;
$hora = $data['hora'] ?? null;
$tipo = $data['tipo'] ?? null;
$visibilidade = $data['visibilidade'] ?? null;
$foto = $data['foto'] ?? null;

// Validações
if (!$nome) {
    returnError('Nome do evento é obrigatório');
}

if (!$dia_semana) {
    returnError('Dia da semana é obrigatório');
}

if (!$hora) {
    returnError('Hora é obrigatória');
}

if (!$tipo) {
    returnError('Tipo do evento é obrigatório');
}

// Validação do dia da semana
$dias_validos = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
if (!in_array(strtolower($dia_semana), $dias_validos)) {
    returnError('Dia da semana inválido');
}

// Validação da hora
if (!preg_match('/^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/', $hora)) {
    returnError('Formato de hora inválido (Use HH:MM:SS)');
}

// Validação da visibilidade
if ($visibilidade) {
    $visibilidades_validas = ['publico', 'privado'];
    if (!in_array($visibilidade, $visibilidades_validas)) {
        returnError('Visibilidade inválida');
    }
}

// Monta a URL da API
$apiUrl = $_ENV['API_BASE_URL'] . '/api/eventos/' . $id;

// Prepara os dados para envio
$updateData = [
    'nome' => $nome,
    'dia_semana' => $dia_semana,
    'hora' => $hora,
    'tipo' => $tipo,
    'organizacao_id' => $organizacao_id
];

if ($visibilidade) {
    $updateData['visibilidade'] = $visibilidade;
}

if ($foto) {
    $updateData['foto'] = $foto;
}

// Configuração do cURL
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $apiUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST => 'PUT',
    CURLOPT_POSTFIELDS => json_encode($updateData),
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Accept: application/json',
        'Authorization: ' . $_ENV['API_KEY']
    ]
]);

// Faz a requisição
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Verifica erros do cURL
if (curl_errno($ch)) {
    $error = curl_error($ch);
    curl_close($ch);
    returnError("Erro ao conectar com a API: {$error}", 500);
}

curl_close($ch);

// Verifica se a resposta é um JSON válido
$responseData = json_decode($response, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    returnError('Resposta inválida da API', 500);
}

// Retorna a resposta
http_response_code($httpCode);
echo json_encode([
    'code' => 200,
    'message' => 'Evento atualizado com sucesso',
    'data' => $responseData
]);
