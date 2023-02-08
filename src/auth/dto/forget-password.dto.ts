import { IsString } from 'class-validator';

export class forgetPasswordDto {
  @IsString()
  readonly email: string;

  @IsString()
  readonly newPassword: string;
}
