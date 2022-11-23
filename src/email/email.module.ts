import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";

import { EmailConfirmationService } from "./email-confirmation.service";
import { EmailService } from "./email.service";
import { jwtConstants } from "../account/auth/constants";

@Module({
    imports: [],
    providers: [EmailService, EmailConfirmationService, JwtService],
    exports: [EmailService, EmailConfirmationService, JwtService]
}) export class EmailModule {}
