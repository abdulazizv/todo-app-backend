import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Todo, TodoDocument } from './schemas/todo.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo.name) private todoModule: Model<TodoDocument>,
    private readonly jwtService: JwtService,
  ) {}
  async create(createTodoDto: CreateTodoDto, request) {
    const newTask = new this.todoModule({
      title: createTodoDto.title,
      status: createTodoDto.status,
      expiring_date: createTodoDto.expiring_date,
      user_id: request.headers.user_id,
    });
    await newTask.save();
    if (!newTask) {
      throw new HttpException('Forbidden error', HttpStatus.FORBIDDEN);
    } else {
      return newTask;
    }
  }

  async getAll(request) {
    return this.todoModule
      .find({
        user_id: request.headers.user_id,
      })
      .populate('user_id');
  }

  async getOne(id: string, request) {
    try {
      const toDo = await this.todoModule.find({
        _id: id,
        user_id: request.headers.user_id,
      });
    } catch (err) {
      return {
        message: 'Not found',
        status: 404,
      };
    }
  }

  async update(id: string, updateTodoDto: UpdateTodoDto, request) {
    const check = await this.todoModule.find({
      _id: id,
      user_id: request.headers.user_id,
    });
    if (!check) {
      throw new HttpException(
        'User_id or id incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.todoModule.findByIdAndUpdate(id, { ...updateTodoDto });
  }

  async delete(id: string, request) {
    const check = await this.todoModule.find({
      _id: id,
      user_id: request.headers.user_id,
    });
    if (!check) {
      throw new HttpException(
        'User_id or id incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.todoModule.findByIdAndDelete(id);
  }
}
