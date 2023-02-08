import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Todo, TodoDocument } from './schemas/todo.schema';
import { Model } from 'mongoose';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo.name) private todoModule: Model<TodoDocument>,
  ) {}
  async create(createTodoDto: CreateTodoDto) {
    const newTodo = await new this.todoModule(createTodoDto);
    if (!newTodo) {
      throw new HttpException('Forbidden error', HttpStatus.FORBIDDEN);
    } else {
      return newTodo;
    }
  }

  async getAll() {
    return this.todoModule.find().populate('user_id');
  }

  async getOne(id: number) {
    try {
      const toDo = await this.todoModule.findById(id);
    } catch (err) {
      return {
        message: 'Not found',
        status: 404,
      };
    }
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    return this.todoModule.findByIdAndUpdate(id, { ...updateTodoDto });
  }

  async delete(id: number) {
    return this.todoModule.findByIdAndDelete(id);
  }
}
