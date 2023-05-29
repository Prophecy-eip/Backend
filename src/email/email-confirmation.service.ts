import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as dotenv from "dotenv";

import { EmailService } from "./email.service";
import { ProfileService } from "@account/profile/profile.service";
import { Profile } from "@account/profile/profile.entity";
import { jwtConstants } from "@account/auth/constants";

dotenv.config();

const API_URL: string = process.env.API_URL;
const EMAIL_VERIFICATION_ROUTE: string = `${API_URL}/account/verify-email`;
const FROM_ADDRESS: string = process.env.SES_FROM_ADDRESS;
const WEBSITE_URL: string = process.env.WEBSITE_URL;

const EMAIL_CONFIRMATION_ROUTE: string = `${WEBSITE_URL}/account/email-confirm`;

@Injectable()
export class EmailConfirmationService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly emailService: EmailService,
        private readonly profileService: ProfileService,
    ) {}

    public sendVerificationLink(email: string) {
        const payload = { email: email };
        const token = this.jwtService.sign(payload, {
            secret: jwtConstants.secret,
            expiresIn: "3d"
        });
        const url: string = `${EMAIL_VERIFICATION_ROUTE}?token=${token}`;
        const text: string = `<p>Welcome to Prophecy!</p><p>To confirm your email address, click <a href="${url}">here</a>.</p>`;

        return this.emailService.sendEmail([email], FROM_ADDRESS, "Email confirmation", text);
    }

    public async decodeConfirmationToken(token: string): Promise<string> {
        try {
            const payload = await this.jwtService.verify(token, {
                secret: jwtConstants.secret
            });
            if (typeof payload === "object" && "email" in payload) {
                return payload.email;
            }
        } catch (error) {
            console.error(error);
            if (error?.name === "TokenExpiredError") {
                throw new BadRequestException("Email confirmation token expired");
            }
            throw new BadRequestException("Bad confirmation token");
        }
    }

    public async confirmEmail(email: string): Promise<void> {
        const profile: Profile = await this.profileService.findOneByEmail(email);

        if (profile.isEmailVerified) {
            throw new BadRequestException("Email already confirmed");
        }
        await this.profileService.markEmailAsConfirmed(email);
    }
}
