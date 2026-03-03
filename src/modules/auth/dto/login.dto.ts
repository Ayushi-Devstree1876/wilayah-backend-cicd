// src/auth/dtos/login.dto.ts
import { IsNotEmpty, IsString, IsEmail, IsOptional } from "class-validator";

export class LoginDto {
  @IsEmail({}, { message: "Invalid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @IsString({ message: "Password is required" })
  @IsNotEmpty({ message: "Password is required" })
  password: string;

  @IsOptional()
  fcm_token: string;

  role: any;
}
