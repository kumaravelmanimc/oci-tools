@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo ============================================================
echo  OCI Tools - Publish local changes to GitHub
echo ============================================================
echo.

set "GIT_EXE="
for %%G in (git.exe) do set "GIT_EXE=%%~$PATH:G"
if not defined GIT_EXE if exist "%ProgramFiles%\Git\cmd\git.exe" set "GIT_EXE=%ProgramFiles%\Git\cmd\git.exe"
if not defined GIT_EXE if exist "%ProgramFiles(x86)%\Git\cmd\git.exe" set "GIT_EXE=%ProgramFiles(x86)%\Git\cmd\git.exe"
if not defined GIT_EXE if exist "%LocalAppData%\Programs\Git\cmd\git.exe" set "GIT_EXE=%LocalAppData%\Programs\Git\cmd\git.exe"
if not defined GIT_EXE if exist "%UserProfile%\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe" set "GIT_EXE=%UserProfile%\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe"

if not defined GIT_EXE (
  echo ERROR: Git could not be found.
  echo Install Git for Windows, then reopen this file.
  goto :fail
)

echo Using Git: %GIT_EXE%
echo.

"%GIT_EXE%" rev-parse --is-inside-work-tree >nul 2>nul
if errorlevel 1 (
  echo ERROR: This folder is not a Git repository.
  goto :fail
)

echo Current branch:
"%GIT_EXE%" branch --show-current
echo.
echo Local changes to be published:
"%GIT_EXE%" status --short
echo.

set "HAS_CHANGES="
for /f "delims=" %%L in ('"%GIT_EXE%" status --porcelain') do set "HAS_CHANGES=1"
if not defined HAS_CHANGES (
  echo Nothing to publish. The working tree is clean.
  goto :done
)

set /p "CONFIRM=Stage all changes, commit, and push to GitHub? Type YES: "
if /I not "%CONFIRM%"=="YES" (
  echo Publish cancelled. No Git changes were made by this script.
  goto :done
)

set /p "MESSAGE=Commit message: "
if "%MESSAGE%"=="" set "MESSAGE=Update OCI tools"

echo.
echo Staging files...
"%GIT_EXE%" add -A
if errorlevel 1 goto :gitfail

echo Creating commit...
"%GIT_EXE%" commit -m "%MESSAGE%"
if errorlevel 1 goto :gitfail

echo Pushing to origin...
"%GIT_EXE%" push
if errorlevel 1 goto :gitfail

echo.
echo Published successfully.
goto :done

:gitfail
echo.
echo ERROR: Git publish failed. Review the message above.
goto :fail

:fail
echo.
pause
exit /b 1

:done
echo.
pause
exit /b 0
