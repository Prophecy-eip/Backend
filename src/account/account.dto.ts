import { IsDefined, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class EmailParameterDTO {
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    public email: string;
}

export class PasswordParameterDTO {
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    public password: string;
}

export class UsernameParameterDTO {
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    public username: string;
}
