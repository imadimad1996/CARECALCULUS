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
echo [1/4] Type-checking (tsc --noEmit)...
call npm run lint
if %errorlevel% neq 0 (
    echo(
    echo *** DEPLOY ABORTED at step 1 [type-check] — fix TypeScript errors and re-run. ***
    endlocal & exit /b 1
)

REM --- 2. Sitemap -------------------------------------------------------------
echo(
echo [2/4] Regenerating sitemap.xml...
call npm run sitemap
if %errorlevel% neq 0 (
    echo(
    echo *** DEPLOY ABORTED at step 2 [sitemap] — fix sitemap script and re-run. ***
    endlocal & exit /b 1
)

REM --- 3. Build ---------------------------------------------------------------
echo(
echo [3/4] Building production bundle (vite build)...
call npm run build
if %errorlevel% neq 0 (
    echo(
    echo *** DEPLOY ABORTED at step 3 [build] — fix build errors and re-run. ***
    endlocal & exit /b 1
)

REM --- 4. Deploy --------------------------------------------------------------
echo(
echo [4/4] Deploying to Cloudflare Pages...
call npx wrangler pages deploy dist --project-name=carecalculus --commit-dirty=true
if %errorlevel% neq 0 (
    echo(
    echo *** DEPLOY ABORTED at step 4 [wrangler] — check Cloudflare auth and re-run. ***
    endlocal & exit /b 1
)

echo(
echo === Deploy complete ======================================================
endlocal
exit /b 0
