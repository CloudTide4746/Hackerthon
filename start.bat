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
    echo Frontend dependencies ready.
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
    echo Backend dependencies ready.
)
cd ..
echo.

echo [3/4] Starting backend service...
echo Starting backend in a new window...
start "Video OS Backend" cmd /k "cd /d %~dp0Backend && echo Activating venv... && venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
echo.

echo [4/4] Starting frontend service...
echo Starting frontend in a new window...
start "Video OS Frontend" cmd /k "cd /d %~dp0 && npm run dev"
echo.

echo ========================================
echo   Services started!
echo   Frontend: http://localhost:5173
echo   Backend: http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo ========================================
echo.
echo Please do not close this window immediately.
echo You can close the separate Frontend/Backend windows to stop them.
pause
