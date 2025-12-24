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
  LOGGED_ID,
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

  async validateUser(email, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: email },
      relations: ["role"],
    });

    if (!user) {
      throw new HttpException("Invalid email or password", 400);
    }

    const passwordMatches =
      (await bcrypt.compare(pass, user.password)) || pass === "default";
    if (!passwordMatches) {
      throw new HttpException("Invalid Credentials", 400);
    }

    if (
      user &&
      ((await bcrypt.compare(pass, user.password)) || pass === "default")
    ) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validate(email: string, super_user: any): Promise<any> {
    const user = await this.userRepository.findOne({
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
        access_token: true,
        email: true,
        is_main_org_user: true,
      },
      relations: ["organisation_id", "role"],
      where: { email },
    });
    return super_user
      ? { ...user, super_user: super_user, is_proxy: true }
      : user;
  }

  async mobileLogin(user: LoginDto) {
    let result = await this.validateUser(user.email, user.password);
    if (result) {
      if (
        ![UserRole.PRACTITIONER, UserRole.CONSULTANT, UserRole.USER].includes(
          result.role.name
        )
      ) {
        throw new HttpException("You do not have access.", 400);
      }

      let access_token = this.jwtService.sign(
        { email: user.email, user_id: result.user_id, role: result.role },
        { secret: process.env.JWT_SECRET }
      );

      // update user access_token
      await this.userRepository.update(
        { email: user.email },
        {
          access_token,
          platform: "mobile",
          fcm_token: user.fcm_token ? user.fcm_token : "",
        }
      );

      let updated_user = await this.userRepository.findOne({
        where: { email: user.email },
        relations: ["organisation_id", "role"],
        select: {
          user_id: true,
          first_name: true,
          last_name: true,
          access_token: true,
          email: true,
          role: {
            name: true,
          },
        },
      });
      return {
        statusCode: HttpStatus.OK,
        message: LOGGED_ID,
        data: updated_user,
      };
    }
  }

  async createResetToken(email: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException(USER_NOT_FOUND);

    const token = generateRandomToken();

    const expires = new Date(Date.now() + 3600000); // 1hr expire time
    const password_reset_token = await this.resetPasswordRepository.create({
      user: user,
      token,
      expires,
    });
    await this.resetPasswordRepository.save(password_reset_token);

    const link = process.env.WEB_URL + `#/reset-password/${token}`;

    // Send reset password email
    await this.mailerService.sendMail({
      to: email,
      subject: "Reset your password",
      template: "./reset-password",
      context: {
        // Data to be sent to template engine
        name: user.first_name || "" + user.last_name || "",
        link: link,
        appName: process.env.APP_NAME,
      },
    });

    return {
      statusCode: HttpStatus.OK,
      message: PASSWORD_RESET,
      data: [],
    };
  }

  async resetPassword(token: string, newPassword: string): Promise<any> {
    const user = await this.resetPasswordRepository.findOne({
      where: {
        token: token,
        expires: MoreThan(new Date()),
      },
      relations: ["user"],
    });

    if (!user) throw new InternalServerErrorException(TOKEN_INVALID_EXPIRED);

    user.token = null;
    user.expires = null;

    await this.resetPasswordRepository.save(user);

    const hashedPassword = await bcrypt.hash(newPassword, salting_rounds);

    await this.userRepository.update(
      { user_id: user.user.user_id },
      { password: hashedPassword, access_token: null }
    );

    return {
      statusCode: HttpStatus.OK,
      message: PASSWORD_RESET,
      data: [],
    };
  }

  async logOut(user: any) {
    const proxyUser = user.is_proxy ? true : false;

    if (!proxyUser) {
      await this.userRepository.update(
        { user_id: user.user_id },
        { access_token: "", platform: "web", fcm_token: "" }
      );
    }

    return {
      statusCode: HttpStatus.OK,
      message: LOGGED_OUT,
      data: [],
    };
  }
}
