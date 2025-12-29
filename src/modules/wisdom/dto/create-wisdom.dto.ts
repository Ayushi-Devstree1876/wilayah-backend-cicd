import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateWisdomDto {
  @IsNotEmpty()
  description: string;

  @IsOptional()
  written_by: string;
}
