@echo off
chcp 65001 >nul
echo ========================================
echo   Video OS - Frontend & Backend Startup
echo ========================================
echo.

echo [1/4] Checking frontend dependencies...
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo Frontend dependencies installed
)
echo.

echo [2/4] Checking backend dependencies...
cd Backend
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    call venv\Scripts\activate
    echo Installing backend dependencies...
    pip install -r requirements.txt
) else (
    echo Backend dependencies installed
    call venv\Scripts\activate
)
echo.

echo [3/4] Starting backend service...
start "Video OS Backend" cmd /k "cd /d %~dp0Backend && venv\Scripts\activate && uvicorn app.main:app --reload"
echo Backend service starting... (http://localhost:8000)
echo.

echo [4/4] Starting frontend service...
cd ..
start "Video OS Frontend" cmd /k "cd /d %~dp0 && npm run dev"
echo Frontend service starting... (http://localhost:5173)
echo.

echo ========================================
echo   Services started!
echo   Frontend: http://localhost:5173
echo   Backend: http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo ========================================
echo.
echo Close this window to stop services
pause