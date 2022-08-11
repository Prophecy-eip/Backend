import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";

import { ProfileEntity } from "src/models/profile.entity";
import { ProfilesService } from "src/services/profiles.service";


@Controller("/api/account")
export class AccountsController {
    @Post("sign-up")
    @HttpCode(HttpStatus.CREATED)
    async signUp(@Body("username") username: string, @Body("email") email: string, @Body("password") password: string): Promise<void> {
        console.log(email); 
        console.log(password);
        console.log(username); 

        let s: ProfilesService;

        await s.create({ username, password, email });
    }
}