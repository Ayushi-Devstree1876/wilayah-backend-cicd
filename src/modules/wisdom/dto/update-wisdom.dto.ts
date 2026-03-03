import { PartialType } from '@nestjs/mapped-types';
import { CreateWisdomDto } from './create-wisdom.dto';
import { IsOptional, MaxLength } from 'class-validator';

export class UpdateWisdomDto extends PartialType(CreateWisdomDto) {
    @IsOptional()
    @MaxLength(1000)
    description?: string;   
}
