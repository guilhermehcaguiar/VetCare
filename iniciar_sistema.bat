@echo off
title VetCare OS - Inicializador
color 0A

echo ===================================================
echo              VETCARE OS - STARTUP
echo ===================================================

:: Garante que o terminal esta operando na exata pasta do arquivo .bat
cd /d "%~dp0"

:: 1. VERIFICACAO DO BACKEND
echo.
echo [1/2] Verificando Backend...
cd backend
if not exist "venv\Scripts\python.exe" (
    echo [AVISO] Ambiente Virtual nao encontrado. Criando...
    :: Tenta usar 'py' para evitar o bloqueio da Microsoft Store
    py -m venv venv
    if errorlevel 1 python -m venv venv
    
    echo [STATUS] Instalando dependencias do requirements.txt...
    venv\Scripts\python.exe -m pip install -r requirements.txt
) else (
    echo [STATUS] Ambiente do Backend OK!
)

:: Volta para a raiz
cd /d "%~dp0"

:: 2. VERIFICACAO DO FRONTEND
echo.
echo [2/2] Verificando Frontend...
cd frontend
if not exist "node_modules" (
    echo [AVISO] Pacotes Node nao encontrados. Instalando...
    call npm install
) else (
    echo [STATUS] Pacotes do Frontend OK!
)

:: Volta para a raiz
cd /d "%~dp0"

:: 3. SUBINDO OS SERVIDORES E NAVEGADOR
echo.
echo ===================================================
echo Iniciando servidores em janelas separadas...
echo ===================================================

cd backend
start "VetCare - Backend (Django)" cmd /k "venv\Scripts\python.exe manage.py runserver"

cd /d "%~dp0"
cd frontend
start "VetCare - Frontend (React)" cmd /k "npm run dev"

echo.
echo Aguardando 4 segundos para os servidores iniciarem...
timeout /t 4 /nobreak >nul

echo Abrindo o sistema no navegador...
:: 5173 eh a porta padrao do Vite, altere se o seu rodar em outra (ex: 3000)
start http://localhost:5173

echo.
echo Tudo pronto! Pode minimizar esta janela.
pause