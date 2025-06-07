<?php
require_once dirname(__DIR__, 2) . '/vendor/autoload.php';
require_once dirname(__DIR__) . '/auth/session.service.php';

header('Content-Type: application/json');

$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__, 2));
$dotenv->load();

$apiBaseUrl = $_ENV['API_BASE_URL'];

SessionService::start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $whatsapp = $input['whatsapp'] ?? '';
    $senha = $input['senha'] ?? '';

    $url = $apiBaseUrl . '/api/usuarios/login';
    $data = [
        'whatsapp' => $whatsapp,
        'senha' => $senha
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json'
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $responseData = json_decode($response, true);

    if ($httpCode === 200 && isset($responseData['nome'])) {
        // Cria a sessão do usuário com os dados retornados
        SessionService::createUserSession($responseData);

        echo json_encode([
            'success' => true,
            'data' => $responseData
        ]);
    } else {
        $message = $responseData['error']
            ?? (isset($responseData['data']['message']) ? $responseData['data']['message'] : null);
        echo json_encode([
            'success' => false,
            'message' => $message
        ]);
    }
    exit;
}

