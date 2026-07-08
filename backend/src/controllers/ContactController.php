<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Request;
use App\Response;
use App\Models\ContactMessageRepo;
use App\Models\NotificationRepo;

class ContactController
{
    public static function create(Request $req): void
    {
        $b = $req->body;

        $name    = trim((string)($b['name'] ?? ''));
        $email   = trim((string)($b['email'] ?? ''));
        $phone   = trim((string)($b['phone'] ?? ''));
        $subject = trim((string)($b['subject'] ?? ''));
        $product = trim((string)($b['productInterest'] ?? ''));
        $message = trim((string)($b['message'] ?? ''));

        if (strlen($name) < 2)                   Response::error('El nombre debe tener al menos 2 caracteres');
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) Response::error('Email inválido');
        if (strlen($message) < 5)                Response::error('El mensaje es demasiado corto');

        $id = ContactMessageRepo::create(
            $name,
            $email,
            $phone ?: null,
            $subject ?: null,
            $product ?: null,
            $message
        );

        try {
            NotificationRepo::create(
                'CONTACT_MESSAGE',
                'Nuevo Mensaje de Contacto',
                "Mensaje de {$name} ({$email})"
            );
        } catch (\Throwable $__ignored) {}

        Response::json(['ok' => true, 'id' => $id], 201);
    }
}
