# Spotify Authentication Diagnostic Script
# Save this file as firstfm/backend/tests/Diagnose-SpotifyAuth.ps1

$backendDir = (Get-Item -Path ".\").FullName
$baseUrl = "http://localhost:5000/api"

function Write-Log {
    param (
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host (Get-Date -Format "yyyy-MM-dd HH:mm:ss") -NoNewline -ForegroundColor Gray
    Write-Host " - $Message" -ForegroundColor $Color
}

function Test-EnvFile {
    Write-Log "Checking .env file..." -Color Cyan
    $envPath = Join-Path $backendDir ".env"
    if (Test-Path $envPath) {
        Write-Log ".env file found at $envPath" -Color Green
        $envContent = Get-Content $envPath -Raw
        if ($envContent -match "SPOTIFY_CLIENT_ID=(.*)") {
            Write-Log "SPOTIFY_CLIENT_ID is set in .env" -Color Green
        } else {
            Write-Log "SPOTIFY_CLIENT_ID is missing in .env" -Color Red
        }
        if ($envContent -match "SPOTIFY_CLIENT_SECRET=(.*)") {
            Write-Log "SPOTIFY_CLIENT_SECRET is set in .env" -Color Green
        } else {
            Write-Log "SPOTIFY_CLIENT_SECRET is missing in .env" -Color Red
        }
        if ($envContent -match "SPOTIFY_REDIRECT_URI=(.*)") {
            Write-Log "SPOTIFY_REDIRECT_URI is set in .env" -Color Green
        } else {
            Write-Log "SPOTIFY_REDIRECT_URI is missing in .env" -Color Red
        }
    } else {
        Write-Log ".env file not found at $envPath" -Color Red
    }
}

function Test-SpotifyCredentials {
    Write-Log "Checking Spotify API credentials..." -Color Cyan
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/spotify/check-credentials" -Method Get
        Write-Log "Client ID status: $($response.clientId)" -Color Cyan
        Write-Log "Client Secret status: $($response.clientSecret)" -Color Cyan
        Write-Log "Redirect URI: $($response.redirectUri)" -Color Cyan
    } catch {
        Write-Log "Failed to check Spotify credentials: $($_.Exception.Message)" -Color Red
    }
}

function Test-SpotifyLogin {
    Write-Log "Testing Spotify login process..." -Color Cyan
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/spotify/login" -Method Get
        if ($response.url) {
            Write-Log "Login URL generated successfully:" -Color Green
            Write-Log "$($response.url)" -Color Cyan
            
            # Attempt to access the Spotify authorization URL
            try {
                $auth = Invoke-WebRequest -Uri $response.url -Method Get -MaximumRedirection 0 -ErrorAction SilentlyContinue
            } catch {
                if ($_.Exception.Response.StatusCode -eq 302) {
                    Write-Log "Spotify authorization URL is valid and redirects as expected." -Color Green
                } else {
                    Write-Log "Unexpected response from Spotify authorization URL: $($_.Exception.Message)" -Color Red
                }
            }
        } else {
            Write-Log "Failed to generate Spotify login URL." -Color Red
        }
    } catch {
        Write-Log "Error during Spotify login process: $($_.Exception.Message)" -Color Red
        if ($_.Exception.Response) {
            Write-Log "Response Status Code: $($_.Exception.Response.StatusCode)" -Color Yellow
            Write-Log "Response Content: $($_.ErrorDetails.Message)" -Color Yellow
        }
    }
}

function Test-SpotifyCallback {
    Write-Log "Testing Spotify callback endpoint..." -Color Cyan
    $testCode = "test_auth_code"
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/spotify/callback?code=$testCode" -Method Get
        Write-Log "Callback endpoint responded without errors." -Color Green
    } catch {
        Write-Log "Error testing callback endpoint: $($_.Exception.Message)" -Color Red
        if ($_.Exception.Response) {
            Write-Log "Response Status Code: $($_.Exception.Response.StatusCode)" -Color Yellow
            Write-Log "Response Content: $($_.ErrorDetails.Message)" -Color Yellow
        }
    }
}

function Check-ServerLogs {
    Write-Log "Checking server logs for Spotify-related errors..." -Color Cyan
    $logPath = Join-Path $backendDir "logs" "server.log"
    if (Test-Path $logPath) {
        $recentLogs = Get-Content $logPath -Tail 50
        $spotifyErrors = $recentLogs | Select-String "spotify|authentication" -CaseSensitive
        if ($spotifyErrors) {
            Write-Log "Found Spotify-related log entries:" -Color Yellow
            foreach ($error in $spotifyErrors) {
                Write-Log $error -Color Yellow
            }
        } else {
            Write-Log "No recent Spotify-related errors found in logs." -Color Green
        }
    } else {
        Write-Log "Server log file not found at $logPath" -Color Red
    }
}

# Run all diagnostic tests
Test-EnvFile
Test-SpotifyCredentials
Test-SpotifyLogin
Test-SpotifyCallback
Check-ServerLogs

Write-Log "Spotify authentication diagnostic completed." -Color Cyan
Write-Log "Please review the output above for any issues with your Spotify authentication setup." -Color Yellow
