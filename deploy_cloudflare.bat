@echo off
title Deploy to Cloudflare Pages
color 0b
echo ========================================================
echo   Adithyan Biolink - 1-Click Cloudflare Pages Deploy
echo ========================================================
echo.
echo Running pre-flight verification tests...
call npm run test:all
if %errorlevel% neq 0 (
  color 0c
  echo.
  echo [ERROR] Pre-flight tests failed! Please fix errors before deploying.
  pause
  exit /b %errorlevel%
)

echo.
echo Deploying to Cloudflare Pages via Wrangler...
echo If this is your first time, your browser will open to authorize Cloudflare.
echo.
call npx wrangler pages deploy . --project-name=adithyan-biolink

echo.
echo ========================================================
echo   Deployment Process Completed!
echo ========================================================
pause
