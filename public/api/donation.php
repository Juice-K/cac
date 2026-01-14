<?php
/**
 * Donation Registration API Endpoint
 * Stores donation records in the cacvols database
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
    $amount = sanitize($conn, $input['amount'] ?? '');
    $payment_method = sanitize($conn, $input['payment_method'] ?? '');
    
    // Parse amount (handle "$25" format or custom amounts)
    $amount_value = floatval(preg_replace('/[^0-9.]/', '', $amount));
    
    // Validate required fields
    if (empty($amount) || $amount_value <= 0 || empty($payment_method)) {
        jsonResponse(['success' => false, 'error' => 'Valid amount and payment method are required'], 400);
    }
    
    // Validate email if provided
    if (!empty($input['email']) && !filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['success' => false, 'error' => 'Invalid email format'], 400);
    }
    
    // Insert into database
    $sql = "INSERT INTO donations (
        name, email, amount, payment_method, created_at
    ) VALUES (
        '$name', '$email', $amount_value, '$payment_method', NOW()
    )";
    
    if ($conn->query($sql)) {
        $insertId = $conn->insert_id;
        jsonResponse([
            'success' => true, 
            'message' => 'Donation recorded successfully',
            'donation_id' => $insertId
        ]);
    } else {
        throw new Exception('Failed to save donation: ' . $conn->error);
    }
    
    $conn->close();
    
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}

/*
SQL to create the donations table in your cacvols database:

CREATE TABLE donations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200),
    email VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    INDEX idx_email (email),
    INDEX idx_payment_method (payment_method),
    INDEX idx_created_at (created_at)
);

*/
?>
