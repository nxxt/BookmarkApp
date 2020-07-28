@echo off
cd /d %~dp0/server
cmd /k docker build -t bookmark-server .
