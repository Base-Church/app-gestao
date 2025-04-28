<?php
class CacheBuster {
    private static $version = null;
    private static $hasLoggedStart = false;
    
    public static function getVersion() {
        if (self::$version === null) {
            self::$version = time();
        }
        return self::$version;
    }

    public static function generateUrl($path) {
        if (!str_ends_with($path, '.js')) {
            return $path;
        }

        if (!self::$hasLoggedStart && !strpos($path, '/layouts/')) {
            self::$hasLoggedStart = true;
            echo "<script>console.log('🔄 Atualizando scripts principais...');</script>";
        }

        $url = $path . '?v=' . self::getVersion();
        
        // Só loga scripts principais, não os layouts que são carregados dinamicamente
        if (!strpos($path, '/layouts/')) {
            $filename = basename($path);
            echo "<script>console.log('✓ " . $filename . "');</script>";
        }
        
        return $url;
    }
}
?>
