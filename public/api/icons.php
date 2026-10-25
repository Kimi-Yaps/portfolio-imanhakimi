<?php
require_once __DIR__ . '/config.php';

$iconsDir = realpath(__DIR__ . '/../tech-icons');
if (!$iconsDir || !is_dir($iconsDir)) {
    $iconsDir = realpath(__DIR__ . '/../icons');
}

if (!$iconsDir || !is_dir($iconsDir)) {
    jsonResponse(['success' => false, 'error' => 'Icons directory not found'], 500);
}

$method = $_SERVER['REQUEST_METHOD'];

// 1. GET: List all SVG files in public/tech-icons
if ($method === 'GET') {
    $files = scandir($iconsDir);
    $icons = [];

    foreach ($files as $file) {
        if (substr($file, -4) === '.svg') {
            $name = substr($file, 0, -4);
            $icons[] = [
                'name' => $name,
                'filename' => $file,
                'url' => '/tech-icons/' . $file
            ];
        }
    }

    jsonResponse([
        'success' => true,
        'count' => count($icons),
        'icons' => $icons
    ]);
}

// 2. POST: Upload a new custom SVG icon
if ($method === 'POST') {
    requireAdminAuth();

    $input = json_decode(file_get_contents('php://input'), true);
    $name = preg_replace('/[^a-z0-9_-]/i', '', strtolower($input['name'] ?? ''));
    $svgContent = $input['svg'] ?? '';

    if (empty($name)) {
        jsonResponse(['success' => false, 'error' => 'Icon name required (alphanumeric)'], 400);
    }

    if (empty($svgContent) || strpos($svgContent, '<svg') === false) {
        jsonResponse(['success' => false, 'error' => 'Valid SVG content required'], 400);
    }

    // Ensure fill is black
    if (!strpos($svgContent, 'fill=')) {
        $svgContent = str_replace('<svg ', '<svg fill="#000000" ', $svgContent);
    } else {
        $svgContent = preg_replace('/fill="[^"]*"/', 'fill="#000000"', $svgContent);
    }

    $dest = $iconsDir . '/' . $name . '.svg';
    if (file_put_contents($dest, $svgContent) === false) {
        jsonResponse(['success' => false, 'error' => 'Failed to save icon to disk'], 500);
    }

    jsonResponse([
        'success' => true,
        'message' => 'Icon saved successfully',
        'icon' => [
            'name' => $name,
            'filename' => $name . '.svg',
            'url' => '/tech-icons/' . $name . '.svg'
        ]
    ]);
}

jsonResponse(['error' => 'Method not allowed'], 405);
