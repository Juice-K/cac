<?php
/**
 * Help Request API Endpoint
 * Stores help requests in the cacfriends database
 */

require_once 'config.php';

handlePreflight();
setCorsHeaders();

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'error' => 'Method not allowed'], 405);
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        jsonResponse(['success' => false, 'error' => 'Invalid JSON input'], 400);
    }
    
    // Connect to database
    $conn = getHelpDbConnection();
    
    // Sanitize inputs
    $service_type = sanitize($conn, $input['service_type'] ?? '');
    $first_name = sanitize($conn, $input['first_name'] ?? '');
    $last_name = sanitize($conn, $input['last_name'] ?? '');
    $email = sanitize($conn, $input['email'] ?? '');
    $phone = sanitize($conn, $input['phone'] ?? '');
    $address = sanitize($conn, $input['address'] ?? '');
    $city = sanitize($conn, $input['city'] ?? '');
    $state = sanitize($conn, $input['state'] ?? '');
    $zip = sanitize($conn, $input['zip'] ?? '');
    
    // Service-specific fields (store as JSON)
    $service_details = sanitize($conn, json_encode($input['service_details'] ?? []));
    
    // Validate required fields
    if (empty($service_type) || empty($first_name) || empty($last_name) || empty($email) || empty($phone)) {
        jsonResponse(['success' => false, 'error' => 'Missing required fields'], 400);
    }
    
    // Validate email format
    if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['success' => false, 'error' => 'Invalid email format'], 400);
    }
    
    // Insert into database
    // Note: You'll need to create this table in your database
    // See the SQL schema below
    $sql = "INSERT INTO help_requests (
        service_type, first_name, last_name, email, phone, 
        address, city, state, zip, service_details, created_at
    ) VALUES (
        '$service_type', '$first_name', '$last_name', '$email', '$phone',
        '$address', '$city', '$state', '$zip', '$service_details', NOW()
    )";
    
    if ($conn->query($sql)) {
        $insertId = $conn->insert_id;
        jsonResponse([
            'success' => true, 
            'message' => 'Help request submitted successfully',
            'request_id' => $insertId
        ]);
    } else {
        throw new Exception('Failed to save request: ' . $conn->error);
    }
    
    $conn->close();
    
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}

/*
SQL to create the help_requests table in your cacfriends database:

CREATE TABLE help_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_type VARCHAR(50) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    zip VARCHAR(20),
    service_details JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    INDEX idx_service_type (service_type),
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);

*/
?>
