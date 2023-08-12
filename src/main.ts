import { NestFactory } from "@nestjs/core";
import * as dotenv from "dotenv";

import { AppModule } from "./app.module";

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
  
  await app.listen(PORT);
}

bootstrap();
