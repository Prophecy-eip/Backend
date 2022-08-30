import {Inject, Injectable} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Profile } from "./profile.entity"
import { ProfileDTO } from "./profile.dto"

@Injectable()
export class ProfileRepositoryService {
    constructor(
        @InjectRepository(Profile)
        private repository: Repository<Profile>,
    ) {}

    async exists(username: string, email: string): Promise<boolean> {
        return (await this.repository.findOneBy([
            { username },
            { email },
        ])) !== null;
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
}
