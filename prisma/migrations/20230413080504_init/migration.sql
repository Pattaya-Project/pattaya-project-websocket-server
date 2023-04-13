-- CreateTable
CREATE TABLE "Bot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "socketId" TEXT NOT NULL,
    "wanIp" TEXT NOT NULL,
    "lanIp" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "hostname" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "lastSeen" TEXT NOT NULL,
    "idle" INTEGER NOT NULL,
    "online" BOOLEAN NOT NULL,
    "hwid" TEXT NOT NULL
);
