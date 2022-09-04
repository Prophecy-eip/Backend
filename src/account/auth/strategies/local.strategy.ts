import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import {BadRequestException, Injectable} from "@nestjs/common";

import { AuthService } from "../auth.service";
import { Profile } from "../../profile/profile.entity";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {
    constructor(
        private readonly authService: AuthService,
    ) {
        super();
    }

    async validate(username: string, password: string): Promise<Profile> {
        return await this.authService.validateProfile(username, password);
    }
}
