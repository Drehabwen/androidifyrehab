# PowerShell functions to manage multiple Java versions

function Set-JavaVersion {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Version
    )
    
    $javaPaths = @{
        "17" = "C:\Program Files\Java\jdk-17"
        "21" = "C:\Program Files\Eclipse Adoptium\jdk-21.0.5-hotspot"
    }
    
    if ($javaPaths.ContainsKey($Version)) {
        $javaHome = $javaPaths[$Version]
        if (Test-Path "$javaHome\bin\java.exe") {
            $env:JAVA_HOME = $javaHome
            $env:PATH = "$javaHome\bin;" + ($env:PATH -replace [regex]::Escape("$javaHome\bin;"), "")
            Write-Host "Switched to Java $Version" -ForegroundColor Green
            java -version
        } else {
            Write-Host "Java $Version not found at $javaHome" -ForegroundColor Red
        }
    } else {
        Write-Host "Unsupported Java version. Supported versions: $($javaPaths.Keys -join ', ')" -ForegroundColor Red
    }
}

# Usage examples:
# Set-JavaVersion "17"
# Set-JavaVersion "21"

Write-Host "Java Version Manager loaded. Use 'Set-JavaVersion <version>' to switch versions." -ForegroundColor Cyan
Write-Host "Supported versions: 17, 21" -ForegroundColor Yellow