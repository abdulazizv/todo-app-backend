import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req
} from "@nestjs/common";
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { userGuard } from '../guards/user.guard';

@Controller('api/v1')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(userGuard)
  @Post('/add')
  create(@Body() createTodoDto: CreateTodoDto, @Req() request) {
    return this.todoService.create(createTodoDto, request);
  }

  @UseGuards(userGuard)
  @Get('all')
  findAll(@Req() request) {
    return this.todoService.getAll(request);
  }

  @UseGuards(userGuard)
  @Get(':id')
  findOne(@Param('id') id: string,@Req() request) {
    return this.todoService.getOne(id, request);
  }

  @UseGuards(userGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto,@Req() request) {
    return this.todoService.update(id, updateTodoDto, request);
  }

  @UseGuards(userGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() request) {
    return this.todoService.delete(id, request);
  }
}
