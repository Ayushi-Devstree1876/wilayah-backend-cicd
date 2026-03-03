import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThan, Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { LoginDto } from "./dto/login.dto";
import {
  CHANGE_PASSWORD_FAILED,
  INVALID_EMAIL_OR_PASSWORD,
  INVALID_OLD_PASSWORD,
  LOGGED_OUT,
  PASSWORD_RESET,
  TOKEN_INVALID_EXPIRED,
  USER_NOT_FOUND,
} from "../../utils/message";
import { PasswordResetToken } from "./password_reset_token.entity";
import {
  generateRandomToken,
  salting_rounds,
  UserRole,
} from "../../utils/constant";
import { MailerService } from "@nestjs-modules/mailer";
import { User } from "src/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(PasswordResetToken)
    private resetPasswordRepository: Repository<PasswordResetToken>,
    private jwtService: JwtService,
    private readonly mailerService: MailerService
  ) {}

  async signin(email: string, password: string) {
    if (!email || !password) {
      throw new HttpException(
        INVALID_EMAIL_OR_PASSWORD,
        HttpStatus.BAD_REQUEST
      );
    }

    const existingUser = await this.userRepository.findOne({
      where: { email },
      relations: ["role"], // Include the related role
    });

    if (!existingUser) {
      throw new HttpException(
        INVALID_EMAIL_OR_PASSWORD,
        HttpStatus.BAD_REQUEST
      );
    }

    // Check if the password is correct
    const passwordMatches = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!passwordMatches) {
      throw new HttpException(
        INVALID_EMAIL_OR_PASSWORD,
        HttpStatus.BAD_REQUEST
      );
    }

    let access_token = this.jwtService.sign(
      {
        email,
        user_id: existingUser.user_id,
        role_id: existingUser.role.role_id,
      },
      { expiresIn: "1d" }
    );

    await this.userRepository.update(
      { email },
      {
        access_token,
      }
    );

    let userData = {
      user_id: existingUser.user_id,
      first_name: existingUser.first_name,
      last_name: existingUser.last_name,
      access_token: access_token,
      email: existingUser.email,
      role: {
        name: existingUser.role.name,
      },
    };

    return userData;
  }

  async logout(user: any) {
    await this.userRepository.update(
      { user_id: user.user_id },
      { access_token: "" }
    );

    return;
  }

  async changePassword(user: any, old_password: string, new_password: string) {
    const userData = await this.userRepository.findOne({
      where: { user_id: user.user_id },
    });

    if (!userData) {
      throw new Error(USER_NOT_FOUND);
    }

    const passwordMatches = await bcrypt.compare(
      old_password,
      userData.password
    );

    if (!passwordMatches) {
      throw new HttpException(INVALID_OLD_PASSWORD, HttpStatus.BAD_REQUEST);
    }

    if (old_password === new_password) {
      throw new HttpException(CHANGE_PASSWORD_FAILED, HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(new_password, salting_rounds);

    userData.password = hashedPassword;
    await this.userRepository.save(userData);
  }

  async validate(user_id: string, super_user: any): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { user_id },
      relations: ["role"], // Include the related role
    });
    return user;
  }
}
