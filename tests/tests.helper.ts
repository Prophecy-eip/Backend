import * as request from "supertest";

export class TestsHelper {
    static async createAccountAndGetToken(httpServer: any, username: string, email: string, password: string): Promise<string> {
        // const r1 = await request(httpServer)
        //     .post(this.SIGN_UP_ROUTE)
        //     .send({
        //         username: username,
        //         email: email,
        //         password: password,
        //         sendEmail: false
        //     });
        // const signInRes = await this.signIn
        // const r2 = await request(httpServer)
        //     .post(this.SIGN_IN_ROUTE)
        //     .send({
        //         username: username,
        //         password: password
        //     });
        // return r2.body.access_token;
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

    static SIGN_UP_ROUTE: string = "/sign-up";
    static SIGN_IN_ROUTE: string = "/sign-in";
    static SIGN_OUT_ROUTE: string = "/sign-out";

    /**
     * ACCOUNT
     */
    static DELETE_ACCOUNT_ROUTE: string = "/account/settings/delete-account";
    static UPDATE_PASSWORD_ROUTE: string = "/account/settings/update-password";
    static UPDATE_EMAIL_ROUTE: string = "/account/settings/update-email-address";
    static UPDATE_USERNAME_ROUTE: string = "/account/settings/update-username";

    /**
     * PROPHECIES
     */
    static REQUEST_UNIT_PROPHECY_ROUTE: string = "/prophecies/units/request-prophecy";
    static UNIT_PROPHECY_LOOKUP_ROUTE: string = "/prophecies/units/lookup";
    static UNIT_PROPHECY_DELETE_ROUTE: string = "/prophecies/units/delete";

    /**
     * ARMIES LISTS
     */

    static ARMIES_LISTS_ROUTE: string = "/armies-lists";
    static ARMIES_LISTS_CREATE_ROUTE: string = "/armies-lists/create";
    static ARMIES_LISTS_LOOKUP_ROUTE: string = "/armies-lists/lookup";
    static ARMIES_LISTS_DELETE_ROUTE: string = this.ARMIES_LISTS_ROUTE + "/delete";
    static ARMIES_LISTS_UPDATE_ROUTE: string = this.ARMIES_LISTS_ROUTE + "/update";
}
