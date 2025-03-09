<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set the correct MIME type for CSS files
header('Content-Type: text/css');

// Debug mode - uncomment to see errors
// header('Content-Type: text/plain');
// echo "Debug mode enabled\n\n";

// Get the requested CSS file
$file = $_GET['file'] ?? '';

// Debug info
// echo "Requested file: " . $file . "\n";
// echo "Current directory: " . __DIR__ . "\n";
// echo "Full path: " . __DIR__ . '/css/' . $file . "\n\n";

// Security check - only allow CSS files from the css directory
if (!preg_match('/^[a-zA-Z0-9_-]+\.css$/', $file)) {
    header('HTTP/1.1 403 Forbidden');
    exit('Access denied');
}

// Path to the CSS file
$path = __DIR__ . '/css/' . $file;

// Check if the file exists
if (!file_exists($path)) {
    header('HTTP/1.1 404 Not Found');
    exit('File not found: ' . $path);
}

// Read and output the file
readfile($path);
?> 