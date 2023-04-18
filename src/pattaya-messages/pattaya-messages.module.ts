import { Module } from '@nestjs/common';
import { PattayaMessagesService } from './pattaya-messages.service';
import { PattayaMessagesGateway } from './pattaya-messages.gateway';
import { PrismaModule } from 'prisma/prisma.module';
import { PanelAuthGuard } from './guard/panel-auth.guard';
import { ConfigService } from '@nestjs/config';
import { BotAuthGuard } from './guard/bot-auth.guard';

@Module({
  imports: [PrismaModule],
  providers: [PattayaMessagesGateway, PattayaMessagesService, BotAuthGuard, PanelAuthGuard, ConfigService]
})
export class PattayaMessagesModule {}
