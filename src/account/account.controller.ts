import {
    Body,
    Controller,
    HttpCode,
    HttpException,
    HttpStatus,
    Post,
    UseGuards,
    Request,
    Delete,
    BadRequestException, ConflictException, UnauthorizedException, Put, InternalServerErrorException, Get, Query
} from "@nestjs/common";
import * as dotenv from "dotenv";

import { ProfileService } from "./profile/profile.service";
import { LocalAuthGuard } from "./auth/guards/local-auth.guard";
import { AuthService } from "./auth/auth.service";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { Profile } from "./profile/profile.entity";
import { EmailConfirmationService } from "../email/email-confirmation.service";

dotenv.config();

@Controller("account")
export class AccountController {
    constructor(
        private readonly profileService: ProfileService,
        private readonly authService: AuthService,
        private readonly emailConfirmationService: EmailConfirmationService,
    ) {}

    @Post("sign-up")
    @HttpCode(HttpStatus.CREATED)
    async create(@Body("username") username: string, @Body("email") email: string, @Body("password") password: string) {
        if (!this.isFieldValid(username) || !this.isFieldValid(email) || !this.isFieldValid(password)) {
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

    @UseGuards(JwtAuthGuard)
    @Get("send-email-verification-link")
    @HttpCode(HttpStatus.OK)
    async sendEmailVerificationLink(@Request() req) {
        const profile: Profile = await this.profileService.findOneByUsername(req.user.username);

        if (profile.isEmailVerified) {
            throw new BadRequestException("The email address is already verified");
        }
        const link: string = "";
        await this.emailConfirmationService.sendVerificationLink(profile.email)
    }

    @Get("verify-email")
    @HttpCode(HttpStatus.OK)
    async verifyEmail(@Request() req, @Query("token") token: string) {
        const email: string = await this.emailConfirmationService.decodeConfirmationToken(token);

        await this.emailConfirmationService.confirmEmail(email);
    }

    @UseGuards(JwtAuthGuard)
    @Delete("settings/delete-account")
    @HttpCode(HttpStatus.OK)
    async deleteAccount(@Request() req) {
        const username = req.user.username;

        if (await this.profileService.findOneByUsername(username) === null) {
            throw new UnauthorizedException();
        }
        await this.profileService.delete(username);
    }

    @UseGuards(JwtAuthGuard)
    @Put("settings/update-password")
    @HttpCode(HttpStatus.OK)
    async updatePassword(@Request() req, @Body("password") password: string) {
        const username = req.user.username;

        if (!this.isFieldValid(password)) {
            throw new BadRequestException()
        }
        await this.profileService.updatePassword(username, password);
    }

    @UseGuards(JwtAuthGuard)
    @Put("settings/update-email-address")
    @HttpCode(HttpStatus.OK)
    async updateEmail(@Request() req, @Body("email") email: string) {
        const username = req.user.username;
        const profile = await this.profileService.findOneByUsername(username);

        if (!this.isFieldValid(email)) {
            throw new BadRequestException()
        }
        await this.profileService.updateEmail(username, email);
    }

    @UseGuards(JwtAuthGuard)
    @Put("settings/update-username")
    @HttpCode(HttpStatus.OK)
    async updateUsername(@Request() req, @Body("username") newUsername: string) {
        const username = req.user.username;

        if (!this.isFieldValid(newUsername)) {
            throw new BadRequestException()
        }
        await this.profileService.updateUsername(username, newUsername);
        return {
            username: newUsername,
        };
    }

    private isFieldValid(str: string): boolean {
        return (str !== undefined && str !== null && str !== "");
    }
}
