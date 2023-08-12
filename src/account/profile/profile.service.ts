import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { hash } from "bcrypt";

import { Profile } from "./profile.entity";
import { ProfileDTO } from "./profile.dto";

/**
 * @class ProfileService
 * @brief Service that groups functions for profile management
 */
@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(Profile)
        private repository: Repository<Profile>,
    ) {}

    /**
     * @brief Checks if a profile with the given credentials exists
     * @param username The profile's username
     * @param email The profile's email address
     * @return True if the profile exists, false otherwise
     */
    async exists(username: string, email: string): Promise<boolean> {
        let p = await this.repository.findOneBy([
            { username: username }
        ]);
        return p !== null && p.email === email;
    }

    /**
     * @brief Checks if a user exists
     * @param username The user's username
     * @param email The user's email address
     * @return True if the user exists, false otherwise
     */
    async credentialsAlreadyInUse(username: string, email: string): Promise<boolean> {
        return await this.repository.findOneBy([
            { username: username },
            {email: email}
        ]) !== null;
    }

    /**
     * @brief Creates a Profile entity from a ProfileDTO
     * @param profileDto The profile's data
     * @return The Profile entity that has been created
     */
    async create(profileDto: ProfileDTO): Promise<Profile> {
        return this.repository.create({ ...profileDto });
    }

    /**
     * @brief Saves a Profile entity in the database
     * @param profile The profile to save
     * @return The Profile entity that has been saved
     */
    async save(profile: Profile): Promise<Profile> {
        return this.repository.save(profile);
    }

    /**
     * @brief Finds a Profile entity from an id (username or email address)
     * @param id The id to find (could be username or email)
     * @return The Profile entity if it exists, null otherwise
     */
    async findOne(id: string): Promise<Profile> {
        const profile = await this.repository.findOneBy([{ username: id }]);

        if (profile) {
            return profile;
        }
        return await this.repository.findOneBy([{ email: id}]);
    }

    /**
     * @brief Finds a Profile entity from a given username
     * @param username The username to find
     * @return The Profile entity if it exists, null otherwise
     */
    async findOneByUsername(username: string): Promise<Profile> {
        return await this.repository.findOneBy([{ username: username }]);
    }

    /**
     * @brief Finds a Profile entity from a given email address
     * @param email The email address to find
     * @return The Profile entity if it exists, null otherwise
     */
    async findOneByEmail(email: string): Promise<Profile> {
        return await this.repository.findOneBy({ email: email });
    }

    /**
     * @brief Deletes a Profile entity from the database
     * @param username The username of the Profile to delete (used as id)
     */
    async delete(username: string): Promise<void> {
        await this.repository.delete(username);
    }

    /**
     * @brief Updates a Profile entity's username value in the database
     * @param oldUsername The old Profile's username (used as id)
     * @param newUsername The new Profile's username
     */
    async updateUsername(oldUsername: string, newUsername: string): Promise<void> {
        await this.repository.update({ username: oldUsername },  { username: newUsername });
    }

    /**
     * @brief Updates a Profile entity's email value in the database
     * @param username The Profile's username (used as id)
     * @param newEmail The new Profile's email
     */
    async updateEmail(username: string, newEmail: string): Promise<void> {
        await this.repository.update({ username: username },  { email: newEmail, isEmailVerified: false });
    }

    /**
     * @brief Updates a Profile entity's password value in the database
     * @param username The Profile's username (used as id)
     * @param newPassword The new Profile's password
     */
    async updatePassword(username: string, newPassword: string): Promise<void> {
        const pwd: string = await hash(newPassword, 10);

        await this.repository.update({username: username }, { password: pwd });
    }

    /**
     * @brief Marks the Profile's email address as verified in the database
     * @param email The email address to mark as confirmed (used as id)
     */
    async markEmailAsConfirmed(email): Promise<void> {
        await this.repository.update({ email: email }, { isEmailVerified: true });
    }
}
