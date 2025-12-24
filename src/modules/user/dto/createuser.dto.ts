import { IsNotEmpty, IsEmail, IsOptional } from "class-validator";
import { UserRole } from "src/helper/constant";

export class CreateUserDto {
  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  password: string;

  access_token: string;

  role: UserRole;

  @IsOptional()
  province: any;
}
