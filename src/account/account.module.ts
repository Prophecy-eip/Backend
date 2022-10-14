import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";

import { ProfileModule } from "./profile/profile.module";
import { AuthModule } from "./auth/auth.module";
import { AuthService } from "./auth/auth.service";
import { Profile } from "./profile/profile.entity";
import { ProfileService } from "./profile/profile.service";
import { jwtConstants } from "./auth/constants";
import { ArmyList } from "../army-list/army-list.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Profile, ArmyList]),
        ProfileModule,
        AuthModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: "7d" }
        })
    ],
    providers: [ProfileService, AuthService],
    exports: [ProfileModule]
})
export class AccountModule {}
