import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { UsersService } from "./user.service";
import { JwtAuthGuard } from "src/utils/guard/jwt.guard";
import { CreateUserDto } from "./dto/createuser.dto";
import { logger } from "src/logger/winston.logger";
import { RolesGuard } from "src/utils/guard/role.guard";
import { Roles } from "src/utils/decorators/roles.decorators";
import { Action_Type, UserRole } from "src/helper/constant";
import { GetUser } from "src/utils/decorators/get-user.decorators";
import { Action } from "src/utils/decorators/action.decorator";
import { User } from "src/entities/user.entity";

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
