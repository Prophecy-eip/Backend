import { Module } from "@nestjs/common";
import { PassportModule } from '@nestjs/passport';

import { AuthService } from "./auth.service";
import { ProfileModule } from "../profile/profile.module";
import { LocalStrategy } from './local.strategy';
import {ProfileRepositoryService} from "../profile/profile-repository.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Profile} from "../profile/profile.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Profile]), ProfileModule, PassportModule],
    providers: [AuthService, LocalStrategy, ProfileRepositoryService],
    exports: [AuthService]
})
export class AuthModule {}