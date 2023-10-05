import * as request from "supertest";

export class TestsHelper {
    static async createAccountAndGetToken(httpServer: any, username: string, email: string, password: string): Promise<string> {
        const signUpRes = await this.signUp(httpServer, username, email, password);

        return await this.getToken(httpServer, username, password);
    }

    static async getToken(httpServer: any, id: string, password: string): Promise<string> {
        const response = await request(httpServer)
            .post(this.SIGN_IN_ROUTE)
            .send({
                username: id,
                password: password,
            });
        return response.body.access_token;
    }

    static async deleteAccount(httpServer: any, token: string) {
        return request(httpServer)
            .delete(this.DELETE_ACCOUNT_ROUTE)
            .set("Authorization", `Bearer ${token}`);
    }

    static async signUp(httpServer: any, username: string, email: string, password: string) {
        return request(httpServer)
            .post(this.SIGN_UP_ROUTE)
            .send({
                username: username,
                email: email,
                password: password,
                sendEmail: false
            });
    }

    static async deleteArmyList(httpServer: any, token: string, listId: string): Promise<void> {
        await request(httpServer)
            .delete(`${TestsHelper.ARMIES_LISTS_ROUTE}/${listId}`)
            .set("Authorization", `Bearer ${token}`);
    }

    static SIGN_UP_ROUTE: string = "/sign-up";
    static SIGN_IN_ROUTE: string = "/sign-in";
    static SIGN_OUT_ROUTE: string = "/sign-out";

    /**
     * ACCOUNT
     */
    static DELETE_ACCOUNT_ROUTE: string = "/account";
    static UPDATE_PASSWORD_ROUTE: string = "/account/password";
    static UPDATE_EMAIL_ROUTE: string = "/account/email";
    static UPDATE_USERNAME_ROUTE: string = "/account/username";

    /**
     * PROPHECIES
     */
    static UNIT_PROPHECY_ROUTE: string = "/prophecies/units";
    static ARMY_PROPHECY_ROUTE: string = "/prophecies/armies";

    /**
     * ARMIES LISTS
     */
    static ARMIES_LISTS_ROUTE: string = "/armies-lists";

    /**
     * ARMIES
     */
    static ARMIES_ROUTE = "/armies";

    /**
     * GAMES
     */
    static GAMES_ROUTE = "/games";
}
