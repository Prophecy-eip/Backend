import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { EmailService } from "./email.service";
import * as dotenv from "dotenv";

import { ProfileService } from "@account/profile/profile.service";
import { jwtConstants } from "@account/auth/constants";
import { Profile } from "@account/profile/profile.entity";
import { SendEmailCommandOutput } from "@aws-sdk/client-ses";

dotenv.config();

const FROM_ADDRESS: string = process.env.SES_FROM_ADDRESS;
const WEBSITE_URL: string = process.env.WEBSITE_URL;

const NEW_PASSWORD_ROUTE: string = `${WEBSITE_URL}/account/password-reset`;

/**
 * @class ForgottenPasswordService
 * @brief Service that implements function to reset users' forgotten passwords
 */
@Injectable()
export class ForgottenPasswordService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly emailService: EmailService,
        private readonly profileService: ProfileService
    ) {}

    /**
     * @brief Sends a password reset link to the email address given as parameter
     * @param email The email address to send the link to
     */
    public async sendPasswordResetLink(email: string): Promise<SendEmailCommandOutput> {
        const profile: Profile = await this.profileService.findOneByEmail(email);
        const payload = { username: profile.username };
        const token = this.jwtService.sign(payload, {
            secret: jwtConstants.secret,
            expiresIn: "3d"
        });
        const url: string = `${NEW_PASSWORD_ROUTE}?token=${token}`;
        const text: string = `<p>Hi ${profile.username}!</p><p>To reset your Prophecy password, click <a href="${url}">here</a>.</p><p>If you did not request a password reset, please ignore this email.</p>`;

        return this.emailService.sendEmail([profile.email], FROM_ADDRESS, "Reset your password", text);
    }

    /**
     * @brief Decodes the token present in the password reset link
     * @param token The token to decode
     * @return The username associated to the token
     */
    public async decodeResetToken(token: string): Promise<string> {
        try {
            const payload = await this.jwtService.verify(token, {
                secret: jwtConstants.secret
            });
            if (typeof payload === "object" && "username" in payload) {
                return payload.username;
            }
        } catch (error) {
            console.error(error);
            if (error?.name === "TokenExpiredError") {
                throw new BadRequestException("Password reset token expired");
            }
            throw new BadRequestException("Bad reset token");
        }
    }

    /**
     * @brief Resets a user password
     *        Updates the user's password in the database with a new value.
     * @param username The username of the user that needs to update their password
     * @param password The new password value
     */
    public async resetPassword(username: string, password: string): Promise<void> {
        const _profile: Profile = await this.profileService.findOneByUsername(username);

        await this.profileService.updatePassword(username, password);
    }
}
