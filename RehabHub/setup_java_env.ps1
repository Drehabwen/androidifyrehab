# PowerShell script to set up Java 21 environment variables
# Run this script as Administrator after installing Adoptium OpenJDK 21

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "This script needs to be run as Administrator to set system environment variables." -ForegroundColor Red
    Write-Host "Please right-click PowerShell and select 'Run as Administrator'." -ForegroundColor Yellow
    exit 1
}

# Common installation paths for Adoptium OpenJDK 21
$possiblePaths = @(
    "C:\Program Files\Eclipse Adoptium\jdk-21.0.5-hotspot",
    "C:\Program Files\Eclipse Adoptium\jdk-21.0.4-hotspot",
    "C:\Program Files\Eclipse Adoptium\jdk-21.0.3-hotspot",
    "C:\Program Files\Eclipse Adoptium\jdk-21.0.2-hotspot",
    "C:\Program Files\Eclipse Adoptium\jdk-21.0.1-hotspot",
    "C:\Program Files\Eclipse Adoptium\jdk-21-hotspot",
    "C:\Program Files\Java\jdk-21"
)

$javaHome = $null

# Find Java installation
foreach ($path in $possiblePaths) {
    if (Test-Path "$path\bin\java.exe") {
        $javaHome = $path
        break
    }
}

if ($null -eq $javaHome) {
    Write-Host "Could not find Java 21 installation. Please install Adoptium OpenJDK 21 first." -ForegroundColor Red
    Write-Host "You can download it from: https://adoptium.net" -ForegroundColor Yellow
    exit 1
}

Write-Host "Found Java 21 installation at: $javaHome" -ForegroundColor Green

# Set JAVA_HOME system environment variable
try {
    [Environment]::SetEnvironmentVariable("JAVA_HOME", $javaHome, [EnvironmentVariableTarget]::Machine)
    Write-Host "Set JAVA_HOME to: $javaHome" -ForegroundColor Green
}
catch {
    Write-Host "Failed to set JAVA_HOME: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Update PATH system environment variable
try {
    $currentPath = [Environment]::GetEnvironmentVariable("PATH", [EnvironmentVariableTarget]::Machine)
    $javaBinPath = "$javaHome\bin"
    
    # Check if JAVA_HOME\bin is already in PATH
    if ($currentPath -notlike "*$javaBinPath*") {
        # Add JAVA_HOME\bin to the beginning of PATH
        $newPath = "$javaBinPath;$currentPath"
        [Environment]::SetEnvironmentVariable("PATH", $newPath, [EnvironmentVariableTarget]::Machine)
        Write-Host "Added $javaBinPath to PATH" -ForegroundColor Green
    } else {
        Write-Host "$javaBinPath is already in PATH" -ForegroundColor Yellow
    }
    
    Write-Host "Environment variables updated successfully!" -ForegroundColor Green
    Write-Host "Please restart your command prompt or IDE to use the new Java version." -ForegroundColor Yellow
}
catch {
    Write-Host "Failed to update PATH: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}