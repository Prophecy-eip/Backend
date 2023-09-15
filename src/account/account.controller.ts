import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
    Request,
    Delete,
    BadRequestException, UnauthorizedException, Put, Get, Query
} from "@nestjs/common";
import * as dotenv from "dotenv";

import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { Profile } from "@profile/profile.entity";
import { ProfileService } from "@profile/profile.service";
import { AuthService } from "@auth/auth.service";
import { EmailConfirmationService } from "@email/email-confirmation.service";
import { ForgottenPasswordService } from "@email/forgotten-password.service";
import { PasswordUpdateService } from "@email/password-update.service";

dotenv.config();

/**
 * @class AccountController
 * @brief Controller that defines the account routes
 */
@Controller("account")
export class AccountController {
    constructor(
        private readonly profileService: ProfileService,
        private readonly authService: AuthService,
        private readonly emailConfirmationService: EmailConfirmationService,
        private readonly forgottenPasswordService: ForgottenPasswordService,
        private readonly passwordUpdateService: PasswordUpdateService
    ) {}

    /**
     * @brief Sends an email verification link to the user's email address
     * @param req The request
     */
    @UseGuards(JwtAuthGuard)
    @Get("send-email-verification-link")
    @HttpCode(HttpStatus.OK)
    async sendEmailVerificationLink(@Request() req): Promise<void> {
        const profile: Profile = await this.profileService.findOneByUsername(req.user.username);

        if (profile.isEmailVerified) {
            throw new BadRequestException("The email address is already verified");
        }
        await this.emailConfirmationService.sendVerificationLink(profile.email);
    }

    /**
     * @brief Enables users to confirm their email addresses
     *        Checks if the token is valid and marks the email as confirmed in the database.
     * @param req The request
     * @param token The verification token
     * @see sendEmailVerificationLink
     */
    @Get("verify-email")
    @HttpCode(HttpStatus.OK)
    async verifyEmail(@Request() req, @Query("token") token: string): Promise<void> {
        const email: string = await this.emailConfirmationService.decodeConfirmationToken(token);

        await this.emailConfirmationService.confirmEmail(email);
    }

    /**
     * @brief Sends a reset password link to the given email address
     *        If the email is not assigned to a user, throws an error.
     * @param email The email address to send the email to
     */
    @Post("send-password-reset-link")
    @HttpCode(HttpStatus.OK)
    async sendPasswordResetLink(@Body("email") email: string): Promise<void> {
        if (!this.isFieldValid(email) || await this.profileService.findOneByEmail(email) === null) {
            throw new BadRequestException("Invalid email address");
        }
        await this.forgottenPasswordService.sendPasswordResetLink(email);
    }

    /**
     * @brief Enables users to reset their passwords
     *        Uses the token sent by email to confirm the user's identity, and reset's the password by the new given
     *        value.
     * @param token The reset token
     * @param password The new password value
     * @see sendPasswordResetLink
     */
    @Put("reset-password")
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Query("token") token: string, @Body("password") password: string): Promise<void> {
        const username: string = await this.forgottenPasswordService.decodeResetToken(token);

        if (!this.isFieldValid(password)) {
            throw new BadRequestException("Invalid password field");
        }
        await this.forgottenPasswordService.resetPassword(username, password);
    }

    /**
     * @brief Enables users to delete their accounts
     *        Deletes the user's account in the database.
     * @param req The request
     */
    @UseGuards(JwtAuthGuard)
    @Delete("")
    @HttpCode(HttpStatus.OK)
    async deleteAccount(@Request() req): Promise<void> {
        const username = req.user.username;

        if (await this.profileService.findOneByUsername(username) === null) {
            throw new UnauthorizedException();
        }
        await this.profileService.delete(username);
    }

    /**
     * @brief Enables users to update their passwords
     *        Updates the user's password in the database and sends an email to confirm that the password has been
     *        updated.
     * @param req The request
     * @param password The new password value
     */
    @UseGuards(JwtAuthGuard)
    @Put("password")
    @HttpCode(HttpStatus.OK)
    async updatePassword(@Request() req, @Body("password") password: string): Promise<void> {
        const username = req.user.username;
        const profile: Profile = await this.profileService.findOneByUsername(username);

        if (!this.isFieldValid(password)) {
            throw new BadRequestException();
        }
        await this.profileService.updatePassword(username, password);
        await this.passwordUpdateService.sendPasswordUpdateEmail(profile.email);
    }

    /**
     * @brief Enables users to update their email addresses.
     *        Updates the user's email address in the database, marks it as not verified and sends a verification link
     *        to the new email address.
     * @param req The request
     * @param email The new email address value
     */
    @UseGuards(JwtAuthGuard)
    @Put("email")
    @HttpCode(HttpStatus.OK)
    async updateEmail(@Request() req, @Body("email") email: string): Promise<void> {
        const username = req.user.username;
        const _profile: Profile = await this.profileService.findOneByUsername(username);

        if (!this.isFieldValid(email)) {
            throw new BadRequestException();
        }
        await this.profileService.updateEmail(username, email);
        await this.emailConfirmationService.sendVerificationLink(email);
    }

    /**
     * @brief Enables users to update their usernames.
     *        Updates the username value in the database.
     * @param req The request
     * @param newUsername The new username value
     * @return The new username
     */
    @UseGuards(JwtAuthGuard)
    @Put("username")
    @HttpCode(HttpStatus.OK)
    async updateUsername(@Request() req, @Body("username") newUsername: string): Promise<{username: string}> {
        const username = req.user.username;

        if (!this.isFieldValid(newUsername)) {
            throw new BadRequestException();
        }
        await this.profileService.updateUsername(username, newUsername);
        return {
            username: newUsername
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get("")
    @HttpCode(HttpStatus.OK)
    async getAccount(@Request() req): Promise<{username: string, email: string}> {
        const username = req.user.username;
        const profile: Profile = await this.profileService.findOneByUsername(username);

        if (profile === null) {
            throw new UnauthorizedException();
        }
        return {
            username: profile.username,
            email: profile.email
        };
    }

    /**
     * @brief Checks if a string parameter is valid
     *        Checks if it is not undefined, null or empty
     * @param str The parameter to check
     * @return True if the parameter is valid, false otherwise
     * @private
     */
    private isFieldValid(str: string): boolean {
        return (str !== undefined && str !== null && str !== "");
    }
}
