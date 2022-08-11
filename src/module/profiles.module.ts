import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProfilesService } from "../services/profiles.service";
import { ProfileEntity } from "../models/profile.entity";
import { AccountsController } from "src/controllers/accounts.controller";

@Module({
    imports: [TypeOrmModule.forFeature([ProfileEntity])],
    providers: [ProfilesService],
    controllers: [AccountsController]
})
export class ProfilesModule {}
