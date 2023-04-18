import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PattayaMessagesModule } from './pattaya-messages/pattaya-messages.module';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';



@Global()
@Module({
  imports: [
    PattayaMessagesModule,
    ConfigModule.forRoot({
    load: [() => {
      return yaml.load(
        readFileSync(join(__dirname + "../../config", 'app.config.yaml'), 'utf8')
      ) as Record<string, any>;
    }],
  })
],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
