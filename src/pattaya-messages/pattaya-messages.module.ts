import { Module } from '@nestjs/common';
import { PattayaMessagesService } from './pattaya-messages.service';
import { PattayaMessagesGateway } from './pattaya-messages.gateway';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PattayaMessagesGateway, PattayaMessagesService]
})
export class PattayaMessagesModule {}
