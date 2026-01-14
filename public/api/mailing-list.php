<?php
/**
 * Mailing List Subscription Endpoint
 * Stores community member subscriptions in the cacmailinglist database
 */

require_once 'config.php';

handlePreflight();
setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        jsonResponse(['error' => 'Invalid JSON input'], 400);
    }
    
    // Validate required fields
    $required = ['first_name', 'last_name', 'email'];
    foreach ($required as $field) {
        if (empty($input[$field])) {
            jsonResponse(['error' => "Missing required field: $field"], 400);
        }
    }
    
    // Validate email format
    if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['error' => 'Invalid email format'], 400);
    }
    
    // Connect to mailing list database
    $conn = getMailingListDbConnection();
    
    // Prepare data
    $firstName = sanitize($conn, $input['first_name']);
    $lastName = sanitize($conn, $input['last_name']);
    $email = sanitize($conn, $input['email']);
    $phone = isset($input['phone']) ? sanitize($conn, $input['phone']) : '';
    $wantsNotifications = isset($input['wants_notifications']) ? ($input['wants_notifications'] ? 1 : 0) : 1;
    $contactPreference = isset($input['contact_preference']) ? sanitize($conn, $input['contact_preference']) : 'email';
    
    // Insert into database
    $sql = "INSERT INTO subscribers (first_name, last_name, email, phone, wants_notifications, contact_preference, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, NOW())";
    
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception('Failed to prepare statement: ' . $conn->error);
    }
    
    $stmt->bind_param('ssssis', $firstName, $lastName, $email, $phone, $wantsNotifications, $contactPreference);
    
    if (!$stmt->execute()) {
        // Check for duplicate email
        if ($conn->errno === 1062) {
            jsonResponse(['error' => 'This email is already subscribed'], 409);
        }
        throw new Exception('Failed to insert record: ' . $stmt->error);
    }
    
    $subscriberId = $conn->insert_id;
    
    $stmt->close();
    $conn->close();
    
    jsonResponse([
        'success' => true,
        'message' => 'Successfully subscribed to the community!',
        'subscriber_id' => $subscriberId
    ]);
    
} catch (Exception $e) {
    error_log('Mailing list error: ' . $e->getMessage());
    jsonResponse(['error' => 'An error occurred processing your request'], 500);
}
?>
