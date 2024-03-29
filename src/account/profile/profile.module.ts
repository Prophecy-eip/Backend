import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";

import { Profile } from "./profile.entity";
import { ProfileService } from "./profile.service";
import { AccountController } from "@account/account.controller";
import { AuthService } from "@auth/auth.service";
import { EmailService } from "@email/email.service";
import { EmailConfirmationService } from "@email/email-confirmation.service";
import { ForgottenPasswordService } from "@email/forgotten-password.service";
import { PasswordUpdateService } from "@email/password-update.service";
import { ArmyListModule } from "@army-list/army-list.module";
import { ProphecyModule } from "@prophecy/prophecy.module";

/**
 * @class ProfileModule
 * @brief Module that groups all requirements for profile and user authentication
 */
@Module({
    imports: [
        TypeOrmModule.forFeature([Profile]),
        ArmyListModule,
        ProphecyModule
    ],
    providers: [
        ProfileService,
        AuthService,
        JwtService,
        EmailService,
        EmailConfirmationService,
        ForgottenPasswordService,
        PasswordUpdateService
    ],
    controllers: [AccountController],
    exports: [ProfileService, EmailConfirmationService, AuthService, JwtService, ForgottenPasswordService, PasswordUpdateService]
})

export class ProfileModule {}
