import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../account/auth/constants";
import * as dotenv from "dotenv";

import { EmailService } from "./email.service";

dotenv.config();

const API_URL: string = process.env.API_URL;
const EMAIL_VERIFICATION_ROUTE: string = `${API_URL}/account/email_verification`
const FROM_ADDRESS: string = process.env.SES_FROM_ADDRESS;

@Injectable()
export class EmailConfirmationService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly emailService: EmailService,
    ) {}

    public sendVerificationLink(email: string) {
        const payload = { email: email };
        const token = this.jwtService.sign(payload, {
            secret: jwtConstants.secret,
            expiresIn: "3d"
        });
        const url = `${EMAIL_VERIFICATION_ROUTE}?token=${token}`;
        const text: string = `Welcome to Prophecy!\n\nTo confirm the email address, click here: ${url}`

        return this.emailService.sendEmail([email], FROM_ADDRESS, "Email confirmation", text);
    }
}
