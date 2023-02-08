import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModule: Model<UserDocument>,
  ) {}
  async create(createAuthDto: CreateAuthDto) {
    return new this.userModule(createAuthDto);
  }

  async getAll() {
    const oneUser = await this.userModule.find();
    return oneUser;
  }

  async getOne(id: string) {
    return this.userModule.findById(id);
  }

  async update(id: string, updateAuthDto: UpdateAuthDto) {
    return this.userModule.findByIdAndUpdate(id, { ...updateAuthDto });
  }

  async delete(id: string) {
    return this.userModule.findByIdAndDelete(id);
  }
}
