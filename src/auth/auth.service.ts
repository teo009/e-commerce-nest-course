import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto, LoginUserDto } from './dto/';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jst.payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(CreateUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = CreateUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });
      const savedResponse = await this.userRepository.save(user);
      delete user.password;
      return {
        ...savedResponse,
        token: this.getJwtToken({ id: savedResponse.id }),
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(LoginUserDto: LoginUserDto) {
    const { password, email } = LoginUserDto;
    const user = await this.userRepository.findOne({
      where: { email }, select: { email: true, password: true, id: true }
    });

    if(!user) 
      throw new UnauthorizedException(`Not valid credentials: (email)`);
    if(!bcrypt.compareSync(password, user.password)) 
      throw new UnauthorizedException(`Not valid credentials: (password)`);

    return {
      ...user, 
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async checkAuthStatus(user: User) {
    return {
      ...user, 
      token: this.getJwtToken({ id: user.id }),
    };
  }

  //Own Methods
  private handleDBErrors(error: any): never {
    if(error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException('Please check server logs');
  }
  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}