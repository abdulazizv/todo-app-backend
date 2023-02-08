import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { IsString } from 'class-validator';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {
  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;
}
