import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
    Request,
    Delete,
    BadRequestException, UnauthorizedException, Put, Get, Query, ConflictException
} from "@nestjs/common";
import * as dotenv from "dotenv";

import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { Profile } from "@profile/profile.entity";
import { ProfileService } from "@profile/profile.service";
import { AuthService } from "@auth/auth.service";
import { EmailConfirmationService } from "@email/email-confirmation.service";
import { ForgottenPasswordService } from "@email/forgotten-password.service";
import { PasswordUpdateService } from "@email/password-update.service";
import { PasswordParameterDTO, EmailParameterDTO, UsernameParameterDTO } from "@account/account.dto";
import { ArmyList } from "@army-list/army-list.entity";
import { ArmyListService } from "@army-list/army-list.service";
import { ProphecyUnit } from "@prophecy/unit/prophecy-unit.entity";
import { ProphecyUnitService } from "@prophecy/unit/prophecy-unit.service";
import ProphecyArmyService from "@prophecy/army/prophecy-army.service";
import { ProphecyArmy } from "@prophecy/army/prophecy-army.entity";

dotenv.config();

/**
 * @class AccountController
 * @brief Controller that defines the account routes
 */
@Controller("account")
export class AccountController {
    constructor(
        private readonly profileService: ProfileService,
        private readonly authService: AuthService,
        private readonly emailConfirmationService: EmailConfirmationService,
        private readonly forgottenPasswordService: ForgottenPasswordService,
        private readonly passwordUpdateService: PasswordUpdateService,
        private readonly armyListService: ArmyListService,
        private readonly prophecyUnitService: ProphecyUnitService,
        private readonly prophecyArmyService: ProphecyArmyService
    ) {}

    /**
     * @brief Sends an email verification link to the user's email address
     * @param req The request
     */
    @UseGuards(JwtAuthGuard)
    @Get("send-email-verification-link")
    @HttpCode(HttpStatus.OK)
    async sendEmailVerificationLink(@Request() req): Promise<void> {
        const profile: Profile = await this.profileService.findOneByUsername(req.user.username);

        if (profile.isEmailVerified) {
            throw new BadRequestException("The email address is already verified");
        }
        await this.emailConfirmationService.sendVerificationLink(profile.email);
    }

    /**
     * @brief Enables users to confirm their email addresses
     *        Checks if the token is valid and marks the email as confirmed in the database.
     * @param req The request
     * @param token The verification token
     * @see sendEmailVerificationLink
     */
    @Get("verify-email")
    @HttpCode(HttpStatus.OK)
    async verifyEmail(@Request() req, @Query("token") token: string): Promise<void> {
        const email: string = await this.emailConfirmationService.decodeConfirmationToken(token);

        await this.emailConfirmationService.confirmEmail(email);
    }

    /**
     * @brief Sends a reset password link to the given email address
     *        If the email is not assigned to a user, throws an error.
     * @param email The email address to send the email to
     */
    @Post("send-password-reset-link")
    @HttpCode(HttpStatus.OK)
    async sendPasswordResetLink(@Body() { email }: EmailParameterDTO): Promise<void> {
        if (await this.profileService.findOneByEmail(email) === null) {
            throw new BadRequestException("Invalid email address");
        }
        await this.forgottenPasswordService.sendPasswordResetLink(email);
    }

    /**
     * @brief Enables users to reset their passwords
     *        Uses the token sent by email to confirm the user's identity, and reset's the password by the new given
     *        value.
     * @param token The reset token
     * @param password The new password value
     * @see sendPasswordResetLink
     */
    @Put("reset-password")
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Query("token") token: string,
        @Body() { password }: PasswordParameterDTO): Promise<void> {
        const username: string = await this.forgottenPasswordService.decodeResetToken(token);

        await this.forgottenPasswordService.resetPassword(username, password);
    }

    /**
     * @brief Enables users to delete their accounts
     *        Deletes the user's account in the database.
     * @param req The request
     * @param password The user's password
     */
    @UseGuards(JwtAuthGuard)
    @Delete("")
    @HttpCode(HttpStatus.OK)
    async deleteAccount(@Request() req, @Body() { password }: PasswordParameterDTO): Promise<void> {
        const username = req.user.username;
        const profile: Profile = await this.profileService.findOneByUsername(username);

        if ( profile === null || ! await profile.comparePassword(password)) {
            throw new UnauthorizedException();
        }
        let armiesLists: ArmyList[] = await this.armyListService.findByOwner(username);
        let unitProphecies: ProphecyUnit[] = await this.prophecyUnitService.findByOwner(username, {loadAll: true});
        let armyProphecies: ProphecyArmy[] = await this.prophecyArmyService.findByOwner(username);

        await this._deleteUserData(armiesLists, unitProphecies, armyProphecies);
        await this.profileService.delete(username);
    }

    /**
     * @brief Enables users to update their passwords
     *        Updates the user's password in the database and sends an email to confirm that the password has been
     *        updated.
     * @param req The request
     * @param password The new password value
     */
    @UseGuards(JwtAuthGuard)
    @Put("password")
    @HttpCode(HttpStatus.OK)
    async updatePassword(@Request() req, @Body() { password }: PasswordParameterDTO): Promise<void> {
        const username = req.user.username;
        const profile: Profile = await this.profileService.findOneByUsername(username);

        await this.profileService.updatePassword(username, password);
        await this.passwordUpdateService.sendPasswordUpdateEmail(profile.email);
    }

    /**
     * @brief Enables users to update their email addresses.
     *        Updates the user's email address in the database, marks it as not verified and sends a verification link
     *        to the new email address.
     * @param req The request
     * @param email The new email address value
     */
    @UseGuards(JwtAuthGuard)
    @Put("email")
    @HttpCode(HttpStatus.OK)
    async updateEmail(@Request() req, @Body() { email }: EmailParameterDTO): Promise<void> {
        const username = req.user.username;
        const _profile: Profile = await this.profileService.findOneByUsername(username);

        await this.profileService.updateEmail(username, email);
        await this.emailConfirmationService.sendVerificationLink(email);
    }

    /**
     * @brief Enables users to update their usernames.
     *        Updates the username value in the database.
     * @param req The request
     * @param newUsername The new username value
     * @return The new username
     */
    @UseGuards(JwtAuthGuard)
    @Put("username")
    @HttpCode(HttpStatus.OK)
    async updateUsername(@Request() req, @Body() { username }: UsernameParameterDTO): Promise<{ username: string, access_token: string }> {
        const oldUsername: string = req.user.username;
        let armiesLists: ArmyList[] = await this.armyListService.findByOwner(oldUsername);
        let unitProphecies: ProphecyUnit[] = await this.prophecyUnitService.findByOwner(oldUsername, {loadAll: true});
        let armyProphecies: ProphecyArmy[] = await this.prophecyArmyService.findByOwner(oldUsername);

       await this._deleteUserData(armiesLists, unitProphecies, armyProphecies);
        try {
            await this.profileService.updateUsername(oldUsername, username);
        } catch (_err) {
            await this._restoreUserData(oldUsername, armiesLists, unitProphecies, armyProphecies);
            throw new ConflictException(`The username ${username} is already used.`);
        }
        await this._restoreUserData(username, armiesLists, unitProphecies, armyProphecies);

        const profile: Profile = await this.profileService.findOneByUsername(username);
        return this.authService.login(profile);
    }

    private async _deleteUserData( armiesLists: ArmyList[],
        unitProphecies: ProphecyUnit[],
        armyProphecies: ProphecyArmy[]): Promise<void> {
        await Promise.all(armyProphecies.map(async (p: ProphecyArmy): Promise<void> => { await this.prophecyArmyService.delete(p.id); }));
        await Promise.all(armiesLists.map(async (l: ArmyList): Promise<void> => { await this.armyListService.delete(l.id); }));
        await Promise.all(unitProphecies.map(async (p: ProphecyUnit): Promise<void> => { await this.prophecyUnitService.delete(p.id); }));
    }

    private async _restoreUserData(username: string,
        armiesLists: ArmyList[],
        unitProphecies: ProphecyUnit[],
        armyProphecies: ProphecyArmy[]): Promise<void> {
        await Promise.all(armiesLists.map(async (l: ArmyList): Promise<void> => {
            l.owner = username;
            await this.armyListService.save(l);
        }));
        await Promise.all(unitProphecies.map(async (p: ProphecyUnit): Promise<void> => {
            p.owner = username;
            await this.prophecyUnitService.save(p);
        }));
        await Promise.all(armyProphecies.map(async (p: ProphecyArmy): Promise<void> => {
            p.owner = username;
            await this.prophecyArmyService.save(p);
        }));
    }

    @UseGuards(JwtAuthGuard)
    @Get("")
    @HttpCode(HttpStatus.OK)
    async getAccount(@Request() req): Promise<{username: string, email: string}> {
        const username = req.user.username;
        const profile: Profile = await this.profileService.findOneByUsername(username);

        if (profile === null) {
            throw new UnauthorizedException();
        }
        return {
            username: profile.username,
            email: profile.email
        };
    }
}
