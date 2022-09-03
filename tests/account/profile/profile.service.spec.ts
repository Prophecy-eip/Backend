import {Test, TestingModule} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Repository} from "typeorm";

import {AccountType, Profile} from "../../../src/account/profile/profile.entity";
import {ProfileService} from "../../../src/account/profile/profile.service";

import * as dotenv from "dotenv";
import {ProfileModule} from "../../../src/account/profile/profile.module";


dotenv.config()

const DB = process.env.POSTGRES_DB;
const DB_HOST = process.env.DATABASES_IP;
const DB_PORT: number = +process.env.DATABASES_PORT;
const DB_USERNAME = process.env.POSTGRES_USER;
const DB_PASSWORD = process.env.POSTGRES_PASSWORD;
const DB_DIALECT = "postgres"

const username = "username";
const email = "email@prophecy.com"
const password = "password";

const username1 = "username1";
const email1 = "email1@prophecy.com";
const password1 = "password1";

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

    beforeAll(async () => {
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

        try { await service.delete(username); } catch (err) {}
        try { await service.delete(username1); } catch (err) {}
    })

    afterEach(async () => {
        try { await service.delete(username); } catch (err) {}
        try { await service.delete(username1); } catch (err) {}
    });


    it("Create profile from service", async () => {
        const created = await service.create({username, email, password});

        expect(created.username).toEqual(username);
        expect(created.password).toEqual(password);
        expect(created.email).toEqual(email);
    });

    it("Save profile", async () => {
        const created = await service.create({ username, email, password });
        const saved = await service.save(created);

        expect(saved.username).toBe(username);
        expect(saved.email).toBe(email);
    });

    it("Check if existing profile exists", async () => {
        const created = await service.create({ username, email, password });
        const saved = await service.save(created);
        const exists: boolean = await service.exists(username, email);

        expect(exists).toBe(true);
    });

    it("Check if existing profile with invalid email exists", async () => {
        const created = await service.create({ username, email, password });
        const saved = await service.save(created);
        const exists: boolean = await service.exists(username, email);

        expect(exists).toBe(true);
    });

    it ("Update username", async () => {
        const created = await service.create({username, email, password});
        let saved = await service.save(created);
        const exists: boolean = await service.exists(username, email);

        expect(exists).toBe(true);

        await service.updateUsername(username, username1);
        const updated: boolean = await service.exists(username1, email);
        const oldExists: boolean = await service.exists(username, email);
        expect(updated).toBe(true);
        expect(oldExists).toBe(false);
    });

    it("Update email", async () => {
        const created = await service.create({ username, email, password });
        let saved = await service.save(created);
        const exists: boolean = await service.exists(username, email);

        expect(exists).toBe(true);

        await service.updateEmail(username, email1);
        const updated: boolean = await service.exists(username, email1);
        const oldExists: boolean = await service.exists(username, email);
        expect(updated).toBe(true);
        expect(oldExists).toBe(false);
    });
})