@echo off
REM Set Java 21 for this project only
echo Setting Java 21 for deeprehab-video project...
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.5-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%
java -version
echo JAVA_HOME is now set to %JAVA_HOME%
echo.
echo To build the project, run:
echo gradlew.bat assembleDebug
pause