import * as dotenv from "dotenv";
import { Injectable } from "@nestjs/common";
import { EmailService } from "@email/email.service";
import { ProfileService } from "@profile/profile.service";
import { Profile } from "@profile/profile.entity";
import { SendEmailCommandOutput } from "@aws-sdk/client-ses";

dotenv.config();

const FROM_ADDRESS: string = process.env.SES_FROM_ADDRESS;

/**
 * @class PasswordUpdateService
 * @brief Service that implements features to send a password update email confirmation
 */
@Injectable()
export class PasswordUpdateService {
    constructor(
        private readonly emailService: EmailService,
        private readonly profileService: ProfileService
    ) {}

    /**
     * @brief Sends a password update confirmation email to the address given as parameter
     * @param email The email address to send the email to
     */
    public async sendPasswordUpdateEmail(email: string): Promise<SendEmailCommandOutput> {
        const profile: Profile = await this.profileService.findOneByEmail(email);
        const text: string = `<p>Hi ${profile.username}!</p><p>Your password has been updated.</p><p>If you didn't update your password, please contact us via <a href="mailto:contact@prophecy-eip.com">email</a> immediatly!</p>`;

        return this.emailService.sendEmail([email], FROM_ADDRESS, "Your password has been updated", text);
    }
}
