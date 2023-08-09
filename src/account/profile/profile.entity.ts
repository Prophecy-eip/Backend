import { BeforeInsert, Column, Entity, PrimaryColumn } from "typeorm";
import { hash } from "bcrypt";

export enum AccountType {
    PLAYER,
    GAME_DEV_TEAM,
    ORGANISER
}

/**
 * @class Profile
 * @brief Entity that represents a user's profile data
 * @member username The user's username
 * @member email The user's email address
 * @member password The user's password
 * @member isEmailVerified True if the user's email is verified, false otherwise
 * @member profilePicturePath The path to the user's profile picture
 * @member accountType The type of the user's account
 */
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

    /**
     * @brief Hashes the password before updating the user's information in the database
     * @private
     */
    @BeforeInsert()
    private async hashPassword() {
        this.password = await hash(this.password, 10);
    }
}
