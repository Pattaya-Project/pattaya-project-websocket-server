/*
  Warnings:

  - A unique constraint covering the columns `[hwid]` on the table `Bot` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bot_hwid_key" ON "Bot"("hwid");
