import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as dotenv from "dotenv";

import { EmailService } from "./email.service";
import { ProfileService } from "../account/profile/profile.service";
import { Profile } from "../account/profile/profile.entity";
import { jwtConstants } from "../account/auth/constants";
import { EmailConfirmationTemplate } from "./templates/email-confirmation.template";

dotenv.config();

const API_URL: string = process.env.API_URL;
const EMAIL_VERIFICATION_ROUTE: string = `${API_URL}/account/verify-email`
const FROM_ADDRESS: string = process.env.SES_FROM_ADDRESS;

const WEBSITE_URL: string = process.env.WEBSITE_URL;
const DISCORD_INVITE_URL: string = process.env.DISCORD_INVITE_URL;
const CONTACT_EMAIL_ADDRESS: string = process.env.CONTACT_EMAIL_ADDRESS;
const GITHUB_ORGANISATION_URL: string = process.env.GITHUB_ORGANISATION_URL;

const EMAIL_CONFIRMATION_ROUTE: string = `${WEBSITE_URL}/account/email-confirm`;

@Injectable()
export class EmailConfirmationService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly emailService: EmailService,
        private readonly profileService: ProfileService,
    ) {}

    public async sendVerificationLink(email: string) {
        const payload = { email: email };
        const token = this.jwtService.sign(payload, {
            secret: jwtConstants.secret,
            expiresIn: "3d"
        });
        const url: string = `${EMAIL_VERIFICATION_ROUTE}?token=${token}`;
        const profile: Profile = await this.profileService.findOneByEmail(email);
        const body: string = EmailConfirmationTemplate.getBody(profile.username, url);

        // return this.emailService.sendTemplatedEmail(FROM_ADDRESS, "email-confirmation", [email], "{}"); // `{ "username": "${profile.username}", "confirmationLink": "${url}", "discordInviteUrl": "${DISCORD_INVITE_URL}", "gitHubOrganisationUrl": "${GITHUB_ORGANISATION_URL}", "contactEmailAddress": "${CONTACT_EMAIL_ADDRESS}", "websiteUrl", "${WEBSITE_URL}"`);
        return this.emailService.sendEmail([email], FROM_ADDRESS, "Email confirmation", body);
    }//

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
