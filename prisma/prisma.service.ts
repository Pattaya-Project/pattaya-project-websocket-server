import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();

    process.on('SIGINT', async () => {
      await this.bot.deleteMany()
      await this.task.deleteMany()
      await this.$disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await this.bot.deleteMany()
      await this.task.deleteMany()
      await this.$disconnect();
      process.exit(0);
    });

    process.on('SIGKILL', async () => {
      await this.bot.deleteMany()
      await this.task.deleteMany()
      await this.$disconnect();
      process.exit(0);
    });

    process.on('SIGHUP', async () => {
      await this.bot.deleteMany()
      await this.task.deleteMany()
      await this.$disconnect();
      process.exit(0);
    });

    process.on('SIGUSR1', async () => {
      await this.bot.deleteMany()
      await this.task.deleteMany()
      await this.$disconnect();
      process.exit(0);
    });


    process.on('SIGUSR2', async () => {
      await this.bot.deleteMany()
      await this.task.deleteMany()
      await this.$disconnect();
      process.exit(0);
    });

  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await this.bot.deleteMany()
      await this.task.deleteMany()
      await this.$disconnect();
      await app.close();
    });
  }
}