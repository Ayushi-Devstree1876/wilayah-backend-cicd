import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from "@nestjs/common";
import { EventsService } from "./events.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { JwtAuthGuard } from "src/guard/jwt.guard";
import { RolesGuard } from "src/guard/role.guard";
import { UserRole } from "src/utils/constant";
import { Roles } from "src/decorators/roles.decorators";
import { logger } from "src/logger/winston.logger";
import {
  EVENT_ADD_SUCCESS,
  EVENT_DELETE_SUCCESS,
  EVENT_LIST_GET_SUCCESS,
  EVENT_UPDATE_SUCCESS,
} from "src/utils/message";

@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  async addEvent(@Body() createEventDto: CreateEventDto) {
    try {
      await this.eventsService.addEvent(createEventDto);
      return {
        statusCode: HttpStatus.OK,
        message: EVENT_ADD_SUCCESS,
        data: [],
      };
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get()
  async eventList(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query("pagination") pagination: string
  ) {
    try {
      const data = await this.eventsService.eventList(page, limit, pagination);
      return {
        statusCode: HttpStatus.OK,
        message: EVENT_LIST_GET_SUCCESS,
        data,
      };
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(":id")
  async updateEvent(
    @Body() updateEventDto: UpdateEventDto,
    @Param("id") id: string
  ) {
    try {
      await this.eventsService.updateEvent(id, updateEventDto);
      return {
        statusCode: HttpStatus.OK,
        message: EVENT_UPDATE_SUCCESS,
        data: [],
      };
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(":id")
  async deleteEvent(@Param("id") id: string) {
    try {
      await this.eventsService.deleteEvent(id);
      return {
        statusCode: HttpStatus.OK,
        message: EVENT_DELETE_SUCCESS,
        data: [],
      };
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}
