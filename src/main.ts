import { NestFactory } from '@nestjs/core';
import * as dotenv from "dotenv";

import { AppModule } from './app.module';

dotenv.config();

const PORT = process.env.SERVER_PORT;


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ["log", "error", "warn", "verbose", "debug"]});
  await app.listen(PORT);
}
bootstrap();
