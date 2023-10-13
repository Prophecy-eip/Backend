import { IsDefined, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignUpParameterDTO {
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    public username: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    public email: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    public password: string;

    public sendEmail?: boolean;
}
