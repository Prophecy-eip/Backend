import * as AWS from "aws-sdk";
import * as dotenv from "dotenv";
import { Injectable } from "@nestjs/common";
import { SendTemplatedEmailCommand } from "@aws-sdk/client-ses";

dotenv.config();

const SES_REGION: string = process.env.SES_REGION;
const SES_ACCESS_KEY: string = process.env.SES_ACCESS_KEY;
const SES_SECRET_ACCESS_KEY: string = process.env.SES_SECRET_ACCESS_KEY;

@Injectable()
export class EmailService {

    constructor() {
        this.awsSes = new AWS.SES({
            accessKeyId: SES_ACCESS_KEY,
            secretAccessKey: SES_SECRET_ACCESS_KEY,
            region: SES_REGION
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
                    },
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: subject
                }
            },
            Source: fromAddress
        };

        return this.awsSes.sendEmail(params).promise();
    }

    async sendTemplatedEmail(source: string, template: string, toAddresses: string[], templateData: string) {
        const params = {
            Source: source,
            Template: template,
            Destination: {
                ToAddresses: toAddresses,
            },
            TemplateData: templateData,
            ConfigurationSetName: "prophecy-email",
        };
        console.log(`sending email to ${toAddresses}`);
        console.log(source, template, templateData);
        return this.awsSes.sendTemplatedEmail(params);

            // const command =  new SendTemplatedEmailCommand({
            //     Destination: { ToAddresses: toAddresses },
            //     TemplateData: templateData,
            //     Source: source,
            //     Template: template
            // });
            // return this.awsSes.sendTemplatedEmail(command);
    }

    private awsSes: AWS.SES;
}
