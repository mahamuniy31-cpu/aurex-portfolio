@echo off
title Push AUREX to GitHub
echo ========================================================
echo   PUSHING AUREX PORTFOLIO TO GITHUB REPOSITORY
echo   https://github.com/mahamuniy31-cpu/aurex-portfolio
echo ========================================================
echo.
cd /d "%~dp0"

echo 1. Initializing Git repository if needed...
if not exist ".git" (
    git init
    git branch -M main
    git remote add origin https://github.com/mahamuniy31-cpu/aurex-portfolio.git
)

echo 2. Staging all files...
git add .

echo 3. Creating commit...
git commit -m "feat: initial commit for AUREX personal developer portfolio (Code Alpha)"

echo 4. Pushing main branch to GitHub...
git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo   SUCCESS! AUREX HAS BEEN PUSHED TO GITHUB!
    echo   Repository: https://github.com/mahamuniy31-cpu/aurex-portfolio
    echo ========================================================
) else (
    echo.
    echo If it failed because the repository does not exist on GitHub yet:
    echo 1. Go to https://github.com/new
    echo 2. Name your repository: aurex-portfolio
    echo 3. Click 'Create repository' (leave README unchecked)
    echo 4. Run this script again!
)
echo.
pause
