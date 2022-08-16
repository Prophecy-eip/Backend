import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './profiles/profile.entity';

import * as dbConfig from "./config/database.config";
import { ProfilesModule } from './profiles/profiles.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: dbConfig.DB_DIALECT,
      host: dbConfig.DB_HOST,
      port: dbConfig.DB_PORT,
      username: dbConfig.DB_USERNAME,
      password: dbConfig.DB_PASSWORD,
      database: "prophecy_users",
      entities: [Profile],
      synchronize: true
    }),
    ProfilesModule
  ],
})
export class AppModule {}
