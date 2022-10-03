import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as dotenv from "dotenv";

import { Profile } from "./account/profile/profile.entity";
import { AccountModule } from "./account/account.module";

import { Army } from "./army/army.entity"
import { ArmyModule } from "./army/army.module"
import { Unit } from "./army/unit/unit.entity";
import { UnitCategory} from "./army/unit/unit-category/unit-category.entity";
import { Rule } from "./army/rule/rule.entity";
import { UnitProfile } from "./army/unit/unit-profile/unit-profile.entity";
import { UpgradeCategory } from "./army/upgrade-category/upgrade-category.entity";
import { Option } from "./army/option/option.entity";
import { Modifier } from "./army/modifier/modifier.entity";

dotenv.config()

const DB = process.env.POSTGRES_DB;
const DB_HOST = process.env.DATABASE_IP;
const DB_PORT: number = +process.env.DATABASE_PORT;
const DB_USERNAME = process.env.POSTGRES_USER;
const DB_PASSWORD = process.env.POSTGRES_PASSWORD;
const DB_DIALECT = "postgres"

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: DB_DIALECT,
      host: DB_HOST,
      port: DB_PORT,
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB,
      entities: [Profile, Army, UnitCategory, Unit, Rule, UnitProfile, UpgradeCategory, Option, Modifier],
      synchronize: true // TODO: remove on deployment
    }),
    AccountModule,
    ArmyModule
  ],
})
export class AppModule {}
