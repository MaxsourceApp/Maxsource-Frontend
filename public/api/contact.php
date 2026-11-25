
<?php

ini_set('display_errors', '0');
ini_set('log_errors', '1');
error_reporting(E_ALL);

// Set to false after successful production testing.
define('GHL_DEBUG', true);

function respond(int $status, array $body): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($body);
    exit;
}

function value_length(string $value): int
{
    return function_exists('mb_strlen')
        ? mb_strlen($value, 'UTF-8')
        : strlen($value);
}

function is_string_list($value): bool
{
    if (!is_array($value)) {
        return false;
    }

    foreach ($value as $item) {
        if (!is_string($item)) {
            return false;
        }
    }

    return true;
}

function get_env_value(string $key): string
{
    $value = getenv($key);

    if ($value === false || trim((string) $value) === '') {
        $value = $_SERVER[$key]
            ?? $_ENV[$key]
            ?? $_SERVER['REDIRECT_' . $key]
            ?? '';
    }

    return trim((string) $value);
}

function ghl_error(
    int $status,
    string $message,
    array $debug = []
): void {
    error_log('GHL CONTACT ERROR: ' . json_encode([
        'message' => $message,
        'debug' => $debug,
    ]));

    $response = [
        'error' => 'We could not send your enquiry right now. Please try again.',
    ];

    if (GHL_DEBUG) {
        $response['message'] = $message;
        $response['debug'] = $debug;
    }

    respond($status, $response);
}

// Allow POST requests only.
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');

    respond(405, [
        'error' => 'Method not allowed.',
    ]);
}

// Validate content type.
$contentType = strtolower(
    trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0])
);

if ($contentType !== 'application/json') {
    respond(400, [
        'error' => 'Please submit the enquiry form and try again.',
    ]);
}

// Read JSON request.
$rawInput = file_get_contents('php://input');
$payload = json_decode($rawInput, true);

if (json_last_error() !== JSON_ERROR_NONE || !is_array($payload)) {
    respond(400, [
        'error' => 'The enquiry could not be read. Please try again.',
    ]);
}

// Required form fields.
$requiredStringFields = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'company',
    'referralSource',
    'projectDetails',
    'website',
];

foreach ($requiredStringFields as $field) {
    if (!isset($payload[$field]) || !is_string($payload[$field])) {
        respond(400, [
            'error' => 'Please complete the enquiry form and try again.',
        ]);
    }
}

if (
    !isset($payload['serviceAreas'], $payload['engagements']) ||
    !is_string_list($payload['serviceAreas']) ||
    !is_string_list($payload['engagements'])
) {
    respond(400, [
        'error' => 'Please complete the enquiry form and try again.',
    ]);
}

// Honeypot spam protection.
if (trim($payload['website']) !== '') {
    respond(200, ['ok' => true]);
}

// Allowed form options.
$allowedServiceAreas = [
    'AI & Business Automation',
    'Custom Software Development',
    'Dedicated Development Teams',
    'Healthcare Technology & Operations',
    'Ecommerce Development',
    'Digital Marketing & Automation',
];

$allowedEngagements = [
    'Individual specialists',
    'Dedicated team',
    'Managed service',
    'Fixed-scope project',
];

$allowedReferralSources = [
    '',
    'Google Search',
    'Referral',
    'LinkedIn',
    'Social Media',
    'Existing Client',
    'Other',
];

// Validate service areas.
$validServiceAreas = count($payload['serviceAreas']) > 0;

foreach ($payload['serviceAreas'] as $area) {
    if (!in_array($area, $allowedServiceAreas, true)) {
        $validServiceAreas = false;
        break;
    }
}

// Validate engagements.
$validEngagements = count($payload['engagements']) > 0;

foreach ($payload['engagements'] as $engagement) {
    if (!in_array($engagement, $allowedEngagements, true)) {
        $validEngagements = false;
        break;
    }
}

// Sanitize form values.
$firstName = trim($payload['firstName']);
$lastName = trim($payload['lastName']);
$email = strtolower(trim($payload['email']));
$phone = trim($payload['phone']);
$company = trim($payload['company']);
$referralSource = trim($payload['referralSource']);
$projectDetails = trim($payload['projectDetails']);

// Validate submission.
$validSubmission =
    $firstName !== '' &&
    value_length($firstName) <= 100 &&
    $lastName !== '' &&
    value_length($lastName) <= 100 &&
    filter_var($email, FILTER_VALIDATE_EMAIL) !== false &&
    value_length($email) <= 254 &&
    preg_match('/^[+()\d.\-\s]{7,30}$/', $phone) === 1 &&
    $company !== '' &&
    value_length($company) <= 200 &&
    in_array($referralSource, $allowedReferralSources, true) &&
    value_length($projectDetails) <= 5000 &&
    $validServiceAreas &&
    $validEngagements;

if (!$validSubmission) {
    respond(400, [
        'error' => 'Please check your details and selections, then try again.',
    ]);
}

// Read credentials from cPanel environment.
$token = get_env_value('GHL_API_TOKEN');
$locationId = get_env_value('GHL_LOCATION_ID');

if ($token === '' || $locationId === '') {
    ghl_error(503, 'GHL credentials are missing.', [
        'token_configured' => $token !== '',
        'location_configured' => $locationId !== '',
    ]);
}

// Check PHP cURL support.
if (!function_exists('curl_init')) {
    ghl_error(503, 'PHP cURL extension is not enabled.');
}

// Prepare GHL contact payload.
$ghlPayload = [
    'locationId' => $locationId,
    'tags' => ['contact-us'],
    'firstName' => $firstName,
    'lastName' => $lastName,
    'email' => $email,
    'phone' => $phone,
    'companyName' => $company,
    'customFields' => [
        [
            'id' => 'oy1NKNIhHa7UL0vJb607',
            'value' => implode(', ', $payload['serviceAreas']),
        ],
        [
            'id' => '851GVosWT2sQ1mnsJMq5',
            'value' => implode(', ', $payload['engagements']),
        ],
        [
            'id' => 'O6PGENoT22ExkzCg6G1F',
            'value' => $company,
        ],
        [
            'id' => '0B4AW8emqF6ott77DjyO',
            'value' => $referralSource,
        ],
        [
            'id' => 'R12pmQol2pFhFcVd9Nez',
            'value' => $projectDetails,
        ],
    ],
];

$encodedPayload = json_encode($ghlPayload);

if ($encodedPayload === false) {
    ghl_error(500, 'Unable to encode GHL request.');
}

// GHL API endpoint.
$apiUrl = 'https://services.leadconnectorhq.com/contacts/';

$curl = curl_init($apiUrl);

if ($curl === false) {
    ghl_error(502, 'Unable to initialize cURL.');
}

// Configure cURL request.
$optionsConfigured = curl_setopt_array($curl, [
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $token,
        'Content-Type: application/json',
        'Accept: application/json',
        'Version: 2021-07-28',
    ],
    CURLOPT_POSTFIELDS => $encodedPayload,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 15,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_FOLLOWLOCATION => false,
]);

if (!$optionsConfigured) {
    curl_close($curl);
    ghl_error(502, 'Unable to configure cURL.');
}

// Execute GHL API request.
$ghlResponse = curl_exec($curl);

$curlError = curl_error($curl);
$curlErrno = curl_errno($curl);
$curlInfo = curl_getinfo($curl);
$status = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE);

curl_close($curl);

// Handle server connection errors.
if ($ghlResponse === false) {
    error_log('GHL cURL error: ' . $curlError);

    ghl_error(502, 'Unable to connect to GHL API.', [
        'curl_errno' => $curlErrno,
        'ghl_http_status' => $status,
        'total_time' => $curlInfo['total_time'] ?? null,
    ]);
}

// Handle GHL API errors.
if ($status < 200 || $status >= 300) {
    ghl_error(502, 'GHL API rejected the contact request.', [
        'ghl_http_status' => $status,
        'curl_errno' => $curlErrno,
        'total_time' => $curlInfo['total_time'] ?? null,
    ]);
}

// Contact successfully created.
respond(200, [
    'ok' => true,
]);
