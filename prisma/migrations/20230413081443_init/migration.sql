/*
  Warnings:

  - You are about to drop the column `idle` on the `Bot` table. All the data in the column will be lost.
  - You are about to drop the column `online` on the `Bot` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "socketId" TEXT NOT NULL,
    "wanIp" TEXT NOT NULL,
    "lanIp" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "hostname" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "lastSeen" TEXT NOT NULL,
    "hwid" TEXT NOT NULL
);
INSERT INTO "new_Bot" ("country", "hostname", "hwid", "id", "lanIp", "lastSeen", "os", "socketId", "username", "wanIp") SELECT "country", "hostname", "hwid", "id", "lanIp", "lastSeen", "os", "socketId", "username", "wanIp" FROM "Bot";
DROP TABLE "Bot";
ALTER TABLE "new_Bot" RENAME TO "Bot";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
