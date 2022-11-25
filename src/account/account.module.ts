import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";

import { jwtConstants } from "./auth/constants";
import { Profile } from "./profile/profile.entity";
import { ProfileService } from "./profile/profile.service";
import { EmailConfirmationService } from "../email/email-confirmation.service";
import { EmailService } from "../email/email.service";
import { AuthService } from "./auth/auth.service";
import { EmailModule } from "../email/email.module";
import { ProfileModule } from "./profile/profile.module";
import { AuthModule } from "./auth/auth.module";
import { ForgottenPasswordService } from "../email/forgotten-password.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Profile]),
        ProfileModule,
        AuthModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: "7d" }
        }),
        EmailModule
    ],
    providers: [ProfileService, AuthService, EmailService, EmailConfirmationService, ForgottenPasswordService],
    exports: [ProfileModule]
})
export class AccountModule {}
