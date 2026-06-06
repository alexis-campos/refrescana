<?php
declare(strict_types=1);

namespace App;

class UploadHandler
{
    public static function save(
        array  $file,
        string $subdir,
        array  $allowedMime,
        int    $maxBytes,
        string $prefix = 'file',
    ): string {
        if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            throw new \RuntimeException('Error en la subida del archivo');
        }
        if ($file['size'] > $maxBytes) {
            throw new \RuntimeException('El archivo supera el tamaño máximo permitido');
        }

        // Validate real MIME via finfo
        $fi   = new \finfo(FILEINFO_MIME_TYPE);
        $mime = $fi->file($file['tmp_name']);
        if (!in_array($mime, $allowedMime, true)) {
            throw new \RuntimeException('Tipo de archivo no permitido');
        }

        $ext   = match ($mime) {
            'image/jpeg' => 'jpg',
            'image/png'  => 'png',
            'image/webp' => 'webp',
            'image/gif'  => 'gif',
            default      => pathinfo($file['name'] ?? '', PATHINFO_EXTENSION),
        };

        $config  = $GLOBALS['__APP_CONFIG__'];
        $dir     = rtrim($config['uploads_dir'], '/') . '/' . $subdir;
        if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
            throw new \RuntimeException("No se pudo crear el directorio de subida: $dir (verifique permisos de uploads/)");
        }

        $name   = $prefix . '-' . substr(bin2hex(random_bytes(8)), 0, 8) . '-' . time() . '.' . $ext;
        $dest   = $dir . '/' . $name;

        if (!move_uploaded_file($file['tmp_name'], $dest)) {
            throw new \RuntimeException('No se pudo guardar el archivo');
        }

        return rtrim($config['uploads_url'], '/') . '/' . $subdir . '/' . $name;
    }
}
