import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, UseGuards, Request } from "@nestjs/common";

import { ProfileRepositoryService } from "./profile/profile-repository.service";
import { LocalAuthGuard } from "./auth/local-auth.guard";
import { AuthService } from "./auth/auth.service";

@Controller("account")
export class AccountController{
    constructor(
        private readonly profileRepositoryService: ProfileRepositoryService,
        private readonly authService: AuthService,
    ) {}

    @Post("sign-up")
    @HttpCode(HttpStatus.CREATED)
    async create(@Body("username") username: string, @Body("email") email: string, @Body("password") password: string) {
        if (username === undefined || username === "" || email === undefined || email === "" || password === undefined || password === "") {
            throw new HttpException("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        }
        if (await this.profileRepositoryService.exists(username, email)) {
            throw new HttpException("CONFLICT", HttpStatus.CONFLICT);
        } try {
            const profile = await this.profileRepositoryService.create({ username, email, password });

            await this.profileRepositoryService.save(profile);
        } catch (err) {
            throw new HttpException("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        }
    }

    @UseGuards(LocalAuthGuard)
    @Post("sign-in")
    @HttpCode(HttpStatus.OK)
    async login(@Request() req) {
        return this.authService.login(req.user);
    }
}
