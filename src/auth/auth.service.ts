import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, Tokens } from '../types';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { forgetPasswordDto } from "./dto/forget-password.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModule: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}
  async register(createAuthDto: CreateAuthDto) {
    const salt = genSaltSync(10);
    const hash_password = hashSync(createAuthDto.password, salt);
    const newUser = await new this.userModule({
      username: createAuthDto.username,
      email: createAuthDto.email,
      hashPassword: hash_password,
    });
    const tokens = await this.getTokens(String(newUser._id), newUser.email);
    return tokens;
  }

  async login(updateAuthDto: UpdateAuthDto) {
    const { email, password } = updateAuthDto;
    const user = await this.userModule.findOne({
      email: email,
    });
    const matchPassword = compareSync(password, user.hashPassword);
    if (!user || !matchPassword) {
      throw new HttpException('User is not found', HttpStatus.NOT_FOUND);
    } else {
      const newTokens = await this.getTokens(String(user._id), user.email);
      return newTokens;
    }
  }
  async getAll() {
    const oneUser = await this.userModule.find();
    return oneUser;
  }

  async forgotPassword(ForgetPasswordDto: forgetPasswordDto) {
    const { email, newPassword } = ForgetPasswordDto;
    const user = await this.userModule.findOne({
      email: email,
    });
    if (!user) {
      throw new HttpException('User is not found', HttpStatus.NOT_FOUND);
    } else {
      const salt = genSaltSync(10);
      const hash_password = hashSync(newPassword, salt);
      user.hashPassword = hash_password;
      user.save();
      return {
        status: 202,
        message: 'password is changed succesfully',
      };
    }
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

  async getTokens(user_id: string, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      user_id: user_id,
      email: email,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
