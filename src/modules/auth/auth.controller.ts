import {
  Controller,
  Post,
  Body,
  HttpCode,
  Param,
  Patch,
  UseGuards,
  HttpStatus,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { Action_Type, UserRole } from "src/utils/constant";
import { ProxyLoginDto } from "./dto/proxy_login.dto";
import { logger } from "src/logger/winston.logger";
import { JwtAuthGuard } from "src/guard/jwt.guard";
import { GetUser } from "src/decorators/get-user.decorators";
import {
  LOGGED_IN,
  LOGGED_OUT,
  PASSWORD_CHANGE_SUCCESS,
} from "src/utils/message";
import { Roles } from "src/decorators/roles.decorators";
import { RolesGuard } from "src/guard/role.guard";
import { User } from "src/entities/user.entity";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signin")
  async signin(
    @Body("email") email: string,
    @Body("password") password: string
  ) {
    try {
      const userData = await this.authService.signin(email, password);
      return {
        statusCode: HttpStatus.OK,
        message: LOGGED_IN,
        data: userData,
      };
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  @Patch("logout")
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard)
  async logout(@GetUser() user: Object) {
    try {
      await this.authService.logout(user);
      return {
        statusCode: HttpStatus.OK,
        message: LOGGED_OUT,
        data: [],
      };
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch("change-password")
  async changePassword(
    @GetUser() user: User,
    @Body("old_password") old_password: string,
    @Body("new_password") new_password: string
  ) {
    try {
      await this.authService.changePassword(user, old_password, new_password);
      return {
        statusCode: HttpStatus.OK,
        message: PASSWORD_CHANGE_SUCCESS,
        data: [],
      };
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}
