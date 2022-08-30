import {Module} from "@nestjs/common";

import {ProfileModule} from "./profile/profile.module";
import {AuthModule} from "./auth/auth.module";
import {AuthService} from "./auth/auth.service";
import {Profile} from "./profile/profile.entity";
import {AccountController} from "./account.controller";
import {ProfileRepositoryService} from "./profile/profile-repository.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {jwtConstants} from "./auth/constants";

@Module({
    imports: [
        TypeOrmModule.forFeature([Profile]),
        ProfileModule,
        AuthModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: "7d" }
        })
    ],
    providers: [ProfileRepositoryService, AuthService],
    exports: [ProfileModule]
})

export class AccountModule {}