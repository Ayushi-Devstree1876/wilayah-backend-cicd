import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Events } from "src/entities/events.entity";
import { EVENT_NOT_EXISTS } from "src/utils/message";

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Events)
    private eventRepository: Repository<Events>
  ) {}

  async addEvent(createEventDto: CreateEventDto) {
    // check if same day already event exists

    const newEvent = this.eventRepository.create(createEventDto);
    await this.eventRepository.save(newEvent);
  }

  async eventList(page: number = 1, limit: number = 10, pagination: any) {
    pagination = pagination === "true" ? true : false;

    if (pagination) {
      const [data, total] = await this.eventRepository.findAndCount({
        skip: (page - 1) * limit,
        order: { created_at: "DESC" },
        take: limit,
      });

      return {
        data,
        totalCount: total,
        page,
        limit,
      };
    } else {
      return await this.eventRepository.find({
        order: { created_at: "DESC" },
      });
    }
  }

  async updateEvent(id: string, updateEventDto: UpdateEventDto) {
    // check if same day already event exists

    let { event_date, event_name } = updateEventDto;

    const event = await this.eventRepository.findOne({
      where: {
        event_id: id,
      },
    });

    if (!event) {
      throw new HttpException(EVENT_NOT_EXISTS, HttpStatus.NOT_FOUND);
    }

    if (event_date) event.event_date = event_date;
    if (event_name) event.event_name = event_name;

    await this.eventRepository.save(event);
  }

  async deleteEvent(id: string) {
    const event = await this.eventRepository.findOne({
      where: {
        event_id: id,
      },
    });

    if (!event) {
      throw new HttpException(EVENT_NOT_EXISTS, HttpStatus.NOT_FOUND);
    }

    await this.eventRepository.softDelete({ event_id: id });
  }
}
