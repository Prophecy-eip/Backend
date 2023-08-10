import { SendEmailCommandOutput, SES } from "@aws-sdk/client-ses";
import * as dotenv from "dotenv";
import { Injectable } from "@nestjs/common";

dotenv.config();

const SES_REGION: string = process.env.SES_REGION;
const SES_ACCESS_KEY: string = process.env.SES_ACCESS_KEY;
const SES_SECRET_ACCESS_KEY: string = process.env.SES_SECRET_ACCESS_KEY;

/**
 * @class EmailService
 * @brief Service that implements basic features to send emails
 */
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

    /**
     * @brief Sends an email
     * @param toAddresses The address to send the email to
     * @param fromAddress The address the email is sent from
     * @param subject The email's subject
     * @param emailBody The email's body
     */
    async sendEmail(toAddresses: string[], fromAddress: string, subject: string, emailBody: string): Promise<SendEmailCommandOutput> {
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
