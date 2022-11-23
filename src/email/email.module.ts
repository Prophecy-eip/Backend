import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { EmailConfirmationService } from "./email-confirmation.service";
import { EmailService } from "./email.service";
import { ProfileService } from "../account/profile/profile.service";
import { ProfileModule } from "../account/profile/profile.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Profile } from "../account/profile/profile.entity";
import { AuthModule } from "../account/auth/auth.module";

@Module({
    imports: [TypeOrmModule.forFeature([Profile]), ProfileModule],
    providers: [EmailService, EmailConfirmationService, JwtService, ProfileService],
    exports: [EmailService, EmailConfirmationService, JwtService]
}) export class EmailModule {}
