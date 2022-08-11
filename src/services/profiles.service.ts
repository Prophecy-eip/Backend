import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { query } from 'express';
import { DataSource, Repository } from 'typeorm';
import { ProfileEntity } from '../models/profile.entity';

class ProfileDto {
    username: string;
    password: string;
    email: string;
}

@Injectable()
export class ProfilesService {
    constructor(
        @InjectRepository(ProfileEntity)
        private profileRepository: Repository<ProfileEntity>,
    ) {}

    // constructor(private dataSource: DataSource) {}

    // findAll(): Promise<Profile []> {
    //     return this.profileRepository.find();
    // }

    findOneByUsername(username: string): Promise<ProfileEntity> {
        return this.profileRepository.findOneBy({username});
    }

    findOneByEmail(email: string): Promise<ProfileEntity> {
        return this.profileRepository.findOne({ where: { email }});
    }

    // async remove(username: string): Promise<void> {
    //     await this.profileRepository.delete(username);
    // }

    async create(profileDto: ProfileDto): Promise<ProfileEntity> {
        const { username, password, email } = profileDto;

        const byUsername = await this.profileRepository.findOne({ where: { username }});
        const byEmail = await this.profileRepository.findOne({ where: {email}});

        if (byUsername || byEmail) {
            throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);
        }
        const profile = await this.profileRepository.create({username, password, email});
        await this.profileRepository.save(profile);
        return profile;
    }
}