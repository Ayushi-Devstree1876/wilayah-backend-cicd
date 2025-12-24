import {
  Controller,
  Post,
  Body,
  HttpCode,
  Param,
  Patch,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { Action_Type, UserRole } from "src/utils/constant";
import { ProxyLoginDto } from "./dto/proxy_login.dto";
import { logger } from "src/logger/winston.logger";
import { JwtAuthGuard } from "src/guard/jwt.guard";
import { GetUser } from "src/decorators/get-user.decorators";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("forgot-password")
  async forgotPassword(@Body("email") email: string) {
    try {
      return await this.authService.createResetToken(email);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  @Patch("reset-password/:token")
  async resetPassword(
    @Param("token") token: string,
    @Body("password") password: string
  ) {
    try {
      return this.authService.resetPassword(token, password);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  @Post("mobile/login")
  @HttpCode(200)
  async mobileLogin(@Body() body: LoginDto) {
    try {
      return this.authService.mobileLogin(body);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  @Post("mobile/forgot-password")
  async mobileForgotPassword(@Body("email") email: string) {
    try {
      return await this.authService.createResetToken(email);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  @Patch("mobile/reset-password/:token")
  async mobileResetPassword(
    @Param("token") token: string,
    @Body("password") password: string
  ) {
    try {
      return this.authService.resetPassword(token, password);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  async logout(@GetUser() user: Object) {
    try {
      return this.authService.logOut(user);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}
