@echo off
REM ============================================================================
REM  CareCalculus — Web Deploy
REM  Usage:  deploy_web.bat  (or  .\deploy_web.bat  from PowerShell)
REM
REM  Pipeline (fail-fast — stops on the first error):
REM    1. Type-check       (tsc --noEmit)
REM    2. Generate sitemap (fresh lastmod + all per-item routes)
REM    3. Production build  (vite build -> dist/)
REM    4. Deploy            (wrangler pages deploy -> Cloudflare Pages)
REM ============================================================================
setlocal EnableExtensions
cd /d "%~dp0"

echo(
echo === CareCalculus Web Deploy ==============================================
echo(

REM --- 1. Type-check ----------------------------------------------------------
echo [1/4] Type-checking ^(tsc --noEmit^)...
call npm run lint
if errorlevel 1 goto :failed

REM --- 2. Sitemap -------------------------------------------------------------
echo(
echo [2/4] Regenerating sitemap.xml...
call npm run sitemap
if errorlevel 1 goto :failed

REM --- 3. Build ---------------------------------------------------------------
echo(
echo [3/4] Building production bundle ^(vite build^)...
call npm run build
if errorlevel 1 goto :failed

REM --- 4. Deploy --------------------------------------------------------------
echo(
echo [4/4] Deploying to Cloudflare Pages...
call npm run deploy:ci
if errorlevel 1 goto :failed

echo(
echo === Deploy complete ======================================================
endlocal
exit /b 0

:failed
echo(
echo *** DEPLOY ABORTED — a step above failed ^(exit code %errorlevel%^). ***
echo     Nothing was deployed. Fix the error and re-run deploy_web.bat.
endlocal
exit /b 1
