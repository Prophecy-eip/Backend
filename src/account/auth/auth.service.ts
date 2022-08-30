import {Injectable, UnauthorizedException} from '@nestjs/common';
import * as bcrypt from "bcrypt";

import {ProfileRepositoryService} from "../profile/profile-repository.service";
import {Profile} from "../profile/profile.entity";

@Injectable()
export class AuthService {
    constructor(private profileService: ProfileRepositoryService) {
    }

    validateProfile(id: string, password: string): Promise<Profile> {
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
        })
    }
}
