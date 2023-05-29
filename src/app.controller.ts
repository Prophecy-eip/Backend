import {
    BadRequestException,
    Body,
    ConflictException,
    Controller, Get,
    HttpCode,
    HttpException,
    HttpStatus, InternalServerErrorException,
    Post, Query, Request, UseGuards
} from "@nestjs/common";
import { LocalAuthGuard } from "./account/auth/guards/local-auth.guard";
import { JwtAuthGuard } from "./account/auth/guards/jwt-auth.guard";
import { Profile } from "./account/profile/profile.entity";
import { ProfileService } from "./account/profile/profile.service";
import { AuthService } from "./account/auth/auth.service";
import { EmailConfirmationService } from "./email/email-confirmation.service";
import { ForgottenPasswordService } from "./email/forgotten-password.service";

@Controller("/")
export class AppController {
    constructor(
        private readonly profileService: ProfileService,
        private readonly authService: AuthService,
        private readonly emailConfirmationService: EmailConfirmationService,
    ) {}

    @Post("sign-up")
    @HttpCode(HttpStatus.CREATED)
    async create(@Body("username") username: string, @Body("email") email: string, @Body("password") password: string, @Body("sendEmail") sendEmail: boolean) {
        if (!this._isFieldValid(username) || !this._isFieldValid(email) || !this._isFieldValid(password)) {
            throw new HttpException("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        }
        if (await this.profileService.credentialsAlreadyInUse(username, email)) {
            throw new ConflictException();
        }
        try {
            const profile = await this.profileService.create({username, email, password});

            await this.profileService.save(profile);
        } catch (err) {
            throw new BadRequestException();
        }
        try {
            if (sendEmail === false ) {
                return;
            }
            await this.emailConfirmationService.sendVerificationLink(email);
        } catch(error) {
            console.error(error);
            throw new InternalServerErrorException("Unable to send email address validation");
        }
    }

    @UseGuards(LocalAuthGuard)
    @Post("sign-in")
    @HttpCode(HttpStatus.OK)
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post("sign-out")
    @HttpCode(HttpStatus.OK)
    async logout(@Request() req) {}

    private _isFieldValid(str: string): boolean {
        return (str !== undefined && str !== null && str !== "");
    }
}
