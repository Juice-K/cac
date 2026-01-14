<?php
/**
 * Database Configuration for Community Advancement Collective
 * 
 * IMPORTANT: Update these credentials before deploying to Dreamhost
 * Keep this file secure and never commit with real credentials to version control
 */

// Help Requests Database (cacfriends)
define('DB_HELP_HOST', 'friendsql.cacfla.org');
define('DB_HELP_NAME', 'cacfriends');
define('DB_HELP_USER', 'YOUR_USERNAME_HERE');  // Update this
define('DB_HELP_PASS', 'YOUR_PASSWORD_HERE');  // Update this

// Volunteers/Donors Database (cacvols)
define('DB_SUPPORT_HOST', 'friendsql.cacfla.org');
define('DB_SUPPORT_NAME', 'cacvols');
define('DB_SUPPORT_USER', 'YOUR_USERNAME_HERE');  // Update this
define('DB_SUPPORT_PASS', 'YOUR_PASSWORD_HERE');  // Update this

// CORS headers for API responses
function setCorsHeaders() {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json');
}

// Handle preflight requests
function handlePreflight() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        setCorsHeaders();
        exit(0);
    }
}

// Create database connection
function getHelpDbConnection() {
    $conn = new mysqli(DB_HELP_HOST, DB_HELP_USER, DB_HELP_PASS, DB_HELP_NAME);
    if ($conn->connect_error) {
        throw new Exception('Database connection failed: ' . $conn->connect_error);
    }
    $conn->set_charset('utf8mb4');
    return $conn;
}

function getSupportDbConnection() {
    $conn = new mysqli(DB_SUPPORT_HOST, DB_SUPPORT_USER, DB_SUPPORT_PASS, DB_SUPPORT_NAME);
    if ($conn->connect_error) {
        throw new Exception('Database connection failed: ' . $conn->connect_error);
    }
    $conn->set_charset('utf8mb4');
    return $conn;
}

// Send JSON response
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}

// Sanitize input
function sanitize($conn, $input) {
    return $conn->real_escape_string(trim($input));
}
?>
