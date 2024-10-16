
$baseUrl = "http://localhost:5000/api"

function Test-SpotifyCredentials {
    Write-Host "Testing Spotify API Credentials..." -ForegroundColor Cyan
    $response = Invoke-RestMethod -Uri "$baseUrl/spotify/check-credentials" -Method Get
    if ($response.clientId -eq "Set" -and $response.clientSecret -eq "Set") {
        Write-Host "Spotify credentials are set." -ForegroundColor Green
    } else {
        Write-Host "Spotify credentials are not properly set." -ForegroundColor Red
    }
    Write-Host "Redirect URI: $($response.redirectUri)"
}

function Test-SpotifyLogin {
    Write-Host "`nTesting Spotify Login..." -ForegroundColor Cyan
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/spotify/login" -Method Get
        Write-Host "Login URL generated successfully: $($response.url)" -ForegroundColor Green
    } catch {
        Write-Host "Failed to generate Spotify login URL: $_" -ForegroundColor Red
    }
}

function Test-SpotifyCallback {
    Write-Host "`nTesting Spotify Callback..." -ForegroundColor Cyan
    Write-Host "Note: This test will fail without a valid auth code. It's meant to check the endpoint existence." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/spotify/callback?code=test_code" -Method Get
        Write-Host "Callback endpoint exists, but expects a valid code." -ForegroundColor Yellow
    } catch {
        if ($_.Exception.Response.StatusCode -eq 500) {
            Write-Host "Callback endpoint exists, but returned an error as expected without a valid code." -ForegroundColor Yellow
        } else {
            Write-Host "Unexpected error testing callback: $_" -ForegroundColor Red
        }
    }
}

function Test-SpotifyScrobble {
    Write-Host "`nTesting Spotify Scrobble..." -ForegroundColor Cyan
    Write-Host "Note: This test requires authentication. Using a placeholder token." -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer placeholder_token"
    }
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/spotify/scrobble" -Method Post -Headers $headers
        Write-Host "Scrobble endpoint exists, but requires valid authentication." -ForegroundColor Yellow
    } catch {
        if ($_.Exception.Response.StatusCode -eq 401) {
            Write-Host "Scrobble endpoint exists and properly requires authentication." -ForegroundColor Green
        } else {
            Write-Host "Unexpected error testing scrobble: $_" -ForegroundColor Red
        }
    }
}

function Test-SpotifyDashboard {
    Write-Host "`nTesting Spotify Dashboard Data..." -ForegroundColor Cyan
    Write-Host "Note: This test requires authentication. Using a placeholder token." -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer placeholder_token"
    }
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/spotify/dashboard" -Method Get -Headers $headers
        Write-Host "Dashboard endpoint exists, but requires valid authentication." -ForegroundColor Yellow
    } catch {
        if ($_.Exception.Response.StatusCode -eq 401) {
            Write-Host "Dashboard endpoint exists and properly requires authentication." -ForegroundColor Green
        } else {
            Write-Host "Unexpected error testing dashboard: $_" -ForegroundColor Red
        }
    }
}

# Run all tests
Test-SpotifyCredentials
Test-SpotifyLogin
Test-SpotifyCallback
Test-SpotifyScrobble
Test-SpotifyDashboard

Write-Host "`nSpotify API tests completed." -ForegroundColor Cyan
