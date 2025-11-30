@echo off
REM Script to verify JDK 21 setup

echo ==========================================
echo     JDK 21 Setup Verification
echo ==========================================
echo.

echo Checking JAVA_HOME environment variable:
echo ------------------------------------------
if defined JAVA_HOME (
    echo JAVA_HOME = %JAVA_HOME%
    
    if exist "%JAVA_HOME%\bin\java.exe" (
        echo Status: JAVA_HOME points to a valid JDK installation
    ) else (
        echo Status: Warning - JAVA_HOME does not point to a valid JDK installation
    )
) else (
    echo Status: JAVA_HOME is not set
)
echo.

echo Checking Java version:
echo ----------------------
java -version 2>&1
echo.

echo Checking Java compiler:
echo ----------------------
where javac >nul 2>&1
if %errorlevel% equ 0 (
    javac -version 2>&1
    echo Status: Java compiler is accessible
) else (
    echo Status: Java compiler is not accessible
)
echo.

echo Checking if JDK path is in system PATH:
echo ---------------------------------------
echo %PATH% | findstr /C:"jdk-21.0.9\bin" >nul
if %errorlevel% equ 0 (
    echo Status: JDK 21 bin directory is in PATH
) else (
    echo Status: JDK 21 bin directory is NOT in PATH
)
echo.

echo ==========================================
echo     Verification Complete
echo ==========================================
echo.
echo If everything looks good above, you can now build your Android project.
echo.
pause