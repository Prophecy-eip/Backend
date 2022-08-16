import { HttpException, HttpStatus, Injectable  } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";

import { Profile } from "./profile.entity";
import { CreateProfileDto } from "./dto/create-profile.dto";

@Injectable()
export class ProfilesService {

    constructor(
        @InjectRepository(Profile)
        private profilesRepository: Repository<Profile | undefined>,
    ) {}

    findByUsername(username: string): Promise<Profile> {
        return this.profilesRepository.findOneBy({ username });
    }

    findByEmail(email: string): Promise<Profile | undefined> {
        return this.profilesRepository.findOneBy({ email: email });
    }

    async remove(username: string): Promise<void> {
        await this.profilesRepository.delete(username);
    }

    async create(profileDto: CreateProfileDto) {
        const { username, email, password } = profileDto;

        if (await this.findByEmail(email) !== null || await this.findByUsername(username) !== null) {
            throw new HttpException("CONFLICT", HttpStatus.CONFLICT);
        }
        let p = new Profile;
        p.username = username;
        p.password = password;
        p.email = email;
        this.profilesRepository.save(p);
       
    }
}