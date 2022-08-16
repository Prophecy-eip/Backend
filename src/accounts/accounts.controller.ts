import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";

// import { ProfileEntity } from "src/models/profile.entity";
import { ProfilesService } from "src/profiles/profiles.service";
import { Profile } from "src/profiles/profile.entity"

// @Controller("/account")
// export class AccountsController {
//     @Post("sign-up")
//     @HttpCode(HttpStatus.CREATED)
//     async signUp(@Body("username") username: string, @Body("email") email: string, @Body("password") password: string): Promise<void> {
//         console.log(email); 
//         console.log(password);
//         console.log(username); 

//         let s: ProfilesService;

//         await s.create({ username, password, email });
//     }   
// }

@Controller("account")
export class AccountsController {
    constructor(private readonly profilesService: ProfilesService) {}

    @Post("sign-up")
    signUp(@Body("username") username: string, @Body("email") email: string, @Body("password") password: string): Promise<void> {
        return this.profilesService.create({username, email, password});
    }
}