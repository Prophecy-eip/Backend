import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Profile } from "./profile.entity";
import { ProfileRepositoryService } from "./profile-repository.service";
import { AccountController } from "../account.controller";
import {AuthService} from "../auth/auth.service";
import {AuthModule} from "../auth/auth.module";
import {JwtService} from "@nestjs/jwt";

@Module({
    imports: [TypeOrmModule.forFeature([Profile])],
    providers: [ProfileRepositoryService, AuthService, JwtService],
    controllers: [AccountController],
})
export class ProfileModule {}