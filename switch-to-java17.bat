@echo off
echo Switching to Java 17...
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%
java -version
echo JAVA_HOME is now set to %JAVA_HOME%
pause