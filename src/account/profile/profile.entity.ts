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

    @Column({ name: "is_verified", default: false})
    public isVerified: boolean;

    @Column({ name: "profile_picture_path", default: "" })
    public profilePicturePath: string;

    @Column({ name: "account_type", default: AccountType.PLAYER })
    public accountType: AccountType;

    // @Column({ name: "army_lists", nullable: true, type: "varchar" })
    // @ManyToOne(() => ArmyList, (list) => list.owner)
    // @JoinColumn({ name: "army_lists", referencedColumnName: "id" })
    // public armyLists: ArmyList[];

    @BeforeInsert()
    private async hashPassword() {
        this.password = await hash(this.password, 10);
    }
}
