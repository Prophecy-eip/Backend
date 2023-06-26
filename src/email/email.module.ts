import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { Profile } from "@account/profile/profile.entity";
import { EmailConfirmationService } from "./email-confirmation.service";
import { EmailService } from "./email.service";
import { ProfileService } from "@account/profile/profile.service";
import { ProfileModule } from "@account/profile/profile.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ForgottenPasswordService } from "./forgotten-password.service";
import { PasswordUpdateService } from "@email/password-update.service";

@Module({
    imports: [TypeOrmModule.forFeature([Profile]), ProfileModule],
    providers: [
        EmailService,
        EmailConfirmationService,
        ForgottenPasswordService,
        JwtService,
        ProfileService,
        PasswordUpdateService
    ],
    exports: [
        EmailService,
        EmailConfirmationService,
        JwtService,
        PasswordUpdateService
    ]
}) export class EmailModule {}
