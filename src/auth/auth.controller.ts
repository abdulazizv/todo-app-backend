import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { forgetPasswordDto } from './dto/forget-password.dto';

@Controller('api/v1')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Get('/login')
  login(@Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.login(updateAuthDto);
  }
  @Post('/forgotpassword')
  forgetPassword(@Body() forgetPasswordDto: forgetPasswordDto) {
    return this.authService.forgotPassword(forgetPasswordDto);
  }
  @Get('/users')
  findAll() {
    return this.authService.getAll();
  }

  @Get('/user/:id')
  findOne(@Param('id') id: string) {
    return this.authService.getOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.delete(id);
  }
}
