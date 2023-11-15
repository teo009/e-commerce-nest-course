import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(CreateUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(CreateUserDto);
      const savedResponse = await this.userRepository.save(user);
      return savedResponse;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  //Own Methods
  private handleDBErrors(error: any): never {
    if(error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException('Please check server logs');
  }
}
