@echo off
start npm i
start npx prisma generate --schema=./db.sqlite.schema.prisma
start npx prisma migrate dev --name init --schema=./db.sqlite.schema.prisma