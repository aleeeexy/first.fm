$baseUrl = "http://localhost:5000/api"

function Invoke-ApiRequest {
    param (
        [string]$Method,
        [string]$Endpoint,
        [hashtable]$Headers = @{},
        $Body = $null
    )
    
    $url = "$baseUrl$Endpoint"
    $params = @{
        Method = $Method
        Uri = $url
        Headers = $Headers
    }
    
    if ($Body) {
        $params.Body = $Body | ConvertTo-Json
        $params.ContentType = 'application/json'
    }
    
    try {
        $response = Invoke-WebRequest @params
        return @{
            StatusCode = $response.StatusCode
            Content = $response.Content | ConvertFrom-Json -ErrorAction SilentlyContinue
        }
    }
    catch {
        return @{
            StatusCode = $_.Exception.Response.StatusCode.value__
            Error = $_.Exception.Message
            Content = $_.ErrorDetails.Message
        }
    }
}

# Test server connection
Write-Host "Testing server connection..."
$testResponse = Invoke-ApiRequest -Method GET -Endpoint "/test"
if ($testResponse.StatusCode -eq 200) {
    Write-Host "Successfully connected to the server."
    Write-Host "Response: $($testResponse.Content | ConvertTo-Json)"
} else {
    Write-Host "Failed to connect to the server. Status Code: $($testResponse.StatusCode)"
    Write-Host "Error: $($testResponse.Error)"
    Write-Host "Response Content: $($testResponse.Content)"
    exit
}

# Register a new user
Write-Host "`nRegistering a new user..."
$registerResponse = Invoke-ApiRequest -Method POST -Endpoint "/auth/register" -Body @{
    username = "testuser"
    email = "test@example.com"
    password = "password123"
}
Write-Host "Registration Status Code: $($registerResponse.StatusCode)"
Write-Host "Registration Response: $($registerResponse.Content | ConvertTo-Json)"

# Login
Write-Host "`nLogging in..."
$loginResponse = Invoke-ApiRequest -Method POST -Endpoint "/auth/login" -Body @{
    email = "test@example.com"
    password = "password123"
}
Write-Host "Login Status Code: $($loginResponse.StatusCode)"
Write-Host "Login Response: $($loginResponse.Content | ConvertTo-Json)"

if ($loginResponse.StatusCode -eq 200 -and $loginResponse.Content.token) {
    $token = $loginResponse.Content.token
    
    # Get user profile
    Write-Host "`nGetting user profile..."
    $profileResponse = Invoke-ApiRequest -Method GET -Endpoint "/user/profile" -Headers @{
        Authorization = "Bearer $token"
    }
    Write-Host "Profile Status Code: $($profileResponse.StatusCode)"
    Write-Host "Profile Response: $($profileResponse.Content | ConvertTo-Json)"
    
    # Search for music
    Write-Host "`nSearching for music..."
    $searchResponse = Invoke-ApiRequest -Method GET -Endpoint "/music/search?query=test" -Headers @{
        Authorization = "Bearer $token"
    }
    Write-Host "Search Status Code: $($searchResponse.StatusCode)"
    Write-Host "Search Response: $($searchResponse.Content | ConvertTo-Json)"
}
else {
    Write-Host "Login failed. Cannot proceed with authenticated requests."
}
