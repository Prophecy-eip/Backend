import {AfterUpdate, BeforeInsert, Column, Entity, PrimaryColumn} from "typeorm";
import { hash } from "bcrypt";

export enum AccountType {
    PLAYER,
    GAME_DEV_TEAM,
    ORGANISER
}

@Entity("profile")
export class Profile {
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

    @Column({ default: AccountType.PLAYER })
    public account_type: AccountType;

    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, 10);
    }
}
