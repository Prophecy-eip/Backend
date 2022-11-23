import * as AWS from "aws-sdk";
import * as dotenv from "dotenv";
import { Injectable } from "@nestjs/common";

dotenv.config();

const SES_REGION: string = process.env.SES_REGION;
const SES_ACCESS_KEY: string = process.env.SES_ACCESS_KEY;
const SES_SECRET_ACCESS_KEY: string = process.env.SES_SECRET_ACCESS_KEY;

// const SES_CONFIG = {
//     accessKeyId: SES_ACCESS_KEY,
//     secretAccessKey: SES_SECRET_ACCESS_KEY,
//     region: SES_REGION
// };
// const AWS_SES = new AWS.SES(SES_CONFIG);

// console.log(SES_CONFIG);

@Injectable()
export class EmailService {

    constructor() {
        // console.log("coucou")
        this.awsSes = new AWS.SES({
            accessKeyId: SES_ACCESS_KEY,
            secretAccessKey: SES_SECRET_ACCESS_KEY,
            region: SES_REGION
        });
    }

    async sendEmail(toAddresses: string[], fromAddress: string, subject: string, emailBody: string) {
        console.log(`sending an email to ${toAddresses}`);
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

        // return AWS_SES.sendEmail(params).promise();
        return this.awsSes.sendEmail(params).promise();
    }

    private awsSes: AWS.SES;
}
