import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoDto } from './create-todo.dto';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @IsOptional()
  @IsString({ message: 'Titleni type string bolishi kerak' })
  readonly title: string;
  @IsOptional()
  @IsBoolean({ message: 'Status boolean bolishi kerak' })
  readonly status: boolean;
  @IsOptional()
  readonly expiring_date: Date;
}
