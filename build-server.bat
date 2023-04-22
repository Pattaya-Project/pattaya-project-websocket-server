@echo off

xcopy /s /e .\assets\* .\dist-projects\dist-default\assets\
xcopy /s /e .\prisma\schema.prisma .\dist-projects\dist-default\
xcopy /s /e .\assets\scripts\start-pattaya-server.bat .\dist-projects\dist-default\
cd .\dist-projects\dist-default\
npm i
npx prisma generate --schema=./schema.prisma
npx prisma migrate dev --name init

call .\build-server-start.bat