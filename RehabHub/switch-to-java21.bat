@echo off
echo Switching to Java 21...
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.5-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%
java -version
echo JAVA_HOME is now set to %JAVA_HOME%
pause