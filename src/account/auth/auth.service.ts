import {Injectable, UnauthorizedException} from '@nestjs/common';
import * as bcrypt from "bcrypt";
import {JwtService, JwtSignOptions} from "@nestjs/jwt";

import {ProfileRepositoryService} from "../profile/profile-repository.service";
import {Profile} from "../profile/profile.entity";
import {jwtConstants} from "./constants";

@Injectable()
export class AuthService {
    constructor(
        private readonly profileService: ProfileRepositoryService,
        private readonly jwtService: JwtService
    ) {}

    async validateProfile(id: string, password: string): Promise<Profile> {
        return new Promise<Profile>(async (resolve, reject) => {
            const profile = await this.profileService.findOne(id);

            if (profile) {
                await bcrypt.compare(password, profile.password).then((result) => {
                    if (result) {
                        resolve(profile);
                    }
                    reject(new UnauthorizedException());
                });
            }
            reject(new UnauthorizedException());
        });
    }

    async login(profile: Profile) {
        const payload = { username: profile.username };
        const signOptions: JwtSignOptions = { secret: jwtConstants.secret}

        return {
            username: profile.username,
            access_token: this.jwtService.sign(payload, signOptions),
        };
    }
}
