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
    const newTask = new this.todoModule({
      title: createTodoDto.title,
      status: createTodoDto.status,
      expiring_date: createTodoDto.expiring_date,
      user_id: 1, // tokendan yechib olib olishim kerak
    });
    if (!newTask) {
      throw new HttpException('Forbidden error', HttpStatus.FORBIDDEN);
    } else {
      return newTask;
    }
  }

  async getAll() {
    return this.todoModule.find().populate('user_id');
  }

  async getOne(id: string) {
    try {
      const toDo = await this.todoModule.findById(id);
    } catch (err) {
      return {
        message: 'Not found',
        status: 404,
      };
    }
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    return this.todoModule.findByIdAndUpdate(id, { ...updateTodoDto });
  }

  async delete(id: string) {
    return this.todoModule.findByIdAndDelete(id);
  }
}
