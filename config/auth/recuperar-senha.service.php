<?php
require_once dirname(__DIR__) . '/load_env.php';

header('Content-Type: application/json');

$apiBaseUrl = $_ENV['API_BASE_URL'] ?? ($_SERVER['API_BASE_URL'] ?? null);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $step = $input['step'] ?? '';
    $whatsapp = $input['whatsapp'] ?? '';

    // Step 1: Solicitar código
    if ($step === 'solicitar') {
        $url = $apiBaseUrl . '/usuarios/recuperar-senha/solicitar';
        $data = ['whatsapp' => $whatsapp];
    }
    // Step 2: Atualizar senha
    else if ($step === 'atualizar') {
        $url = $apiBaseUrl . '/usuarios/recuperar-senha/verificar';
        $data = [
            'whatsapp' => $whatsapp,
            'codigo' => $input['codigo'] ?? '',
            'nova_senha' => $input['nova_senha'] ?? ''
        ];
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Step inválido']);
        exit;
    }

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
    if ($httpCode === 200) {
        if ($step === 'atualizar' && isset($responseData['message']) && $responseData['message'] === 'Senha atualizada com sucesso') {
            echo json_encode([
                'success' => true,
                'message' => $responseData['message']
            ]);
        } else {
            echo $response;
        }
    } else {
        echo $response;
    }
    exit;
}
