<?php
return [
    'db' => [
        'host'    => 'localhost',
        'port'    => '3306',
        'name'    => 'refrescana',
        'user'    => 'root',
        'pass'    => '',
        'charset' => 'utf8mb4',
    ],
    'jwt_secret'     => 'CHANGE_ME_TO_A_RANDOM_32_CHAR_STRING',
    'jwt_ttl'        => 8 * 60 * 60, // 8 hours in seconds
    'uploads_dir'    => __DIR__ . '/../uploads',  // uploads/ en la raíz del proyecto
    'uploads_url'    => '/uploads',
    'cookie_secure'  => false, // set true in production (HTTPS)
    'timezone'       => 'America/Lima',
    'app_env'        => 'development', // 'production' in prod
];
