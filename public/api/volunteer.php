<?php
/**
 * Volunteer Registration API Endpoint
 * Stores volunteer applications in the cacvols database
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
    $conn = getSupportDbConnection();
    
    // Sanitize inputs
    $name = sanitize($conn, $input['name'] ?? '');
    $email = sanitize($conn, $input['email'] ?? '');
    $phone = sanitize($conn, $input['phone'] ?? '');
    $service_area = sanitize($conn, $input['service_area'] ?? '');
    $availability = sanitize($conn, json_encode($input['availability'] ?? []));
    $experience = sanitize($conn, $input['experience'] ?? '');
    $message = sanitize($conn, $input['message'] ?? '');
    
    // Validate required fields
    if (empty($name) || empty($email)) {
        jsonResponse(['success' => false, 'error' => 'Name and email are required'], 400);
    }
    
    // Validate email format
    if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['success' => false, 'error' => 'Invalid email format'], 400);
    }
    
    // Insert into database
    $sql = "INSERT INTO volunteers (
        name, email, phone, service_area, availability, 
        experience, message, created_at
    ) VALUES (
        '$name', '$email', '$phone', '$service_area', '$availability',
        '$experience', '$message', NOW()
    )";
    
    if ($conn->query($sql)) {
        $insertId = $conn->insert_id;
        jsonResponse([
            'success' => true, 
            'message' => 'Volunteer application submitted successfully',
            'volunteer_id' => $insertId
        ]);
    } else {
        throw new Exception('Failed to save application: ' . $conn->error);
    }
    
    $conn->close();
    
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}

/*
SQL to create the volunteers table in your cacvols database:

CREATE TABLE volunteers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    service_area VARCHAR(100),
    availability JSON,
    experience TEXT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    INDEX idx_email (email),
    INDEX idx_service_area (service_area),
    INDEX idx_created_at (created_at)
);

*/
?>
