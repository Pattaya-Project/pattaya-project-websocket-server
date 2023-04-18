import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as colors from 'colors';
import { join } from 'path';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';


const config = yaml.load(
  readFileSync(join(__dirname + "../../config", 'app.config.yaml'), 'utf8')
) as Record<string, any>;


async function bootstrap() {
  const banner = readFileSync(join(__dirname + "../../banner", 'pattaya.txt'), 'utf8')
  console.log(colors.rainbow(`${banner}`));

  console.log(colors.inverse(`name: ${config.app.name}`)); 
  console.log(colors.inverse(`description: ${config.app.description}`)); 
  console.log(colors.inverse(`version: ${config.app.version}`)); 
  console.log(colors.inverse(`port: ${config.app.port}`)); 
  console.log(colors.inverse(`server-token: ${config.app['server-token']}`)); 
  console.log(colors.inverse(`bot-token: ${config.app['bot-token']}`)); 
  console.log(colors.inverse(`server-heartbeat-delay: ${config.app['server-heartbeat-delay']}`)); 
 
  console.log('\n')
  console.log(colors.red.underline('developer: un4ckn0wl3z (https://github.com/un4ckn0wl3z)'))
  console.log(colors.green.underline('contact: pattaya.dev@unknownclub.net'))
  console.log(colors.blue.underline('visite: https://www.unknownclub.net/'))
  console.log('\n')
  const app = await NestFactory.create(AppModule, {logger: config.app.logger});
  const configService = app.get<ConfigService>(ConfigService);

  await app.listen(configService.get<number>('app.port'));
}
bootstrap();

