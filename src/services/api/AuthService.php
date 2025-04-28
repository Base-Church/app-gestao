<?php
require_once __DIR__ . '/../../../vendor/autoload.php';

class AuthService {
    private $apiBaseUrl;

    public function __construct() {
        $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../');
        $dotenv->load();
        $this->apiBaseUrl = $_ENV['API_BASE_URL'];
    }

    public function login($whatsapp, $senha) {
        $url = $this->apiBaseUrl . '/api/usuarios/login';
        
        $data = array(
            'whatsapp' => $whatsapp,
            'senha' => $senha
        );

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Accept: application/json'
        ));

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return [
            'status' => $httpCode,
            'data' => json_decode($response, true)
        ];
    }

    public function register($nome, $whatsapp, $senha) {
        $url = $this->apiBaseUrl . '/api/usuarios/registro';
        
        $data = array(
            'nome' => $nome,
            'whatsapp' => $whatsapp,
            'senha' => $senha,
            'organizacao_id' => 1 // Valor fixo conforme especificado
        );

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Accept: application/json'
        ));

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return [
            'status' => $httpCode,
            'data' => json_decode($response, true)
        ];
    }
}
