@echo off
rem Scarica gli ultimi dati pubblicati dalla routine giornaliera e apre l'app.
cd /d "%~dp0"
git pull --ff-only
start "" "%~dp0index.html"
