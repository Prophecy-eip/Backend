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
    BadRequestException, ConflictException, UnauthorizedException, Put
} from "@nestjs/common";

import { ProfileService } from "./profile/profile.service";
import { LocalAuthGuard } from "./auth/guards/local-auth.guard";
import { AuthService } from "./auth/auth.service";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";

@Controller("account")
export class AccountController{
    constructor(
        private readonly profileService: ProfileService,
        private readonly authService: AuthService,
    ) {}

    @Post("sign-up")
    @HttpCode(HttpStatus.CREATED)
    async create(@Body("username") username: string, @Body("email") email: string, @Body("password") password: string) {
        if (username === undefined || username === "" || email === undefined || email === "" || password === undefined || password === "") {
            throw new HttpException("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        }
        if (await this.profileService.exists(username, email)) {
            throw new ConflictException();
        } try {
            const profile = await this.profileService.create({ username, email, password });

            await this.profileService.save(profile);
        } catch (err) {
            throw new BadRequestException();
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
        const profile = await this.profileService.findOneByUsername(req.user.username);

        if (profile === null) {
            throw new UnauthorizedException();
        }
        if (password === null || password === undefined || password === "") {
            throw new BadRequestException()
        }
        profile.password = password;
        await this.profileService.save(profile);
    }
}
