@echo off
cd /d %~dp0/client
cmd /k docker build -t bookmark-client .
