-- CreateTable
CREATE TABLE "Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "taskId" TEXT,
    "hwid" TEXT,
    "command" TEXT,
    "arguments" TEXT,
    "file" TEXT,
    "result" TEXT
);
