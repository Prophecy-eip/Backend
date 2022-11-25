import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { EmailService } from "./email.service";
import * as dotenv from "dotenv";

import { ProfileService } from "../account/profile/profile.service";
import { jwtConstants } from "../account/auth/constants";
import { Profile } from "../account/profile/profile.entity";

dotenv.config();

const FROM_ADDRESS: string = process.env.SES_FROM_ADDRESS;
const WEBSITE_URL: string = process.env.WEBSITE_URL;

const NEW_PASSWORD_ROUTE: string = `${WEBSITE_URL}/account/password-reset`

@Injectable()
export class ForgottenPasswordService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly emailService: EmailService,
        private readonly profileService: ProfileService
    ) {}

    public async sendPasswordResetLink(email: string) {
        const profile: Profile = await this.profileService.findOneByEmail(email);
        const payload = { username: profile.username };
        const token = this.jwtService.sign(payload, {
            secret: jwtConstants.secret,
            expiresIn: "3d"
        });
        const url: string = `${NEW_PASSWORD_ROUTE}?token=${token}`
        const text: string = `<p>Hi ${profile.username}!</p><p>To reset your Prophecy password, click <a href="${url}">here</a>.</p><p>If you did not request a password reset, please ignore this email.</p>`;

        return this.emailService.sendEmail([profile.email], FROM_ADDRESS, "Reset your password", text);
    }

    public async decodeResetToken(token: string): Promise<string> {
        try {
            const payload = await this.jwtService.verify(token, {
                secret: jwtConstants.secret
            });
            if (typeof payload === "object" && "username" in payload) {
                return payload.username;
            }
        } catch (error) {
            console.error(error)
            if (error?.name === "TokenExpiredError") {
                throw new BadRequestException("Password reset token expired");
            }
            throw new BadRequestException("Bad reset token");
        }
    }

    public async resetPassword(username: string, password: string): Promise<void> {
        const profile: Profile = await this.profileService.findOneByUsername(username);

        await this.profileService.updatePassword(username, password);
    }
}
