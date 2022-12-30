import { Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as dotenv from "dotenv";
import * as bcrypt from "bcrypt";

import { AccountType, Profile } from "../../../src/account/profile/profile.entity";
import { ProfileService } from "../../../src/account/profile/profile.service";
import { ProfileModule } from "../../../src/account/profile/profile.module";
import { ArmyList } from "../../../src/army-list/army-list.entity";


dotenv.config()

const DB = process.env.POSTGRES_DB;
const DB_HOST = process.env.DATABASE_IP;
const DB_PORT: number = +process.env.DATABASE_PORT;
const DB_USERNAME = process.env.POSTGRES_USER;
const DB_PASSWORD = process.env.POSTGRES_PASSWORD;
const DB_DIALECT = "postgres"

const USERNAME = "username";
const EMAIL = "email@prophecy.com"
const PASSWORD = "password";

const USERNAME1 = "username1";
const EMAIL1 = "email1@prophecy.com";
const PASSWORD1 = "password1";

function initDefaultProfile(username: string, email: string, password: string): Profile {
    const profile = new Profile();

    profile.username = username;
    profile.email = email;
    profile.password = password;
    profile.isEmailVerified = false;
    profile.accountType = "player";
    profile.profilePicturePath = "";
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
                entities: [Profile, ArmyList],
                synchronize: true,
            }),
            ProfileModule],
        })).compile();

        service = moduleRef.get<ProfileService>(ProfileService);

        try { await service.delete(USERNAME); } catch (err) {}
        try { await service.delete(USERNAME1); } catch (err) {}
    })

    afterEach(async () => {
        try { await service.delete(USERNAME); } catch (err) {}
        try { await service.delete(USERNAME1); } catch (err) {}
    });


    it("Create profile from service", async () => {
        const created = await service.create({username: USERNAME, email: EMAIL, password: PASSWORD});

        expect(created.username).toEqual(USERNAME);
        expect(created.password).toEqual(PASSWORD);
        expect(created.email).toEqual(EMAIL);
    });

    it("Save profile", async () => {
        const created = await service.create({ username: USERNAME, email: EMAIL, password: PASSWORD });
        const saved = await service.save(created);

        expect(saved.username).toBe(USERNAME);
        expect(saved.email).toBe(EMAIL);
    });

    it("Check if existing profile exists", async () => {
        const created = await service.create({ username: USERNAME, email: EMAIL, password: PASSWORD });
        const saved = await service.save(created);
        const exists: boolean = await service.exists(USERNAME, EMAIL);

        expect(exists).toBe(true);
    });

    it("Check if existing profile with invalid email exists", async () => {
        const created = await service.create({ username: USERNAME, email: EMAIL, password: PASSWORD });
        const saved = await service.save(created);
        const exists: boolean = await service.exists(USERNAME, EMAIL);

        expect(exists).toBe(true);
    });

    it ("Update username", async () => {
        const created = await service.create({username: USERNAME, email: EMAIL, password: PASSWORD});
        let saved = await service.save(created);
        const exists: boolean = await service.exists(USERNAME, EMAIL);

        expect(exists).toBe(true);

        await service.updateUsername(USERNAME, USERNAME1);
        const updated: boolean = await service.exists(USERNAME1, EMAIL);
        const oldExists: boolean = await service.exists(USERNAME, EMAIL);
        expect(updated).toBe(true);
        expect(oldExists).toBe(false);
    });

    it("Update email", async () => {
        const created = await service.create({ username: USERNAME, email: EMAIL, password: PASSWORD });
        let saved = await service.save(created);
        const exists: boolean = await service.exists(USERNAME, EMAIL);

        expect(exists).toBe(true);

        await service.updateEmail(USERNAME, EMAIL1);
        const updated: boolean = await service.exists(USERNAME, EMAIL1);
        const oldExists: boolean = await service.exists(USERNAME, EMAIL);
        expect(updated).toBe(true);
        expect(oldExists).toBe(false);
    });

    it("Update password", async () => {
        const created = await service.create({ username: USERNAME, email: EMAIL, password: PASSWORD });
        let saved = await service.save(created);
        const exists: boolean = await service.exists(USERNAME, EMAIL);

        expect(exists).toBe(true);
        await service.updatePassword(USERNAME, PASSWORD1);
        const newProfile = await service.findOne(USERNAME);
        let updated: boolean;

        await bcrypt.compare(PASSWORD1, newProfile.password).then((result) => {
            updated = result
        });
        expect(updated).toEqual(true);
    });
});
