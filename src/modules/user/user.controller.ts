import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { UsersService } from "./user.service";
import { CreateUserDto } from "./dto/createuser.dto";
import { logger } from "src/logger/winston.logger";
import { Action_Type, UserRole } from "src/utils/constant";
import { User } from "src/entities/user.entity";
import { RolesGuard } from "src/guard/role.guard";
import { JwtAuthGuard } from "src/guard/jwt.guard";
import { Roles } from "src/decorators/roles.decorators";
import { Action } from "src/decorators/action.decorator";
import { GetUser } from "src/decorators/get-user.decorators";

@Controller("user")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOSPITAL_ADMINISTRATOR)
  @Action(Action_Type.CREATE)
  @Post("/doctor/add")
  create(@Body() createUserDto: CreateUserDto, @GetUser() user: User) {
    try {
      return this.usersService.createUser(createUserDto, user);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}
