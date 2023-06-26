import * as dotenv from "dotenv";
import { Injectable } from "@nestjs/common";
import { EmailService } from "@email/email.service";
import { ProfileService } from "@profile/profile.service";
import { Profile } from "@profile/profile.entity";

dotenv.config();

const FROM_ADDRESS: string = process.env.SES_FROM_ADDRESS;

@Injectable()
export class PasswordUpdateService {
    constructor(
        private readonly emailService: EmailService,
        private readonly profileService: ProfileService
    ) {}

    public async sendPasswordUpdateEmail(email: string) {
        const profile: Profile = await this.profileService.findOneByEmail(email);
        const text: string = `<p>Hi ${profile.username}!</p><p>Your password has been updated.</p><p>If you didn't update your password, please contact us via <a href="mailto:contact@prophecy-eip.com">email</a> immediatly!</p>`;

        return this.emailService.sendEmail([email], FROM_ADDRESS, "Your password has been updated", text);
    }
}
