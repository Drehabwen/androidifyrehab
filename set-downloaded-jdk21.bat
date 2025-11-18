@echo off
REM Set the downloaded JDK 21 as JAVA_HOME and add to PATH
echo Setting downloaded JDK 21 as JAVA_HOME...

set JAVA_HOME=C:\Users\23849\Desktop\个人\dev\jdk-21.0.9
set PATH=%JAVA_HOME%\bin;%PATH%

echo JAVA_HOME is now set to: %JAVA_HOME%
echo.
echo Verifying Java version:
java -version
echo.
echo Verification complete. Your JDK 21 is now active for this session.
pause