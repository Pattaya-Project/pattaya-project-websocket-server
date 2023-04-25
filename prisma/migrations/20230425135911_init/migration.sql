/*
  Warnings:

  - A unique constraint covering the columns `[taskId]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Task_taskId_key" ON "Task"("taskId");
