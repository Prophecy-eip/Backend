import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";

import { Profile } from "./profile.entity";
import { ProfileService } from "./profile.service";
import { AccountController } from "../account.controller";
import { AuthService } from "../auth/auth.service";
import { EmailService } from "../../email/email.service";
import { EmailConfirmationService } from "../../email/email-confirmation.service";

@Module({
    imports: [TypeOrmModule.forFeature([Profile])],
    providers: [ProfileService, AuthService, JwtService, EmailService, EmailConfirmationService],
    controllers: [AccountController],
})
export class ProfileModule {}
