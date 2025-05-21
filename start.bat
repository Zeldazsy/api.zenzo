@echo off
:build
echo Building project...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Build failed. Retrying...
    timeout /t 2 >nul
    goto build
)
echo Build succeeded.
call npm start -- --port=8080

