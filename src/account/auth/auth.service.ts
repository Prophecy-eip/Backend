import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";

import { ProfileService } from "@profile/profile.service";
import { Profile } from "@profile/profile.entity";
import { jwtConstants } from "./constants";

/**
 * @class AuthService
 * @brief Service that groups methods for users authentication
 */
@Injectable()
export class AuthService {
    constructor(
        private readonly profileService: ProfileService,
        private readonly jwtService: JwtService,
    ) {}

    /**
     * @brief Verifies that the new user's connection credentials are valid
     * @param id The user's id (username or email address)
     * @param password The user's password
     * @return The user's profile
     */
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

    /**
     * @brief Logs the user in and creates a JWT token
     * @param profile The user to log in's profile
     * @return An object containing the user's username and the user's token
     */
    async login(profile: Profile) {
        const payload = { username: profile.username };
        const signOptions: JwtSignOptions = { secret: jwtConstants.secret};

        return {
            username: profile.username,
            access_token: this.jwtService.sign(payload, signOptions)
        };
    }
}
