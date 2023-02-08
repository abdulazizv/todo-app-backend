import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateTodoDto {
  @IsString({ message: 'Titleni type string bolishi kerak' })
  readonly title: string;
  @IsBoolean({ message: 'Status boolean bolishi kerak'})
  readonly status: boolean;
  @IsNotEmpty()
  readonly expiring_date: Date;
}
