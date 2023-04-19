-- CreateTable
CREATE TABLE "Bot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "socketId" TEXT,
    "wanIp" TEXT,
    "lanIp" TEXT,
    "os" TEXT,
    "username" TEXT,
    "hostname" TEXT,
    "processName" TEXT,
    "processId" DECIMAL,
    "architecture" TEXT,
    "integrity" TEXT,
    "country" TEXT,
    "lastSeen" DATETIME,
    "hwid" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Bot_hwid_key" ON "Bot"("hwid");
