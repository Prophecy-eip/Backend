import {Test, TestingModule} from "@nestjs/testing";
import {getRepositoryToken, TypeOrmModule} from "@nestjs/typeorm";
import {Repository} from "typeorm";

import {AccountType, Profile} from "../../../src/account/profile/profile.entity";
import {ProfileService} from "../../../src/account/profile/profile.service";

import * as dotenv from "dotenv";
import {ProfileModule} from "../../../src/account/profile/profile.module";
import {create} from "domain";

import * as bcrypt from "bcrypt"
import {UnauthorizedException} from "@nestjs/common";
import {AccountController} from "../../../src/account/account.controller";

dotenv.config()

const DB = process.env.POSTGRES_DB;
const DB_HOST = process.env.DATABASES_IP;
const DB_PORT: number = +process.env.DATABASES_PORT;
const DB_USERNAME = process.env.POSTGRES_USER;
const DB_PASSWORD = process.env.POSTGRES_PASSWORD;
const DB_DIALECT = "postgres"

type MockType<T> = {
    [P in keyof T]?: jest.Mock<{}>;
};

const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
    findOne: jest.fn(entity => entity),
}));

function initDefaultProfile(username: string, email: string, password: string): Profile {
    const profile = new Profile();

    profile.username = username;
    profile.email = email;
    profile.password = password;
    profile.is_verified = false;
    profile.account_type = AccountType.PLAYER;
    profile.profile_picture_path = "";
    return profile;
}

describe("ProfileService", () => {
    let service: ProfileService;
    let repositoryMock: MockType<Repository<Profile>>;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule(({
            imports: [TypeOrmModule.forRoot({
                type: DB_DIALECT,
                host: DB_HOST,
                port: DB_PORT,
                username: DB_USERNAME,
                password: DB_PASSWORD,
                database: DB,
                entities: [Profile],
                synchronize: true,
            }),
            ProfileModule],
        })).compile();

        service = moduleRef.get<ProfileService>(ProfileService);
    })


    it("Create profile from service", async () => {
        const profile = initDefaultProfile("username", "email", "password");
        const { username, email, password } = profile;
        const created = await service.create({ username, email, password });

        expect(created.username).toEqual(profile.username);
        expect(created.password).toEqual(profile.password);
        expect(created.email).toEqual(profile.email);
    });

    it("Save profile", async () => {
        const profile = initDefaultProfile("username1", "email1", "password");
        const { username, email, password } = profile;
        const created = await service.create({ username, email, password });
        const saved = await service.save(created);

        expect(saved.username).toBe(profile.username);
        expect(saved.email).toBe(profile.email);
    });

    it("Check if existing profile exists", async () => {
        const profile = initDefaultProfile("username", "email", "password");
        const { username, email, password } = profile;
        const exists: boolean = await service.exists(profile.username, profile.email);

        // expect(exists).toBe(true);
    })
})