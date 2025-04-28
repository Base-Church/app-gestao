<?php
require_once __DIR__ . '/SessionService.php';

class MenuService {
    private static $menuConfig = null;

    public static function loadMenuConfig() {
        if (self::$menuConfig === null) {
            $jsonContent = file_get_contents(__DIR__ . '/../../menu.config.json');
            self::$menuConfig = json_decode($jsonContent, true);
        }
        return self::$menuConfig;
    }

    public static function getUserAuthorizedMenus() {
        $menuConfig = self::loadMenuConfig();
        $userPermissions = SessionService::getPermissoes();
        $nivel = SessionService::getNivel();
        
        // Se for superadmin, retorna todos os menus
        if ($nivel === 'superadmin') {
            return $menuConfig;
        }

        // Filtra apenas os menus que o usuário tem permissão
        return array_filter($menuConfig, function($menuItem) use ($userPermissions) {
            return in_array((string)$menuItem['id'], $userPermissions, true);
        });
    }

    public static function hasMenuAccess($menuId) {
        $nivel = SessionService::getNivel();
        $userPermissions = SessionService::getPermissoes();
        
        // Superadmin tem acesso a tudo
        if ($nivel === 'superadmin') {
            return true;
        }

        // Converte menuId para string para comparação consistente
        return in_array((string)$menuId, $userPermissions, true);
    }

    public static function debug() {
        return [
            'permissions' => SessionService::getPermissoes(),
            'nivel' => SessionService::getNivel(),
            'menus' => self::getUserAuthorizedMenus()
        ];
    }
}
