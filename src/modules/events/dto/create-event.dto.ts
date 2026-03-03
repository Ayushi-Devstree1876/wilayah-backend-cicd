import { IsNotEmpty } from "class-validator";

export class CreateEventDto {
  @IsNotEmpty()
  event_name: string;

  @IsNotEmpty()
  event_date: Date;
}
