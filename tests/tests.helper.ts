import * as request from "supertest";

export class TestsHelper {
    static async createAccountAndGetToken(httpServer: any, username: string, email: string, password: string): Promise<string> {
        const r1 = await request(httpServer)
            .post("/account/sign-up")
            .send({
                username: username,
                email: email,
                password: password,
                sendEmail: false
            });
        const r2 = await request(httpServer)
            .post("/account/sign-in")
            .send({
                username: username,
                password: password
            });
        return r2.body.access_token;
    }

    static async deleteAccount(httpServer: any, token: string) {
        await request(httpServer)
            .delete(this.DELETE_ACCOUNT_ROUTE)
            .set("Authorization", `Bearer ${token}`);
    }

    static DELETE_ACCOUNT_ROUTE: string = "/account/settings/delete-account";

    public static USERNAME = "username";
    public static PASSWORD = "password";
    public static EMAIL = "user@prophecy.com";
    public static USERNAME1 = "username1";
    public static EMAIL1 = "user1@prophecy.com";
}
