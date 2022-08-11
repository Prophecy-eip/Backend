import { Entity, Column, PrimaryColumn, BeforeInsert } from "typeorm";

const bcrypt = require("bcrypt");

const DB_NAME = "Prophecy_Users"
const dbConfig = require("../config/db.config");

export enum AccountType {
    player, 
    the_9th_Age_team, 
    organiser
};


@Entity()
export class ProfileEntity
{
    @PrimaryColumn()
    public username: string;

    @Column()
    public email: string;

    @Column()
    public password: string;

    @Column({ default: false})
    public is_verified: boolean;

    @Column()
    public profile_picture_path: string;

    @Column()
    public account_type: AccountType;

    @BeforeInsert() async hashPassword() {
        this.password = await bcrypt.hashPassword(this.password, 10);
    }
};