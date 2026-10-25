<?php
/**
 * Database & API Configuration
 * Supports MySQL / MariaDB on cPanel & Plesk with phpMyAdmin
 */

// Enable session for Admin Authentication
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// -------------------------------------------------------------
// Database Credentials
// Update these when deploying to your cPanel / Plesk hosting server
// -------------------------------------------------------------
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'portfolio_db');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_CHARSET', 'utf8mb4');

// Global JSON & CORS Headers
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

/**
 * Returns active PDO MySQL Connection or null with error
 */
function getDbConnection() {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        return null;
    }
}

/**
 * Helper to emit JSON response and terminate
 */
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

/**
 * Authentication check helper
 */
function requireAdminAuth() {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    $sessionToken = $_SESSION['admin_token'] ?? '';
    
    // Check session or Bearer token
    if ($sessionToken && (!empty($_SESSION['admin_logged_in']))) {
        return true;
    }
    
    if ($authHeader && preg_match('/Bearer\s+(\S+)/', $authHeader, $matches)) {
        if ($sessionToken && hash_equals($sessionToken, $matches[1])) {
            return true;
        }
    }

    jsonResponse([
        'success' => false,
        'error' => 'UNAUTHORIZED: Please login to admin terminal'
    ], 401);
}
