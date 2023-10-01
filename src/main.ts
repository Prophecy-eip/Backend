import { NestFactory } from "@nestjs/core";
import * as dotenv from "dotenv";

import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

dotenv.config();

const PORT = process.env.SERVER_PORT;
const DEV = process.env.DEV;

/**
 * @brief The server's entry point
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (DEV !== undefined && DEV === "true") {
    app.enableCors();
    console.log("dev !");
  }
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT);
}

bootstrap();
