import { Body, Controller, HttpCode, HttpException, HttpStatus, Post } from "@nestjs/common";

import { ProfileRepositoryService } from "./profile/profile-repository.service";

@Controller("account")
export class AccountController{
    constructor(
        private readonly profilesRepositoryService: ProfileRepositoryService
    ) {}

    @Post("sign-up")
    @HttpCode(HttpStatus.CREATED)
    async create(@Body("username") username: string, @Body("email") email: string, @Body("password") password: string) {
        if (username === undefined || username === "" || email === undefined || email === "" || password === undefined || password === "") {
            throw new HttpException("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        }
        if (await this.profilesRepositoryService.exists(username, email)) {
            throw new HttpException("CONFLICT", HttpStatus.CONFLICT);
        } try {
            const profile = await this.profilesRepositoryService.create({ username, email, password });

            await this.profilesRepositoryService.save(profile);
        } catch (err) {
            throw new HttpException("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        }
    }
}