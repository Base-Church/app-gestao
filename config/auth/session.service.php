<?php

class SessionService {
    public static function start() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    public static function createUserSession($userData) {
        self::start();
        $_SESSION['user'] = [
            'nome' => $userData['nome'],
            'ministerio_atual' => $userData['ministerios'][0]['id'] ?? null,
            'ministerios' => $userData['ministerios'],
            'organizacao_id' => $userData['organizacao_id'],
            'nivel' => $userData['nivel'],
            'permissoes' => isset($userData['permissoes']) ? (array)$userData['permissoes'] : []
        ];
    }

    public static function getUser() {
        self::start();
        return $_SESSION['user'] ?? null;
    }

    public static function isLoggedIn() {
        self::start();
        return isset($_SESSION['user']);
    }

    public static function logout() {
        self::start();
        unset($_SESSION['user']);
        session_destroy();
    }

    public static function getMinisterioAtual() {
        self::start();
        return $_SESSION['user']['ministerio_atual'] ?? null;
    }

    public static function setMinisterioAtual($ministerioId) {
        self::start();
        $_SESSION['user']['ministerio_atual'] = $ministerioId;
    }

    public static function getMinisterios() {
        self::start();
        return $_SESSION['user']['ministerios'] ?? [];
    }

    public static function getOrganizacaoId() {
        self::start();
        return $_SESSION['user']['organizacao_id'] ?? null;
    }

    public static function getNivel() {
        self::start();
        return $_SESSION['user']['nivel'] ?? null;
    }

    public static function clearSession() {
        self::start();
        $_SESSION = array();
    }

    public static function hasMinisterios() {
        self::start();
        return !empty($_SESSION['user']['ministerios']);
    }

    // Adicionar novo método para obter permissões
    public static function getPermissoes() {
        self::start();
        return $_SESSION['user']['permissoes'] ?? [];
    }
}
