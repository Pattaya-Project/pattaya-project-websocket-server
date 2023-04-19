@echo off

xcopy /s /e .\assets\* .\dist-projects\dist-default\assets\
xcopy /s /e .\prisma\schema.prisma .\dist-projects\dist-default\
cd .\dist-projects\dist-default\
npm i
npx prisma generate --schema=./schema.prisma
npx prisma migrate dev --name init