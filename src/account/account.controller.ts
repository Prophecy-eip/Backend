import {Body, Controller, HttpCode, HttpException, HttpStatus, Post, UseGuards, Request} from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";

import { ProfileRepositoryService } from "./profile/profile-repository.service";
import {AuthGuard} from "@nestjs/passport";
import {LocalAuthGuard} from "./auth/local-auth.guard";

@Controller("account")
export class AccountController{
    constructor(
        private readonly profileRepositoryService: ProfileRepositoryService
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
        return req.profile;
    }
}
