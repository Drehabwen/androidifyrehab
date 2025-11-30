# PowerShell script to download Adoptium OpenJDK 21 for Windows x64
# This script will download the MSI installer for OpenJDK 21

Write-Host "Downloading Adoptium OpenJDK 21 for Windows x64..." -ForegroundColor Green

# URL for Adoptium OpenJDK 21 Windows x64 MSI installer
# Note: This URL may change, please verify on https://adoptium.net if this fails
$downloadUrl = "https://github.com/adoptium/temurin21-binaries/releases/latest/download/OpenJDK21U-jdk_x64_windows_hotspot.msi"
$outputFile = "$env:USERPROFILE\Downloads\OpenJDK21U-jdk_x64_windows_hotspot.msi"

Write-Host "Download URL: $downloadUrl" -ForegroundColor Yellow
Write-Host "Output file: $outputFile" -ForegroundColor Yellow

try {
    # Create Downloads directory if it doesn't exist
    $downloadsDir = "$env:USERPROFILE\Downloads"
    if (!(Test-Path $downloadsDir)) {
        New-Item -ItemType Directory -Path $downloadsDir | Out-Null
    }

    # Download the file
    Write-Host "Starting download..." -ForegroundColor Cyan
    Invoke-WebRequest -Uri $downloadUrl -OutFile $outputFile -UseBasicParsing
    Write-Host "Download completed successfully!" -ForegroundColor Green
    
    Write-Host "The OpenJDK 21 installer has been downloaded to: $outputFile" -ForegroundColor Green
    Write-Host "Please run the installer manually to complete the installation." -ForegroundColor Yellow
    Write-Host "After installation, you'll need to set the JAVA_HOME environment variable and update your PATH." -ForegroundColor Yellow
}
catch {
    Write-Host "Error downloading file: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please visit https://adoptium.net manually to download OpenJDK 21." -ForegroundColor Yellow
}