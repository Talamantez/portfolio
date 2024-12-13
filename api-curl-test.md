$baseUrl = "https://conscious-robot.com/api/license"

Write-Host "`nTesting invalid license key (GET)..."
curl.exe -X GET "$baseUrl/invalid-key" -H "Content-Type: application/json"

Write-Host "`nTesting invalid license key usage update (POST)..."
curl.exe -X POST "$baseUrl/invalid-key" `
    -H "Content-Type: application/json" `
    -d "{\"tokens\": 10}"

$testKey = "test-key-123"

Write-Host "`nTesting valid license key (GET)..."
curl.exe -X GET "$baseUrl/$testKey" -H "Content-Type: application/json"

Write-Host "`nTesting usage update for valid license (POST)..."
curl.exe -X POST "$baseUrl/$testKey" `
    -H "Content-Type: application/json" `
    -d "{\"tokens\": 5}"

Write-Host "`nTesting with malformed data..."
curl.exe -X POST "$baseUrl/$testKey" `
    -H "Content-Type: application/json" `
    -d "{invalid_json}"