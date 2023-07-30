import { SES } from "@aws-sdk/client-ses";
import * as dotenv from "dotenv";
import { Injectable } from "@nestjs/common";

dotenv.config();

const SES_REGION: string = process.env.SES_REGION;
const SES_ACCESS_KEY: string = process.env.SES_ACCESS_KEY;
const SES_SECRET_ACCESS_KEY: string = process.env.SES_SECRET_ACCESS_KEY;

@Injectable()
export class EmailService {

    constructor() {
        this.awsSes = new SES({
            region: SES_REGION,
            credentials: {
                accessKeyId: SES_ACCESS_KEY,
                secretAccessKey: SES_SECRET_ACCESS_KEY
            }
        });
    }

    async sendEmail(toAddresses: string[], fromAddress: string, subject: string, emailBody: string) {
        const params = {
            Destination: {
                ToAddresses: toAddresses
            },
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: emailBody
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: subject
                }
            },
            Source: fromAddress
        };

        return this.awsSes.sendEmail(params);
    }

    private awsSes: SES;
}
