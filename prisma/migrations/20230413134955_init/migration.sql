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
    "lastSeen" DATETIME NOT NULL,
    "hwid" TEXT NOT NULL,
    "online" BOOLEAN DEFAULT false
);
INSERT INTO "new_Bot" ("country", "hostname", "hwid", "id", "lanIp", "lastSeen", "online", "os", "socketId", "username", "wanIp") SELECT "country", "hostname", "hwid", "id", "lanIp", "lastSeen", "online", "os", "socketId", "username", "wanIp" FROM "Bot";
DROP TABLE "Bot";
ALTER TABLE "new_Bot" RENAME TO "Bot";
CREATE UNIQUE INDEX "Bot_hwid_key" ON "Bot"("hwid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
