import { PartialType } from '@nestjs/mapped-types';
import { CreateWisdomDto } from './create-wisdom.dto';

export class UpdateWisdomDto extends PartialType(CreateWisdomDto) {}
