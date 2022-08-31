import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthService } from "./auth.service";
import { ProfileModule } from "../profile/profile.module";
import { LocalStrategy } from "./strategies/local.strategy";
import { ProfileService } from "../profile/profile.service";
import { Profile } from "../profile/profile.entity";
import { jwtConstants } from "./constants";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
    imports: [
        TypeOrmModule.forFeature([Profile]),
        ProfileModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: "7d" }
        })
    ],
    providers: [
        AuthService,
        LocalStrategy,
        ProfileService,
        JwtStrategy
    ],
    exports: [AuthService]
})
export class AuthModule {}
