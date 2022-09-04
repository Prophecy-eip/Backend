import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Profile } from "./profile.entity"
import { ProfileDTO } from "./profile.dto"

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(Profile)
        private repository: Repository<Profile>,
    ) {}

    async exists(username: string, email: string): Promise<boolean> {
        let p = await this.repository.findOneBy([
            { username: username },
        ]);
        return p !== null && p.email === email;
    }

    async credentialsAlreadyInUse(username: string, email: string): Promise<boolean> {
        return await this.repository.findOneBy([
            { username: username },
            {email: email}
        ]) !== null;
    }

    async create(profileDto: ProfileDTO): Promise<Profile> {
        return this.repository.create({ ...profileDto });
    }

    save(profile: Profile): Promise<Profile> {
        return this.repository.save(profile);
    }

    async findOne(id: string): Promise<Profile> {
        const profile = await this.repository.findOneBy([{ username: id }]);

        if (profile) {
            return profile;
        }
        return await this.repository.findOneBy([{ email: id}]);
    }

    async findOneByUsername(username: string): Promise<Profile> {
        return await this.repository.findOneBy([{ username: username }]);
    }

    async delete(username: string): Promise<void> {
        await this.repository.delete(username);
    }

    async updateUsername(oldUsername: string, newUsername: string) {
        await this.repository.update({ username: oldUsername },  { username: newUsername });
    }

    async updateEmail(username: string, newEmail: string) {
        await this.repository.update({ username: username },  { email: newEmail });
    }

    async updatePassword(username: string, newPassword: string) {
        await this.repository.update({username: username}, {password: newPassword});
    }
}
