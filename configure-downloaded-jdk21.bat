@echo off
REM Script to configure downloaded JDK 21
REM This script will set JAVA_HOME temporarily for the current session

echo Configuring downloaded JDK 21...
echo.

REM Define JDK path
set "JDK_PATH=C:\Users\23849\Desktop\个人\dev\jdk-21.0.9"

REM Check if JDK exists
if not exist "%JDK_PATH%\bin\java.exe" (
    echo Error: JDK not found at %JDK_PATH%
    echo Please verify the JDK installation path.
    pause
    exit /b 1
)

echo JDK found at: %JDK_PATH%
echo.

REM Set JAVA_HOME temporarily for current session
set JAVA_HOME=%JDK_PATH%
set PATH=%JAVA_HOME%\bin;%PATH%

echo JAVA_HOME is now set to: %JAVA_HOME%
echo.
echo Verifying Java version:
java -version
echo.
echo Configuration complete for current session!
echo.
echo To build your Android project, run this command in the android directory:
echo gradlew.bat assembleDebug
echo.
pause