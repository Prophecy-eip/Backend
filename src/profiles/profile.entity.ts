import { Entity, Column, PrimaryColumn, BeforeInsert } from "typeorm";

const bcrypt = require("bcrypt");

export enum AccountType {
    player, 
    the_9th_Age_team, 
    organiser
};


@Entity()
export class Profile
{
    @PrimaryColumn()
    public username: string;

    @Column()
    public email: string;

    @Column()
    public password: string;

    @Column({ default: false})
    public is_verified: boolean;

    @Column({ default: "" })
    public profile_picture_path: string;

    @Column({ default: AccountType.player })
    public account_type: AccountType;

    @BeforeInsert() async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
};