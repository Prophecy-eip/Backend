import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { hash } from "bcrypt";
import { ArmyList } from "../../army-list/army-list.entity";

export enum AccountType {
    PLAYER,
    GAME_DEV_TEAM,
    ORGANISER
}

@Entity("profiles")
export class Profile {
    @PrimaryColumn()
    public username: string;

    @Column()
    public email: string;

    @Column()
    public password: string;

    @Column({ name: "is_email_verified", default: false})
    public isEmailVerified: boolean;

    @Column({ name: "profile_picture_path", default: null })
    public profilePicturePath: string;

    @Column({ name: "account_type", default: "player" })
    public accountType: string = "player";

    @BeforeInsert()
    private async hashPassword() {
        this.password = await hash(this.password, 10);
    }
}
