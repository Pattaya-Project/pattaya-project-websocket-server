import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Bot, Prisma } from '@prisma/client';
import { BotCheckinDto } from './dto/bot-checkin.dto';


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
                            online: true
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
                        online: true
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
                await this.prisma.bot.update(
                    {
                        where: {
                            hwid: found.hwid
                        },
                        data: {
                            online: false
                        }
                    }
                )
            }
            this.logger.log(`set bot hwid: ${found.hwid}, OFFLINE`)
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
            const bots = await this.prisma.bot.findMany({
                where: {
                    online: true
                }
            })
            return bots.length
        } catch (error) {
            this.logger.error(`Something wrong`, error)
            return 0
        }
      }
}
