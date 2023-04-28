import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as colors from 'colors';
import { join } from 'path';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';


const config = yaml.load(
  readFileSync(join(process.cwd(), 'assets', 'config', 'app.config.yaml'), 'utf8')
) as Record<string, any>;


async function bootstrap() {
  const banner = readFileSync(join(process.cwd(), 'assets', 'banner', 'pattaya.txt'), 'utf8')
  console.log(colors.rainbow(`${banner}`));

  console.log(colors.inverse(`name: ${config.app.name}`)); 
  console.log(colors.inverse(`description: ${config.app.description}`)); 
  console.log(colors.inverse(`version: ${config.app.version}`)); 
  console.log(colors.inverse(`port: ${config.app.port}`)); 
  console.log(colors.inverse(`server-token: ${JSON.stringify(config.app['server-token'])}`)); 
  console.log(colors.inverse(`bot-token: ${config.app['bot-token']}`)); 
  console.log(colors.inverse(`server-heartbeat-delay: ${config.app['server-heartbeat-delay']}`)); 
  console.log(colors.inverse(`endpoint: http://localhost:${config.app.port}/`));
  console.log('\n')
  console.log(colors.red.underline('developer: un4ckn0wl3z (https://github.com/un4ckn0wl3z)'))
  console.log(colors.green.underline('contact: pattaya.dev@unknownclub.net'))
  console.log(colors.blue.underline('visite: https://www.unknownclub.net/'))
  console.log('\n')
  const app = await NestFactory.create(AppModule, {logger: config.app.logger});
  await app.listen(config.app.port);
}
bootstrap();
