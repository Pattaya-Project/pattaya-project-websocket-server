@echo off
start npm i
start npx prisma generate --schema=./db.mongodb.schema.prisma
start npx prisma db push --schema=./db.mongodb.schema.prisma