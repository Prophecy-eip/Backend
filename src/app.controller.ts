import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    HttpCode,
    HttpException,
    HttpStatus, InternalServerErrorException,
    Post, Request, UseGuards
} from "@nestjs/common";
import { LocalAuthGuard } from "@account/auth/guards/local-auth.guard";
import { JwtAuthGuard } from "@account/auth/guards/jwt-auth.guard";
import { ProfileService } from "@account/profile/profile.service";
import { AuthService } from "@account/auth/auth.service";
import { EmailConfirmationService } from "@email/email-confirmation.service";

/**
 * @class AppController
 * @brief Controller that defines the / routes
 */
@Controller("/")
export class AppController {
    constructor(
        private readonly profileService: ProfileService,
        private readonly authService: AuthService,
        private readonly emailConfirmationService: EmailConfirmationService,
    ) {}

    /**
     * @brief Enables a user to create an account
     * @param username The user's username
     * @param email The user's email address
     * @param password The user's password
     * @param sendEmail True to confirm email address (only used for debug or tests)
     */
    @Post("sign-up")
    @HttpCode(HttpStatus.CREATED)
    async signUp(
        @Body("username") username: string,
        @Body("email") email: string,
        @Body("password") password: string,
        @Body("sendEmail") sendEmail: boolean
    ): Promise<void> {
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

    /**
     * @brief Enables a user to sign in
     * @param req The request
     */
    @UseGuards(LocalAuthGuard)
    @Post("sign-in")
    @HttpCode(HttpStatus.OK)
    async login(@Request() req): Promise<{ username: string, access_token: string }> {
        return this.authService.login(req.user);
    }

    /**
     * @brief Enables a user to logout
     *        Does nothing.
     * @param _req The request
     */
    @UseGuards(JwtAuthGuard)
    @Post("sign-out")
    @HttpCode(HttpStatus.OK)
    async logout(@Request() _req): Promise<void> {}

    private _isFieldValid(str: string): boolean {
        return (str !== undefined && str !== null && str !== "");
    }
}
